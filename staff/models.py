import stripe
import time
from django.core.mail import send_mail
from django.utils.timezone import now
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from unsift.settings import STRIPE_API_KEY as stripeAPIKey
from publish.models import Site
from pubdash.models import AllTimeMetric
from account.models import Profile

class Vetting(models.Model):
    # URL required for unique identification of sites independent of Site model which may be deleted
    url = models.URLField(max_length=100)
    site = models.ForeignKey(Site, on_delete=models.SET_NULL, blank=True, null=True)
    assigned = models.BooleanField(default=False)
    staff = models.ForeignKey(User, default=None, on_delete=models.SET_NULL, blank=True, null=True)
    decision = models.BooleanField(default=None, null=True)
    decidedOn = models.DateField(default=None, blank=True, null=True)
    notes = models.TextField(default=None, max_length=1024, blank=True, null=True)
    def __str__(self):
        return str(self.url)

class Customer(models.Model):
    cid = models.CharField(max_length=32, blank=False, default='unsift-default-id')
    account = models.OneToOneField(User, on_delete=models.CASCADE, blank=False)
    def __str__(self):
        return str(self.account)

class Subscription(models.Model):
    sid = models.CharField(max_length=32, blank=False, default='unsift-default-id')
    quantity = models.IntegerField(default=1)
    account = models.OneToOneField(User, on_delete=models.CASCADE, blank=False)
    def __str__(self):
        return str(self.account)

class FailedPayment(models.Model):
    # Does not indicate general failed payment
    # Only to be used when publisher does not provide payment info whatsoever
    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    date = models.DateField(default=now)
    def __str__(self):
        return str(self.account) + ' on ' + str(self.date)

class Removal(models.Model):
    url = models.URLField(max_length=100)
    removedOn = models.DateField(default=now)
    staff = models.ForeignKey(User, default=None, on_delete=models.SET_NULL, blank=True, null=True)
    notes = models.TextField(default=None, max_length=1024, blank=True, null=True)
    def __str__(self):
        return str(self.url)

class Ticket(models.Model):
    timestamp = models.DateTimeField(default=now)
    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    subject = models.CharField(max_length=64, blank=False)
    message = models.TextField(max_length=1024, blank=False)
    solved = models.BooleanField(default=False)
    solvedOn = models.DateTimeField(default=None, blank=True, null=True)
    def __str__(self):
        return str(self.subject)

class TicketMessage(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, blank=False)
    timestamp = models.DateTimeField(default=now)
    account = models.ForeignKey(User, on_delete=models.CASCADE, blank=False)
    message = models.TextField(max_length=1024, blank=False)
    def __str__(self):
        return 'ticket #' + str(self.ticket.id) + ' on ' + str(self.timestamp)

@receiver(post_save, sender=Vetting)
def update_site_model(sender, instance=None, created=False, **kwargs):
    if instance.decision == True and instance.site.active == False:
        site = instance.site
        site.audited = now()
        if site.freeSite == False:
            customer = Customer.objects.filter(account=site.account)
            if not customer:
                try:
                    send_mail(
                        "Payment Information Required",
                        "There was an error in trying to process your site application. We have no record of you successfully submitting payment information. This usually occurs when your browser doesn't redirect back to Unsift after submitting card details.\nPlease visit the following link to provide payment:\n\nhttps://www.unsift.com/publish/payment/\n\nThank You,\nUnsift Publishing",
                        'Unsift Publishing <publishing@unsift.com>',
                        [site.account.email,]
                    )
                except:
                    time.sleep(3)
                    send_mail(
                        "Payment Information Required",
                        "There was an error in trying to process your site application. We have no record of you successfully submitting payment information. This usually occurs when your browser doesn't redirect back to Unsift after submitting card details.\nPlease visit the following link to provide payment:\n\nhttps://www.unsift.com/publish/payment/\n\nThank You,\nUnsift Publishing",
                        'Unsift Publishing <publishing@unsift.com>',
                        [site.account.email,]
                    )
                fp = FailedPayment.objects.create(account=site.account)
            else:
                customer = customer[0]
                stripe.api_key = stripeAPIKey
                localsub = Subscription.objects.filter(account=site.account)
                if not localsub:
                    stripesub = stripe.Subscription.create(
                        customer=customer.cid,
                        items=[
                            {
                                'plan': 'plan_Gb8kkx1XeVVseu',
                            },
                        ],
                        expand=['latest_invoice.payment_intent'],
                        trial_period_days=1
                    )
                    localsub = Subscription.objects.create(sid=stripesub.id, quantity=1, account=site.account)
                else:
                    localsub = localsub[0]
                    localsub.quantity = localsub.quantity + 1
                    localsub.save()
                    stripe.Subscription.modify(
                        localsub.sid,
                        quantity=localsub.quantity,
                    )
                atm = AllTimeMetric.objects.create(site=site)
                site.active = True
                site.save()
                owner = site.account
                title = owner.username
                try:
                    send_mail(
                        'Application Approved',
                        title + ", we are happy to inform you that " + site.name + " has been approved to be shown on Unsift.\nWe will begin showing " + site.name + " first thing tomorrow morning. Billing for " + site.name + " will also begin tomorrow.\nIf you have any questions, comments, or concerns, please let us know and we will be happy to assist you.\n\nThank You,\nUnsift Publishing",
                        'Unsift Publishing <publishing@unsift.com>',
                        [owner.email,]
                    )
                except:
                    time.sleep(3)
                    send_mail(
                        'Application Approved',
                        title + ", we are happy to inform you that " + site.name + " has been approved to be shown on Unsift.\nWe will begin showing " + site.name + " first thing tomorrow morning. Billing for " + site.name + " will also begin tomorrow.\nIf you have any questions, comments, or concerns, please let us know and we will be happy to assist you.\n\nThank You,\nUnsift Publishing",
                        'Unsift Publishing <publishing@unsift.com>',
                        [owner.email,]
                    )
        else:
            atm = AllTimeMetric.objects.create(site=site)
            site.active = True
            site.save()
    if instance.decision != None and instance.decidedOn == None:
        instance.decidedOn = now().date()
        instance.save()
        if instance.site.freeSite == False:
            if instance.decision == False:
                site = instance.site
                owner = site.account
                title = owner.username
                try:
                    send_mail(
                        'Application Denied',
                        title + ", we are sorry to inform you that your application to show " + site.name + " on Unsift has been denied. We thank you for your interest, but " + site.name + " doesn't appear to be a good fit for our platform. If you wish to appeal this decision you may re-apply in 30 days. We only ask you to ensure that " + site.name + " meets our publishing criteria before re-applying. The following notes have been provided from one of our staff members:\n\n" + instance.notes + "\n\nThank You,\nUnsift Publishing",
                        'Unsift Publishing <publishing@unsift.com>',
                        [owner.email,]
                    )
                except:
                    time.sleep(3)
                    send_mail(
                        'Application Denied',
                        title + ", we are sorry to inform you that your application to show " + site.name + " on Unsift has been denied. We thank you for your interest, but " + site.name + " doesn't appear to be a good fit for our platform. If you wish to appeal this decision you may re-apply in 30 days. We only ask you to ensure that " + site.name + " meets our publishing criteria before re-applying. The following notes have been provided from one of our staff members:\n\n" + instance.notes + "\n\nThank You,\nUnsift Publishing",
                        'Unsift Publishing <publishing@unsift.com>',
                        [owner.email,]
                    )
                superuser = User.objects.get(username='unsift', is_superuser=True)
                removal = Removal.objects.create(url=site.url, staff=superuser, notes='Site did not pass the vetting process.\n' + instance.notes)
                site.delete()
                totalSiteCount = Site.objects.filter(account=owner).count()
                if totalSiteCount == 0:
                    profile = Profile.objects.get(account=owner)
                    profile.publisher = False
                    profile.save()
        elif instance.site.freeSite == True:
            if instance.decision == False:
                site = instance.site
                superuser = User.objects.get(username='unsift', is_superuser=True)
                removal = Removal.objects.create(url=site.url, staff=superuser, notes='Site did not pass the vetting process.\n' + instance.notes)
                site.delete()