from django.urls import path
from .views import GetSessionDetails


# app_name = 'users'


urlpatterns = [
    path('getsession/', GetSessionDetails.as_view()),

   
]
