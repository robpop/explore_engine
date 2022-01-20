from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from library.models import Folder

@login_required()
def library(request):
    return render(request, 'library/library.html')

@login_required()
def folder(request, pk):
    folder = get_object_or_404(Folder, id=pk, account=request.user)
    context = {
        'folder': folder,
    }
    return render(request, 'library/library-folder.html', context)