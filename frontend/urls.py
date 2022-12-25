from django.urls import path
from .views import index
from .views import login
from .views import register


app_name = 'frontend'

urlpatterns = [
    path('', index, name = 'home'),
    path('info', index),
    path('join', index),
    path('create', index),
    path('project/<str:projectID>', index),
    path('meta/<str:projectID>', index),
    path('annotate', index),
    path('login', login),
    path('register', register,  name='register'),
]