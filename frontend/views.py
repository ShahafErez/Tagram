from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_protect
from .forms import CreateUserForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render
from .decorators import unauthenticated_user, allowed_users
import requests


@login_required(login_url='login')
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

@allowed_users(allowed_roles=['admins'])
def admin_index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

@csrf_protect
def loginpage(request, *args, **kwargs):
    if request.method == 'POST':
        username1 = request.POST.get('username')
        password1 = request.POST.get('password')
        user = authenticate(
            request, username=username1, password=password1)
        if user is not None:
            login(request, user)
            context = {}
            request.session['username'] = username1
            return redirect('/')
        else:
            messages.info(request, "Username or password is incorrect")
    context = {}
    return render(request, 'frontend/login.html', context)


@login_required(login_url='login')
def logoutUser(request):
    logout(request)
    return redirect('login')


@csrf_protect
@unauthenticated_user
def register(request, *args, **kwargs):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            username1 = form.cleaned_data.get('username')
            password1 = form.cleaned_data.get('password1')
            user = authenticate(
                request, username=username1, password=password1)
            if user is not None:
                login(request, user)
                context = {}
                request.session['username'] = username1
                return redirect('/')
            messages.success(request, 'Hi ' + username1+"! You can start your annotation project now!")
            context ={}
            return redirect('login')
    return render(request, 'frontend/register.html', {'form': form})
