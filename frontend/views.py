from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_protect
from .forms import CreateUserForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

@csrf_protect
def loginpage(request, *args, **kwargs):
    if request.method == 'POST':
        username1 = request.POST.get('username')
        password1 = request.POST.get('password')
        user = authenticate(request, username = username1, password = password1)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.info(request, "user name or password is not correct")
    context ={}
    return render(request, 'frontend/login.html',context)


@csrf_protect
def register(request, *args, **kwargs):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            user = form.cleaned_data.get('username')
            messages.success(request, 'Hi ' + user+"! You can start your annotation project now!")
            return redirect('login')
    return render(request, 'frontend/register.html',{'form':form})


