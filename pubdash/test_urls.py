from django.test import TestCase
from django.urls import reverse, resolve

class URLTestCase(TestCase):

    def test_url_reverse_dashboard(self):
        url = reverse('pubdash:dashboard')
        self.assertEqual(url, '/publisher-dashboard/')
    
    def test_url_resolve_dashboard(self):
        resolver = resolve('/publisher-dashboard/')
        self.assertEqual(resolver.view_name, 'pubdash:dashboard')
    
    def test_url_reverse_manage(self):
        url = reverse('pubdash:manage', kwargs={'pk': 1})
        self.assertEqual(url, '/publisher-dashboard/manage/1/')
    
    def test_url_resolve_manage(self):
        resolver = resolve('/publisher-dashboard/manage/1/')
        self.assertEqual(resolver.view_name, 'pubdash:manage')