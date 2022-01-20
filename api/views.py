import json
import re
import secrets
import stripe
import requests
import base64
import time
from urllib.parse import urlparse
from binascii import unhexlify
from random import shuffle
from django.utils.timezone import now, timedelta
from django.db.models import F, Avg, Max, Min, ProtectedError
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.http import Http404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from unsift.settings import STRIPE_API_KEY as stripeAPIKey
from unsift.settings import APIVOID_API_KEY as apivoidAPIKey
from django_otp import devices_for_user
from two_factor.utils import default_device
from django_otp.oath import totp
from . import serializers
from .permissions import VettingIsAvailableOrOwnerOrReadOnly
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth.models import User
from account.models import EmailChangeRequest, Profile
from library.models import Folder, SavedSite
from pubdash.models import DailyMetric, AllTimeMetric, Feedback, Cancellation, SiteChange
from publish.models import Category, Site, Claim
from explore.models import Chunk
from staff.models import Vetting, Customer, Subscription, Removal, Ticket, TicketMessage

class FolderList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Folder.objects.filter(account=user)
    
    def get_serializer_class(self):
        return serializers.get_folder_serializer(user=self.request.user)

class FolderDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        user = self.request.user
        return Folder.objects.filter(account=user)
    
    def get_serializer_class(self):
        return serializers.get_folder_serializer(user=self.request.user)

    def perform_destroy(self, instance):
        # Perform automatic decrease of all time saves metrics for all sites in folder upon deletion
        metricQrst = AllTimeMetric.objects.filter(site__savedsite__folder=instance)
        metricQrst.update(saves=F('saves') - 1)
        instance.delete()

class SavedSitesInFolder(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        user = self.request.user
        folderPK = self.kwargs['pk']
        return SavedSite.objects.filter(account=user, folder__pk=folderPK)
    
    def get_serializer_class(self):
        return serializers.get_saved_site_serializer(user=self.request.user, update=False)

class SavedSiteDashboardList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return SavedSite.objects.filter(account=user, folder=None)
    
    def get_serializer_class(self):
        return serializers.get_saved_site_serializer(user=self.request.user, update=False)
    
    def perform_create(self, serializer):
        # Perform automatic increase of saves metric
        savedSite = serializer.save()
        today = now()
        metricQrst = DailyMetric.objects.filter(site=savedSite.site, date=today)
        metricQrst.update(saves=F('saves') + 1)
        metricQrst = AllTimeMetric.objects.filter(site=savedSite.site)
        metricQrst.update(saves=F('saves') + 1)

class AllSavedSitesList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return SavedSite.objects.filter(account=user)
    
    def get_serializer_class(self):
        return serializers.get_saved_site_serializer(user=self.request.user, update=False)

class SavedSiteDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        user = self.request.user
        return SavedSite.objects.filter(account=user)

    def get_serializer_class(self):
        if(self.request.method == 'PUT') or (self.request.method == 'PATCH'):
            update = True
        else:
            update = False
        return serializers.get_saved_site_serializer(user=self.request.user, update=update)
    
    def perform_destroy(self, instance):
        # Perform automatic decrease of all time saves metric
        metricQrst = AllTimeMetric.objects.filter(site=instance.site)
        metricQrst.update(saves=F('saves') - 1)
        instance.delete()

class DailyMetricList(generics.ListAPIView):
    serializer_class = serializers.DailyMetricSerializer
    pagination_class = None
    
    def get_queryset(self):
        siteID = self.kwargs['site_id']
        return DailyMetric.objects.filter(site__id=siteID)

class AllTimeMetricDetail(generics.RetrieveAPIView):
    serializer_class = serializers.AllTimeMetricSerializer
    lookup_field = 'site_id'

    def get_queryset(self):
        siteID = self.kwargs['site_id']
        return AllTimeMetric.objects.filter(site__id=siteID)

class RandomDailyMetricsList(generics.ListAPIView):
    serializer_class = serializers.DailyMetricSerializer

    def get_queryset(self):
        yesterday = now() - timedelta(days=1)
        return DailyMetric.objects.filter(date=yesterday).order_by('?')[:25]
        

class ViewMetricRequest(APIView):

    def post(self, request, format=None):
        try:
            siteID = request.data['site_id']
        except KeyError:
            return Response({'site_id': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            siteID = int(siteID)
        except ValueError:
            return Response({'site_id': ['This field must be an integer']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            providedSiteObj = Site.objects.get(id=siteID)
        except Site.DoesNotExist:
            return Response({'site_id': ['Site with provided site_id does not exist']}, status=status.HTTP_400_BAD_REQUEST)
        today = now()
        metricQrst = DailyMetric.objects.filter(site=providedSiteObj, date=today)
        if not metricQrst:
            return Response('Daily metric object does not exist yet', status=status.HTTP_400_BAD_REQUEST)
        if metricQrst[0].views < metricQrst[0].showings:
            metricQrst.update(views=F('views') + 1)
        metricQrst = AllTimeMetric.objects.filter(site=providedSiteObj)
        if metricQrst[0].views < metricQrst[0].showings:
            metricQrst.update(views=F('views') + 1)
        return Response('Success', status=status.HTTP_200_OK)

class ClickMetricRequest(APIView):

    def post(self, request, format=None):
        try:
            siteID = request.data['site_id']
        except KeyError:
            return Response({'site_id': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            siteID = int(siteID)
        except ValueError:
            return Response({'site_id': ['This field must be an integer']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            providedSiteObj = Site.objects.get(id=siteID)
        except Site.DoesNotExist:
            return Response({'site_id': ['Site with provided site_id does not exist']}, status=status.HTTP_400_BAD_REQUEST)
        today = now()
        metricQrst = DailyMetric.objects.filter(site=providedSiteObj, date=today)
        if not metricQrst:
            return Response('Daily metric object does not exist yet', status=status.HTTP_400_BAD_REQUEST)
        if metricQrst[0].clicks < metricQrst[0].views:
            metricQrst.update(clicks=F('clicks') + 1)
        metricQrst = AllTimeMetric.objects.filter(site=providedSiteObj)
        if metricQrst[0].clicks < metricQrst[0].views:
            metricQrst.update(clicks=F('clicks') + 1)
        return Response('Success', status=status.HTTP_200_OK)

class ShowingsMetricRequest(APIView):

    def post(self, request, format=None):
        siteIDs = []
        try:
            for x in range(8):
                siteIDs.append(request.data['site_id_' + str(x+1)])
        except KeyError:
            return Response({'site_id_1 - site_id_8': ['All of these fields are required']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            for x in range(8):
                siteIDs[x] = int(siteIDs[x])
        except ValueError:
            return Response({'site_id_1 - site_id_8': ['All of these fields must be integers']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            sites = []
            for x in range(8):
                providedSiteObj = Site.objects.get(id=siteIDs[x])
                sites.append(providedSiteObj)
        except Site.DoesNotExist:
            return Response({'site_id_1 - site_id_8': ['One or more provided site ID values does not correspond to an existing site']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            chunk = Chunk.objects.filter(site_1=sites[0], site_2=sites[1], site_3=sites[2], site_4=sites[3], site_5=sites[4], site_6=sites[5], site_7=sites[6], site_8=sites[7])[0]
        except IndexError:
            return Response('Provided chunk of sites does not exist', status=status.HTTP_400_BAD_REQUEST)
        chunk.delete()
        today = now()
        for site in sites:
            metricQrst = DailyMetric.objects.filter(site=site, date=today)
            if not metricQrst:
                return Response('One or more daily metric objects does not exist yet', status=status.HTTP_400_BAD_REQUEST)
            metricQrst.update(showings=F('showings') + 1)
            metricQrst = AllTimeMetric.objects.filter(site=site)
            metricQrst.update(showings=F('showings') + 1)
        return Response('Success', status=status.HTTP_200_OK)

class CreateFeedback(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    throttle_scope = 'feedback'

    def get_serializer_class(self):
        return serializers.get_feedback_serializer(user=self.request.user)

class FeedbackGiven(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return Site.objects.filter(feedback__account=user)

class PubdashFeedbackUnsavedList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.PubdashFeedbackSerializer
    
    def get_queryset(self):
        user = self.request.user
        sitePK = self.kwargs['site_pk']
        return Feedback.objects.filter(site__id=sitePK, site__account=user, saved=False)

class PubdashFeedbackSavedList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.PubdashFeedbackSerializer
    
    def get_queryset(self):
        user = self.request.user
        sitePK = self.kwargs['site_pk']
        return Feedback.objects.filter(site__id=sitePK, site__account=user, saved=True)

class PubdashFeedback(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.PubdashFeedbackSerializer

    def get_queryset(self):
        user = self.request.user
        return Feedback.objects.filter(site__account=user)
    
    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        if not self.object.saved:
            self.object.saved = True
            self.object.save()
            return Response('Feedback successfully saved', status=status.HTTP_200_OK)
        else:
            self.object.saved = False
            self.object.save()
            return Response('Feedback successfully unsaved', status=status.HTTP_200_OK)

class CategoryList(generics.ListAPIView):
    serializer_class = serializers.CategorySerializer
    queryset = Category.objects.all()

class SiteList(APIView):
    
    def get(self, request, format=None):
        
        # Return no sites if less than 8 sites total
        siteCount = Site.objects.all().count()
        if siteCount < 8:
            sites = []
            serializer = serializers.SiteSerializer(sites, many=True, context={'request': request})
            return Response({'results': serializer.data})

        # Automatically delete chunks older than 24 hours
        twentyFourHoursAgo = now() - timedelta(days=1)
        oldChunks = Chunk.objects.filter(created__lt=twentyFourHoursAgo).delete()

        # The algorithm
        # Get sites with below average showings and order from least to greatest
        # If there's not enough (1024), add additional sites with average or above average showings in order from least to greatest
        # Shuffle, create showings chunks, and return list of sites
        today = now()
        averageShowings = DailyMetric.objects.filter(date=today).aggregate(Avg('showings'))['showings__avg']
        if averageShowings == None:
            return Response('Failed to retrieve sites, daily metrics have not been made', status=status.HTTP_400_BAD_REQUEST)
        sites = Site.objects.filter(active=True, dailymetric__showings__lt=averageShowings, dailymetric__date=today).order_by('dailymetric__showings')[:1024]
        numberOfSites = sites.count()
        # Add additional sites if necessary
        if numberOfSites < 1024:
            NumberOfAdditionalSites = 1024 - numberOfSites
            additionalSites = Site.objects.filter(active=True, dailymetric__showings__gte=averageShowings, dailymetric__date=today).order_by('dailymetric__showings')[:NumberOfAdditionalSites]
            sites = sites | additionalSites
        sites = list(sites)
        # Reduce sites to a multiple of 8 if necessary for chunk creation
        while len(sites) % 8 != 0:
            sites = sites[:-1]
        shuffle(sites)
        for x in range(int(len(sites)/8)):
            chunk = Chunk.objects.create(site_1=sites[x*8], site_2=sites[x*8+1], site_3=sites[x*8+2], site_4=sites[x*8+3], site_5=sites[x*8+4], site_6=sites[x*8+5], site_7=sites[x*8+6], site_8=sites[x*8+7])
        serializer = serializers.SiteSerializer(sites, many=True, context={'request': request})
        return Response({'results': serializer.data})

class SiteDetail(generics.RetrieveAPIView):
    serializer_class = serializers.SiteSerializer
    queryset = Site.objects.all()

class SitesByCategory(APIView):

    def get(self, request, categorySlug, format=None):
        
        # Automatically delete chunks older than 24 hours
        twentyFourHoursAgo = now() - timedelta(days=1)
        oldChunks = Chunk.objects.filter(created__lt=twentyFourHoursAgo).delete()

        # The algorithm
        # Get sites with below average showings for the provided category and order from least to greatest
        # If there's not enough (1024), add additional sites with average or above average showings in order from least to greatest
        # Shuffle, create showings chunks, and return list of sites
        try:
            category = Category.objects.get(url=categorySlug)
        except Category.DoesNotExist:
            return Response('Provided category does not exist', status=status.HTTP_400_BAD_REQUEST)
        # Return no sites if less than 8 sites in category
        siteCount = Site.objects.filter(category=category).count()
        if siteCount < 8:
            sites = []
            serializer = serializers.SiteSerializer(sites, many=True, context={'request': request})
            return Response({'results': serializer.data})
        today = now()
        averageShowings = DailyMetric.objects.filter(date=today, site__category=category).aggregate(Avg('showings'))['showings__avg']
        if averageShowings == None:
            return Response('Failed to retrieve sites, daily metrics have not been made', status=status.HTTP_400_BAD_REQUEST)
        sites = Site.objects.filter(active=True, category=category, dailymetric__showings__lt=averageShowings, dailymetric__date=today).order_by('dailymetric__showings')[:1024]
        numberOfSites = sites.count()
        # Add additional sites if necessary
        if numberOfSites < 1024:
            NumberOfAdditionalSites = 1024 - numberOfSites
            additionalSites = Site.objects.filter(active=True, category=category, dailymetric__showings__gte=averageShowings, dailymetric__date=today).order_by('dailymetric__showings')[:NumberOfAdditionalSites]
            sites = sites | additionalSites
        sites = list(sites)
        # Reduce sites to a multiple of 8 if necessary for chunk creation
        while len(sites) % 8 != 0:
            sites = sites[:-1]
        shuffle(sites)
        for x in range(int(len(sites)/8)):
            chunk = Chunk.objects.create(site_1=sites[x*8], site_2=sites[x*8+1], site_3=sites[x*8+2], site_4=sites[x*8+3], site_5=sites[x*8+4], site_6=sites[x*8+5], site_7=sites[x*8+6], site_8=sites[x*8+7])
        serializer = serializers.SiteSerializer(sites, many=True, context={'request': request})
        return Response({'results': serializer.data})

class ActiveSiteCount(APIView):

    def get(self, request, format=None):
        count = Site.objects.filter(active=True).count()
        return Response(count)

class NewClaim(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = request.user
        try:
            url = request.data['url']
        except:
            return Response({'url': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            verification_method = request.data['verification_method']
        except:
            return Response({'verification_method': ["This required field should be 'true' or 'false' to indicate DNS or meta tag verification respectively"]}, status=status.HTTP_400_BAD_REQUEST)
        if verification_method != 'true' and verification_method != 'false':
            return Response({'verification_method': ["This field must be 'true' or 'false'"]}, status=status.HTTP_400_BAD_REQUEST)
        if verification_method == 'true':
            verification_method = True
        else:
            verification_method = False
        parsed_url = urlparse(url)
        # Handling of multiple possible common url formats
        full_http_url = 'http://{uri.netloc}/'.format(uri=parsed_url)
        full_https_url = 'https://{uri.netloc}/'.format(uri=parsed_url)
        full_http_www_url = 'http://www.{uri.netloc}/'.format(uri=parsed_url)
        full_https_www_url = 'https://www.{uri.netloc}/'.format(uri=parsed_url)
        http_url = 'http://{uri.path}/'.format(uri=parsed_url)
        https_url = 'https://{uri.path}/'.format(uri=parsed_url)
        http_www_url = 'http://www.{uri.path}/'.format(uri=parsed_url)
        https_www_url = 'https://www.{uri.path}/'.format(uri=parsed_url)
        try:
            site = Site.objects.get(url=full_http_url, freeSite=True, account__username='unsift', verified=False)
        except Site.DoesNotExist:
            try:
                site = Site.objects.get(url=full_https_url, freeSite=True, account__username='unsift', verified=False)
            except Site.DoesNotExist:
                try:
                    site = Site.objects.get(url=full_http_www_url, freeSite=True, account__username='unsift', verified=False)
                except Site.DoesNotExist:
                    try:
                        site = Site.objects.get(url=full_https_www_url, freeSite=True, account__username='unsift', verified=False)
                    except Site.DoesNotExist:
                        try:
                            site = Site.objects.get(url=http_url, freeSite=True, account__username='unsift', verified=False)
                        except Site.DoesNotExist:
                            try:
                                site = Site.objects.get(url=https_url, freeSite=True, account__username='unsift', verified=False)
                            except Site.DoesNotExist:
                                try:
                                    site = Site.objects.get(url=http_www_url, freeSite=True, account__username='unsift', verified=False)
                                except Site.DoesNotExist:
                                    try:
                                        site = Site.objects.get(url=https_www_url, freeSite=True, account__username='unsift', verified=False)
                                    except Site.DoesNotExist:
                                        return Response('The provided url does not belong to a claimable site', status=status.HTTP_400_BAD_REQUEST)
        claim = Claim.objects.create(account=user, site=site, verificationMethod=verification_method)
        serializer = serializers.get_claim_serializer(user)
        serializer = serializer(claim, many=False, context={'request': request})
        return Response({'results': serializer.data}, status=status.HTTP_200_OK)

class ClaimList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Claim.objects.filter(account=user)
    
    def get_serializer_class(self):
        return serializers.get_claim_serializer(user=self.request.user)

class ClaimDetail(generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Claim.objects.filter(account=user)
    
    def get_serializer_class(self):
        return serializers.get_claim_serializer(user=self.request.user)

class ClaimVerify(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def dns_verification(self, domain, claimCode):
        verified = False
        apivoid_request = requests.get(url='https://endpoint.apivoid.com/dnslookup/v1/pay-as-you-go/?key=' + apivoidAPIKey + '&action=dns-txt&host=' + domain)
        apivoid_response = apivoid_request.json()
        # TODO
        # Test this functionality with a real domain
        try:
            data = apivoid_response["data"]
        except KeyError:
            return verified
        try:
            records = data["records"]
        except KeyError:
            return verified
        try:
            found = records["found"]
        except KeyError:
            return verified
        if found:
            items = records["items"]
        else:
            return verified
        for item in items:
            if item["txt"] == 'unsift-site-verification=' + claimCode:
                verified = True
                break
            else:
                pass
        return verified
    
    def meta_tag_verification(self, url, claimCode):
        verified = False
        apivoid_request = requests.get(url='https://endpoint.apivoid.com/urltohtml/v1/pay-as-you-go/?key=' + apivoidAPIKey + '&url=' + url)
        apivoid_response = apivoid_request.json()
        # TODO
        # Test this functionality with a real domain
        try:
            data = apivoid_response["data"]
        except KeyError:
            return verified
        try:
            b64_response = data["base64_file"]
        except KeyError:
            return verified
        text = base64.b64decode(b64_response).decode('utf-8')
        found = text.find("<meta name=\"unsift-site-verification\" content=\"" + claimCode + "\">")
        if found != -1:
            verified = True
        return verified
    
    def send_success_email(self, request, site):
        title = request.user.username
        try:
            send_mail(
                'Site Claimed Successfully',
                title + ",\n\nYou have successfully claimed " + str(site) + " on Unsift. Head over to your publisher dashboard to see how your site is performing, or make any changes you would like to your site information. Because your site was added for free, you will not be billed for this site moving forward. Any other paid subscriptions on your account will continue to be billed normally.\n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [request.user.email,]
            )
        except:
            time.sleep(3)
            send_mail(
                'Site Claimed Successfully',
                title + ",\n\nYou have successfully claimed " + str(site) + " on Unsift. Head over to your publisher dashboard to see how your site is performing, or make any changes you would like to your site information. Because your site was added for free, you will not be billed for this site moving forward. Any other paid subscriptions on your account will continue to be billed normally.\n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [request.user.email,]
            )
        return None


    def get(self, request, claimID, format=None):
        try:
            claim = Claim.objects.get(id=claimID, account=request.user)
        except Claim.DoesNotExist:
            return Response('A claim with an ID of ' + str(claimID) + ' belonging to your account could not be found' , status=status.HTTP_404_NOT_FOUND)
        verified = False
        claimCode = claim.verificationCode
        method = claim.verificationMethod
        url = claim.site.url
        parsed_url = urlparse(url)
        domain = '{uri.netloc}'.format(uri=parsed_url)
        if method == True:
            verified = self.dns_verification(domain, claimCode)
        else:
            verified = self.meta_tag_verification(url, claimCode)
        # TODO
        # Remove This Override in Production
        verified = True
        if verified:
            site = claim.site
            site.verificationCode = claim.verificationCode
            site.account = claim.account
            site.verified = True
            site.save()
            claims = Claim.objects.filter(site=site)
            claims.delete()
            user = request.user
            userProfile = Profile.objects.get(account=user)
            if userProfile.publisher == False:
                userProfile.publisher = True
                userProfile.save()
            self.send_success_email(request, site)
            return Response('Success', status=status.HTTP_200_OK)
        else:
            return Response('We were unable to verify your claim, please follow the instructions carefully and try again in a few minutes', status=status.HTTP_424_FAILED_DEPENDENCY)

class PubdashVerificationInfo(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, site_pk, format=None):
        user = request.user
        profile = Profile.objects.get(account=user)
        isPublisher = profile.publisher
        if isPublisher:
            try:
                site = Site.objects.get(account=user, id=site_pk)
            except Site.DoesNotExist:
                return Response('A site with the provided ID belonging to your account could not be found', status=status.HTTP_400_BAD_REQUEST)
            if site.verified:
                return Response('This site has already been verified', status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'code': site.verificationCode,
                    'method': site.verificationMethod,
                    }, status=status.HTTP_200_OK)
        else:
            return Response('You must be a publisher to use this endpoint', status=status.HTTP_403_FORBIDDEN)

class PubdashToggleVerificationMethod(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, site_pk, format=None):
        user = request.user
        try:
            site = Site.objects.get(id=site_pk, account=user, verified=False)
        except:
            return Response('An unverified site with the provided ID belonging to your account could not be found', status=status.HTTP_400_BAD_REQUEST)
        site.verificationMethod = not site.verificationMethod
        site.save()
        if site.verificationMethod:
            return Response('DNS verification selected', status=status.HTTP_200_OK)
        else:
            return Response('Meta tag verification selected', status=status.HTTP_200_OK)


class PubdashVerifySite(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def dns_verification(self, domain, verification_code):
        verified = False
        apivoid_request = requests.get(url='https://endpoint.apivoid.com/dnslookup/v1/pay-as-you-go/?key=' + apivoidAPIKey + '&action=dns-txt&host=' + domain)
        apivoid_response = apivoid_request.json()
        # TODO
        # Test this functionality with a real domain
        try:
            data = apivoid_response["data"]
        except KeyError:
            return verified
        try:
            records = data["records"]
        except KeyError:
            return verified
        try:
            found = records["found"]
        except KeyError:
            return verified
        if found:
            items = records["items"]
        else:
            return verified
        for item in items:
            if item["txt"] == 'unsift-site-verification=' + verification_code:
                verified = True
                break
            else:
                pass
        return verified
    
    def meta_tag_verification(self, url, verification_code):
        verified = False
        apivoid_request = requests.get(url='https://endpoint.apivoid.com/urltohtml/v1/pay-as-you-go/?key=' + apivoidAPIKey + '&url=' + url)
        apivoid_response = apivoid_request.json()
        # TODO
        # Test this functionality with a real domain
        try:
            data = apivoid_response["data"]
        except KeyError:
            return verified
        try:
            b64_response = data["base64_file"]
        except KeyError:
            return verified
        text = base64.b64decode(b64_response).decode('utf-8')
        found = text.find("<meta name=\"unsift-site-verification\" content=\"" + verification_code + "\">")
        if found != -1:
            verified = True
        return verified
    
    def send_success_email(self, request, site):
        title = request.user.username
        try:
            send_mail(
                'Site Successfully Verified',
                title + ",\n\nYou have successfully verified ownership of " + str(site) + " on Unsift. Next we will review your site information and determine if your site is a good fit for Unsift. We will process your application in the order it was recieved, and we will notify you once a decision has been made. Typically this process takes no more than 72 hours. \n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [request.user.email,]
            )
        except:
            time.sleep(3)
            send_mail(
                'Site Successfully Verified',
                title + ",\n\nYou have successfully verified ownership of " + str(site) + " on Unsift. Next we will review your site information and determine if your site is a good fit for Unsift. We will process your application in the order it was recieved, and we will notify you once a decision has been made. Typically this process takes no more than 72 hours. \n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [request.user.email,]
            )
        return None


    def get(self, request, site_pk, fomat=None):
        user = request.user
        try:
            site = Site.objects.get(account=user, verified=False, freeSite=False, id=site_pk)
        except Site.DoesNotExist:
            return Response('The provided site ID does not belong to a paid and unverified site associated with your account', status=status.HTTP_400_BAD_REQUEST)
        verified = False
        verification_code = site.verificationCode
        method = site.verificationMethod
        url = site.url
        parsed_url = urlparse(url)
        domain = '{uri.netloc}'.format(uri=parsed_url)
        if method == True:
            verified = self.dns_verification(domain, verification_code)
        else:
            verified = self.meta_tag_verification(url, verification_code)
        # TODO
        # Remove this override in production
        verified = True
        if verified:
            site.verified = True
            site.save()
            copies = Site.objects.filter(url=site.url).exclude(id=site.id)
            if copies:
                copies.delete()
            Vetting.objects.create(url=site.url, site=site)
            self.send_success_email(request, site)
            return Response('Success', status=status.HTTP_200_OK)
        else:
            return Response('We were unable to verify ownership of this site, please follow the instructions carefully and try again in a few minutes', status=status.HTTP_424_FAILED_DEPENDENCY)
        

class PubdashSites(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.SiteSerializer

    def get_queryset(self):
        user = self.request.user
        return Site.objects.filter(account=user)

class PubdashSiteChangeStatus(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, site_pk, format=None):
        site = Site.objects.filter(id=site_pk, account=request.user).first()
        if not site:
            return Response('Site with provided ID belonging to this account could not be found', status=status.HTTP_400_BAD_REQUEST)
        try:
            site_change = SiteChange.objects.get(site=site)
        except SiteChange.DoesNotExist:
            return Response('There are no pending changes for this site', status=status.HTTP_200_OK)
        serializer = serializers.SiteChangeSerializer(site_change, context={'request': request})
        return Response(serializer.data)

class PubdashDeleteSite(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve_site(self, request, id):
        return Site.objects.filter(id=id, account=request.user).first()
    
    def retrieve_authenticated_user(self, request, password):
        authenticatedUser = authenticate(username=request.user.username, password=password)
        return authenticatedUser

    def validate_two_factor_token(self, tokenDevice, token):
        # The following lines are from django-two-factor-auth, please do not change
        validated = False
        t0s = [tokenDevice.t0]
        key = unhexlify(tokenDevice.key.encode())
        for t0 in t0s:
            for offset in range(-tokenDevice.tolerance, tokenDevice.tolerance):
                if totp(key, tokenDevice.step, t0, tokenDevice.digits, tokenDevice.drift + offset)  == token:
                    validated = True
        return validated
        # The above lines are from django-two-factor-auth, please do not change
    
    def remove_vetting_if_needed(self, site):
        try:
            vetting = Vetting.objects.get(site=site, decision=None)
        except Vetting.DoesNotExist:
            return None
        vetting.delete()
        return None
    
    def reduce_subscription_quantity(self, request, site):
        try:
            localsub = Subscription.objects.get(account=request.user)
            if not site.freeSite and site.active:
                localsub.quantity = localsub.quantity - 1
                localsub.save()
                stripe.api_key = stripeAPIKey
                stripe.Subscription.modify(
                    localsub.sid,
                    quantity=localsub.quantity,
                )
            paidSiteCount = Site.objects.filter(account=request.user, freeSite=False).exclude(id=site.id).count()
            if paidSiteCount == 0:
                stripe.Subscription.modify(
                    localsub.sid,
                    cancel_at_period_end = True,
                )
                localsub.delete()
        except Subscription.DoesNotExist:
            pass
        return None
    
    def send_removal_email(self, request, site):
        title = request.user.username
        try:
            send_mail(
                'Site Successfully Removed',
                title + ",\n\nWe were sorry to see " + site.name + " leaving Unsift. We just wanted to express our gratitude for giving us your business. We know that without publishers like you, Unsift would never be possible, so we hope that you'll consider us again in the future. Please reach out to us at any time if you have concerns or feedback and we'll ensure that things are fixed.\n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [request.user.email,]
            )
        except:
            time.sleep(3)
            send_mail(
                'Site Successfully Removed',
                title + ",\n\nWe were sorry to see " + site.name + " leaving Unsift. We just wanted to express our gratitude for giving us your business. We know that without publishers like you, Unsift would never be possible, so we hope that you'll consider us again in the future. Please reach out to us at any time if you have concerns or feedback and we'll ensure that things are fixed.\n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [request.user.email,]
            )
        return None
    
    def set_publisher_flag(self, request):
        totalSiteCount = Site.objects.filter(account=request.user).count()
        if totalSiteCount == 0:
            profile = Profile.objects.get(account=request.user)
            profile.publisher = False
            profile.save()
        return None

    # API View
    def delete(self, request, site_pk, format=None):
        site = self.retrieve_site(request, site_pk)
        if not site:
            return Response('Site with provided ID belonging to this account could not be found', status=status.HTTP_400_BAD_REQUEST)
        try:
            password = request.data['password']
        except KeyError:
            return Response({'password': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        authenticatedUser = self.retrieve_authenticated_user(request, password)
        if authenticatedUser is not None:
            tokenDevice = default_device(authenticatedUser)
            if tokenDevice:
                try:
                    token = request.data['token']
                except KeyError:
                    return Response({'token': ['A two-factor authentication token is required']}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    token = int(token)
                except ValueError:
                    return Response({'token': ['This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
                validated = self.validate_two_factor_token(tokenDevice, token)
                if not validated:
                    return Response({'token': ['The provided token is invalid']}, status=status.HTTP_400_BAD_REQUEST)            
            try:
                valid_reasons = [
                    'OTHR',
                    'COST',
                    'NEFF',
                    'PEXP',
                ]
                reason = request.data['reason']
                if reason not in valid_reasons:
                    return Response({'reason': ['This reason is not a valid choice']}, status=status.HTTP_400_BAD_REQUEST)
            except KeyError:
                reason = 'OTHR'
            try:
                notes = request.data['notes']
            except KeyError:
                notes = None
            cancellation = Cancellation.objects.create(account=request.user, reason=reason, notes=notes)
            self.reduce_subscription_quantity(request, site)
            self.remove_vetting_if_needed(site)
            self.send_removal_email(request, site)
            site.delete()
            self.set_publisher_flag(request)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'password': ['The provided password invalid for this account']}, status=status.HTTP_400_BAD_REQUEST)   

class AccountDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.AccountSerializer

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(username=user)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, username=self.request.user)
        return obj
    
    def perform_destroy(self, instance):
        # Perform automatic decrease of all time saves metrics for all saved sites belonging to user upon account deletion
        metricQrst = AllTimeMetric.objects.filter(site__savedsite__account=instance)
        metricQrst.update(saves=F('saves') - 1)
        try:
            instance.delete()
            return True
        except ProtectedError:
            return False
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            try:
                password = request.data['password']
            except KeyError:
                return Response({'password': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
            authenticatedUser = authenticate(username=request.user.username, password=password)
            if authenticatedUser is not None:
                try:
                    token = request.data['token']
                    if token is None or token == 'NaN':
                        token = 123456
                        tokenProvided = False
                    else:
                        tokenProvided = True
                except KeyError:
                    token = 123456
                    tokenProvided = False
                try:
                    token = int(token)
                except ValueError:
                    return Response({'token': [ str(token) + 'This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
                tokenDevice = default_device(authenticatedUser)
                if tokenDevice:
                    if not tokenProvided:
                        return Response({'token': ['This account requires a 2FA token before deletion']}, status=status.HTTP_400_BAD_REQUEST)
                    # The following lines are from django-two-factor-auth, please do not change
                    validated = False
                    t0s = [tokenDevice.t0]
                    key = unhexlify(tokenDevice.key.encode())
                    for t0 in t0s:
                        for offset in range(-tokenDevice.tolerance, tokenDevice.tolerance):
                            if totp(key, tokenDevice.step, t0, tokenDevice.digits, tokenDevice.drift + offset)  == token:
                                validated = True
                    # The above lines are from django-two-factor-auth, please do not change
                    if validated:
                        destroyed = self.perform_destroy(instance)
                        if not destroyed:
                            return Response('This account may not be deleted until all related Sites are deleted first', status=status.HTTP_409_CONFLICT)
                    else:
                        return Response({'token': ['The provided two-factor authentication token is invalid']}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    destroyed = self.perform_destroy(instance)
                    if not destroyed:
                        return Response('This account may not be deleted until all related Sites are deleted first', status=status.HTTP_409_CONFLICT)
            else:
                return Response({'password': ['The provided password invalid for this account']}, status=status.HTTP_400_BAD_REQUEST)
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProfileDetail(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, format=None):
        user = request.user
        profile = Profile.objects.get(account=user)
        serializer = serializers.ProfileSerializer(profile)
        return Response(serializer.data)

class ToggleNSFW(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        profile = Profile.objects.get(account=user)
        profile.showNSFW = not profile.showNSFW
        profile.save()
        serializer = serializers.ProfileSerializer(profile)
        return Response(serializer.data)


class UsernameCheck(APIView):

    def post(self, request, format=None):
        try:
            username = request.data['username']
        except KeyError:
            return Response({'username': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        if username == '':
            return Response({'username': ['This field must not be blank']}, status=status.HTTP_400_BAD_REQUEST)
        pattern = re.compile("^[\w.-]{4,30}$")
        if pattern.match(username):
            try:
                taken = User.objects.get(username=username)
                if taken:
                    return Response('Username is taken', status=status.HTTP_409_CONFLICT)
            except User.DoesNotExist:
                return Response('Username is available', status=status.HTTP_200_OK)
        else:
            return Response('Username is not valid', status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationStatus(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        profile = Profile.objects.get(account=user)
        return Response({'email_verified': profile.emailVerified}, status=status.HTTP_200_OK)

class ResendEmailVerificationLink(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, format=None):
        user = request.user
        profile = Profile.objects.get(account=user)
        if profile.emailVerified:
            return Response('Your email address is already verified', status=status.HTTP_400_BAD_REQUEST)
        profile.emailUnverifiedCutoff = now() + timedelta(days=14)
        profile.emailUnverifiedNextNotice = now() + timedelta(hours=1)
        profile.emailVerificationCode = secrets.token_urlsafe(32)
        profile.save()
        verificationcode = profile.emailVerificationCode
        title = user.username
        try:
            send_mail(
                'Verify Your Email',
                title + ", please verify your email address by clicking on the following link. If you do not verify your email address, your Unsift account will be automatically deleted in two weeks and will not be recoverable. For security reasons, previously sent email verification links will not work.\n\nhttps://www.unsift.com/account/verify-email/" + verificationcode + "/",
                'Unsift <support@unsift.com>',
                [user.email,]
            )
        except:
            time.sleep(3)
            send_mail(
                'Verify Your Email',
                title + ", please verify your email address by clicking on the following link. If you do not verify your email address, your Unsift account will be automatically deleted in two weeks and will not be recoverable. For security reasons, previously sent email verification links will not work.\n\nhttps://www.unsift.com/account/verify-email/" + verificationcode + "/",
                'Unsift <support@unsift.com>',
                [user.email,]
            )
        return Response('Success', status=status.HTTP_200_OK)


class ChangeEmail(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.ChangeEmailSerializer

    def get_object(self):
        obj = self.request.user
        return obj
    
    def random_code(self):
        return secrets.token_urlsafe(32)

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = serializer.data.get('email')
            ecrCheck = EmailChangeRequest.objects.filter(account=user)
            if len(ecrCheck) >= 1:
                return Response('Emails can only be updated once every seven days', status=status.HTTP_400_BAD_REQUEST)
            ecr = EmailChangeRequest.objects.create(account=user, oldEmail=user.email, revertCode=self.random_code())
            title = user.username
            try:
                send_mail(
                    'Security Alert',
                    title + ", the email address associated with your Unsift account has changed to " + email + ".\n\nIf you do not recognize this change, please click the following link to revert the change and secure your account:\n\nhttps://www.unsift.com/account/revert-email-change/" + ecr.revertCode + "/\n\nIf you recognize this change, you may safely delete this email.\n\nThank You,\nUnsift Support",
                    'Unsift <support@unsift.com>',
                    [user.email,]
                )
            except:
                time.sleep(3)
                send_mail(
                    'Security Alert',
                    title + ", the email address associated with your Unsift account has changed to " + email + ".\n\nIf you do not recognize this change, please click the following link to revert the change and secure your account:\n\nhttps://www.unsift.com/account/revert-email-change/" + ecr.revertCode + "/\n\nIf you recognize this change, you may safely delete this email.\n\nThank You,\nUnsift Support",
                    'Unsift <support@unsift.com>',
                    [user.email,]
                )
            user.email = email
            user.save()
            profile = Profile.objects.get(account=user)
            profile.emailVerified = False
            profile.emailUnverifiedCutoff = now() + timedelta(days=14)
            profile.emailVerificationCode = self.random_code()
            profile.emailUnverifiedNextNotice = now() + timedelta(hours=1)
            profile.save()
            try:
                send_mail(
                    'Verify Your Email',
                    title + ", please verify your new email address by clicking on the following link. If you do not verify your email address, your Unsift account will be automatically deleted in two weeks and will not be recoverable.\n\nhttps://www.unsift.com/account/verify-email/" + profile.emailVerificationCode + "/\n\nThank you,\nUnsift Support",
                    'Unsift <support@unsift.com>',
                    [user.email,]
                )
            except:
                time.sleep(3)
                send_mail(
                    'Verify Your Email',
                    title + ", please verify your new email address by clicking on the following link. If you do not verify your email address, your Unsift account will be automatically deleted in two weeks and will not be recoverable.\n\nhttps://www.unsift.com/account/verify-email/" + profile.emailVerificationCode + "/\n\nThank you,\nUnsift Support",
                    'Unsift <support@unsift.com>',
                    [user.email,]
                )
            return Response('Success', status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePassword(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.ChangePasswordSerializer

    def get_object(self):
        obj = self.request.user
        return obj
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'old_password': ['This password is incorrect']}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            update_session_auth_hash(request, user)
            title = user.username
            try:
                send_mail(
                    'Security Alert',
                    title + ", your Unsift account password has been updated. If you do not recognize this change, please click the following link to reset your password and secure your account. If you recieved a notice that your account's email has also changed, you must follow the instructions to revert the email change before resetting your password.\n\nhttps://www.unsift.com/password_reset/\n\nIf you recognize this password change, you may safely delete this email.\n\nThank you,\nUnsift Support",
                    'Unsift <support@unsift.com>',
                    [user.email,]
                )
            except:
                time.sleep(3)
                send_mail(
                    'Security Alert',
                    title + ", your Unsift account password has been updated. If you do not recognize this change, please click the following link to reset your password and secure your account. If you recieved a notice that your account's email has also changed, you must follow the instructions to revert the email change before resetting your password.\n\nhttps://www.unsift.com/password_reset/\n\nIf you recognize this password change, you may safely delete this email.\n\nThank you,\nUnsift Support",
                    'Unsift <support@unsift.com>',
                    [user.email,]
                )
            return Response('Success', status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Signup(generics.CreateAPIView):
    serializer_class = serializers.SignupSerializer
    throttle_scope = 'signup'

class SignOutEverywhere(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        oldToken = Token.objects.get(user=user)
        oldToken.delete()
        newToken = Token.objects.create(user=user)
        return Response('Success', status=status.HTTP_200_OK)

class IsTwoFactorEnabled(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, format=None):
        user = request.user
        tokenDevice = default_device(user)
        if tokenDevice:
            return Response(True, status=status.HTTP_200_OK)
        else:
            return Response(False, status=status.HTTP_200_OK)

class DisableTwoFactor(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = request.user
        tokenDevice = default_device(user)
        if tokenDevice:
            try:
                password = request.data['password']
                token = request.data['token']
            except KeyError:
                return Response({'password, token': ['Both of these fields are required']}, status=status.HTTP_400_BAD_REQUEST)
            if len(token) != 6:
                return Response({'token': ['The two-factor authentication token must be six digits long']}, status=status.HTTP_400_BAD_REQUEST)
            try:
                token = int(token)
            except ValueError:
                return Response({'token': ['This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
            authenticatedUser = authenticate(username=user.username, password=password)
            if authenticatedUser is not None:
                # The following lines are from django-two-factor-auth, please do not change
                validated = False
                t0s = [tokenDevice.t0]
                key = unhexlify(tokenDevice.key.encode())
                for t0 in t0s:
                    for offset in range(-tokenDevice.tolerance, tokenDevice.tolerance):
                        if totp(key, tokenDevice.step, t0, tokenDevice.digits, tokenDevice.drift + offset)  == token:
                            validated = True
                # The above lines are from django-two-factor-auth, please do not change
                if validated:
                    for device in devices_for_user(user):
                        device.delete()
                    return Response('Success', status=status.HTTP_200_OK)
                else:
                    return Response({'token': ['The provided two-factor authentication token is invalid']}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'password': ['The provided password is invalid']}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('This account does not have two-factor authentication enabled', status=status.HTTP_400_BAD_REQUEST)

class ObtainAPIToken(APIView):

    def post(self, request, format=None):
        try:
            username = request.data['username']
            password = request.data['password']
        except KeyError:
            return Response({'username, password': ['Both of these fields are required']}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(username=username)
        userEmail = User.objects.filter(email=username)
        if user.count() and userEmail.count == 0:
            return Response({'username': ['The provided username or email is invalid']}, status=status.HTTP_400_BAD_REQUEST)
        elif user.count() == 1:
            pass
        elif userEmail.count() == 1:
            user = userEmail
        else:
            return Response({'username': ['The provided username or email is invalid']}, status=status.HTTP_400_BAD_REQUEST)
        
        authenticatedUser = authenticate(username=username, password=password)
        if authenticatedUser is not None:
            user = authenticatedUser
            tokenDevice = default_device(user)
            if tokenDevice:
                try:
                    token = request.data['token']
                except KeyError:
                    return Response({'token': ['A six-digit two-factor authentication token is required']}, status=status.HTTP_400_BAD_REQUEST)
                if len(token) != 6:
                    return Response({'token': ['The two-factor authentication token must be six digits long']}, status=status.HTTP_400_BAD_REQUEST)
                try:
                    token = int(token)
                except ValueError:
                    return Response({'token': ['This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
                # The following lines are from django-two-factor-auth, please do not change
                validated = False
                t0s = [tokenDevice.t0]
                key = unhexlify(tokenDevice.key.encode())
                for t0 in t0s:
                    for offset in range(-tokenDevice.tolerance, tokenDevice.tolerance):
                        if totp(key, tokenDevice.step, t0, tokenDevice.digits, tokenDevice.drift + offset)  == token:
                            validated = True
                # The above lines are from django-two-factor-auth, please do not change
                if not validated:
                    return Response({'token': ['The provided two-factor authentication token is invalid']}, status=status.HTTP_400_BAD_REQUEST)
                apiToken = Token.objects.filter(user=user)[0]
                serializer = serializers.APITokenSerializer(apiToken)
                return Response(serializer.data)
            else:
                apiToken = Token.objects.filter(user=user)[0]
                serializer = serializers.APITokenSerializer(apiToken)
                return Response(serializer.data)
        else:
            return Response('The provided credentials are invalid', status=status.HTTP_400_BAD_REQUEST)

class StripeInvoiceStatus(APIView):
    def post(self, request, format=None):
        payload = request.body
        event = None
        try:
            event = stripe.Event.construct_from(
                json.loads(payload), stripeAPIKey
            )
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        invoice = event.data.object
        customerID = invoice.customer
        localcustomer = Customer.objects.get(cid=customerID)
        user = localcustomer.account
        if event.type == 'invoice.payment_succeeded':
            Site.objects.filter(account=user, active=False, vetting__decision=True).update(active=True)
        elif event.type == 'invoice.payment_failed':
            Site.objects.filter(account=user).update(active=False)
            title = user.username
            try:
                send_mail(
                    'Payment Required',
                    title + ",\n\nWe were unable to process the automatic payment for your subscription. All sites under your Unsift account have been temporarily deactivated, which means they won't be shown again until payment can be processed. Please visit the following link to provide payment:\n\nhttps://www.unsift.com/publish/payment/\n\nPlease note, it may take up to 24 hours to completely reactivate your site after payment is processed.\n\nThank You,\nUnsift Publishing",
                    'Unsift Publishing <publishing@unsift.com>',
                    [user.email,]
                )
            except:
                time.sleep(3)
                send_mail(
                    'Payment Required',
                    title + ",\n\nWe were unable to process the automatic payment for your subscription. All sites under your Unsift account have been temporarily deactivated, which means they won't be shown again until payment can be processed. Please visit the following link to provide payment:\n\nhttps://www.unsift.com/publish/payment/\n\nPlease note, it may take up to 24 hours to completely reactivate your site after payment is processed.\n\nThank You,\nUnsift Publishing",
                    'Unsift Publishing <publishing@unsift.com>',
                    [user.email,]
                )
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

class StripeSubscriptionInfo(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        try:
            subscription = Subscription.objects.get(account=user)
        except Subscription.DoesNotExist:
            return Response('There is not a subscription associated with your account', status=status.HTTP_204_NO_CONTENT)
        stripe.api_key = stripeAPIKey
        stripe_sub = stripe.Subscription.retrieve(subscription.sid)
        return Response({'subscription_info': stripe_sub})

class StripePaymentMethodList(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        try:
            customer = Customer.objects.get(account=user)
        except Customer.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)
        stripe.api_key = stripeAPIKey
        paymentMethods = stripe.PaymentMethod.list(
            customer = customer.cid,
            type = 'card',
        )
        return Response(paymentMethods, status=status.HTTP_200_OK)
    
    def delete(self, request, format=None):
        try:
            paymentMethod = request.data['payment_method']
        except KeyError:
            return Response({'payment_method': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        defaultPM = StripePaymentMethodDefault.get(self, request, format=None)
        if defaultPM.data == paymentMethod:
            return Response('You may not delete your default payment method', status=status.HTTP_400_BAD_REQUEST)
        stripe.api_key = stripeAPIKey
        stripe.PaymentMethod.detach(paymentMethod)
        return Response(status=status.HTTP_204_NO_CONTENT)

class StripePaymentMethodDefault(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        user = request.user
        try:
            localCustomer = Customer.objects.get(account=user)
        except Customer.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)
        stripe.api_key = stripeAPIKey
        stripeCustomer = stripe.Customer.retrieve(localCustomer.cid)
        dpm = stripeCustomer.invoice_settings.default_payment_method
        return Response(dpm, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        try:
            paymentMethod = request.data['payment_method']
        except KeyError:
            return Response({'payment_method': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        try:
            localCustomer = Customer.objects.get(account=user)
        except Customer.DoesNotExist:
            return Response('No active payment methods are associated with this account', status=status.HTTP_400_BAD_REQUEST)
        stripe.api_key = stripeAPIKey
        stripe.Customer.modify(
            localCustomer.cid,
            invoice_settings={
				'default_payment_method': paymentMethod
			},
        )
        return Response('Success', status=status.HTTP_200_OK)

class UnsolvedTicketList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Ticket.objects.filter(account=user, solved=False)
    
    def get_serializer_class(self):
        user = self.request.user
        return serializers.get_ticket_serializer(user=user)

class SolvedTicketList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Ticket.objects.filter(account=user, solved=True)
    
    def get_serializer_class(self):
        user = self.request.user
        return serializers.get_ticket_serializer(user=user)

class CreateTicket(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        user = self.request.user
        return serializers.get_ticket_serializer(user=user)

class TicketDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk, format=None):
        user = self.request.user
        try:
            ticket = Ticket.objects.get(account=user, id=pk)
        except Ticket.DoesNotExist:
            staff = user.is_staff
            if staff:
                try:
                    ticket = Ticket.objects.get(id=pk)
                except Ticket.DoesNotExist:
                    return Response('The provided ticket ID is invalid', status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response('The provided ticket ID does not correspond with a ticket associated with your account', status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.get_ticket_serializer(user=user)
        serializer = serializer(ticket, many=False, context={'request': request})
        return Response(serializer.data)

class TicketMessageList(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk, format=None):
        user = self.request.user
        messages = TicketMessage.objects.filter(ticket__account=user, ticket__id=pk)
        if not messages:
            staff = user.is_staff
            if staff:
                messages = TicketMessage.objects.filter(ticket__id=pk)
                if not messages:
                    return Response({
                        'count': 0,
                        'next': None,
                        'previous': None,
                        'results': []
                    }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'count': 0,
                    'next': None,
                    'previous': None,
                    'results': []
                }, status=status.HTTP_200_OK)
        serializer = serializers.get_ticket_message_serializer(user=user, ticketID=pk)
        serializer = serializer(messages, many=True, context={'request': request})
        return Response({
            'results': serializer.data
        })

class NewTicketMessage(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk, format=None):
        user = self.request.user
        staff = user.is_staff
        try:
            ticket = Ticket.objects.get(id=pk, account=user, solved=False)
        except Ticket.DoesNotExist:
            if staff:
                try:
                    ticket = Ticket.objects.get(id=pk, solved=False)
                except Ticket.DoesNotExist:
                    return Response('The provided ticket either does not exist or has been solved', status=status.HTTP_400_BAD_REQUEST)
                try:
                    message = request.data['message']
                except KeyError:
                    return Response({'message': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
                if len(message) < 8:
                    return Response({'message': ['This field must contain at least 8 characters']}, status=status.HTTP_400_BAD_REQUEST)
                if len(message) > 1024:
                    return Response({'message': ['This field may not exceed 1024 characters']}, status=status.HTTP_400_BAD_REQUEST)
                tm = TicketMessage.objects.create(ticket=ticket, account=user, message=message)
                serializer = serializers.get_ticket_message_serializer(user=user, ticketID=ticket.id)
                serializer = serializer(tm, many=False, context={'request': request})
                return Response(serializer.data)
            else:
                return Response('The provided ticket ID does not correspond with an open ticket associated with your account', status=status.HTTP_400_BAD_REQUEST)
        try:
            message = request.data['message']
        except KeyError:
            return Response({'message': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        if len(message) < 8:
            return Response({'message': ['This field must contain at least 8 characters']}, status=status.HTTP_400_BAD_REQUEST)
        if len(message) > 1024:
            return Response({'message': ['This field may not exceed 1024 characters']}, status=status.HTTP_400_BAD_REQUEST)
        tm = TicketMessage.objects.create(ticket=ticket, account=user, message=message)
        serializer = serializers.get_ticket_message_serializer(user=user, ticketID=ticket.id)
        serializer = serializer(tm, many=False, context={'request': request})
        return Response(serializer.data)

class TicketSolved(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk, format=None):
        user = self.request.user
        try:
            ticket = Ticket.objects.get(account=user, solved=False, id=pk)
        except Ticket.DoesNotExist:
            return Response('The provided ticket ID does not corrospond with an unsolved ticket associated with your account', status=status.HTTP_400_BAD_REQUEST)
        ticket.solved = True
        ticket.solvedOn = now()
        ticket.save()
        return Response('Success', status=status.HTTP_200_OK)

class StaffGlobalMetrics(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, format=None):
        yesterday = now() - timedelta(days=1)
        avgShowingsYD = DailyMetric.objects.filter(date=yesterday).aggregate(Avg('showings'))['showings__avg']
        avgViewsYD = DailyMetric.objects.filter(date=yesterday).aggregate(Avg('views'))['views__avg']
        avgClicksYD = DailyMetric.objects.filter(date=yesterday).aggregate(Avg('clicks'))['clicks__avg']
        avgSavesYD = DailyMetric.objects.filter(date=yesterday).aggregate(Avg('saves'))['saves__avg']
        maxShowingsYD = DailyMetric.objects.filter(date=yesterday).aggregate(Max('showings'))['showings__max']
        minShowingsYD = DailyMetric.objects.filter(date=yesterday).aggregate(Min('showings'))['showings__min']
        numFreeSites = Site.objects.filter(freeSite=True).count()
        numRegSites = Site.objects.filter(freeSite=False).count()
        totalSites = numFreeSites + numRegSites
        numAwaitingApproval = Vetting.objects.filter(decision=None).count()
        oneWeekAgo = now() - timedelta(days=7)
        freeSitesAddedPastWeek = Site.objects.filter(freeSite=True, active=True, vetting__decision=True, vetting__decidedOn__gt=oneWeekAgo).count()
        regSitesAddedPastWeek = Site.objects.filter(freeSite=False, active=True, vetting__decision=True, vetting__decidedOn__gt=oneWeekAgo).count()
        estimatedRevenueNextMonth = numRegSites * 9.41
        results = {
            'avgShowingsYD': avgShowingsYD,
            'avgViewsYD': avgViewsYD,
            'avgClicksYD': avgClicksYD,
            'avgSavesYD': avgSavesYD,
            'maxShowingsYD': maxShowingsYD,
            'minShowingsYD': minShowingsYD,
            'numFreeSites': numFreeSites,
            'numRegSites': numRegSites,
            'totalSites': totalSites,
            'numAwaitingApproval': numAwaitingApproval,
            'freeSitesAddedPastWeek': freeSitesAddedPastWeek,
            'regSitesAddedPastWeek': regSitesAddedPastWeek,
            'estimatedRevenueNextMonth': estimatedRevenueNextMonth,
        }
        return Response(results)

class StaffVettingDetail(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAdminUser, VettingIsAvailableOrOwnerOrReadOnly,)
    queryset = Vetting.objects.all()

    def get_serializer_class(self):
        return serializers.get_vetting_serializer(user=self.request.user)

class StaffVettingQueuePaidList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Vetting.objects.filter(assigned=False, staff=None, decision=None, site__freeSite=False)

    def get_serializer_class(self):
        return serializers.get_vetting_serializer(user=self.request.user)

class StaffVettingQueueFreeList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Vetting.objects.filter(assigned=False, staff=None, decision=None, site__freeSite=True)

    def get_serializer_class(self):
        return serializers.get_vetting_serializer(user=self.request.user)

class StaffVettingQueuePaidHelpList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Vetting.objects.filter(assigned=False, decision=None, site__freeSite=False).exclude(staff=None)

    def get_serializer_class(self):
        return serializers.get_vetting_serializer(user=self.request.user)

class StaffVettingQueueFreeHelpList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Vetting.objects.filter(assigned=False, decision=None, site__freeSite=True).exclude(staff=None)

    def get_serializer_class(self):
        return serializers.get_vetting_serializer(user=self.request.user)

class StaffVettingAssignedList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    
    def get_serializer_class(self):
        return serializers.get_vetting_serializer(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return Vetting.objects.filter(assigned=True, staff=user, decision=None)

class StaffVettingRelatedList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    
    def get_serializer_class(self):
        return serializers.get_vetting_serializer(user=self.request.user)

    def get_queryset(self):
        vettingID = self.kwargs['pk']
        try:
            vettingObj = Vetting.objects.get(id=vettingID)
        except Vetting.DoesNotExist:
            return Vetting.objects.none()
        url = vettingObj.url
        queryset = Vetting.objects.filter(url=url).exclude(id=vettingID)
        parsed_url = urlparse(url)
        scheme = '{uri.scheme}'.format(uri=parsed_url)
        if scheme == 'http':
            alt_url = 'https://{uri.netloc}/'.format(uri=parsed_url)
        else:
            alt_url = 'http://{uri.netloc}/'.format(uri=parsed_url)
        alt_queryset = Vetting.objects.filter(url=alt_url)
        queryset = queryset | alt_queryset
        return queryset

class StaffVettingRelatedRemovalList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.RelatedRemovalSerializer
    
    def get_queryset(self):
        vettingID = self.kwargs['pk']
        try:
            vetting = Vetting.objects.get(id=vettingID)
        except Vetting.DoesNotExist:
            return Removal.objects.none()
        url = vetting.url
        queryset = Removal.objects.filter(url=url)
        parsed_url = urlparse(url)
        scheme = '{uri.scheme}'.format(uri=parsed_url)
        if scheme == 'http':
            alt_url = 'https://{uri.netloc}/'.format(uri=parsed_url)
        else:
            alt_url = 'http://{uri.netloc}/'.format(uri=parsed_url)
        alt_queryset = Removal.objects.filter(url=alt_url)
        queryset = queryset | alt_queryset
        return queryset

class StaffAuditList(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, format=None):
        twoWeeksAgo = now() - timedelta(weeks=2)
        # TODO
        # Change back to 30 days for production
        thirtyDaysAgo = now() - timedelta(minutes=5)
        averageRating = Feedback.objects.filter(created__gt=twoWeeksAgo).aggregate(Avg('rating'))['rating__avg']
        if averageRating == None:
            sites = []
            serializer = serializers.SiteSerializer(sites, many=True, context={'request': request})
            return Response({'results': serializer.data})
        sites = Site.objects.filter(active=True, audited__lt=thirtyDaysAgo, feedback__created__gt=twoWeeksAgo, feedback__rating__lt=averageRating).order_by('feedback__rating')
        # Remove duplicates by converting to dictionary and then a list
        sites = list(dict.fromkeys(sites))[:1024]
        serializer = serializers.SiteSerializer(sites, many=True, context={'request': request})
        return Response({'results': serializer.data})

class StaffAuditSiteFeedbackList(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.PubdashFeedbackSerializer
    
    def get_queryset(self):
        siteID = self.kwargs['site_pk']
        twoWeeksAgo = now() - timedelta(weeks=2)
        return Feedback.objects.filter(site__id=siteID, created__gt=twoWeeksAgo).order_by('rating')

class StaffAuditSitePassed(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, site_pk, format=None):
        try:
            site = Site.objects.get(id=site_pk, active=True)
        except Site.DoesNotExist:
            return Response('Unable to retrieve active site with provided ID', status=status.HTTP_400_BAD_REQUEST)
        site.audited = now()
        site.save()
        return Response('Success', status=status.HTTP_200_OK)

class StaffAuditRemoveSite(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def delete(self, request, format=None):
        try:
            url = request.data['url']
        except KeyError:
            return Response({'url': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            site = Site.objects.get(freeSite=False, active=True, url=url)
        except Site.DoesNotExist:
            try:
                site = Site.objects.get(freeSite=True, active=True, url=url)
            except Site.DoesNotExist:
                return Response('The provided url does not belong to an active site', status=status.HTTP_400_BAD_REQUEST)
        free = site.freeSite
        try:
            password = request.data['password']
        except KeyError:
            return Response({'password': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        authenticatedUser = authenticate(username=request.user.username, password=password)
        if authenticatedUser is not None:
            try:
                token = request.data['token']
                tokenProvided = True
            except KeyError:
                token = 123456
                tokenProvided = False
            try:
                token = int(token)
            except ValueError:
                return Response({'token': ['This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
            if len(str(token)) != 6:
                return Response({'token': ['This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
            try:
                notes = str(request.data['notes'])
            except:
                return Response({'notes': ['You must send the publisher notes about why their site was removed']})
            if len(notes) > 1024:
                return Response({'notes': ['Notes to publishers must be 1024 characters or less']})
            tokenDevice = default_device(authenticatedUser)
            if tokenDevice:
                if not tokenProvided:
                    return Response({'token': ['This account requires that you supply a six-digit 2FA token before deletion']}, status=status.HTTP_400_BAD_REQUEST)
                # The following lines are from django-two-factor-auth, please do not change
                validated = False
                t0s = [tokenDevice.t0]
                key = unhexlify(tokenDevice.key.encode())
                for t0 in t0s:
                    for offset in range(-tokenDevice.tolerance, tokenDevice.tolerance):
                        if totp(key, tokenDevice.step, t0, tokenDevice.digits, tokenDevice.drift + offset)  == token:
                            validated = True
                # The above lines are from django-two-factor-auth, please do not change
                if validated:
                    if free:
                        siteAccount = site.account
                        # Unclaimed free sites should always be held by the superuser named 'unsift'
                        if siteAccount.username == 'unsift':
                            site.delete()
                            return Response(status=status.HTTP_204_NO_CONTENT)
                        else:
                            user = site.account
                            title = user.username
                            try:
                                send_mail(
                                    'Audit Failed',
                                    title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. This means that your free site status has been revoked and cannot be reinstated. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n\"" + notes + "\"\n\nThank You,\nUnsift Publishing",
                                    'Unsift Publishing <publishing@unsift.com>',
                                    [user.email,]
                                )
                            except:
                                time.sleep(3)
                                send_mail(
                                    'Audit Failed',
                                    title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. This means that your free site status has been revoked and cannot be reinstated. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n\"" + notes + "\"\n\nThank You,\nUnsift Publishing",
                                    'Unsift Publishing <publishing@unsift.com>',
                                    [user.email,]
                                )
                            removal = Removal.objects.create(url=site.url, staff=authenticatedUser, notes=notes)
                            site.delete()
                            siteCount = Site.objects.filter(account=user).count()
                            if siteCount == 0:
                                profile = Profile.objects.get(account=user)
                                profile.publisher = False
                                profile.save()
                            return Response(status=status.HTTP_204_NO_CONTENT)
                    else:
                        stripe.api_key = stripeAPIKey
                        user = site.account
                        if site.active:
                            localsub = Subscription.objects.get(account=user)
                            localsub.quantity = localsub.quantity - 1
                            localsub.save()
                            stripe.Subscription.modify(
                                localsub.sid,
                                quantity=localsub.quantity,
                            )
                        title = user.username
                        try:
                            send_mail(
                                'Audit Failed',
                                title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. Your subscription for this site has been cancelled and you will not be billed for it moving forward. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n\"" + notes + "\"\n\nThank You,\nUnsift Publishing",
                                'Unsift Publishing <publishing@unsift.com>',
                                [user.email,]
                            )
                        except:
                            time.sleep(3)
                            send_mail(
                                'Audit Failed',
                                title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. Your subscription for this site has been cancelled and you will not be billed for it moving forward. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n\"" + notes + "\"\n\nThank You,\nUnsift Publishing",
                                'Unsift Publishing <publishing@unsift.com>',
                                [user.email,]
                            )
                        removal = Removal.objects.create(url=site.url, staff=authenticatedUser, notes=notes)
                        site.delete()
                        paidSiteCount = Site.objects.filter(account=user, freeSite=False).count()
                        if paidSiteCount == 0:
                            stripe.Subscription.modify(
                                localsub.sid,
                                cancel_at_period_end = True,
                            )
                            localsub.delete()
                        totalSiteCount = Site.objects.filter(account=user).count()
                        if totalSiteCount == 0:
                            profile = Profile.objects.get(account=user)
                            profile.publisher = False
                            profile.save()
                        return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'token': ['The provided two-factor authentication token is invalid']}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if free:
                    siteAccount = site.account
                    # Unclaimed free sites should always be held by the superuser named 'unsift'
                    if siteAccount.username == 'unsift':
                        site.delete()
                        return Response(status=status.HTTP_204_NO_CONTENT)
                    else:
                        user = site.account
                        title = user.username
                        try:
                            send_mail(
                                'Audit Failed',
                                title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. This means that your free site status has been revoked and cannot be reinstated. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n\"" + notes + "\"\n\nThank You,\nUnsift Publishing",
                                'Unsift Publishing <publishing@unsift.com>',
                                [user.email,]
                            )
                        except:
                            time.sleep(3)
                            send_mail(
                                'Audit Failed',
                                title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. This means that your free site status has been revoked and cannot be reinstated. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n\"" + notes + "\"\n\nThank You,\nUnsift Publishing",
                                'Unsift Publishing <publishing@unsift.com>',
                                [user.email,]
                            )
                        removal = Removal.objects.create(url=site.url, staff=authenticatedUser, notes=notes)
                        site.delete()
                        siteCount = Site.objects.filter(account=user).count()
                        if siteCount == 0:
                            profile = Profile.objects.get(account=user)
                            profile.publisher = False
                            profile.save()
                        return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    stripe.api_key = stripeAPIKey
                    user = site.account
                    if site.active:
                        localsub = Subscription.objects.get(account=user)
                        localsub.quantity = localsub.quantity - 1
                        localsub.save()
                        stripe.Subscription.modify(
                            localsub.sid,
                            quantity=localsub.quantity,
                        )
                    title = user.username
                    try:
                        send_mail(
                            'Audit Failed',
                            title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. Your subscription for this site has been cancelled and you will not be billed for it moving forward. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n" + notes + "\n\nThank You,\nUnsift Publishing",
                            'Unsift Publishing <publishing@unsift.com>',
                            [user.email,]
                        )
                    except:
                        time.sleep(3)
                        send_mail(
                            'Audit Failed',
                            title + ",\n\nWe have some bad news. Your site, " + site.name + ", has failed a routine audit and has been removed from Unisft. This is typically caused by a violation of Unsift's terms. Your subscription for this site has been cancelled and you will not be billed for it moving forward. While it is possible to re-publish your site on Unsift following necessary changes, we ask that you wait at least 30 days and consider the following notes from one of our staff:\n\n" + notes + "\n\nThank You,\nUnsift Publishing",
                            'Unsift Publishing <publishing@unsift.com>',
                            [user.email,]
                        )
                    removal = Removal.objects.create(url=site.url, staff=authenticatedUser, notes=notes)
                    site.delete()
                    paidSiteCount = Site.objects.filter(account=user, freeSite=False).count()
                    if paidSiteCount == 0:
                        stripe.Subscription.modify(
                            localsub.sid,
                            cancel_at_period_end = True,
                        )
                        localsub.delete()
                    totalSiteCount = Site.objects.filter(account=user).count()
                    if totalSiteCount == 0:
                        profile = Profile.objects.get(account=user)
                        profile.publisher = False
                        profile.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'password': ['The provided password invalid for this account']}, status=status.HTTP_400_BAD_REQUEST)

class StaffSiteChangesQueue(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.SiteChangeSerializer

    def get_queryset(self):
        return SiteChange.objects.all().order_by('created')

class StaffSiteChangeDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.SiteChangeSerializer
    queryset = SiteChange.objects.all()

class StaffSiteChangeApprove(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, pk, format=None):
        try:
            site_change = SiteChange.objects.get(id=pk)
        except SiteChange.DoesNotExist:
            return Response('The SiteChange object with the provided ID could not be found', status=status.HTTP_404_NOT_FOUND)
        site = site_change.site
        site.name = site_change.name
        site.description = site_change.description
        if site_change.change_logo:
            site.logo = site_change.logo
        site.save()
        site_change.delete()
        serializer = serializers.SiteSerializer(site, many=False, context={'request': request})
        return Response({'updated_site': serializer.data})

class StaffSiteChangeDeny(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, pk, format=None):
        try:
            site_change = SiteChange.objects.get(id=pk)
        except SiteChange.DoesNotExist:
            return Response('The SiteChange object with the provided ID could not be found', status=status.HTTP_404_NOT_FOUND)
        try:
            notes = request.data['notes']
        except KeyError:
            return Response({'notes': ['You must send the publisher notes about your decision']}, status=status.HTTP_400_BAD_REQUEST)
        site = site_change.site
        user = site.account
        title = user.username
        try:
            send_mail(
                'Site Change Denied',
                title + ",\n\nYou recently tried to modify your site, " + site.name + ", but the request was denied by one of our staff members. This is typically caused by providing inaccurate site information or breaking Unsift's terms of publishing. You may try to modify your site again after 30 days from the time of the last request. A staff member has provided the following notes about their decision:\n\n" + notes + "\n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [user.email,]
            )
        except:
            time.sleep(3)
            send_mail(
                'Site Change Denied',
                title + ",\n\nYou recently tried to modify your site, " + site.name + ", but the request was denied by one of our staff members. This is typically caused by providing inaccurate site information or breaking Unsift's terms of publishing. You may try to modify your site again after 30 days from the time of the last request. A staff member has provided the following notes about their decision:\n\n" + notes + "\n\nThank You,\nUnsift Publishing",
                'Unsift Publishing <publishing@unsift.com>',
                [user.email,]
            )
        site_change.delete()
        return Response('Success', status=status.HTTP_200_OK)

class StaffDeleteTicket(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def delete(self, request, pk, format=None):
        try:
            password = request.data['password']
        except KeyError:
            return Response({'password': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        authenticatedUser = authenticate(username=request.user.username, password=password)
        if authenticatedUser is not None:
            try:
                token = request.data['token']
                tokenProvided = True
            except KeyError:
                token = 123456
                tokenProvided = False
            try:
                token = int(token)
            except ValueError:
                return Response({'token': ['This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
            if len(str(token)) != 6:
                return Response({'token': ['This field must be a six-digit integer']}, status=status.HTTP_400_BAD_REQUEST)
            tokenDevice = default_device(authenticatedUser)
            if tokenDevice:
                if not tokenProvided:
                    return Response({'token': ['This account requires that you supply a six-digit 2FA token before deletion']}, status=status.HTTP_400_BAD_REQUEST)
                # The following lines are from django-two-factor-auth, please do not change
                validated = False
                t0s = [tokenDevice.t0]
                key = unhexlify(tokenDevice.key.encode())
                for t0 in t0s:
                    for offset in range(-tokenDevice.tolerance, tokenDevice.tolerance):
                        if totp(key, tokenDevice.step, t0, tokenDevice.digits, tokenDevice.drift + offset)  == token:
                            validated = True
                # The above lines are from django-two-factor-auth, please do not change
                if validated:
                    try:
                        ticket = Ticket.objects.get(id=pk)
                    except Ticket.DoesNotExist:
                        return Response('The provided ticket ID is invalid', status=status.HTTP_400_BAD_REQUEST)
                    ticket.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'token': ['The provided two-factor authentication token is invalid']}, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    ticket = Ticket.objects.get(id=pk)
                except Ticket.DoesNotExist:
                    return Response('The provided ticket ID is invalid', status=status.HTTP_400_BAD_REQUEST)
                ticket.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'password': ['The provided password invalid for this account']}, status=status.HTTP_400_BAD_REQUEST)

class StaffTicketQueue(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Ticket.objects.filter(solved=False).order_by('timestamp')

    def get_serializer_class(self):
        user = self.request.user
        return serializers.get_ticket_serializer(user=user)

class APIVoidVettingScan(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, format=None):
        try:
            domain = request.data['url']
        except KeyError:
            return Response({'url': ['This field is required']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            site = Site.objects.get(active=False, verified=True, url=request.data['url'])
        except Site.DoesNotExist:
            return Response('The provided url does not belong to an inactive and verified site on Unsift', status=status.HTTP_400_BAD_REQUEST)
        parsed_domain = urlparse(domain)
        scheme = '{uri.scheme}'.format(uri=parsed_domain)
        domain = '{uri.netloc}'.format(uri=parsed_domain)
        request1 = requests.get(url='https://endpoint.apivoid.com/sitetrust/v1/pay-as-you-go/?key=' + apivoidAPIKey + '&host=' + domain)
        response1 = request1.json()
        valid_https = response1["data"]["report"]["security_checks"]["is_valid_https"]
        if valid_https:
            if scheme == 'http':
                site.url = site.url.replace('http://', 'https://', 1)
                site.save()
                vetting = Vetting.objects.get(site=site)
                vetting.url = vetting.url.replace('http://', 'https://', 1)
                vetting.save()
        elif not valid_https:
            if scheme == 'https':
                site.url = site.url.replace('https://', 'http://', 1)
                site.save()
                vetting = Vetting.objects.get(site=site)
                vetting.url = vetting.url.replace('https://', 'http://', 1)
                vetting.save()
        request2 = requests.get(url='https://endpoint.apivoid.com/domainbl/v1/pay-as-you-go/?key=' + apivoidAPIKey + '&host=' + domain)
        response2 = request2.json()
        return Response({'site_trustworthiness_scan': response1, 'domain_reputation_scan': response2})


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'username-check': reverse('api:username-check', request=request, format=format),
        'sign-up': reverse('api:sign-up', request=request, format=format),
        'token': reverse('api:obtain-api-token', request=request, format=format),
        'account': reverse('api:account-detail', request=request, format=format),
        'change-password': reverse('api:change-password', request=request, format=format),
        'change-email': reverse('api:change-email', request=request, format=format),
        'email-verification-status': reverse('api:email-verification-status', request=request, format=format),
        'resend-email-verification-link': reverse('api:resend-email-verification-link', request=request, format=format),
        'is-2fa-enabled': reverse('api:is-2fa-enabled', request=request, format=format),
        'disable-2fa': reverse('api:disable-2fa', request=request, format=format),
        'sign-out-everywhere': reverse('api:sign-out-everywhere', request=request, format=format),
        'profile': reverse('api:profile-detail', request=request, format=format),
        'toggle-nsfw': reverse('api:toggle-nsfw', request=request, format=format),
        'sites': reverse('api:site-list', request=request, format=format),
        'categories': reverse('api:category-list', request=request, format=format),
        'sites-by-category': reverse('api:sites-by-category', kwargs={'categorySlug': 'category-url-here'}, request=request, format=format),
        'dashboard-saved-sites': reverse('api:saved-site-dashboard-list', request=request, format=format),
        'all-saved-sites': reverse('api:saved-sites-list', request=request, format=format),
        'folders': reverse('api:folder-list', request=request, format=format),
        'saved-sites-in-folder': reverse('api:saved-sites-in-folder', kwargs={'pk': '0'}, request=request, format=format),
        'all-time-metrics': reverse('api:all-time-metric-detail', kwargs={'site_id': '0'}, request=request, format=format),
        'daily-metrics': reverse('api:daily-metric-list', kwargs={'site_id': '0'}, request=request, format=format),
        'random-daily-metrics': reverse('api:random-daily-metrics-list', request=request, format=format),
        'metric-request-showings': reverse('api:metric-request-showings', request=request, format=format),
        'metric-request-view': reverse('api:metric-request-view', request=request, format=format),
        'metric-request-click': reverse('api:metric-request-click', request=request, format=format),
        'feedback': reverse('api:feedback', request=request, format=format),
        'feedback-given': reverse('api:feedback-given', request=request, format=format),
        'claims': reverse('api:claim-list', request=request, format=format),
        'new-claim': reverse('api:new-claim', request=request, format=format),
        'verify-claim': reverse('api:claim-verify', kwargs={'claimID': '0'}, request=request, format=format),
        'publisher-dashboard-sites': reverse('api:pubdash-sites', request=request, format=format),
        'publisher-dashboard-delete-site': reverse('api:pubdash-delete-site', kwargs={'site_pk': '0'}, request=request, format=format),
        'publisher-dashboard-unsaved-feedback': reverse('api:pubdash-unsaved-feedback', kwargs={'site_pk': '0'}, request=request, format=format),
        'publisher-dashboard-saved-feedback': reverse('api:pubdash-saved-feedback', kwargs={'site_pk': '0'}, request=request, format=format),
        'publisher-dashboard-feedback': reverse('api:pubdash-feedback-detail', kwargs={'pk': '0'}, request=request, format=format),
        'publisher-dashboard-site-verification-info': reverse('api:pubdash-verification-info', kwargs={'site_pk': 0}, request=request, format=format),
        'publisher-dashboard-toggle-verification-method': reverse('api:pubdash-toggle-verification-method', kwargs={'site_pk': 0}, request=request, format=format),
        'publisher-dashboard-verify-site': reverse('api:pubdash-verify-site', kwargs={'site_pk': 0}, request=request, format=format),
        'publisher-dashboard-site-change-status': reverse('api:pubdash-site-change-status', kwargs={'site_pk': 0}, request=request, format=format),
        'payment-methods': reverse('api:payment-method-list', request=request, format=format),
        'default-payment-method': reverse('api:payment-method-default', request=request, format=format),
        'subscription-info': reverse('api:stripe-subscription-info', request=request, format=format),
        'unsolved-tickets': reverse('api:unsolved-ticket-list', request=request, format=format),
        'solved-tickets': reverse('api:solved-ticket-list', request=request, format=format),
        'create-ticket': reverse('api:create-ticket', request=request, format=format),
        'ticket-messages': reverse('api:ticket-message-list', kwargs={'pk': '0'}, request=request, format=format),
        'new-ticket-message': reverse('api:new-ticket-message', kwargs={'pk': '0'}, request=request, format=format),
        'mark-ticket-solved': reverse('api:ticket-solved', kwargs={'pk': '0'}, request=request, format=format),
    })