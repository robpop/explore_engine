from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from publish.models import Site, Category
from account.models import Profile

class PubdashViewTests(TestCase):

    # MANUAL TESTING REQUIRED
    # Test pubdash manage view using post with recent change
    # Test pubdash manage view using post with suspicious code in logo

    def setUp(self):
        user = User.objects.create_user(username='unsift', email='unsift1@mailinator.com', password='BlueGreen123!')
        # example user should never have sites
        user2 = User.objects.create_user(username='example', email='unsift2@mailinator.com', password='BlueGreen123!')
        category = Category.objects.create(name='Tools', url='tools')
        site = Site.objects.create(
            account = user,
            url = 'https://www.unsift.com/',
            name = 'Unsift',
            description = 'Unsift lets you explore more of the web.',
            category = category
        )
        profile = Profile.objects.get(account=user)
        profile.publisher = True
        profile.save()

    def test_pubdash_dashboard_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('pubdash:dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pubdash/dashboard.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_pubdash_dashboard_view_without_sites(self):
        authenticated = self.client.login(username='example', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('pubdash:dashboard'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('pubdash:dashboard'), follow=True)
        self.assertRedirects(response, '/publish/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'publish/splash.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_pubdash_dashboard_view_without_authentication(self):
        response = self.client.get(reverse('pubdash:dashboard'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('pubdash:dashboard'), follow=True)
        self.assertRedirects(response, '/account/login/?next=/publisher-dashboard/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_pubdash_manage_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        site = Site.objects.filter(account__username='unsift').first()
        response = self.client.get(reverse('pubdash:manage', kwargs={'pk': site.id}))
        self.assertEqual(response.status_code, 200)
        self.assertIn('site', response.context)
        self.assertIn('updateSiteForm', response.context)
        self.assertTemplateUsed(response, 'pubdash/manage.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_pubdash_manage_view_without_sites(self):
        authenticated = self.client.login(username='example', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('pubdash:manage', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, 'core/404.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_pubdash_manage_view_without_authentication(self):
        response = self.client.get(reverse('pubdash:manage', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('pubdash:manage', kwargs={'pk': 1}), follow=True)
        self.assertRedirects(response, '/account/login/?next=/publisher-dashboard/manage/1/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_pubdash_manage_view_using_post(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        site = Site.objects.filter(account__username='unsift').first()
        response = self.client.post('/publisher-dashboard/manage/' + str(site.id) + '/', {
            'site': site.id,
            'name': site.name,
            'description': site.description,
            'logo': '',
            'change_logo': False,
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pubdash/manage.html')
        self.assertTemplateUsed(response, 'core/base.html')
        self.assertIn('updateSiteForm', response.context)
        self.assertFormError(response=response, form='updateSiteForm', field=None, errors='You must wait at least 30 days from the last modification before making another')
