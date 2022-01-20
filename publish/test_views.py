from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from account.models import Profile
from publish.models import Category

class PublishViewTests(TestCase):

    # MANUAL TESTING REQUIRED
    # Test publish payment success view with valid checkout session ID
    # Test publish onboarding view using post with suspicious code in logo

    def setUp(self):
        user = User.objects.create_user(username='unsift', email='unsift1@mailinator.com', password='BlueGreen123!')
        profile = Profile.objects.get(account=user)
        profile.emailVerified = True
        profile.emailVerificationCode = None
        profile.save()
        unverified_user = User.objects.create_user(username='unverified', email='unsift2@mailinator.com', password='BlueGreen123!')
        category = Category.objects.create(name='Tools', url='tools')

    def test_publish_splash_view(self):
        response = self.client.get(reverse('publish:splash'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'publish/splash.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_payment_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('publish:payment'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('checkoutSessionID', response.context)
        self.assertTemplateUsed(response, 'publish/payment.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_payment_view_without_authentication(self):
        response = self.client.get(reverse('publish:payment'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('publish:payment'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/publish/payment/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_payment_success_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('publish:payment-success', kwargs={'checkoutSessionID': 'testing'}))
        self.assertEqual(response.status_code, 200)
        # Payment failure returned due to invalid checkout session ID
        self.assertTemplateUsed(response, 'publish/payment_failure.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_payment_success_view_without_authentication(self):
        response = self.client.get(reverse('publish:payment-success', kwargs={'checkoutSessionID': 'testing'}))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('publish:payment-success', kwargs={'checkoutSessionID': 'testing'}), follow=True)
        self.assertRedirects(response, '/account/login/?next=/publish/payment/success/testing/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_payment_cancel_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('publish:payment-cancel'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'publish/payment_cancel.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_payment_cancel_view_without_authentication(self):
        response = self.client.get(reverse('publish:payment-cancel'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('publish:payment-cancel'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/publish/payment/cancel/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_claims_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('publish:claims'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'publish/claims.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_claims_view_without_authentication(self):
        response = self.client.get(reverse('publish:claims'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('publish:claims'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/publish/claims/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_onboarding_view(self):
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('publish:onboarding'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('onboardingForm', response.context)
        self.assertIn('verificationCode', response.context)
        self.assertTemplateUsed(response, 'publish/onboarding.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_onboarding_view_without_authentication(self):
        response = self.client.get(reverse('publish:onboarding'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('publish:onboarding'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/publish/onboarding/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_onboarding_view_with_unverified_account(self):
        authenticated = self.client.login(username='unverified', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.get(reverse('publish:onboarding'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/verify-email-to-proceed.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_publish_onboarding_view_using_post(self):
        user = User.objects.get(username='unsift')
        category = Category.objects.get(name='Tools')
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.post(reverse('publish:onboarding'), data={
            'account': user,
            'url': 'https://www.unsift.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift',
            'description': 'Unsift helps you discover more sites.',
            'category': category,
            'logo': '',
            'agreement': True,
            'h-captcha-response': '0123456789abcdef'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'publish/onboarding.html')
        self.assertTemplateUsed(response, 'core/base.html')
        self.assertIn('onboardingForm', response.context)
        self.assertIn('verificationCode', response.context)
        self.assertFormError(response=response, form='onboardingForm', field=None, errors='The captcha is invalid')
    
    def test_publish_onboarding_view_using_post_without_captcha_response(self):
        user = User.objects.get(username='unsift')
        category = Category.objects.get(name='Tools')
        authenticated = self.client.login(username='unsift', password='BlueGreen123!')
        self.assertTrue(authenticated)
        response = self.client.post(reverse('publish:onboarding'), data={
            'account': user,
            'url': 'https://www.unsift.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift',
            'description': 'Unsift helps you discover more sites.',
            'category': category,
            'logo': '',
            'agreement': True,
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'publish/onboarding.html')
        self.assertTemplateUsed(response, 'core/base.html')
        self.assertIn('onboardingForm', response.context)
        self.assertIn('verificationCode', response.context)
        self.assertFormError(response=response, form='onboardingForm', field=None, errors='You must complete the captcha')