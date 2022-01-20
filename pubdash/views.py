from django.utils.datastructures import MultiValueDictKeyError
from django.utils.timezone import now, timedelta
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from publish.models import Site
from publish.forms import UpdateSiteForm
from unsift.scour import containsCode

@login_required()
def dashboard(request):
    sites = Site.objects.filter(account=request.user)
    if not sites:
        return HttpResponseRedirect(reverse('publish:splash'))
    return render(request, 'pubdash/dashboard.html')

@login_required()
def manage(request, pk):
	site = get_object_or_404(Site, pk=pk, account=request.user)
	if(request.method == 'POST'):
		update_site_form = UpdateSiteForm(request.POST, request.FILES)
		context = {
			'updateSiteForm': update_site_form
		}		
		if update_site_form.is_valid():
			try:
				logo = request.FILES['logo']
				if containsCode(logo):
					update_site_form.add_error('logo', 'The image you uploaded contains suspicious code. Please upload a different image.')
				else:
					# TODO
					# Change back to 30 days for production
					thirtyDaysAgo = now() - timedelta(minutes=5)
					last_update = site.updated
					if last_update >= thirtyDaysAgo:
						update_site_form.add_error(None, 'You must wait at least 30 days from the last modification before making another')
					else:
						update_site_form.save()
			except MultiValueDictKeyError:
				# TODO
				# Change back to 30 days for production
				thirtyDaysAgo = now() - timedelta(minutes=5)
				last_update = site.updated
				if last_update >= thirtyDaysAgo:
					update_site_form.add_error(None, 'You must wait at least 30 days from the last modification before making another')
				else:
					update_site_form.save()
	else:
		update_site_form = UpdateSiteForm()
		update_site_form.fields['site'].initial = site
		update_site_form.fields['name'].initial = site.name
		update_site_form.fields['description'].initial = site.description
		context = {
			'updateSiteForm': update_site_form
		}
	context['site'] = site
	return render(request, 'pubdash/manage.html', context)