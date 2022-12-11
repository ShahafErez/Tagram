from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ProjectSerializer, CreateProjectSerializer, EditProjectSerializer
from .models import Project
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

PROJECT_ID_NOT_FOUNT_MESSAGE = {'Project Not Found': 'Invalid Project Id.'}
PROJECT_ID_NOT_IN_PATH_MESSAGE = {'Bad Request': 'Invalid post data, did not find a project id'}
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
            title = serializer.data.get('title')
            description = serializer.data.get('description')
            project_manager = self.request.session.session_key

            project = Project(project_manager=project_manager, title=title, description=description)
            project.save()
            # saving the current project id in the session, so we could return the user to it if needed
            self.request.session['project_id'] = project.project_id # storing a custom variable in the user session

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


class EditProject(APIView):
    """
        Edit existing project
    """

    serializer_class = EditProjectSerializer

    def put(self, request, format=None):
        
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # serializer contains the content on the edit request
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            project_id = serializer.data.get('project_id')
            updated_title = serializer.data.get('title')

            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) <= 0:
                return Response(PROJECT_ID_NOT_IN_PATH_MESSAGE, status=status.HTTP_400_BAD_REQUEST)

            project = project_query[0]

            user_id = self.request.session.session_key
            if project.project_manager != user_id:
                 return Response({'message': 'Invalid user request. Only the project manager can edit the project'}, status=status.HTTP_403_FORBIDDEN)

            project.title = updated_title
            project.save(update_fields=['title'])
            return Response(ProjectSerializer(project).data, status=status.HTTP_200_OK)

        return Response(PROJECT_ID_NOT_FOUNT_MESSAGE, status=status.HTTP_400_BAD_REQUEST)

    