from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.project.models import Project
from api.users.models import User, UsersInProject
from api.project.models import Annotation
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
        return Response([username, is_admin], status=status.HTTP_200_OK)


class UserView(generics.ListAPIView):
    """
        Gets all of the active users in the database
    """
    queryset = User.objects.all()
    # specify the serializer of this object
    serializer_class = UserSerializer


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
            if (len(User.objects.filter(username=username)) == 1):
                return Response({'Conflict': 'User already exists'}, status=status.HTTP_200_OK)
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
                    return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

            if users_array != None:
                # getting user object by username
                for current_user in users_array:
                    current_user = User.objects.filter(username=current_user)
                    if (len(current_user)) > 0:
                        current_user = current_user[0]
                    else:
                        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
                    user_in_project = UsersInProject(
                        user=current_user, project=project, project_manager=project.project_manager)
                    user_in_project.save()
                    # saving empty annotation record for each tagger in project
                    username = UserSerializer(current_user).data["username"]
                    annotation = annotation = Annotation(
                        project=project, tags=None, tagger=username, relations=None, co_occcurrence=None)
                    annotation.save()

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
            user_project_mapping_query = UsersInProject.objects.filter(
                user=user)
            if len(user_project_mapping_query) > 0:
                # getting all the projects for the username
                user_project_mapping = []
                for user_project_object in user_project_mapping_query:
                    user_project_mapping.append(
                        UsersInProjectSerializer(user_project_object).data)

                return Response(user_project_mapping, status=status.HTTP_200_OK)
            return Response({"No projects found"}, status=status.HTTP_204_NO_CONTENT)
        return Response({'Bad Request': 'Invalid get data'}, status=status.HTTP_400_BAD_REQUEST)


class GetUsersByProject(APIView):
    """
        Get all users for a given project
    """
    lookup_url_kwarg = 'project'

    def get(self, request, format=None):
        project = request.GET.get(self.lookup_url_kwarg)
        if project != None:
            users_query = UsersInProject.objects.filter(project=project)
            if len(users_query) > 0:
                # getting all the projects for the username
                users = []
                for user in users_query:
                    users.append(UsersInProjectSerializer(user).data)

                return Response(users, status=status.HTTP_200_OK)

            return Response({"This project does not have any taggers."}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid get data'}, status=status.HTTP_400_BAD_REQUEST)


class IsAssigned(APIView):
    """
        Get all projects for a given username
    """
    lookup_url_kwarg_project_id = 'project_id'
    lookup_url_kwarg_project_username = 'username'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg_project_id)
        user = request.GET.get(self.lookup_url_kwarg_project_username)
        if project_id != None and user != None:
            project = Project.objects.filter(project_id=project_id)
            if (len(project)) > 0:
                is_assigned = False
                users_query = UsersInProject.objects.filter(
                    project=project_id, user=user)
                if len(users_query) > 0:
                    is_assigned = True
                return Response({"Assigned": is_assigned}, status=status.HTTP_200_OK)
            return Response({'No project found with given id'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid get data'}, status=status.HTTP_400_BAD_REQUEST)
