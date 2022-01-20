from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class StaffViewTests(TestCase):

    def setUp(self):
        superuser = User.objects.create_superuser(username='unsift', email='unsift1@mailinator.com', password='BlueGreen123!')
        staff_user = User.objects.create_user(username='staff', email='unsift2@mailinator.com', password='BlueGreen123!')
        staff_user.is_staff = True
        staff_user.save()
        normal_user = User.objects.create_user(username='normal', email='unsift3@mailinator.com', password='BlueGreen123!')

    # Home

    def test_home_view_using_superuser(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/home.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_home_view_using_staff_user(self):
        authenticated = self.client.login(username='staff', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/home.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_home_view_using_normal_user(self):
        authenticated = self.client.login(username='normal', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:home'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:home'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')

    
    def test_home_view_without_authentication(self):
        response = self.client.get(reverse('staff:home'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:home'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    # Support

    def test_support_view_using_superuser(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:support'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/support.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_support_view_using_staff_user(self):
        authenticated = self.client.login(username='staff', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:support'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/support.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_support_view_using_normal_user(self):
        authenticated = self.client.login(username='normal', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:support'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:support'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_support_view_without_authentication(self):
        response = self.client.get(reverse('staff:support'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:support'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    # Vettings

    def test_vettings_view_using_superuser(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:vettings'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/vettings.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_vettings_view_using_staff_user(self):
        authenticated = self.client.login(username='staff', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:vettings'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/vettings.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_vettings_view_using_normal_user(self):
        authenticated = self.client.login(username='normal', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:vettings'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:vettings'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_vettings_view_without_authentication(self):
        response = self.client.get(reverse('staff:vettings'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:vettings'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    # Audits

    def test_audits_view_using_superuser(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:audits'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/audits.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_audits_view_using_staff_user(self):
        authenticated = self.client.login(username='staff', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:audits'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/audits.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_audits_view_using_normal_user(self):
        authenticated = self.client.login(username='normal', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:audits'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:audits'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_audits_view_without_authentication(self):
        response = self.client.get(reverse('staff:audits'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:audits'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')

    # Changes

    def test_changes_view_using_superuser(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:changes'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/changes.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_changes_view_using_staff_user(self):
        authenticated = self.client.login(username='staff', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:changes'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'staff/changes.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_changes_view_using_normal_user(self):
        authenticated = self.client.login(username='normal', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('staff:changes'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:changes'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_changes_view_without_authentication(self):
        response = self.client.get(reverse('staff:changes'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('staff:changes'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')