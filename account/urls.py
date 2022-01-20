from django.urls import path
from . import views

app_name = 'account'

urlpatterns = [
    path('two_factor/disable/', views.disableTwoFactor, name='disable-2fa'),
    path('logout/', views.logoutView, name='logout'),
    path('manage/', views.manage, name='manage'),
    path('sign-up/', views.signup, name='signup'),
    path('revert-email-change/<str:revertcode>/', views.revertEmail, name='revert-email'),
    path('verify-email/<str:verificationcode>/', views.verifyEmail, name='verify-email'),
    path('support/', views.supportHome, name='support-home')
]