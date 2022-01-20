from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from .models import EmailChangeRequest, Profile

class AccountViewTests(TestCase):

    def setUp(self):
        user = User.objects.create_user(username='unsift', email='unsift1@mailinator.com', password='BlueGreen123!')
        ecr = EmailChangeRequest.objects.create(account=user, oldEmail='unsift5@mailinator.com', revertCode='00000000000000000000000000000000000000000000')
    
    def test_account_logout_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('account:logout'))
        self.assertEqual(response.status_code, 302)
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('account:logout'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_manage_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('account:manage'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/manage.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_manage_view_without_authentication(self):
        response = self.client.get(reverse('account:manage'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('account:manage'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/account/manage/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_revert_email_view(self):
        response = self.client.get(reverse('account:revert-email', kwargs={'revertcode': '00000000000000000000000000000000000000000000'}))
        user = User.objects.get(username='unsift')
        profile = Profile.objects.get(account=user)
        self.assertEqual(user.email, 'unsift5@mailinator.com')
        self.assertTrue(profile.emailVerified)
        self.assertIsNone(profile.emailVerificationCode)
        self.assertIn('email', response.context)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/revert-email-success.html')
        self.assertTemplateUsed(response, 'core/base.html')

    def test_account_revert_email_view_with_bad_revert_code(self):
        # Authentication required to test correct redirect
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('account:revert-email', kwargs={'revertcode': '0123456789abcdef'}))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('account:revert-email', kwargs={'revertcode': '0123456789abcdef'}), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/manage/')
        self.assertTemplateUsed(response, 'account/manage.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_revert_email_view_with_bad_revert_code_and_without_authentication(self):
        response = self.client.get(reverse('account:revert-email', kwargs={'revertcode': '0123456789abcdef'}))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('account:revert-email', kwargs={'revertcode': '0123456789abcdef'}), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/account/manage/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_verify_email_view(self):
        user = User.objects.get(username='unsift')
        profile = Profile.objects.get(account=user)
        self.assertFalse(profile.emailVerified)
        verification_code = profile.emailVerificationCode
        response = self.client.get(reverse('account:verify-email', kwargs={'verificationcode': verification_code}))
        profile = Profile.objects.get(account=user)
        self.assertTrue(profile.emailVerified)
        self.assertIsNone(profile.emailVerificationCode)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/verify-email-success.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_verify_email_view_with_bad_verification_code(self):
        # Authentication required to test correct redirect
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('account:verify-email', kwargs={'verificationcode': '0123456789abcdef'}))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('account:verify-email', kwargs={'verificationcode': '0123456789abcdef'}), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/manage.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_verify_email_view_with_bad_verification_code_and_without_authentication(self):
        response = self.client.get(reverse('account:verify-email', kwargs={'verificationcode': '0123456789abcdef'}))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('account:verify-email', kwargs={'verificationcode': '0123456789abcdef'}), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/account/manage/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_disable_two_factor_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('account:disable-2fa'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/profile/disable.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_disable_two_factor_view_without_authentication(self):
        response = self.client.get(reverse('account:disable-2fa'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('account:disable-2fa'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/account/two_factor/disable/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_support_home_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('account:support-home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/support.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_support_home_view_without_authentication(self):
        response = self.client.get(reverse('account:support-home'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('account:support-home'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/account/support/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_signup_view(self):
        response = self.client.get(reverse('account:signup'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('signup_form', response.context)
        self.assertTemplateUsed(response, 'account/signup.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_account_signup_view_using_post(self):
        response = self.client.post(reverse('account:signup'), data={
            'email': 'unsift2@mailinator.com',
            'username': 'test',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True,
            'h-captcha-response': '0123456789abcdef'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/signup.html')
        self.assertTemplateUsed(response, 'core/base.html')
        self.assertIn('signup_form', response.context)
        self.assertFormError(response=response, form='signup_form', field=None, errors='The captcha is invalid')
    
    def test_account_signup_view_using_post_without_captcha_response(self):
        response = self.client.post(reverse('account:signup'), data={
            'email': 'unsift2@mailinator.com',
            'username': 'test',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': False,
            'age': True
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/signup.html')
        self.assertTemplateUsed(response, 'core/base.html')
        self.assertIn('signup_form', response.context)
        self.assertFormError(response=response, form='signup_form', field=None, errors='You must complete the captcha')
    
