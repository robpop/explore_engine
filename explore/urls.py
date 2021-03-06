from django.urls import path
from . import views

app_name = 'explore'

urlpatterns = [
    path('', views.explore, name='explore'),
    path('<slug:category>/', views.exploreCategory, name='exploreCategory')
]