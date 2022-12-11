from django.urls import path, include

urlpatterns = [
    path('project/', include('api.project.urls')),
]
