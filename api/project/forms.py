from django.forms import ModelForm
from django import forms
from .models import File

class UploadFile(ModelForm):
    file = forms.FileField()
    class Meta:
        model = File
        fields = ['file',]