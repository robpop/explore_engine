from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from library.models import Folder

class LibraryViewTests(TestCase):

    def setUp(self):
        User.objects.create_user(username='unsift', email='unsift1@mailinator.com', password='BlueGreen123!')

    def test_library_view(self):
        response = self.client.login(username='unsift', password='BlueGreen123!')
        response = self.client.get(reverse('library:library'))
        self.assertEqual(response.status_code, 200)
        templates = response.templates
        self.assertTemplateUsed(response, 'library/library.html')
        self.assertTemplateUsed(response, 'core/base.html')
    
    def test_library_view_unauthenticated(self):
        response = self.client.get(reverse('library:library'))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('library:library'), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/library/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')

    
    def test_library_folder_view(self):
        response = self.client.login(username='unsift', password='BlueGreen123!')
        user = User.objects.get(username='unsift')
        folder = Folder.objects.create(account=user, name='test')
        response = self.client.get(reverse('library:folder', kwargs={'pk': folder.id}))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'library/library-folder.html')
        self.assertTemplateUsed(response, 'core/base.html')
        self.assertIn('folder', response.context)
        self.assertEqual(response.context['folder'], folder)
    
    def test_library_folder_view_with_bad_folder(self):
        response = self.client.login(username='unsift', password='BlueGreen123!')
        response = self.client.get(reverse('library:folder', kwargs={'pk': 9999}))
        self.assertEqual(response.status_code, 404)
    
    def test_library_folder_view_unauthenticated(self):
        response = self.client.get(reverse('library:folder', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, 302)
        response = self.client.get(reverse('library:folder', kwargs={'pk': 1}), follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, '/account/login/?next=/library/folder/1/')
        self.assertTemplateUsed(response, 'two_factor/core/login.html')
        self.assertTemplateUsed(response, 'core/base.html')