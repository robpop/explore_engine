from django.test import TestCase
from django.urls import reverse, resolve

class URLTestCase(TestCase):

    def test_url_reverse_splash(self):
        url = reverse('publish:splash')
        self.assertEqual(url, '/publish/')
    
    def test_url_resolve_splash(self):
        resolver = resolve('/publish/')
        self.assertEqual(resolver.view_name, 'publish:splash')
    
    def test_url_reverse_onboarding(self):
        url = reverse('publish:onboarding')
        self.assertEqual(url, '/publish/onboarding/')
    
    def test_url_resolve_onboarding(self):
        resolver = resolve('/publish/onboarding/')
        self.assertEqual(resolver.view_name, 'publish:onboarding')
    
    def test_url_reverse_payment(self):
        url = reverse('publish:payment')
        self.assertEqual(url, '/publish/payment/')
    
    def test_url_resolve_payment(self):
        resolver = resolve('/publish/payment/')
        self.assertEqual(resolver.view_name, 'publish:payment')
    
    def test_url_reverse_payment_success(self):
        url = reverse('publish:payment-success', kwargs={'checkoutSessionID': '0123456789abcdef'})
        self.assertEqual(url, '/publish/payment/success/0123456789abcdef/')
    
    def test_url_resolve_payment_success(self):
        resolver = resolve('/publish/payment/success/0123456789abcdef/')
        self.assertEqual(resolver.view_name, 'publish:payment-success')
    
    def test_url_reverse_payment_cancel(self):
        url = reverse('publish:payment-cancel')
        self.assertEqual(url, '/publish/payment/cancel/')
    
    def test_url_resolve_payment_cancel(self):
        resolver = resolve('/publish/payment/cancel/')
        self.assertEqual(resolver.view_name, 'publish:payment-cancel')
    
    def test_url_reverse_claims(self):
        url = reverse('publish:claims')
        self.assertEqual(url, '/publish/claims/')
    
    def test_url_resolve_claims(self):
        resolver = resolve('/publish/claims/')
        self.assertEqual(resolver.view_name, 'publish:claims')