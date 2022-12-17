from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import CreateMetaTaggingSerializer, MetaTaggingSerializer, CreateMetaTaggingLabelSerializer,MetaTaggingLabelSerializer
from .models import MetaTagging, MetaTaggingLabels

""" Meta Tagging """

class MetaTaggingView(generics.ListAPIView):
    """
        Gets all of the meta tagging in the database
    """
    queryset = MetaTagging.objects.all()
    serializer_class = MetaTaggingSerializer


class GetMetaTagging(APIView):
    """
        Get meta-tagging details by a given id in path
    """
    serializer_class = MetaTaggingSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        # Getting meta-tagging id from path
        meta_tagging_id = request.GET.get(self.lookup_url_kwarg)
        if meta_tagging_id != None:
            query = MetaTagging.objects.filter(meta_tagging_id=meta_tagging_id)
            if len(query) > 0:
                data = MetaTaggingSerializer(query[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Invalid meta-tagging id."}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid post data, did not find a meta tagging id'}, status=status.HTTP_400_BAD_REQUEST)


class CreateMetaTaggingView(APIView):
    """
        Creates a new meta tagging
    """
    serializer_class = CreateMetaTaggingSerializer
    
    def post(self, request, format=None):

        # checking if we have an active session with the user
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # serialize all the data that was sent
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title = serializer.data.get('title')
            metaTagging = MetaTagging(title=title)
            metaTagging.save()
            # saving the current meta tagging id in the session, so we could return the user to it if needed
            self.request.session['meta_tagging_id'] = metaTagging.meta_tagging_id # storing a custom variable in the user session

            return Response({'meta_tagging_id' : metaTagging.meta_tagging_id}, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


""" Meta Tagging  Lebals"""

class MetaTaggingLabelView(generics.ListAPIView):
    """
        Gets all of labels in the database
    """
    queryset = MetaTaggingLabels.objects.all()
    serializer_class = MetaTaggingLabelSerializer


class GetLabelsByMetaTaggingId(APIView):
    """
        Get all labels for a given meta tagging id
    """
    serializer_class = MetaTaggingSerializer
    lookup_url_kwarg = 'meta-tagging-id'

    def get(self, request, format=None):
        meta_tagging_id = request.GET.get(self.lookup_url_kwarg)

        if meta_tagging_id != None:
            query = MetaTaggingLabels.objects.filter(meta_tagging_id=meta_tagging_id)
            
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
        metaTagging = MetaTagging.objects.filter(meta_tagging_id=request.data['meta_tagging'])
        # no meta tagging found with given id
        if (len(metaTagging) <= 0):
            return Response({"Invalid meta-tagging id."}, status=status.HTTP_400_BAD_REQUEST)

        # iterating over the labels array
        for label in request.data['labels']:
            name = label.get('name')
            type = label.get('type')
            color = label.get('color')
            metaTaggingLabel = MetaTaggingLabels(meta_tagging=metaTagging[0], name=name, type=type, color=color)
            metaTaggingLabel.save()
            self.request.session['label_id'] = metaTaggingLabel.label_id

        return Response({"labels created"}, status=status.HTTP_201_CREATED)