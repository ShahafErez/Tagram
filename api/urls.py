from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Tagram API Documentation",
        default_version="v1"
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('project/', include('api.project.urls')),
    path('meta-tagging/', include('api.meta_tagging.urls')),
    path('users/', include('api.users.urls')),
    path('correctness/', include('api.correctness.urls')),
]
