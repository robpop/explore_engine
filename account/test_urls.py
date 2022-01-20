from django.test import TestCase
from django.urls import reverse, resolve

class URLTestCase(TestCase):

    def test_url_reverse_disable_two_factor(self):
        # This test also ensures that the custom url/view override is working
        url = reverse('account:disable-2fa')
        self.assertEqual(url, '/account/two_factor/disable/')
    
    def test_url_resolve_disable_two_factor(self):
        resolver = resolve('/account/two_factor/disable/')
        self.assertEqual(resolver.view_name, 'account:disable-2fa')
    
    def test_url_reverse_logout(self):
        url = reverse('account:logout')
        self.assertEqual(url, '/account/logout/')
    
    def test_url_resolve_logout(self):
        resolver = resolve('/account/logout/')
        self.assertEqual(resolver.view_name, 'account:logout')
    
    def test_url_reverse_manage(self):
        url = reverse('account:manage')
        self.assertEqual(url, '/account/manage/')
    
    def test_url_resolve_manage(self):
        resolver = resolve('/account/manage/')
        self.assertEqual(resolver.view_name, 'account:manage')
    
    def test_url_reverse_signup(self):
        url = reverse('account:signup')
        self.assertEqual(url, '/account/sign-up/')
    
    def test_url_resolve_signup(self):
        resolver = resolve('/account/sign-up/')
        self.assertEqual(resolver.view_name, 'account:signup')
    
    def test_url_reverse_revert_email(self):
        url = reverse('account:revert-email', kwargs={'revertcode': '0123456789abcdef'})
        self.assertEqual(url, '/account/revert-email-change/0123456789abcdef/')
    
    def test_url_resolve_revert_email(self):
        resolver = resolve('/account/revert-email-change/0123456789abcdef/')
        self.assertEqual(resolver.view_name, 'account:revert-email')
    
    def test_url_reverse_verify_email(self):
        url = reverse('account:verify-email', kwargs={'verificationcode': '0123456789abcdef'})
        self.assertEqual(url, '/account/verify-email/0123456789abcdef/')
    
    def test_url_resolve_verify_email(self):
        resolver = resolve('/account/verify-email/0123456789abcdef/')
        self.assertEqual(resolver.view_name, 'account:verify-email')
    
    def test_url_reverse_support(self):
        url = reverse('account:support-home')
        self.assertEqual(url, '/account/support/')
    
    def test_url_resolve_support(self):
        resolver = resolve('/account/support/')
        self.assertEqual(resolver.view_name, 'account:support-home')
    
    def test_url_reverse_login(self):
        url = reverse('two_factor:login')
        self.assertEqual(url, '/account/login/')
    
    def test_url_resolve_login(self):
        resolver = resolve('/account/login/')
        self.assertEqual(resolver.view_name, 'two_factor:login')
    
    def test_url_reverse_two_factor_setup(self):
        url = reverse('two_factor:setup')
        self.assertEqual(url, '/account/two_factor/setup/')
    
    def test_url_resolve_two_factor_setup(self):
        resolver = resolve('/account/two_factor/setup/')
        self.assertEqual(resolver.view_name, 'two_factor:setup')
    
    def test_url_reverse_two_factor_qrcode(self):
        url = reverse('two_factor:qr')
        self.assertEqual(url, '/account/two_factor/qrcode/')
    
    def test_url_resolve_two_factor_qrcode(self):
        resolver = resolve('/account/two_factor/qrcode/')
        self.assertEqual(resolver.view_name, 'two_factor:qr')
    
    def test_url_reverse_two_factor_setup_complete(self):
        url = reverse('two_factor:setup_complete')
        self.assertEqual(url, '/account/two_factor/setup/complete/')
    
    def test_url_resolve_two_factor_setup_complete(self):
        resolver = resolve('/account/two_factor/setup/complete/')
        self.assertEqual(resolver.view_name, 'two_factor:setup_complete')
    
    def test_url_reverse_two_factor_backup_tokens(self):
        url = reverse('two_factor:backup_tokens')
        self.assertEqual(url, '/account/two_factor/backup/tokens/')
    
    def test_url_resolve_two_factor_backup_tokens(self):
        resolver = resolve('/account/two_factor/backup/tokens/')
        self.assertEqual(resolver.view_name, 'two_factor:backup_tokens')
    
    def test_url_reverse_two_factor_profile(self):
        url = reverse('two_factor:profile')
        self.assertEqual(url, '/account/two_factor/')
    
    def test_url_resolve_two_factor_profile(self):
        resolver = resolve('/account/two_factor/')
        self.assertEqual(resolver.view_name, 'two_factor:profile')