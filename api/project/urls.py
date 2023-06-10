from django.urls import path

from .views import (CreateProjectView, EditProjectView, GetAnnotationByProject,
                    GetAnnotationByTagger, GetAnnotatorsStatus, DeleteUsersFromProjectView,
                    GetByProjectManager, GetFile, GetProcessedFile, GetProject,
                    GetProjectFleissKappaScore, GetUserModelsNames,
                    RunUserModel, SaveAnnotation, SendToAlgorithm,
                    UpdateAnnotationStatus, UploadFile, UploadUserModel)

urlpatterns = [
    # project
    path('create', CreateProjectView.as_view()),
    path('edit', EditProjectView.as_view()),
    path('get', GetProject.as_view()),
    path('get-by-project-manager', GetByProjectManager.as_view()),
    path('delete-users-from-project', DeleteUsersFromProjectView.as_view()),

    # file
    path('uploadfile', UploadFile.as_view()),
    path('get-file', GetFile.as_view()),
    path('get-file-content', GetProcessedFile.as_view()),

    # annotations
    path('save-annotation', SaveAnnotation.as_view()),
    path('get-annotation-of-tagger', GetAnnotationByTagger.as_view()),
    path('get-annotation-of-project', GetAnnotationByProject.as_view()),
    path('get-annotators-status', GetAnnotatorsStatus.as_view()),
    path('edit-annotation-status', UpdateAnnotationStatus.as_view()),

    # algorithm
    path('send-to-algorithm', SendToAlgorithm.as_view()),
    path('getProjectFleissKappaScore', GetProjectFleissKappaScore.as_view()),

    path('upload-user-model', UploadUserModel.as_view()),
    path('run-user-model', RunUserModel.as_view()),
    path('get-all-usermodels-names', GetUserModelsNames.as_view()),

]
