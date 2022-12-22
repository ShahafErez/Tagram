from django.urls import path
from .views import ProjectView, CreateProjectView, GetProject, JoinProject, UploadFile, GetFile

# app_name = 'project'


urlpatterns = [
    path('get-all', ProjectView.as_view()),
    path('create', CreateProjectView.as_view()),
    path('get', GetProject.as_view()),
    path('join', JoinProject.as_view()),
    path('uploadfile', UploadFile.as_view()),
    path('get-file', GetFile.as_view()),
]
