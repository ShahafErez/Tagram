from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.forms import SetPasswordForm

class UserPasswordSetForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super(UserPasswordResetForm, self).__init__(*args, **kwargs)

    password1 = forms.CharField(label='', widget=forms.EmailInput(attrs={
        'class': "input_user",
        'placeholder': '  New Password...',
        'type': 'password',
        'name': 'password1'
        }
        
        ))
    
    password2 = forms.CharField(label='', widget=forms.EmailInput(attrs={
        'class': "input_user",
        'placeholder': '  Retype Password...',
        'type': 'password',
        'name': 'password2'
        }
        
        ))

class UserPasswordResetForm(PasswordResetForm):
    def __init__(self, *args, **kwargs):
        super(UserPasswordResetForm, self).__init__(*args, **kwargs)

    email = forms.EmailField(label='', widget=forms.EmailInput(attrs={
        'class': "input_user",
        'placeholder': '  Email...',
        'type': 'email',
        'name': 'email'
        }))


class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class SetPasswordForm(SetPasswordForm):
    new_password1 = forms.CharField(
        label=("New password"),
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'class': "input_user",        'placeholder': '  New Password...',

        }),
        strip=False,
    )
    new_password2 = forms.CharField(
        label=("New password confirmation"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password','class': "input_user", 'placeholder': '  Password Confirmation...', }),
    )