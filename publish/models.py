import secrets
from django.utils.timezone import now
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator

class Category(models.Model):
    name = models.CharField(max_length=25, blank=False)
    url = models.SlugField(max_length=25, blank=False)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural='categories'

class Site(models.Model):
    account = models.ForeignKey(User, on_delete=models.PROTECT, blank=False)
    url = models.URLField(max_length=100, blank=False)
    # verificationMethod False = Meta Tag, True = DNS Record
    verificationMethod = models.BooleanField(default=False)
    # verificationCode may be null for unclaimed free sites
    verificationCode = models.CharField(max_length=16, default=None, blank=True, null=True)
    verified = models.BooleanField(default=False)
    name = models.CharField(max_length=25, blank=False)
    description = models.TextField(max_length=150, blank=False)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, blank=False)
    logo = models.ImageField(upload_to='uploads', max_length=100, blank=True, null=True, validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])])
    freeSite = models.BooleanField(default=False)
    active = models.BooleanField(default=False)
    audited = models.DateTimeField(default=now)
    updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
    class Meta:
        unique_together = ['account', 'url']

class Claim(models.Model):

    def random_code():
        return secrets.token_urlsafe(12)

    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False)
    verificationCode = models.CharField(max_length=16, default=random_code, blank=False)
    verificationMethod = models.BooleanField(default=False)
    # This field must be a DateTimeField to properly work with the generic API view
    created = models.DateTimeField(default=now)
    def __str__(self):
        return str(self.account) + " claiming " + str(self.site)

from staff.models import Vetting
from urllib.parse import urlparse

@receiver(post_save, sender=Site)
def site_post_save(sender, instance, created, **kwargs):
    # Automatically set correct url and create vetting
    if created:
        url = instance.url
        parsed_url = urlparse(url)
        result = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_url)
        instance.url = result
        instance.save()
        if instance.freeSite == True:
            Vetting.objects.create(url=instance.url, site=instance)