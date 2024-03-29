from django.urls import path

from .views import (CreateUserProjectView, CreateUserView,
                    GetProjectsByUsername, GetSessionDetails,
                    GetUsersByProject, IsAssigned, UserView)

urlpatterns = [
    path('getsession/', GetSessionDetails.as_view()),
    path('get-all', UserView.as_view()),
    path('is-assigned', IsAssigned.as_view()),
    path('create-user', CreateUserView.as_view()),
    path('create-user-project-mapping', CreateUserProjectView.as_view()),
    path('projects-by-username/', GetProjectsByUsername.as_view()),
    path('users-by-project/', GetUsersByProject.as_view()),
]
