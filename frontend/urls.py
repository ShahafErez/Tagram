from django.urls import path
from .views import index, admin_index
from .views import loginpage, logoutUser
from .views import register
from .forms import UserPasswordResetForm
from django.contrib.auth import views as auth_views


app_name = 'frontend'


urlpatterns = [
    path('', index, name=''),
    path('create', admin_index),
    # path('create', index), // todo- access to create
    path('my-projects', index),
    path('project/<str:projectID>', index),
    path('correct', index),
    path('login', loginpage),
    path('logout', logoutUser),
    path('register', register,  name='register'),
    path('dashboard/<str:username>', index),
    path('password_reset/', auth_views.PasswordResetView.as_view(
    template_name='main/password_reset.html',
    form_class=UserPasswordResetForm),name='password_reset'),
    path('reset_password/', auth_views.PasswordResetView.as_view(
    template_name='frontend/password_reset.html',
    form_class=UserPasswordResetForm),name='reset_password'),
    path('reset_password', auth_views.PasswordResetView.as_view(
    template_name='frontend/password_reset.html',
    form_class=UserPasswordResetForm),name='reset_password'),


]
