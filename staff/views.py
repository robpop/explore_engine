from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required

@staff_member_required
def home(request):
    return render(request, 'staff/home.html')

@staff_member_required
def support(request):
    return render(request, 'staff/support.html')

@staff_member_required
def vettings(request):
    return render(request, 'staff/vettings.html')

@staff_member_required
def audits(request):
    return render(request, 'staff/audits.html')

@staff_member_required
def changes(request):
    return render(request, 'staff/changes.html')