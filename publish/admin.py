from django.contrib import admin

from .models import Category, Site, Claim

admin.site.register(Category)
admin.site.register(Site)
admin.site.register(Claim)