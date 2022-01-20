from django.urls import path
from . import views

app_name = 'pubdash'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('manage/<int:pk>/', views.manage, name='manage')
]