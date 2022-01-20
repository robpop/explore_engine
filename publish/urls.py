from django.urls import path
from . import views

app_name = 'publish'

urlpatterns = [
    path('', views.splash, name='splash'),
    path('onboarding/', views.onboarding, name='onboarding'),
    path('payment/', views.payment, name='payment'),
    path('payment/success/<str:checkoutSessionID>/', views.paymentSuccess, name='payment-success'),
    path('payment/cancel/', views.paymentCancel, name='payment-cancel'),
    path('claims/', views.claims, name='claims'),
]