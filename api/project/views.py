from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ProjectSerializer, CreateProjectSerializer, FileSerializer
from .models import Project, File
from api.meta_tagging.models import MetaTagging
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import logging
from .forms import UploadFile

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


class JoinProject(APIView):
    """
        Join user to existing project
    """
    lookup_url_kwarg = 'project_id'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        project_id = request.data.get(self.lookup_url_kwarg)
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]
                self.request.session['project_id'] = project_id
                return Response({'message': 'Project Joined!'}, status=status.HTTP_200_OK)
            return Response(PROJECT_ID_NOT_FOUNT_MESSAGE, status=status.HTTP_400_BAD_REQUEST)
        return Response(PROJECT_ID_NOT_IN_PATH_MESSAGE, status=status.HTTP_400_BAD_REQUEST)


# class EditProject(APIView):
#     """
#         Edit existing project
#     """

#     serializer_class = EditProjectSerializer

#     def put(self, request, format=None):

#         if not self.request.session.exists(self.request.session.session_key):
#             self.request.session.create()

#         # serializer contains the content on the edit request
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             project_id = serializer.data.get('project_id')
#             updated_title = serializer.data.get('title')

#             project_query = Project.objects.filter(project_id=project_id)
#             if len(project_query) <= 0:
#                 return Response(PROJECT_ID_NOT_IN_PATH_MESSAGE, status=status.HTTP_400_BAD_REQUEST)

#             project = project_query[0]

#             user_id = self.request.session.session_key
#             if project.project_manager != user_id:
#                  return Response({'message': 'Invalid user request. Only the project manager can edit the project'}, status=status.HTTP_403_FORBIDDEN)

#             project.title = updated_title
#             project.save(update_fields=['title'])
#             return Response(ProjectSerializer(project).data, status=status.HTTP_200_OK)

        # return Response(PROJECT_ID_NOT_FOUNT_MESSAGE, status=status.HTTP_400_BAD_REQUEST)


class UploadFile(APIView):
    """
    save file
    """

    def post(self, request, format=None):
        print(request.FILES['myFile'])
        # logging.DEBUG(request.FILES['myFile'])
        file = File(file=request.FILES['myFile'],
                    project_id=request.POST['project_id'])
        file.save()
        return Response("test", status=status.HTTP_200_OK)


class GetFile(APIView):
    serializer_class = FileSerializer
    lookup_url_kwarg = 'project_id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg)
        # Checking we got project id in the path param
        if project_id != None:
            project_query = File.objects.filter(project_id=project_id)
            # logging("project id is: "+ project_id)
            if len(project_query) > 0:
                data = FileSerializer(project_query[0]).data
                with open(f".{data['file']}", 'r') as f:
                    text = f.read()
                    # text = text.split('\n')
                    # text = '<br/>'.join(text)
                    data['text'] = text
                return Response(data, status=status.HTTP_200_OK)
            return Response(PROJECT_ID_NOT_FOUNT_MESSAGE, status=status.HTTP_404_NOT_FOUND)
        return Response(PROJECT_ID_NOT_IN_PATH_MESSAGE, status=status.HTTP_400_BAD_REQUEST)
