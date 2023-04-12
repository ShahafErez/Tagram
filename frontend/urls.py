from django.urls import path
from .views import index, admin_index
from .views import loginpage, logoutUser
from .views import register


app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('create', admin_index),
    path('my-projects', index),
    path('project/<str:projectID>', index),
    path('correct', index),
    path('login', loginpage),
    path('logout', logoutUser),
    path('register', register,  name='register'),
    path('dashboard/<str:username>', index),
]
