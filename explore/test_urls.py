from django.test import TestCase
from django.urls import reverse, resolve

class URLTestCase(TestCase):

    def test_url_reverse_explore(self):
        url = reverse('explore:explore')
        self.assertEqual(url, '/explore/')
    
    def test_url_resolve_explore(self):
        resolver = resolve('/explore/')
        self.assertEqual(resolver.view_name, 'explore:explore')
    
    def test_url_reverse_explore_category(self):
        url = reverse('explore:exploreCategory', kwargs={'category': 'news'})
        self.assertEqual(url, '/explore/news/')
    
    def test_url_resolve_explore_category(self):
        resolver = resolve('/explore/news/')
        self.assertEqual(resolver.view_name, 'explore:exploreCategory')