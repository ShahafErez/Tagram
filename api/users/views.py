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
        if 'username' in request.session:
            username = request.session['username']
            return Response(username, status=status.HTTP_200_OK)


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
            users_array = serializer.data.get('user')
            project_id = serializer.data.get('project')

            if project_id != None:
                # getting project object by id
                project = Project.objects.filter(project_id=project_id)
                if (len(project)) > 0:
                    project = project[0]
                else:
                    project = None

            if users_array != None:
                # getting user object by username
                for current_user in users_array:
                    current_user = User.objects.filter(username=current_user)
                    if (len(current_user)) > 0:
                        current_user = current_user[0]
                    user_in_project = UsersInProject(user=current_user, project=project)
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
