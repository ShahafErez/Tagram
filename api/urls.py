from django.urls import path, include

urlpatterns = [
    path('project/', include('api.project.urls')),
    path('meta-tagging/', include('api.meta_tagging.urls')),
    path('users/', include('api.users.urls')),
]
