from django.shortcuts import render, redirect
from publish.models import Category

def explore(request):
    return render(request, 'explore/explore.html')

def exploreCategory(request, category):
    catExists = Category.objects.filter(url=category)
    if len(catExists) == 0:
        return redirect('explore:explore')
    context = {
        'category': category 
    }
    return render(request, 'explore/explore.html', context)