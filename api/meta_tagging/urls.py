from django.urls import path
from .views import CreateMetaTaggingView, CreateMetaTaggingLabelView, GetLabelsByMetaTaggingId, GetLabelsGroupByMetaTagging

urlpatterns = [
    path('create', CreateMetaTaggingView.as_view()),
    path('create-labels', CreateMetaTaggingLabelView.as_view()),
    path('labels-by-id', GetLabelsByMetaTaggingId.as_view()),
    path('all-labels-grouped', GetLabelsGroupByMetaTagging.as_view())
]
