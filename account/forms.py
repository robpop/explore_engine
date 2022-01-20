from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserCreationForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        max_length=50,
        error_messages={
            'required': 'You must provide an email.',
            'max_length': 'This email is too long.',
            'invalid': 'This email is invalid.'
        },
        widget=forms.EmailInput(attrs={
            'class': 'sign-opt-half',
            'id': 'sign-opt-email',
            'placeholder': '*Email'
        })
    )
    username = forms.RegexField(
        required=True,
        min_length=4,
        max_length=30,
        regex=r"^[\w.-]+$",
        error_messages={
            'required': "You didn't enter a username.",
            'min_length': 'Your username must contain at least 4 characters.',
            'max_length': 'Your username must contain 30 characters or fewer.',
            'invalid': 'Your username may only contain letters, numbers, underscores, dots, and dashes.'
        },
        widget=forms.TextInput(attrs={
            'class': 'sign-opt-half',
            'id': 'sign-opt-uname',
            'placeholder': '*Username',
            'autocapitalize': 'none',
            'autocomplete': 'off'
        })
    )
    password1 = forms.CharField(
        required=True,
        min_length=8,
        max_length=128,
        error_messages={
            'required': 'You must fill out the first password field.',
            # Overrides to prevent two password length error messages
            'min_length': '',
            'max_length': ''
        },
        widget=forms.PasswordInput(attrs={
            'id': 'sign-opt-pass1',
            'placeholder': '*Password',
            'autocapitalize': 'none'
        })
    )
    password2 = forms.CharField(
        required=True,
        min_length=8,
        max_length=128,
        error_messages={
            'required': 'You must confirm your password.',
            'min_length': 'Your password must contain 8 or more characters.',
            'max_length': 'Your password is too long.'
        },
        widget=forms.PasswordInput(attrs={
            'id': 'sign-opt-pass2',
            'placeholder': '*Confirm Password',
            'autocapitalize': 'none'
        })
    )
    agreement = forms.BooleanField(
        required=True,
        error_messages={
            'required': "You didn't agree to the privacy policy and terms of service."
        },
        widget=forms.CheckboxInput(attrs={
            'class': 'sign-opt-chkbx',
            'id': 'sign-opt-tos-pp'
        })
    )
    age = forms.BooleanField(
        required=True,
        error_messages={
            'required': "You aren't old enough to have an Unsift account."
        },
        widget=forms.CheckboxInput(attrs={
            'class': 'sign-opt-chkbx',
            'id': 'sign-opt-age-pp'
        })
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'password1', 'password2', 'agreement', 'age')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        try:
            user = User.objects.get(email=email)
            if(user):
                self.add_error('email', 'This email is in use by another user.')
        except User.DoesNotExist:
            return email
        return email

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user