from django.test import TestCase
from account.forms import UserCreationForm
from django.contrib.auth.models import User

class AccountFormTests(TestCase):

    def setUp(self):
        taken_user = User.objects.create_user(username='taken', email='unsift5@mailinator.com', password='BlueGreen123!')

    def test_user_creation_form(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertTrue(form.is_valid())
    
    def test_user_creation_form_without_email(self):
        form_data = {
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['email'][0], 'You must provide an email.')
    
    def test_user_creation_form_with_long_email(self):
        form_data = {
            'email': '012345678901234567890123456789012345678901234567890@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['email'][0], 'This email is too long.')
    
    def test_user_creation_form_with_invalid_email(self):
        form_data = {
            'email': 'invalid',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['email'][0], 'This email is invalid.')
    
    def test_user_creation_form_with_taken_email(self):
        form_data = {
            'email': 'unsift5@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['email'][0], 'This email is in use by another user.')
    
    def test_user_creation_form_without_username(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['username'][0], "You didn't enter a username.")
    
    def test_user_creation_form_with_short_username(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'abc',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['username'][0], 'Your username must contain at least 4 characters.')
    
    def test_user_creation_form_with_long_username(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'abcdefghijklmnopqrstuvwxyz01234',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['username'][0], 'Your username must contain 30 characters or fewer.')
    
    def test_user_creation_form_with_invalid_username(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'abc123_.-!',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['username'][0], 'Your username may only contain letters, numbers, underscores, dots, and dashes.')
    
    def test_user_creation_form_with_taken_username(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'taken',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['username'][0], 'A user with that username already exists.')

    
    def test_user_creation_form_without_password1(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password1'][0], 'You must fill out the first password field.')
    
    def test_user_creation_form_without_password2(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'You must confirm your password.')
    
    def test_user_creation_form_with_short_password(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'Blue12!',
            'password2': 'Blue12!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'Your password must contain 8 or more characters.')
    
    def test_user_creation_form_with_long_password(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            'password2': 'BlueGreen123!00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'Your password is too long.')
    
    def test_user_creation_form_with_mismatched_passwords(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen1234!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], "The two password fields didn't match.")
    
    def test_user_creation_form_without_agreeement(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': False,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['agreement'][0], "You didn't agree to the privacy policy and terms of service.")
    
    def test_user_creation_form_without_age(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123!',
            'password2': 'BlueGreen123!',
            'agreement': True,
            'age': False
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['age'][0], "You aren't old enough to have an Unsift account.")
    
    def test_user_creation_form_with_similar_email_to_password(self):
        form_data = {
            'email': 'myemail@unsift.com',
            'username': 'unsift',
            'password1': 'Myemail123!',
            'password2': 'Myemail123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'The password is too similar to the email address.')
    
    def test_user_creation_form_with_similar_username_to_password(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'testuser',
            'password1': 'Testuser123!',
            'password2': 'Testuser123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'The password is too similar to the username.')
    
    def test_user_creation_form_with_weak_password_no_lowercase(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BLUEGREEN123!',
            'password2': 'BLUEGREEN123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'The password must contain at least 1 lowercase letter, a-z.')
    
    def test_user_creation_form_with_weak_password_no_uppercase(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'bluegreen123!',
            'password2': 'bluegreen123!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'The password must contain at least 1 uppercase letter, A-Z.')
    
    def test_user_creation_form_with_weak_password_no_number(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen!',
            'password2': 'BlueGreen!',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'The password must contain at least 1 digit, 0-9.')
    
    def test_user_creation_form_with_weak_password_no_symbol(self):
        form_data = {
            'email': 'unsift1@mailinator.com',
            'username': 'unsift',
            'password1': 'BlueGreen123',
            'password2': 'BlueGreen123',
            'agreement': True,
            'age': True
        }
        form = UserCreationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['password2'][0], 'The password must contain at least 1 symbol.')