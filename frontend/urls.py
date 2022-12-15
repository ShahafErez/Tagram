from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index),
    path('info', index),
    path('join', index),
    path('create', index),
    path('project/<str:projectID>', index),
    path('create-meta', index),
    path('annotate', index)
]