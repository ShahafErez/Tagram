from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from api.project.models import Project

from api.users.models import User, UsersInProject
from api.users.serializers import CreateUserSerializer, CreateUsersInProjectSerializer, UserSerializer, UsersInProjectSerializer

class GetSessionDetails(APIView):
    """
        Get project details by a given path param
    """
    def get(self, request, format=None):
        username = ""
        is_admin = False
        if 'username' in request.session:
            username = request.session['username']
        if 'is_admin' in request.session: 
            is_admin = request.session['is_admin']
        return Response([username,is_admin], status=status.HTTP_200_OK)

class UserView(generics.ListAPIView):
    """
        Gets all of the active users in the database
    """
    queryset = User.objects.all()
    # specify the serializer of this object
    serializer_class = UserSerializer


class UserProjectView(generics.ListAPIView):
    """
        Gets all of the users-projects mapping in the database
    """
    queryset = UsersInProject.objects.all()
    # specify the serializer of this object
    serializer_class = UsersInProjectSerializer


class CreateUserView(APIView):
    """
        Creates a new user
    """
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):

        # serialize all the data that was sent
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data.get('username')
            user = User(username=username)
            user.save()

            # returns the code to the user
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)




class CreateUserProjectView(APIView):
    """
        User created new project, add to users-projects model
    """
    serializer_class = CreateUsersInProjectSerializer

    def post(self, request, format=None):

        # checking if we have an active session with the user
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # serialize all the data that was sent
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.data.get('user')

            if username != None:
                # getting user object by username
                user = User.objects.filter(username=username)
                if (len(user)) > 0:
                    user = user[0]
                else:
                    user = None

            project_id = serializer.data.get('project')

            if project_id != None:
                # getting project object by id
                project = Project.objects.filter(project_id=project_id)
                if (len(project)) > 0:
                    project = project[0]
                else:
                    project = None

            user_in_project = UsersInProject(user=user, project=project)
            user_in_project.save()

            # returns the code to the user
            return Response(UsersInProjectSerializer(user_in_project).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    




class GetProjectsByUsername(APIView):
    """
        Get all projects for a given username
    """
    lookup_url_kwarg = 'user'
    def get(self, request, format=None):
        user = request.GET.get(self.lookup_url_kwarg)
        if user != None:
            project_query = UsersInProject.objects.filter(user=user)
            if len(project_query) > 0:               
                # getting all the projects for the username
                projects = []
                for project in project_query:
                    projects.append(UsersInProjectSerializer(project).data)

                return Response(projects, status=status.HTTP_200_OK)

            return Response({"This user does not have any projects."}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid get data, did not find a project'}, status=status.HTTP_400_BAD_REQUEST)
