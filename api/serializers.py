from rest_framework import serializers
from rest_framework.validators import UniqueValidator, UniqueTogetherValidator
from rest_framework.authtoken.models import Token
from django.utils.timezone import now, timedelta
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from account.models import Profile
from library.models import Folder, SavedSite
from pubdash.models import DailyMetric, AllTimeMetric, Feedback, SiteChange
from publish.models import Category, Site, Claim
from staff.models import Vetting, Ticket, TicketMessage, Removal

def get_folder_serializer(user):
    class FolderSerializer(serializers.HyperlinkedModelSerializer):
        api_url = serializers.HyperlinkedIdentityField(view_name='api:folder-detail')
        account = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.filter(username=user), default=User.objects.get(username=user))
        username = serializers.StringRelatedField(many=False, read_only=True, source='account')
        class Meta:
            model = Folder
            fields = ('api_url', 'id', 'name', 'account', 'username')
    return FolderSerializer

def get_saved_site_serializer(user, update):
    class SavedSiteSerializer(serializers.HyperlinkedModelSerializer):
        api_url = serializers.HyperlinkedIdentityField(view_name='api:saved-site-detail')
        if(update):
            site = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name='api:site-detail')
            account = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
        else:
            site = serializers.HyperlinkedRelatedField(many=False, read_only=False, queryset=Site.objects.all(), view_name='api:site-detail', validators=[UniqueValidator(queryset=SavedSite.objects.filter(account=user), message='This site is already in your library')])
            account = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.filter(username=user), default=User.objects.get(username=user))
        site_name = serializers.StringRelatedField(many=False, read_only=True, source='site')
        folder = serializers.HyperlinkedRelatedField(many=False, read_only=False, queryset=Folder.objects.filter(account=user), allow_null=True, view_name='api:folder-detail')
        folder_name = serializers.StringRelatedField(many=False, read_only=True, source='folder')
        username = serializers.StringRelatedField(many=False, read_only=True, source='account')
        class Meta:
            model = SavedSite
            fields = ('api_url', 'id', 'site', 'site_name', 'folder', 'folder_name', 'account', 'username')
    return SavedSiteSerializer

class DailyMetricSerializer(serializers.ModelSerializer):
    site = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name='api:site-detail')
    site_name = serializers.StringRelatedField(many=False, read_only=True, source='site')
    class Meta:
        model = DailyMetric
        fields = ('site', 'site_name', 'date', 'views', 'clicks', 'saves', 'showings')

class AllTimeMetricSerializer(serializers.ModelSerializer):
    site = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name='api:site-detail')
    site_name = serializers.StringRelatedField(many=False, read_only=True, source='site')
    class Meta:
        model = AllTimeMetric
        fields = ('site', 'site_name', 'views', 'clicks', 'saves', 'showings')

def get_feedback_serializer(user):
    class FeedbackSerializer(serializers.ModelSerializer):
        account = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.filter(username=user), default=User.objects.get(username=user))
        site = serializers.HyperlinkedRelatedField(many=False, read_only=False, queryset=Site.objects.all(), view_name='api:site-detail')
        subject = serializers.CharField(required=True, min_length=4, max_length=50)
        message = serializers.CharField(required=True, min_length=8, max_length=250)
        rating = serializers.IntegerField(required=True, min_value=1, max_value=5)
        class Meta:
            model = Feedback
            fields = ('account', 'site', 'subject', 'message', 'rating')
            validators = [
            UniqueTogetherValidator(
                queryset=Feedback.objects.all(),
                fields=['account', 'site'],
                message='Your previous feedback is still being reviewed'
            )]
    return FeedbackSerializer

class PubdashFeedbackSerializer(serializers.ModelSerializer):
    api_url = serializers.HyperlinkedIdentityField(view_name='api:pubdash-feedback-detail')
    created = serializers.DateTimeField(read_only=True)
    site = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name='api:site-detail')
    site_name = serializers.StringRelatedField(many=False, read_only=True, source='site')
    subject = serializers.CharField(read_only=True)
    message = serializers.CharField(read_only=True)
    rating = serializers.IntegerField(read_only=True)
    class Meta:
        model = Feedback
        fields = ('api_url', 'id', 'created', 'site', 'site_name', 'subject', 'message', 'rating', 'saved')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'url')

class SiteSerializer(serializers.HyperlinkedModelSerializer):
    api_url = serializers.HyperlinkedIdentityField(view_name='api:site-detail')
    category = serializers.StringRelatedField(many=False, read_only=True)
    verified = serializers.BooleanField(read_only=True)
    active = serializers.BooleanField(read_only=True)
    audited = serializers.DateTimeField(read_only=True)
    updatable = serializers.SerializerMethodField('get_updatable')

    def get_updatable(self, obj):
        # TODO
        # Change back to 30 days for production
        thirtyDaysAgo = now() - timedelta(minutes=5)
        if obj.updated >= thirtyDaysAgo:
            return False
        else:
            return True

    class Meta:
        model = Site
        fields = ('api_url', 'id', 'verified', 'active', 'updated', 'updatable', 'audited', 'url', 'name', 'description', 'category', 'logo')

class AccountSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    username = serializers.RegexField(regex=r"^[\w.-]+$", min_length=4, max_length=30, validators=[UniqueValidator(queryset=User.objects.all(), message='This username is already taken')])
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ChangeEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), message='This email is in use by a different account')])

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, min_length=8, max_length=128)
    new_password = serializers.CharField(required=True, min_length=8, max_length=128)

    def validate_new_password(self, value):
        validate_password(value, self.context['request'].user)
        return value

class SignupSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), message='This email is in use by an existing account')])
    username = serializers.RegexField(regex=r"^[\w.-]+$", min_length=4, max_length=30, validators=[UniqueValidator(queryset=User.objects.all())])
    # Do not create explicit password CharField or it will expose the hashed password upon signup.
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate(self, data):
        # Create dummy user to pass into validate_password
        # Do not save dummy user
        dummyUser = User(
            username=data['username'],
            email=data['email']
        )
        validate_password(data['password'], dummyUser)
        return data

class APITokenSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=40, source='key')
    class Meta:
        model = Token
        fields = ('token',)

def get_vetting_serializer(user):
    class VettingSerializer(serializers.ModelSerializer):
        api_url = serializers.HyperlinkedIdentityField(view_name='api:staff-vetting-detail')
        url = serializers.CharField(read_only=True)
        site = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name='api:site-detail')
        assigned = serializers.BooleanField(required=False)
        staff = serializers.PrimaryKeyRelatedField(required=False, many=False, read_only=False, queryset=User.objects.filter(is_staff=True, username=user), default=user)
        staff_username = serializers.StringRelatedField(many=False, read_only=True, source='staff')
        decision = serializers.BooleanField(required=False, allow_null=True, default=None)
        decided_on = serializers.DateField(source='decidedOn', allow_null=True, required=False)
        notes = serializers.CharField(max_length=1024, allow_blank=True, allow_null=True, required=False)
        class Meta:
            model = Vetting
            fields = ('api_url', 'id', 'url', 'site', 'assigned', 'staff', 'staff_username', 'decision', 'decided_on', 'notes')
    return VettingSerializer

def get_claim_serializer(user):
    class ClaimSerializer(serializers.ModelSerializer):
        api_url = serializers.HyperlinkedIdentityField(view_name='api:claim-detail')
        account = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.filter(username=user), default=User.objects.get(username=user))
        username = serializers.StringRelatedField(many=False, read_only=True, source='account')
        site = serializers.HyperlinkedRelatedField(many=False, read_only=False, queryset=Site.objects.filter(freeSite=True, account__username='unsift', active=True),  view_name='api:site-detail')
        site_name = serializers.StringRelatedField(many=False, read_only=True, source='site')
        verificationCode = serializers.CharField(read_only=True)
        verificationMethod = serializers.BooleanField(required=True, allow_null=False)
        created = serializers.DateTimeField(read_only=True)
        class Meta:
            model = Claim
            fields = ('api_url', 'id', 'account', 'username', 'site', 'site_name', 'verificationCode', 'verificationMethod', 'created')
    return ClaimSerializer

def get_ticket_serializer(user):
    class TicketSerializer(serializers.ModelSerializer):
        api_url = serializers.HyperlinkedIdentityField(view_name='api:ticket-detail')
        timestamp = serializers.DateTimeField(read_only=True)
        account = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.filter(username=user), default=User.objects.get(username=user))
        username = serializers.StringRelatedField(many=False, read_only=True, source='account')
        subject = serializers.CharField(required=True, min_length=4, max_length=64)
        message = serializers.CharField(required=True, min_length=8, max_length=1024)
        solved = serializers.BooleanField(required=False)
        solvedOn = serializers.DateTimeField(read_only=False, default=None)
        class Meta:
            model = Ticket
            fields = ('api_url', 'id', 'timestamp', 'account', 'username', 'subject', 'message', 'solved', 'solvedOn')
    return TicketSerializer

def get_ticket_message_serializer(user, ticketID):
    class TicketMessageSerializer(serializers.ModelSerializer):
        ticket = serializers.HyperlinkedRelatedField(many=False, read_only=False, queryset=Ticket.objects.filter(account=user), default=Ticket.objects.get(id=ticketID), view_name='api:ticket-detail')
        timestamp = serializers.DateTimeField(read_only=True)
        account = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=User.objects.filter(username=user), default=User.objects.get(username=user))
        username = serializers.StringRelatedField(many=False, read_only=True, source='account')
        staff = serializers.SerializerMethodField(read_only=True)
        message = serializers.CharField(required=True, min_length=8, max_length=1024)
        class Meta:
            model = TicketMessage
            fields = ('id', 'ticket', 'timestamp', 'account', 'username', 'staff', 'message')
        def get_staff(self, obj):
            return obj.account.is_staff
    return TicketMessageSerializer

class RelatedRemovalSerializer(serializers.ModelSerializer):
    url = serializers.CharField(read_only=True)
    removed_on = serializers.DateField(read_only=True, source='removedOn')
    staff = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    staff_username = serializers.StringRelatedField(many=False, read_only=True, source='staff')
    notes = serializers.CharField(read_only=True)
    class Meta:
        model = Removal
        fields = ('url', 'removed_on', 'staff', 'staff_username', 'notes')

class ProfileSerializer(serializers.ModelSerializer):
    account = serializers.StringRelatedField(many=False, read_only=True)
    email_verified = serializers.BooleanField(read_only=True, source='emailVerified')
    show_NSFW = serializers.BooleanField(required=False, source='showNSFW')
    class Meta:
        model = Profile
        fields = ('account', 'email_verified', 'show_NSFW')
    
class SiteChangeSerializer(serializers.ModelSerializer):
    api_url = serializers.HyperlinkedIdentityField(view_name='api:staff-site-change-detail')
    created = serializers.DateTimeField(read_only=True)
    site = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name='api:site-detail')
    new_name = serializers.CharField(read_only=True, source='name')
    new_description = serializers.CharField(read_only=True, source='description')
    new_logo = serializers.ImageField(read_only=True, source='logo')
    change_logo = serializers.BooleanField(read_only=True)
    class Meta:
        model = SiteChange
        fields = ('api_url', 'id', 'created', 'site', 'new_name', 'new_description', 'new_logo', 'change_logo')