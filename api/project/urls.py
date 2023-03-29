from django.urls import path
from .views import ProjectView, CreateProjectView, GetProject, UploadFile, GetFile, SaveAnnotation, GetAnnotation, GetStatistics


urlpatterns = [
    # project
    path('get-all', ProjectView.as_view()),
    path('create', CreateProjectView.as_view()),
    path('get', GetProject.as_view()),
    path('get-statistics', GetStatistics.as_view()),
    # file
    path('uploadfile', UploadFile.as_view()),
    path('get-file', GetFile.as_view()),
    # annotations
    path('save-annotation', SaveAnnotation.as_view()),
    path('get-annotation', GetAnnotation.as_view()),

]
