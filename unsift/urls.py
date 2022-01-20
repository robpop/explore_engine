"""unsift URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from two_factor.urls import urlpatterns as tf_urls

handler400 = 'core.views.http400'
handler403 = 'core.views.http403'
handler404 = 'core.views.http404'
handler500 = 'core.views.http500'

urlpatterns = [
    path('account/', include('account.urls')),
    path('', include(tf_urls)),
    path('', include('core.urls')),
    path('api/', include('api.urls')),
    path('explore/', include('explore.urls')),
    path('library/', include('library.urls')),
    path('publish/', include('publish.urls')),
    path('publisher-dashboard/', include('pubdash.urls')),
    path('staff/', include('staff.urls')),
    path('admin/', admin.site.urls),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<str:uidb64>/<str:token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]

# !!!! ONLY FOR DEVELOPMENT !!!! #
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# !!!! ONLY FOR DEVELOPMENT !!!! #
