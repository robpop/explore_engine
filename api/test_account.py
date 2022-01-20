from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from account.models import Profile

class AccountTests(APITestCase):

    def setUp(self):
        self.superuser = User.objects.create_user(username='unsift', email='unsift1@mailinator.com', password='BlueGreen123!')
        self.account = User.objects.create_user(username='test', email='unsift2@mailinator.com', password='BlueGreen123!')
        self.verified_email_account = User.objects.create_user(username='verified', email='unsift4@mailinator.com', password='BlueGreen123!')
        self.superuser_token = Token.objects.get(user__username='unsift')
        self.account_token = Token.objects.get(user__username='test')
        self.verified_email_account_token = Token.objects.get(user__username='verified')
        verified_profile = Profile.objects.get(account=self.verified_email_account)
        verified_profile.emailVerified = True
        verified_profile.save()

    def test_api_root(self):
        url = reverse('api:api-root')
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    


    # username-check tests
    
    def test_username_check(self):
        url = reverse('api:username-check')
        data = {
            'username': 'available'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 'Username is available')
    
    def test_username_check_without_username(self):
        url = reverse('api:username-check')
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'username': ['This field is required']})
    
    def test_username_check_with_blank_username(self):
        url = reverse('api:username-check')
        data = {
            'username': ''
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'username': ['This field must not be blank']})
    
    def test_username_check_with_taken_username(self):
        url = reverse('api:username-check')
        data = {
            'username': 'abcABC123.-_!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'Username is not valid')



    # sign-up tests

    def test_signup(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'unsift5@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {
            "username": "available",
            "email": "unsift5@mailinator.com"
        })
    
    def test_signup_without_username(self):
        url = reverse('api:sign-up')
        data = {
            'email': 'unsift5@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'username': ['This field is required.']})
    
    def test_signup_with_invalid_username(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'abcABC123.-_!',
            'email': 'unsift5@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'username': ['This value does not match the required pattern.']
        })
    
    def test_signup_with_short_username(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'abc',
            'email': 'unsift5@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'username': ['Ensure this field has at least 4 characters.']
        })
    
    def test_signup_with_long_username(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'abcdefghijklmnopqrstuvwxyzabcde',
            'email': 'unsift5@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'username': ['Ensure this field has no more than 30 characters.']
        })
    
    def test_signup_with_taken_username(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'test',
            'email': 'unsift5@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'username': ['This field must be unique.']
        })
    
    def test_signup_without_email(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'email': ['This field is required.']
        })
    
    def test_signup_with_invalid_email(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'invalid',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'email': ['Enter a valid email address.']
        })
    
    def test_signup_with_taken_email(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'unsift2@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'email': ['This email is in use by an existing account']
        })
    
    def test_signup_without_password(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'unsift5@mailinator.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'password': ['This field is required.']
        })
    
    def test_signup_with_all_lowercase_common_password(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'unsift5@mailinator.com',
            'password': 'abc'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            "non_field_errors": [
                "This password is too short. It must contain at least 8 characters.",
                "This password is too common.",
                "The password must contain at least 1 uppercase letter, A-Z.",
                "The password must contain at least 1 digit, 0-9.",
                "The password must contain at least 1 symbol."
            ]
        })
    
    def test_signup_with_all_uppercase_common_password(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'unsift5@mailinator.com',
            'password': 'ABC'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            "non_field_errors": [
                "This password is too short. It must contain at least 8 characters.",
                "This password is too common.",
                "The password must contain at least 1 lowercase letter, a-z.",
                "The password must contain at least 1 digit, 0-9.",
                "The password must contain at least 1 symbol."
            ]
        })
    
    def test_signup_with_similar_password_to_username(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'unsift5@mailinator.com',
            'password': 'Available123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            "non_field_errors": [
                "The password is too similar to the username."
            ]
        })
    
    def test_signup_with_similar_password_to_email(self):
        url = reverse('api:sign-up')
        data = {
            'username': 'available',
            'email': 'unsift5@mailinator.com',
            'password': 'Unsift5!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            "non_field_errors": [
                "The password is too similar to the email address."
            ]
        })



    # is-2fa-enabled tests

    # MANUAL TESTING REQUIRED
    # test_is_2fa_enabled_with_2fa_enabled

    def test_is_2fa_enabled_without_authentication(self):
        url = reverse('api:is-2fa-enabled')
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {
            "detail": "Authentication credentials were not provided."
        })
    
    def test_is_2fa_enabled_with_2fa_disabled(self):
        url = reverse('api:is-2fa-enabled')
        data = {}
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, False)
    


    # disable-2fa tests

    # MANUAL TESTING REQUIRED
    # test_disable_2fa_with_2fa_enabled
    # test_disable_2fa_with_2fa_enabled_and_without_password
    # test_disable_2fa_with_2fa_enabled_and_without_2fa_token
    # test_disable_2fa_with_2fa_enabled_and_with_incorrect_length_2fa_token
    # test_disable_2fa_with_2fa_enabled_and_with_non_integer_2fa_token
    # test_disable_2fa_with_2fa_enabled_and_with_incorrect_2fa_token
    # test_disable_2fa_with_2fa_enabled_and_with_incorrect_password

    def test_disable_2fa_without_authentication(self):
        url = reverse('api:disable-2fa')
        data = {
            'password': 'BlueGreen123!',
            'token': 123456
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {
            "detail": "Authentication credentials were not provided."
        })
    
    def test_disable_2fa_with_2fa_disabled(self):
        url = reverse('api:disable-2fa')
        data = {
            'password': 'BlueGreen123!',
            'token': 123456
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'This account does not have two-factor authentication enabled')
    


    # obtain-api-token tests

    # MANUAL TESTING REQUIRED
    # test_obtain_api_token_with_2fa_enabled
    # test_obtain_api_token_with_2fa_enabled_and_without_2fa_token
    # test_obtain_api_token_with_2fa_enabled_and_with_incorrect_length_2fa_token
    # test_obtain_api_token_with_2fa_enabled_and_with_non_integer_2fa_token
    # test_obtain_api_token_with_2fa_enabled_and_with_incorrect_2fa_token

    def test_obtain_api_token(self):
        url = reverse('api:obtain-api-token')
        data = {
            'username': 'test',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            'token': self.account_token.key
        })
    
    def test_obtain_api_token_with_email_for_username_field(self):
        url = reverse('api:obtain-api-token')
        data = {
            'username': 'unsift2@mailinator.com',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            'token': self.account_token.key
        })
    
    def test_obtain_api_token_without_username(self):
        url = reverse('api:obtain-api-token')
        data = {
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            "username, password": [
                "Both of these fields are required"
            ]
        })
    
    def test_obtain_api_token_without_password(self):
        url = reverse('api:obtain-api-token')
        data = {
            'username': 'test'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            "username, password": [
                "Both of these fields are required"
            ]
        })
    
    def test_obtain_api_token_with_invalid_username(self):
        url = reverse('api:obtain-api-token')
        data = {
            'username': 'unknown',
            'password': 'BlueGreen123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            "username": [
                "The provided username or email is invalid"
            ]
        })
    
    def test_obtain_api_token_with_incorrect_password(self):
        url = reverse('api:obtain-api-token')
        data = {
            'username': 'test',
            'password': 'incorrect'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'The provided credentials are invalid')
    


    # change-password tests

    def test_change_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!',
            'new_password': 'GreenBlue123!'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 'Success')
    
    def test_change_password_without_authentication(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!',
            'new_password': 'GreenBlue123!'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {
            'detail': 'Authentication credentials were not provided.'
        })
    
    def test_change_password_without_old_password(self):
        url = reverse('api:change-password')
        data = {
            'new_password': 'GreenBlue123!'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'old_password': [
                'This field is required.'
            ]
        })

    def test_change_password_with_incorrect_old_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'incorrect',
            'new_password': 'GreenBlue123!'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'old_password': [
                'This password is incorrect'
            ]
        })

    def test_change_password_with_short_old_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'abc123',
            'new_password': 'GreenBlue123!'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'old_password': [
                'Ensure this field has at least 8 characters.'
            ]
        })
    
    def test_change_password_with_long_old_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy',
            'new_password': 'GreenBlue123!'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'old_password': [
                'Ensure this field has no more than 128 characters.'
            ]
        })

    
    def test_change_password_without_new_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'new_password': [
                'This field is required.'
            ]
        })
    
    def test_change_password_with_blank_new_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!',
            'new_password': ''
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'new_password': [
                'This field may not be blank.'
            ]
        })
    
    def test_change_password_with_all_lowercase_new_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!',
            'new_password': 'abcdefgh'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'new_password': [
                "This password is too common.",
                "The password must contain at least 1 uppercase letter, A-Z.",
                "The password must contain at least 1 digit, 0-9.",
                "The password must contain at least 1 symbol."
            ]
        })
    
    def test_change_password_with_all_uppercase_new_password(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!',
            'new_password': 'ABCDEFGH'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'new_password': [
                "This password is too common.",
                "The password must contain at least 1 lowercase letter, a-z.",
                "The password must contain at least 1 digit, 0-9.",
                "The password must contain at least 1 symbol."
            ]
        })
    
    def test_change_password_with_similar_password_to_username(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!',
            'new_password': 'Unsift123!'
        }
        # Superuser utilized because username 'test' does not trigger similarity error
        token = self.superuser_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'new_password': [
                'The password is too similar to the username.'
            ]
        })
    
    def test_change_password_with_similar_password_to_email(self):
        url = reverse('api:change-password')
        data = {
            'old_password': 'BlueGreen123!',
            'new_password': 'unsift2X!'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'new_password': [
                'The password is too similar to the email address.'
            ]
        })
    


    # change-email tests

    def test_change_email(self):
        url = reverse('api:change-email')
        data = {
            'email': 'unsift3@mailinator.com'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 'Success')
    
    def test_change_email_without_authentication(self):
        url = reverse('api:change-email')
        data = {
            'email': 'unsift3@mailinator.com'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {
            'detail': 'Authentication credentials were not provided.'
        })
    
    def test_change_email_without_email(self):
        url = reverse('api:change-email')
        data = {}
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'email': [
                'This field is required.'
            ]
        })
    
    def test_change_email_with_blank_email(self):
        url = reverse('api:change-email')
        data = {
            'email': ''
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'email': [
                'This field may not be blank.'
            ]
        })
    
    def test_change_email_with_invalid_email(self):
        url = reverse('api:change-email')
        data = {
            'email': 'invalid'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'email': [
                'Enter a valid email address.'
            ]
        })
    
    def test_change_email_with_taken_email(self):
        url = reverse('api:change-email')
        data = {
            'email': 'unsift1@mailinator.com'
        }
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'email': [
                'This email is in use by a different account'
            ]
        })
    


    # email-verification-status tests

    def test_email_verification_status(self):
        url = reverse('api:email-verification-status')
        data = {}
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            'email_verified': False
        })

    def test_email_verification_status_with_email_verified(self):
        url = reverse('api:email-verification-status')
        data = {}
        token = self.verified_email_account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            'email_verified': True
        })
    
    def test_email_verification_status_without_authentication(self):
        url = reverse('api:email-verification-status')
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {
            'detail': 'Authentication credentials were not provided.'
        })
    


    # resend-email-verification-link tests

    def test_resend_email_verification_link(self):
        url = reverse('api:resend-email-verification-link')
        data = {}
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 'Success')
    
    def test_resend_email_verification_link_without_authentication(self):
        url = reverse('api:resend-email-verification-link')
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {
            'detail': 'Authentication credentials were not provided.'
        })
    
    def test_resend_email_verification_link_with_verified_email(self):
        url = reverse('api:resend-email-verification-link')
        data = {}
        token = self.verified_email_account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'Your email address is already verified')
    


    # sign-out-everywhere tests

    def test_sign_out_everywhere(self):
        url = reverse('api:sign-out-everywhere')
        data = {}
        token = self.account_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 'Success')

    def test_sign_out_everywhere_without_authentication(self):
        url = reverse('api:sign-out-everywhere')
        data = {}
        response = self.client.get(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {
            'detail': 'Authentication credentials were not provided.'
        })