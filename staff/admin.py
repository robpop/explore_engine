from django.contrib import admin
from .models import Vetting, Customer, Subscription, FailedPayment, Removal, Ticket, TicketMessage

admin.site.register(Vetting)
admin.site.register(Customer)
admin.site.register(Subscription)
admin.site.register(FailedPayment)
admin.site.register(Removal)
admin.site.register(Ticket)
admin.site.register(TicketMessage)