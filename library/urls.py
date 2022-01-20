from django.urls import path
from . import views

app_name = 'library'

urlpatterns = [
    path('', views.library, name='library'),
    path('folder/<int:pk>/', views.folder, name='folder')
]