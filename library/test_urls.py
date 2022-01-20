from django.test import TestCase
from django.urls import reverse, resolve

class URLTestCase(TestCase):

    def test_url_reverse_library(self):
        url = reverse('library:library')
        self.assertEqual(url, '/library/')
    
    def test_url_resolve_library(self):
        resolver = resolve('/library/')
        self.assertEqual(resolver.view_name, 'library:library')
    
    def test_url_reverse_folder(self):
        url = reverse('library:folder', kwargs={'pk': 1})
        self.assertEqual(url, '/library/folder/1/')
    
    def test_url_resolve_folder(self):
        resolver = resolve('/library/folder/1/')
        self.assertEqual(resolver.view_name, 'library:folder')