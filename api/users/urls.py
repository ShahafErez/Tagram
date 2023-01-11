from django.urls import path
from .views import CreateUserProjectView, CreateUserView, GetProjectsByUsername, GetSessionDetails, UserProjectView, UserView


urlpatterns = [
    path('getsession/', GetSessionDetails.as_view()),
    path('get-all', UserView.as_view()),
    path('get-all-user-project-mapping', UserProjectView.as_view()),
    path('create-user', CreateUserView.as_view()),
    path('create-user-project-mapping', CreateUserProjectView.as_view()),
    path('projects-by-username', GetProjectsByUsername.as_view()),
]
