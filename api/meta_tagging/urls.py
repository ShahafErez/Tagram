from django.urls import path
from .views import CreateMetaTaggingView, MetaTaggingView, CreateMetaTaggingLabelView, MetaTaggingLabelView, GetMetaTagging, GetLabelsByMetaTaggingId, GetLabelsGroupByMetaTagging

urlpatterns = [
    path('get-all', MetaTaggingView.as_view()),
    path('create', CreateMetaTaggingView.as_view()),
    path('get', GetMetaTagging.as_view()),
    path('all-labels', MetaTaggingLabelView.as_view()),
    path('create-labels', CreateMetaTaggingLabelView.as_view()),
    path('labels-by-id', GetLabelsByMetaTaggingId.as_view()),
    path('all-labels-grouped', GetLabelsGroupByMetaTagging.as_view())
]
