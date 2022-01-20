import magic
from urllib.parse import urlparse
from django import forms
from django.core.exceptions import NON_FIELD_ERRORS
from django.forms import ModelForm
from django.utils.timezone import now, timedelta
from .models import Site, Category
from staff.models import Removal
from pubdash.models import SiteChange

class OnboardingForm(ModelForm):

    agreement = forms.BooleanField(
        required=True,
        error_messages={
            'required': "You didn't agree to the terms of publishing."
        }
    )

    def clean_verificationCode(self):
        verificationCode = self.cleaned_data['verificationCode']
        if len(verificationCode) > 16 or len(verificationCode) < 16:
            self.add_error('verificationCode', 'The verification code must contain exactly 16 characters.')
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
        for character in verificationCode:
            if character not in charset:
                self.add_error('verificationCode', 'The verification code contains invalid characters.')
                break
        return verificationCode
    
    def clean_url(self):
        # Strip URL to base protocol and hostname
        url = self.cleaned_data['url']
        parsed_url = urlparse(url)
        result = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)
        if result == 'http://example.com/' or result == 'https://example.com/' or result == 'http://www.example.com/' or result == 'https://www.example.com/':
            self.add_error('url', 'example.com cannot be published on Unsift')
        scheme = '{uri.scheme}'.format(uri=parsed_url)
        if scheme == 'https' or scheme == 'http':
            if scheme == 'http':
                alt_result = 'https://{uri.netloc}/'.format(uri=parsed_url)
            else:
                alt_result = 'http://{uri.netloc}/'.format(uri=parsed_url)
        else:
            # Set variable anyway, so that recent removals can be checked below
            alt_result = result
            self.add_error('url', 'Unsift only allows for http and https sites, please provide a valid url')
        try:
            unclaimedSite = Site.objects.get(url=result, freeSite=True, account__username='unsift')
            if unclaimedSite:
                self.add_error('url', 'This is a free site already on Unsift, please use the site claiming process instead')
        except Site.DoesNotExist:
            pass
        try:
            existingVerifiedSite = Site.objects.get(url=result, verified=True)
            self.add_error('url', 'This site is already on Unsift and is controlled by a verified party')
        except Site.DoesNotExist:
            pass
        # TODO
        # Change back to 30 days for production
        thirtyDaysAgo = now() - timedelta(days=1)
        recentRemovals = Removal.objects.filter(url=result, removedOn__gt=thirtyDaysAgo)
        altRecentRemovals = Removal.objects.filter(url=alt_result, removedOn__gt=thirtyDaysAgo)
        if recentRemovals or altRecentRemovals:
            self.add_error('url', 'This site was recently removed from Unsift and cannot be re-published for 30 days from the date of removal')
        return result
    
    def clean_logo(self):
        logo = self.cleaned_data.get("logo", False)
        if logo:
            filetype = magic.from_buffer(logo.read(1024), mime=True)
        if not logo:
            return logo
        allowed_types = ['image/jpeg', 'image/png']
        if filetype not in allowed_types:
            self.add_error('logo', 'The provided file must be a jpg/jpeg or png')
        return logo
    
    def clean_account(self):
        account = self.cleaned_data.get("account", False)
        if not account:
            return account
        if account.is_superuser:
            self.add_error('account', 'You may not onboard sites from the superuser account')
        return account

    class Meta:
        model = Site
        fields = ['account', 'url', 'verificationMethod', 'verificationCode', 'name', 'description', 'category', 'logo', 'agreement']
        exclude = ['verified', 'freeSite', 'active', 'audited', 'updated']
        widgets = {
            'account': forms.HiddenInput(),
            'url': forms.TextInput(attrs={
                'class': 'share-packet-0-verify-field',
                'placeholder': 'https://www.example.com/'
            }),
            'verificationCode': forms.HiddenInput(),
            'name': forms.TextInput(attrs={
                'class': 'pub-analytics-modify-form-mbtm',
                'placeholder': "Your site's name"
            }),
            'description': forms.Textarea(attrs={
                'class': 'pmaf-desc',
                'placeholder': 'Describe what your site is all about.'
            }),
            'logo': forms.FileInput(attrs={
                'class': 'pamf-media-logo pmfield',
                'accept': 'image/png, image/jpeg'
            }),
            'category': forms.Select(attrs={
                'class': 'pub-analytics-top-categories-feed'
            })
        }
        error_messages = {
            'account': {
                'required': 'You must be signed into a valid account to continue.',
                'invalid_choice': 'You must be signed into a valid account to continue.'
            },
            'url': {
                'required': 'The homepage URL field is required.',
                'invalid': 'The provided homepage URL is invalid.',
                'max_length': 'The provided homepage URL is too long. The maximum length is 100 characters.'
            },
            'name': {
                'required': 'You must provide a name for your site.',
                'max_length': "Your site's name must be 25 characters or less."
            },
            'description': {
                'required': 'You must provide a description for your site.',
                'max_length': "Your site's description must be 150 characters or less."
            },
            'category': {
                'required': 'You must select a category.',
                'invalid_choice': 'You have selected an invalid category.'
            },
            'logo': {
                'invalid': 'The provided logo is invalid.',
                'max_length': 'Uploaded file names must be 100 characters or less.'
            },
            NON_FIELD_ERRORS: {
                'unique_together': 'You have already onboarded this site.',
            }
        }

    def __init__(self, *args, **kwargs):
        super(OnboardingForm, self).__init__(*args, **kwargs)
        self.fields['category'].queryset = Category.objects.all()

class UpdateSiteForm(ModelForm):

    def clean_logo(self):
        logo = self.cleaned_data.get("logo", False)
        if logo:
            filetype = magic.from_buffer(logo.read(1024), mime=True)
        if not logo:
            return logo
        allowed_types = ['image/jpeg', 'image/png']
        if filetype not in allowed_types:
            self.add_error('logo', 'The provided file must be a jpg/jpeg or png')
        return logo

    class Meta:
        model = SiteChange
        fields = ['site', 'name', 'description', 'logo', 'change_logo']
        exclude = ['created']
        widgets = {
            'site': forms.HiddenInput(),
            'name': forms.TextInput(attrs={
                'class': 'pub-analytics-modify-form-mbtm',
                'placeholder': "Your site's name"
            }),
            'description': forms.Textarea(attrs={
                'class': 'pmaf-desc',
                'placeholder': 'Describe what your site is all about.'
            }),
            'logo': forms.FileInput(attrs={
                'class': 'pamf-media-logo pmfield',
                'accept': 'image/png, image/jpeg'
            })
        }
        error_messages = {
            'site': {
                'required': 'You must provide a valid site to change.',
                'invalid_choice': 'The provided site is an invalid choice.'
            },
            'name': {
                'required': 'You must provide a name for your site.',
                'max_length': "Your site's name must be 25 characters or less."
            },
            'description': {
                'required': 'You must provide a description for your site.',
                'max_length': "Your site's description must be 150 characters or less."
            },
            'logo': {
                'invalid': 'The provided logo is invalid.',
                'max_length': 'Uploaded file names must be 100 characters or less.'
            }
        }