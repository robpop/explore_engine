from django.test import TestCase
from django.urls import reverse

from publish.models import Category

def create_category(name, url):
    Category.objects.create(name=name, url=url)

class ExploreViewTests(TestCase):
    
    def test_explore_view(self):
        response = self.client.get(reverse('explore:explore'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'explore/explore.html')
        self.assertTemplateUsed(response, 'core/base.html')
        
    
    def test_explore_view_category(self):
        create_category(name='Tools', url='tools')
        response = self.client.get('/explore/tools/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('category', response.context)
        self.assertEqual(response.context['category'], 'tools')
        self.assertTemplateUsed(response, 'explore/explore.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_explore_view_category_with_unknown_category(self):
        response = self.client.get('/explore/unknowncategory/')
        self.assertEqual(response.status_code, 302)
        response = self.client.get('/explore/unknowncategory/', follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/explore/')
        self.assertTemplateUsed(response, 'explore/explore.html')
        self.assertTemplateUsed(response, 'core/base.html')

