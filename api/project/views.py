from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ProjectSerializer, CreateProjectSerializer, FileSerializer, SaveAnnotationSerializer, GetAnnotationSerializer
from .models import Project, File, Annotation
from api.meta_tagging.models import MetaTagging
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import logging
from .forms import UploadFile
import json

PROJECT_ID_NOT_FOUNT_MESSAGE = {'Project Not Found': 'Invalid Project Id.'}
PROJECT_ID_NOT_IN_PATH_MESSAGE = {
    'Bad Request': 'Invalid post data, did not find a project id'}


class ProjectView(generics.ListAPIView):
    """
        Gets all of the active projects in the database
    """
    queryset = Project.objects.all()
    # specify the serializer of this object
    serializer_class = ProjectSerializer


class CreateProjectView(APIView):
    """
        Creates a new project
    """
    serializer_class = CreateProjectSerializer

    def post(self, request, format=None):

        # checking if we have an active session with the user
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # serialize all the data that was sent
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            meta_tagging = None

            meta_tagging_id = serializer.data.get('meta_tagging')
            if meta_tagging_id != None:
                # getting meta tagging object
                meta_tagging = MetaTagging.objects.filter(
                    meta_tagging_id=meta_tagging_id)
                if (len(meta_tagging)) > 0:
                    meta_tagging = meta_tagging[0]
                else:
                    meta_tagging = None

            title = serializer.data.get('title')
            description = serializer.data.get('description')
            project_manager = self.request.session.session_key

            project = Project(project_manager=project_manager, title=title,
                              description=description, meta_tagging=meta_tagging)
            project.save()
            # saving the current project id in the session, so we could return the user to it if needed
            # storing a custom variable in the user session
            self.request.session['project_id'] = project.project_id

            # returns the code to the user
            return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GetProject(APIView):
    """
        Get project details by a given path param
    """
    serializer_class = ProjectSerializer
    lookup_url_kwarg = 'project_id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg)
        # Checking we got project id in the path param
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                data = ProjectSerializer(project_query[0]).data
                # checking if the current request sender is the project manager
                data['is_project_manager'] = self.request.session.session_key == project_query[0].project_manager
                return Response(data, status=status.HTTP_200_OK)
            return Response(PROJECT_ID_NOT_FOUNT_MESSAGE, status=status.HTTP_404_NOT_FOUND)
        return Response(PROJECT_ID_NOT_IN_PATH_MESSAGE, status=status.HTTP_400_BAD_REQUEST)


class UploadFile(APIView):
    """
    save file
    """

    def post(self, request, format=None):
        project_id = request.POST['project_id']
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]
                file = File(file=request.FILES['myFile'],
                            project=project)
                file.save()
                return Response("File saved", status=status.HTTP_200_OK)


class GetFile(APIView):
    serializer_class = FileSerializer
    lookup_url_kwarg = 'project_id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg)
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]

                if project != None:
                    project_query = File.objects.filter(project=project)
                    if len(project_query) > 0:
                        data = FileSerializer(project_query[0]).data
                        with open(f".{data['file']}", 'r') as f:
                            text = f.read()
                            data['text'] = text
                        return Response(data, status=status.HTTP_200_OK)
                    return Response(PROJECT_ID_NOT_FOUNT_MESSAGE, status=status.HTTP_404_NOT_FOUND)
        return Response(PROJECT_ID_NOT_IN_PATH_MESSAGE, status=status.HTTP_400_BAD_REQUEST)


class SaveAnnotation(APIView):
    """
    saving annotation to DB
    """
    serializer_class = SaveAnnotationSerializer

    def post(self, request, format=None):

        data = request.data
        if data:
            project, file = None, None
            project_id = data['project_id']
            if project_id != None:
                project_query = Project.objects.filter(project_id=project_id)
                if (len(project_query)) > 0:
                    project = project_query[0]
                else:
                    return Response({'Bad Request': 'No project was found'}, status=status.HTTP_400_BAD_REQUEST)
            file_id = data['file_id']
            if file_id != None:
                file_query = File.objects.filter(file_id=file_id)
                if (len(file_query)) > 0:
                    file = file_query[0]
                else:
                    return Response({'Bad Request': 'No file was found'}, status=status.HTTP_400_BAD_REQUEST)

            tags = json.dumps(data['tags'])
            relations = json.dumps(data['relations'])
            co_occcurrence = json.dumps(data['co_occcurrence'])

            annotation = Annotation(
                project=project, file=file, tags=tags, relations=relations, co_occcurrence=co_occcurrence)
            annotation.save()

            # return feedback to user
            return Response("Annotation saved successfully", status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GetAnnotation(APIView):
    lookup_url_kwarg = 'project_id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg)
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]

                if project != None:
                    annotation_query = Annotation.objects.filter(
                        project=project)
                    if len(annotation_query) > 0:
                        data = GetAnnotationSerializer(
                            annotation_query[0]).data
                        data['tags'] = json.loads(data['tags'])
                        data['relations'] = json.loads(data['relations'])
                        data['co_occcurrence'] = json.loads(
                            data['co_occcurrence'])
                        return Response(data, status=status.HTTP_200_OK)
                    return Response("no annotation found", status=status.HTTP_404_NOT_FOUND)
        return Response("error", status=status.HTTP_400_BAD_REQUEST)
