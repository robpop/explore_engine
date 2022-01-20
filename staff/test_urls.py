from django.test import TestCase
from django.urls import reverse, resolve

class URLTestCase(TestCase):

    def test_url_reverse_home(self):
        url = reverse('staff:home')
        self.assertEqual(url, '/staff/')
    
    def test_url_resolve_home(self):
        resolver = resolve('/staff/')
        self.assertEqual(resolver.view_name, 'staff:home')
    
    def test_url_reverse_support(self):
        url = reverse('staff:support')
        self.assertEqual(url, '/staff/support/')
    
    def test_url_resolve_support(self):
        resolver = resolve('/staff/support/')
        self.assertEqual(resolver.view_name, 'staff:support')
    
    def test_url_reverse_vettings(self):
        url = reverse('staff:vettings')
        self.assertEqual(url, '/staff/vettings/')
    
    def test_url_resolve_vettings(self):
        resolver = resolve('/staff/vettings/')
        self.assertEqual(resolver.view_name, 'staff:vettings')
    
    def test_url_reverse_audits(self):
        url = reverse('staff:audits')
        self.assertEqual(url, '/staff/audits/')
    
    def test_url_resolve_audits(self):
        resolver = resolve('/staff/audits/')
        self.assertEqual(resolver.view_name, 'staff:audits')
    
    def test_url_reverse_changes(self):
        url = reverse('staff:changes')
        self.assertEqual(url, '/staff/changes/')
    
    def test_url_resolve_changes(self):
        resolver = resolve('/staff/changes/')
        self.assertEqual(resolver.view_name, 'staff:changes')