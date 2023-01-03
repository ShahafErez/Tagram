from django.urls import path
from .views import GetSessionDetails


# app_name = 'project'


urlpatterns = [
    #path('get-all', ProjectView.as_view()),
    path('getsession/', GetSessionDetails.as_view()),

   
]
