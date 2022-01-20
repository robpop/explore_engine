from django.contrib import admin
from .models import EmailChangeRequest, Profile

admin.site.register(EmailChangeRequest)
admin.site.register(Profile)