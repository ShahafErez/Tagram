from django.urls import path
from .views import index, admin_index
from .views import loginpage, logoutUser
from .views import register


app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('my-projects', index),
    path('project/<str:projectId>', index),
    path('correct', index),
    path('login', loginpage),
    path('logout', logoutUser),
    path('register', register,  name='register'),
    # admin_index
    # path('create', admin_index),
    path('create', index),
    path('manager/dashboard/<str:username>', index),
    path('manager/<str:projectId>', index),
    path('manager/<str:projectId>/statistics', index),
]
