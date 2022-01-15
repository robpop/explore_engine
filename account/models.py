import secrets
from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        Profile.objects.create(account=instance)

class EmailChangeRequest(models.Model):
    created = models.DateField(default=now)
    account = models.OneToOneField(User, on_delete=models.CASCADE, blank=False)
    oldEmail = models.EmailField(blank=False)
    revertCode = models.CharField(max_length=44, blank=False)
    def __str__(self):
        return str(self.account)

class Profile(models.Model):
    def default_cutoff():
        return now() + timedelta(days=14)
    
    def random_code():
        return secrets.token_urlsafe(32)
    
    def default_first_notice():
        # TODO
        # Change back to 1 hour for production
        return now() + timedelta(minutes=5)

    account = models.OneToOneField(User, on_delete=models.CASCADE, blank=False)
    emailVerified = models.BooleanField(default=False)
    emailVerificationCode = models.CharField(default=random_code, max_length=44, blank=True, null=True)
    emailUnverifiedCutoff = models.DateField(default=default_cutoff)
    emailUnverifiedNextNotice = models.DateTimeField(default=default_first_notice)
    showNSFW = models.BooleanField(default=False)
    publisher = models.BooleanField(default=False)
    def __str__(self):
        return str(self.account)