from django.urls import path

from .views import GetAnnotatorsStatus, GetByProjectManager, CreateProjectView, GetProject, UploadFile, GetFile, GetProcessedFile, SaveAnnotation, GetAnnotation, UpdateAnnotationStatus, SendToAlgorithm, GetProjectFleissKappaScore, UploadUserModel


urlpatterns = [
    # project
    path('create', CreateProjectView.as_view()),
    path('get', GetProject.as_view()),
    path('get-by-project-manager', GetByProjectManager.as_view()),

    # file
    path('uploadfile', UploadFile.as_view()),
    path('get-file', GetFile.as_view()),
    path('get-file-content', GetProcessedFile.as_view()),

    # annotations
    path('save-annotation', SaveAnnotation.as_view()),

    # algorithm
    path('send-to-algorithm', SendToAlgorithm.as_view()), 
    path('get-annotation-of-tagger', GetAnnotation.as_view()), 
    path('get-annotators-status', GetAnnotatorsStatus.as_view()),
    path('edit-annotation-status', UpdateAnnotationStatus.as_view()),
    path('getProjectFleissKappaScore', GetProjectFleissKappaScore.as_view()),

    path('upload-user-model', UploadUserModel.as_view()),

]
