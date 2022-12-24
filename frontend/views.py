from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_protect
from .forms import CreateUserForm


def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

@csrf_protect
def login(request, *args, **kwargs):
    return render(request, 'frontend/login.html')


@csrf_protect
def register(request, *args, **kwargs):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
    return render(request, 'frontend/register.html',{'form':form})


