from django.urls import path
from .views import GetConnextra

urlpatterns = [
    path('connextra', GetConnextra.as_view()),
]
