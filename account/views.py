import time
import requests
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import logout, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from unsift.settings import HCAPTCHA_SECRET_KEY as hcaptchaSecretKey
from .forms import UserCreationForm
from .models import EmailChangeRequest, Profile

def logoutView(request):
    logout(request)
    response = HttpResponseRedirect('/account/login/')
    response.delete_cookie('apitoken')
    return response

@login_required()
def manage(request):
    return render(request, 'account/manage.html')

def signup(request):
    if(request.method == 'POST'):
        signup_form = UserCreationForm(request.POST)
        context = {'signup_form': signup_form}
        try:
            captcha_token = request.POST['h-captcha-response']
            captcha_payload = {'secret': hcaptchaSecretKey, 'response': captcha_token}
            captcha_request = requests.post('https://hcaptcha.com/siteverify', data=captcha_payload)
            captcha_response = captcha_request.json()
            captcha_success = captcha_response["success"]
            if not captcha_success:
                signup_form.add_error(None, 'The captcha is invalid')
        except KeyError:
            signup_form.add_error(None, 'You must complete the captcha')
        if(signup_form.is_valid()):
            signup_form.save()
            user = User.objects.get(username=signup_form.cleaned_data['username'])
            title = user.username
            profile = Profile.objects.get(account=user)
            verificationcode = profile.emailVerificationCode
            try:
                send_mail(
                    'Welcome to Unsift',
                    "Thanks for signing up for Unsift, " + title + ". We're glad to have you here. Please verify your email address by clicking on the following link. If you do not verify your email address, your Unsift account will be automatically deleted in two weeks and will not be recoverable.\n\nhttps://www.unsift.com/account/verify-email/" + verificationcode + "/",
                    'Unsift <support@unsift.com>',
                    [signup_form.cleaned_data['email'],]
                )
            except:
                time.sleep(3)
                send_mail(
                    'Welcome to Unsift',
                    "Thanks for signing up for Unsift, " + title + ". We're glad to have you here. Please verify your email address by clicking on the following link. If you do not verify your email address, your Unsift account will be automatically deleted in two weeks and will not be recoverable.\n\nhttps://www.unsift.com/account/verify-email/" + verificationcode + "/",
                    'Unsift <support@unsift.com>',
                    [signup_form.cleaned_data['email'],]
                )
            login(request, user, backend='unsift.backends.UsernameEmailBackend')
            return HttpResponseRedirect('/explore/')
    else:
        signup_form = UserCreationForm()
        context = {'signup_form': signup_form}
    return render(request, 'account/signup.html', context)

def revertEmail(request, revertcode):
    ecr = EmailChangeRequest.objects.filter(revertCode=revertcode)
    if not ecr:
        return HttpResponseRedirect('/account/manage/')
    ecr = ecr[0]
    user = ecr.account
    user.email = ecr.oldEmail
    user.save()
    ecr.delete()
    profile = Profile.objects.get(account=user)
    profile.emailVerified = True
    profile.emailVerificationCode = None
    profile.save()
    context = {
        'email': user.email,
    }
    return render(request, 'account/revert-email-success.html', context)

def verifyEmail(request, verificationcode):
    profile = Profile.objects.filter(emailVerificationCode=verificationcode)
    if not profile:
        return HttpResponseRedirect('/account/manage/')
    profile = profile[0]
    profile.emailVerified = True
    profile.emailVerificationCode = None
    profile.save()
    return render(request, 'account/verify-email-success.html')

@login_required()
def disableTwoFactor(request):
    return render(request, 'two_factor/profile/disable.html')

@login_required()
def supportHome(request):
    return render(request, 'account/support.html')