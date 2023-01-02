from django.urls import path
from .views import index
from .views import loginpage , logoutUser
from .views import register


app_name = 'frontend'

urlpatterns = [
    path('', index, name = ''),
    path('info', index),
    path('join', index),
    path('create', index),
    path('project/<str:projectID>', index),
    path('meta/<str:projectID>', index),
    path('annotate', index),
    path('login', loginpage),
    path('logout', logoutUser),
    path('register', register,  name='register'),
]