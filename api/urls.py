from django.urls import path, include
from .views import GetSessionDetails

urlpatterns = [
    path('project/', include('api.project.urls')),
    path('getsession/', GetSessionDetails.as_view()),

    path('meta-tagging/', include('api.meta_tagging.urls')),
]
