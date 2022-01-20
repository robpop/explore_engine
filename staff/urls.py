from django.urls import path
from . import views

app_name = 'staff'

urlpatterns = [
    path('', views.home, name='home'),
    path('support/', views.support, name='support'),
    path('vettings/', views.vettings, name='vettings'),
    path('audits/', views.audits, name='audits'),
    path('changes/', views.changes, name='changes')
]