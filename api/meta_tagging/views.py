from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MetaTagging, MetaTaggingLabels
from .serializers import (CreateMetaTaggingSerializer,
                          MetaTaggingLabelSerializer, MetaTaggingSerializer)

""" Meta Tagging """


class CreateMetaTaggingView(APIView):
    """
        Creates a new meta tagging
    """
    serializer_class = CreateMetaTaggingSerializer

    def post(self, request, format=None):

        # serialize all the data that was sent
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            title = serializer.data.get('title')
            metaTagging = MetaTagging(
                title=title, username=username, test=test)
            metaTagging.save()
            # saving the current meta tagging id in the session, so we could return the user to it if needed
            # storing a custom variable in the user session
            self.request.session['meta_tagging_id'] = metaTagging.meta_tagging_id
            return Response({'meta_tagging_id': metaTagging.meta_tagging_id}, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


""" Meta Tagging  Labels"""


class GetLabelsByMetaTaggingId(APIView):
    """
        Get all labels for a given meta tagging id
    """
    serializer_class = MetaTaggingSerializer
    lookup_url_kwarg = 'meta-tagging-id'

    def get(self, request, format=None):
        meta_tagging_id = request.GET.get(self.lookup_url_kwarg)

        if meta_tagging_id != None:
            query = MetaTaggingLabels.objects.filter(
                meta_tagging_id=meta_tagging_id)

            if len(query) > 0:
                # getting all the labels for the meta tagging id
                labels = []
                for label in query:
                    labels.append(MetaTaggingLabelSerializer(label).data)

                return Response(labels, status=status.HTTP_200_OK)

            return Response({"Invalid meta-tagging id."}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid post data, did not find a meta tagging id'}, status=status.HTTP_400_BAD_REQUEST)


class CreateMetaTaggingLabelView(APIView):
    """
        Creates new labels by a given meta tagging id
    """

    def post(self, request, format=None):

        # checking if we have an active session with the user
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # getting the meta tagging object, to insert the meta tagging as object
        metaTagging = MetaTagging.objects.filter(
            meta_tagging_id=request.data['meta_tagging'])
        # no meta tagging found with given id
        if (len(metaTagging) <= 0):
            return Response({"Invalid meta-tagging id."}, status=status.HTTP_400_BAD_REQUEST)

        # iterating over the labels array
        for label in request.data['labels']:
            name = label.get('name')
            type = label.get('type')
            color = label.get('color')
            metaTaggingLabel = MetaTaggingLabels(
                meta_tagging=metaTagging[0], name=name, type=type, color=color)
            metaTaggingLabel.save()
            self.request.session['label_id'] = metaTaggingLabel.label_id

        return Response({"labels created"}, status=status.HTTP_201_CREATED)


class GetLabelsGroupByMetaTagging(APIView):
    """
        Get all labels, grouped by meta tagging id
    """

    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        data_response = []

        # getting all mega-tagging, for each- getting all the labels
        username = request.GET.get(self.lookup_url_kwarg)
        print("username ", username)
        if username != None:
            meta_taggings = MetaTagging.objects.filter(username=username)
            print("meta_taggings ", meta_taggings)
            for meta_tagging in meta_taggings:
                query = MetaTaggingLabels.objects.filter(
                    meta_tagging_id=meta_tagging.meta_tagging_id)
                labels = []
                for label in query:
                    labels.append(MetaTaggingLabelSerializer(label).data)
                data_response.append({
                    'meta_tagging_id': meta_tagging.meta_tagging_id,
                    'title': meta_tagging.title,
                    'labels': labels
                })
            return Response(data_response, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid post data, did not find a username'}, status=status.HTTP_400_BAD_REQUEST)
