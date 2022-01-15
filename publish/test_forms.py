from django.test import TestCase
from django.contrib.auth.models import User
from publish.forms import OnboardingForm, UpdateSiteForm
from publish.models import Site, Category
from staff.models import Removal

class PublishFormTests(TestCase):


    # MANUAL TESTING REQUIRED
    # Test update site form with invalid logo
    # Test update site form with long filename for logo
    # Test update site form with suspicious code in logo
    # Test onboarding form with invalid logo
    # Test onboarding form with long filename for logo
    # Test onboarding form with suspicious code in logo

    def setUp(self):
        self.account = User.objects.create_user(username='publisher', email='unsift1@mailinator.com', password='BlueGreen123!')
        self.account2 = User.objects.create_user(username='publisher2', email='unsift2@mailinator.com', password='BlueGreen123!')
        self.superuser = User.objects.create_superuser(username='unsift', email='unsift@unsift.com', password='BlueGreen123!')
        self.category = Category.objects.create(name='Tools', url='tools')
        self.paid_verified_active_site = Site.objects.create(
            account=self.account,
            url='https://pva.unsift.com/',
            verificationMethod=True,
            verificationCode='0123456789abcdef',
            verified=True,
            name='Unsift',
            description='Unsift description.',
            category=self.category,
            logo=None,
            freeSite=False,
            active=True,
        )
        self.free_unverified_active_site = Site.objects.create(
            account=self.superuser,
            url='https://fua.unsift.com/',
            verificationMethod=True,
            verificationCode='0123456789abcdef',
            verified=False,
            name='Unsift',
            description='Unsift description.',
            category=self.category,
            logo=None,
            freeSite=True,
            active=True,
        )
        self.paid_unverified_inactive_site = Site.objects.create(
            account=self.account,
            url='https://pui.unsift.com/',
            verificationMethod=True,
            verificationCode='0123456789abcdef',
            verified=False,
            name='Unsift',
            description='Unsift description.',
            category=self.category,
            logo=None,
            freeSite=False,
            active=False,
        )
        self.removed_site = Removal.objects.create(
            url='https://removed.unsift.com/',
            staff=self.superuser,
            notes=None
        )

    # Update Site Form Tests

    def test_update_site_form(self):
        form_data = {
            'site': self.paid_verified_active_site.id,
            'name': 'New Name',
            'description': 'New description.',
            'logo': '',
            'change_logo': False
        }
        form = UpdateSiteForm(data=form_data)
        self.assertTrue(form.is_valid())
    
    def test_update_site_form_without_site(self):
        form_data = {
            'name': 'New Name',
            'description': 'New description.',
            'logo': '',
            'change_logo': False
        }
        form = UpdateSiteForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['site'][0], 'You must provide a valid site to change.')
    
    def test_update_site_form_with_bad_site(self):
        form_data = {
            'site': 999,
            'name': 'New Name',
            'description': 'New description.',
            'logo': '',
            'change_logo': False
        }
        form = UpdateSiteForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['site'][0], 'The provided site is an invalid choice.')
    
    def test_update_site_form_without_name(self):
        form_data = {
            'site': self.paid_verified_active_site.id,
            'description': 'New description.',
            'logo': '',
            'change_logo': False
        }
        form = UpdateSiteForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['name'][0], 'You must provide a name for your site.')
    
    def test_update_site_form_with_long_name(self):
        form_data = {
            'site': self.paid_verified_active_site.id,
            'name': 'abcdefghijklmnopqrstuvwxyz',
            'description': 'New description.',
            'logo': '',
            'change_logo': False
        }
        form = UpdateSiteForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['name'][0], "Your site's name must be 25 characters or less.")
    
    def test_update_site_form_without_description(self):
        form_data = {
            'site': self.paid_verified_active_site.id,
            'name': 'New Name',
            'logo': '',
            'change_logo': False
        }
        form = UpdateSiteForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['description'][0], 'You must provide a description for your site.')
    
    def test_update_site_form_with_long_description(self):
        form_data = {
            'site': self.paid_verified_active_site.id,
            'name': 'New Name',
            'description': 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstu',
            'logo': '',
            'change_logo': False
        }
        form = UpdateSiteForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['description'][0], "Your site's description must be 150 characters or less.")
    
    # Onboarding Form Tests
    
    def test_onboarding_form(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertTrue(form.is_valid())
    
    def test_onboarding_form_without_account(self):
        form_data = {
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['account'][0], 'You must be signed into a valid account to continue.')
    
    def test_onboarding_form_with_superuser_account(self):
        form_data = {
            'account': self.superuser.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['account'][0], 'You may not onboard sites from the superuser account')
    
    def test_onboarding_form_with_invalid_account(self):
        form_data = {
            'account': 999,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['account'][0], 'You must be signed into a valid account to continue.')
    
    def test_onboarding_form_without_url(self):
        form_data = {
            'account': self.account.id,
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'The homepage URL field is required.')
    
    def test_onboarding_form_with_blank_url(self):
        form_data = {
            'account': self.account.id,
            'url': '',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'The homepage URL field is required.')
    
    def test_onboarding_form_with_bad_url(self):
        form_data = {
            'account': self.account.id,
            'url': 'unsift',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'The provided homepage URL is invalid.')
    
    def test_onboarding_form_with_long_url(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.abcdefghijklmnopqrstuvwxyz.abcdefghijklmnopqrstuvwxyz.abcdefghijklmnopqrstuvw.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'The provided homepage URL is too long. The maximum length is 100 characters.')
    
    def test_onboarding_form_with_example_url(self):
        # example.com causes error with APIVoid and cannot be onboarded
        form_data = {
            'account': self.account.id,
            'url': 'https://www.example.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Example',
            'description': 'Example description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'example.com cannot be published on Unsift')
    
    def test_onboarding_form_with_non_http_or_https_url(self):
        form_data = {
            'account': self.account.id,
            'url': 'ftp://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev FTP',
            'description': 'Unsift dev FTP description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'Unsift only allows for http and https sites, please provide a valid url')
    
    def test_onboarding_form_with_unclaimed_free_site(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://fua.unsift.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift',
            'description': 'Unsift description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'This is a free site already on Unsift, please use the site claiming process instead')
    
    def test_onboarding_form_with_existing_site(self):
        form_data = {
            'account': self.account2.id,
            'url': 'https://pva.unsift.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift',
            'description': 'Unsift description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'This site is already on Unsift and is controlled by a verified party')
    
    def test_onboarding_form_with_existing_unverified_site_from_same_account(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://pui.unsift.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift',
            'description': 'Unsift description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        for error in form.non_field_errors():
            self.assertEqual(error, 'You have already onboarded this site.')

    def test_onboarding_form_with_recently_removed_site(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://removed.unsift.com/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift',
            'description': 'Unsift description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['url'][0], 'This site was recently removed from Unsift and cannot be re-published for 30 days from the date of removal')

    def test_onboarding_form_with_short_verification_code(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcde',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['verificationCode'][0], 'The verification code must contain exactly 16 characters.')
    
    def test_onboarding_form_with_long_verification_code(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdeff',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        # Model overrides error message when greater than 16 characters
        # Only curious/malicious users will run into this error so it does not need to be friendly
        self.assertEqual(form.errors['verificationCode'][0], 'Ensure this value has at most 16 characters (it has 17).')

    def test_onboarding_form_with_invalid_verification_code(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': 'abcdABCD1234--_!',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['verificationCode'][0], 'The verification code contains invalid characters.')


    def test_onboarding_form_without_name(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['name'][0], 'You must provide a name for your site.')
    
    def test_onboarding_form_with_blank_name(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': '',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['name'][0], 'You must provide a name for your site.')
    
    def test_onboarding_form_with_long_name(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift ABCDEFGHIJKLMNOPQRS',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['name'][0], "Your site's name must be 25 characters or less.")
    
    def test_onboarding_form_without_description(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['description'][0], 'You must provide a description for your site.')
    
    def test_onboarding_form_with_blank_description(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': '',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['description'][0], 'You must provide a description for your site.')
    
    def test_onboarding_form_with_long_description(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstu',
            'category': self.category.id,
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['description'][0], "Your site's description must be 150 characters or less.")
    
    def test_onboarding_form_without_category(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['category'][0], 'You must select a category.')
    
    def test_onboarding_form_with_invalid_category(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': 'idekman',
            'logo': '',
            'agreement': True,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['category'][0], 'You have selected an invalid category.')
    
    def test_onboarding_form_without_agreement(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': ''
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['agreement'][0], "You didn't agree to the terms of publishing.")
    
    def test_onboarding_form_with_false_agreement(self):
        form_data = {
            'account': self.account.id,
            'url': 'https://www.unsift.dev/',
            'verificationCode': '0123456789abcdef',
            'name': 'Unsift Dev',
            'description': 'Unsift dev description.',
            'category': self.category.id,
            'logo': '',
            'agreement': False,
        }
        form = OnboardingForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['agreement'][0], "You didn't agree to the terms of publishing.")