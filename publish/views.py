import secrets
import stripe
import time
import requests
from stripe.error import InvalidRequestError
from unsift.settings import STRIPE_API_KEY as stripeAPIKey
from unsift.settings import HCAPTCHA_SECRET_KEY as hcaptchaSecretKey
from django.utils.datastructures import MultiValueDictKeyError
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from .forms import OnboardingForm
from .models import Site
from staff.models import Customer
from account.models import Profile
from unsift.scour import containsCode

def splash(request):
	return render(request, 'publish/splash.html')

@login_required()
def onboarding(request):
	profile = Profile.objects.get(account=request.user)
	if not profile.emailVerified:
		return render(request, 'account/verify-email-to-proceed.html')
	if(request.method == 'POST'):
		onboarding_form = OnboardingForm(request.POST, request.FILES)
		context = {
			'onboardingForm': onboarding_form,
			'verificationCode': request.POST.get('verificationCode')
		}
		try:
			captcha_token = request.POST['h-captcha-response']
			captcha_payload = {'secret': hcaptchaSecretKey, 'response': captcha_token}
			captcha_request = requests.post('https://hcaptcha.com/siteverify', data=captcha_payload)
			captcha_response = captcha_request.json()
			captcha_success = captcha_response["success"]
			if not captcha_success:
				onboarding_form.add_error(None, 'The captcha is invalid')
		except KeyError:
			onboarding_form.add_error(None, 'You must complete the captcha')
		if(onboarding_form.is_valid()):
			onboarding_form.cleaned_data['account'] = request.user
			try:
				logo = request.FILES['logo']
				if containsCode(logo):
					onboarding_form.add_error('logo', 'The image you uploaded contains suspicious code. Please upload a different image.')
				else:
					onboarding_form.save()
			except MultiValueDictKeyError:
				onboarding_form.save()
			if onboarding_form.errors:
				return render(request, 'publish/onboarding.html', context)
			try:
				customer = Customer.objects.get(account=request.user)
				profile.publisher = True
				profile.save()
				sitename = onboarding_form.cleaned_data['name']
				try:
					send_mail(
						"Verify Ownership to Continue",
						"We have recieved your application to publish " + sitename + " on Unsift. We just need to verify your ownership of this site before continuing. You can complete this verification process by visiting your publisher dashboard here:\nhttps://www.unsift.com/publisher-dashboard/\n\nThank you,\nUnsift Publishing",
						'Unsift Publishing <publishing@unsift.com>',
						[request.user.email,]
					)
				except:
					time.sleep(3)
					send_mail(
						"Verify Ownership to Continue",
						"We have recieved your application to publish " + sitename + " on Unsift. We just need to verify your ownership of this site before continuing. You can complete this verification process by visiting your publisher dashboard here:\nhttps://www.unsift.com/publisher-dashboard/\n\nThank you,\nUnsift Publishing",
						'Unsift Publishing <publishing@unsift.com>',
						[request.user.email,]
					)
				return redirect('/publisher-dashboard/')
			except Customer.DoesNotExist:
				profile.publisher = True
				profile.save()
				sitename = onboarding_form.cleaned_data['name']
				try:
					send_mail(
						"Verify Ownership to Continue",
						"We have recieved your application to publish " + sitename + " on Unsift. We just need to verify your ownership of this site before continuing. You can complete this verification process by visiting your new publisher dashboard on Unsift.\nCheck it out here:\nhttps://www.unsift.com/publisher-dashboard/\n\nThank you,\nUnsift Publishing",
						'Unsift Publishing <publishing@unsift.com>',
						[request.user.email,]
					)
				except:
					time.sleep(3)
					send_mail(
						"Verify Ownership to Continue",
						"We have recieved your application to publish " + sitename + " on Unsift. We just need to verify your ownership of this site before continuing. You can complete this verification process by visiting your new publisher dashboard on Unsift.\nCheck it out here:\nhttps://www.unsift.com/publisher-dashboard/\n\nThank you,\nUnsift Publishing",
						'Unsift Publishing <publishing@unsift.com>',
						[request.user.email,]
					)
				return redirect('/publish/payment/')
	else:
		onboarding_form = OnboardingForm()
		onboarding_form.fields['account'].initial = request.user
		verificationCode = secrets.token_urlsafe(12)
		onboarding_form.fields['verificationCode'].initial = verificationCode
		context = {
			'onboardingForm': onboarding_form,
			'verificationCode': verificationCode
		}
	return render(request, 'publish/onboarding.html', context)

@login_required()
def payment(request):
	stripe.api_key = stripeAPIKey
	checkoutSession = stripe.checkout.Session.create(
		payment_method_types=['card'],
		mode='setup',
		success_url='https://www.unsift.com/publish/payment/success/{CHECKOUT_SESSION_ID}/',
  		cancel_url='https://www.unsift.com/publish/payment/cancel/',
		customer_email=request.user.email,
	)
	context = {
		'checkoutSessionID': checkoutSession.id
	}
	return render(request, 'publish/payment.html', context)

@login_required()
def paymentSuccess(request, checkoutSessionID):
	stripe.api_key = stripeAPIKey
	try:
		checkoutSession = stripe.checkout.Session.retrieve(checkoutSessionID)
	except InvalidRequestError:
		return render(request, 'publish/payment_failure.html')
	setupIntent = checkoutSession.get("setup_intent")
	setupIntent = stripe.SetupIntent.retrieve(setupIntent)
	paymentMethod = setupIntent.get("payment_method")
	email = request.user.email
	try:
		local_customer = Customer.objects.get(account=request.user)
		stripe.PaymentMethod.attach(
			paymentMethod,
			customer=local_customer.cid,
		)
		stripe.Customer.modify(
			local_customer.cid,
			invoice_settings={
				'default_payment_method': paymentMethod
			},
		)
	except (Customer.DoesNotExist):
		customer = stripe.Customer.create(
				payment_method = paymentMethod,
				name = request.user.username,
				email = email,
				invoice_settings={
					'default_payment_method': paymentMethod
				},
			)
		local_customer = Customer.objects.create(account=request.user, cid=customer.id)
		local_customer.save()
	except (InvalidRequestError):
		# Occurs when refreshing page after loading once
		pass
	return render(request, 'publish/payment_success.html')

@login_required()
def paymentCancel(request):
	return render(request, 'publish/payment_cancel.html')

@login_required()
def claims(request):
	return render(request, 'publish/claims.html')