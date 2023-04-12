from django.urls import path

from .views import GetAllAnnotation, GetByProjectManager, ProjectView, CreateProjectView, GetProject, UploadFile, GetFile, GetProcessedFile, SaveAnnotation, GetAnnotation, UpdateAnnotationStatus, SendToAlgorithm



urlpatterns = [
    # project
    path('get-all', ProjectView.as_view()),
    path('create', CreateProjectView.as_view()),
    path('get', GetProject.as_view()),

    path('get-by-project-manager', GetByProjectManager.as_view()),

    # file
    path('uploadfile', UploadFile.as_view()),
    path('get-file', GetFile.as_view()),
    path('get-file-content', GetProcessedFile.as_view()),
    # annotations
    path('save-annotation', SaveAnnotation.as_view()),

    path('get-annotation', GetAnnotation.as_view()),
    # algorithm
    path('send-to-algorithm', SendToAlgorithm.as_view()),


    path('get-annotation-of-tagger', GetAnnotation.as_view()),

    path('get-all-anotations', GetAllAnnotation.as_view()),
    path('edit-annotation-status', UpdateAnnotationStatus.as_view()),


]
