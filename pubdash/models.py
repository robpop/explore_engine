from django.utils.timezone import now
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.contrib.auth.models import User
from publish.models import Site

class DailyMetric(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False)
    date = models.DateField(default=now)
    views = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    showings = models.IntegerField(default=0)
    def __str__(self):
        return str(self.site) + ' on ' + str(self.date)
    class Meta:
        unique_together = ('site', 'date',)

class AllTimeMetric(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False)
    views = models.BigIntegerField(default=0)
    clicks = models.BigIntegerField(default=0)
    saves = models.BigIntegerField(default=0)
    showings = models.BigIntegerField(default=0)
    def __str__(self):
        return str(self.site)

class Feedback(models.Model):
    created = models.DateTimeField(default=now)
    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False)
    subject = models.CharField(max_length=50, blank=False)
    message = models.TextField(max_length=250, blank=False)
    rating = models.IntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(5)])
    saved = models.BooleanField(default=False)
    def __str__(self):
        return str(self.account) + ' to ' + str(self.site) + ' on ' + str(self.created)
    class Meta:
       verbose_name_plural='feedback'
       unique_together = ('account', 'site')

class Cancellation(models.Model):
    reason_choices = (
        ("OTHR", "Other"),
        ("COST", "Cost"),
        ("NEFF", "Not Effective"),
        ("PEXP", "Poor Experience"),
    )
    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    reason = models.CharField(max_length=4, choices=reason_choices, default='OTHR')
    notes = models.TextField(max_length=256, blank=True, null=True, default=None)
    date = models.DateField(default=now)
    def __str__(self):
        return str(self.account) + ' on ' + str(self.date)

class SiteChange(models.Model):
    created = models.DateTimeField(default=now)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, blank=False)
    name = models.CharField(max_length=25, blank=False)
    description = models.TextField(max_length=150, blank=False)
    logo = models.ImageField(upload_to='uploads', max_length=100, blank=True, null=True, validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])])
    change_logo = models.BooleanField(default=False)
    def __str__(self):
        return str(self.site) + ': ' + str(self.created)

@receiver(post_save, sender=SiteChange)
def site_change_post_save(sender, instance, created, **kwargs):
    # Reset 'updated' on Site upon SiteChange object creation
    if created:
        site = instance.site
        site.save()