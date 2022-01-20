from django.contrib import admin

from .models import DailyMetric, AllTimeMetric, Feedback, Cancellation, SiteChange

admin.site.register(DailyMetric)
admin.site.register(AllTimeMetric)
admin.site.register(Feedback)
admin.site.register(Cancellation)
admin.site.register(SiteChange)