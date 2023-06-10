from django.contrib.auth import views as auth_views
from django.urls import path, re_path

from .forms import SetPasswordForm, UserPasswordResetForm
from .views import admin_index, index, loginpage, logoutUser, register

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('my-projects', index),
    path('project/<str:projectId>', index),
    path('correct', index),
    path('login', loginpage),
    path('logout', logoutUser),
    path('register', register, name='register'),
    # admin_index
    # path('create', admin_index),
    path('create', index),
    path('edit/<str:projectId>', index),
    path('manager/dashboard/<str:username>', index),
    path('manager/<str:projectId>', index),
    path('manager/<str:projectId>/statistics', index),
    path('automation/<str:projectId>', index),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name="frontend/password_reset_form.html", form_class=SetPasswordForm), name="password_reset_confirm"),
    path('reset_password/', auth_views.PasswordResetView.as_view(
        template_name='frontend/password_reset.html',
        form_class=UserPasswordResetForm), name='reset_password'),

    # Catch-all URL pattern
    re_path(r'^.*/$', index),
]
