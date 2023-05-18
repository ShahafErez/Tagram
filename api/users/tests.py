from django.test import TestCase
from api.project.models import Project
from api.users.models import User, UsersInProject
from api.users.serializers import UserSerializer
from rest_framework.test import APIClient
from api.users.models import User
from rest_framework.views import status


class getSessionTestCase(TestCase):
    """
        tests for getting current session - getsession
    """

    def setUp(self):
        self.client = APIClient()
        # Set up the session data
        self.session_data = {'username': 'testuser', 'is_admin': True}
        self.session = self.client.session
        self.session.update(self.session_data)
        self.session.save()

    def test_get_session_details(self):
        print("users: Running test_get_session_details")
        # Make the request to the API endpoint
        response = self.client.get('/api/users/getsession/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the expected session data is returned in the response
        expected_data = [self.session_data['username'],
                         self.session_data['is_admin']]
        self.assertEqual(response.data, expected_data)


class UserViewTestCase(TestCase):
    """
        tests for getting all the users - get-all
    """

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username='user1')
        self.user2 = User.objects.create(
            username='user2', is_project_manager=True)

    def tearDown(self):
        self.user1.delete()
        self.user2.delete()

    def test_get_all_users(self):
        print("users: Running test_get_all_users")
        response = self.client.get('/api/users/get-all')
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), users.count())
        self.assertEqual(response.data, serializer.data)

    def test_get_all_users_with_exact_values(self):
        print("users: Running test_get_all_users_with_exact_values")
        response = self.client.get('/api/users/get-all')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['username'], 'user1')
        self.assertEqual(response.data[0]['is_project_manager'], False)
        self.assertEqual(response.data[1]['username'], 'user2')
        self.assertEqual(response.data[1]['is_project_manager'], True)


class CreateUserViewTestCase(TestCase):
    """
        tests for creating a new user - create-user
    """

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username='tagger_1')
        self.user.save()

    def tearDown(self):
        self.user.delete()

    def test_create_user(self):
        print("users: Running test_create_user")
        data = {'username': 'tagger_2'}
        response = self.client.post('/api/users/create-user', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.get(
            username='tagger_2').username, 'tagger_2')
        User.objects.get(username='tagger_2').delete()

    def test_create_user_with_existing_username(self):
        print("users: Running test_create_user_with_existing_username")
        data = {'username': 'tagger_1'}
        response = self.client.post('/api/users/create-user', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'Conflict': 'User already exists'})

    def test_create_user_with_blank_username(self):
        print("users: Running test_create_user_with_blank_username")
        data = {'username': ''}
        response = self.client.post('/api/users/create-user', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'Bad Request': 'Invalid data...'})

    def test_create_user_without_username(self):
        print("users: Running test_create_user_without_username")
        data = {}
        response = self.client.post('/api/users/create-user', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'Bad Request': 'Invalid data...'})


class CreateUserProjectViewTestCase(TestCase):
    """
        tests for assigning a tagger to a project - create-user-project-mapping
    """

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username='user1')
        self.user2 = User.objects.create(username='user2')
        self.user3 = User.objects.create(username='user3')
        self.project1 = Project.objects.create(
            title='project1', description='Test Project Description')
        self.project2 = Project.objects.create(
            title='project2', description='Test Project Description')

    def tearDown(self):
        self.user1.delete()
        self.user2.delete()
        self.project1.delete()
        self.project2.delete()

    def test_create_user_project_success(self):
        print("users: Running test_create_user_project_success")
        data = {'user': ["user1"], 'project': self.project1.project_id}
        response = self.client.post(
            '/api/users/create-user-project-mapping', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UsersInProject.objects.count(), 1)
        self.assertEqual(UsersInProject.objects.get().user.username, 'user1')
        self.assertEqual(
            UsersInProject.objects.get().project.title, 'project1')

    def test_project_with_many_users(self):
        print("users: Running test_project_with_many_users")
        data = {'user': ['user2', "user3"],
                'project': self.project1.project_id}
        response = self.client.post(
            '/api/users/create-user-project-mapping', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UsersInProject.objects.count(), 2)
        self.assertTrue(UsersInProject.objects.filter(
            user__username='user2', project=self.project1).exists())
        self.assertTrue(UsersInProject.objects.filter(
            user__username='user3', project=self.project1).exists())

    def test_user_with_many_projects(self):
        print("users: Running test_user_with_many_projects")
        data_first_insertion = {
            'user': ['user1'], 'project': self.project1.project_id}
        response_first_insertion = self.client.post(
            '/api/users/create-user-project-mapping', data_first_insertion, format='json')
        data_second_insertion = {
            'user': ['user1'], 'project': self.project2.project_id}
        response_second_insertion = self.client.post(
            '/api/users/create-user-project-mapping', data_second_insertion, format='json')
        self.assertEqual(response_first_insertion.status_code,
                         status.HTTP_201_CREATED)
        self.assertEqual(response_second_insertion.status_code,
                         status.HTTP_201_CREATED)
        self.assertEqual(UsersInProject.objects.count(), 2)
        self.assertTrue(UsersInProject.objects.filter(
            user__username='user1', project=self.project1).exists())
        self.assertTrue(UsersInProject.objects.filter(
            user__username='user1', project=self.project2).exists())

    def test_no_taggers_assigned(self):
        print("users: Running test_no_taggers_assigned")
        data = {'user': [''], 'project': self.project2.project_id}
        response = self.client.post(
            '/api/users/create-user-project-mapping', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UsersInProject.objects.count(), 0)

    def test_no_project_assigned(self):
        print("users: Running test_no_project_assigned")
        data = {'user': ['user1'], 'project': ""}
        response = self.client.post(
            '/api/users/create-user-project-mapping', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UsersInProject.objects.count(), 0)

    def test_invalid_user_assigned(self):
        print("users: Running test_invalid_user_assigned")
        data = {'user': ['invaliduser'], 'project': self.project2.project_id}
        response = self.client.post(
            '/api/users/create-user-project-mapping', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UsersInProject.objects.count(), 0)

    def test_invalid_project_assigned(self):
        print("users: Running test_invalid_project_assigned")
        data = {'user': ['user1'], 'project': "invalidproject"}
        response = self.client.post(
            '/api/users/create-user-project-mapping', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(UsersInProject.objects.count(), 0)


class GetProjectsByUsernameTestCase(TestCase):
    """
        tests for getting project of tagger, used in my projects page - projects-by-username/
    """

    def setUp(self):
        self.user1 = User.objects.create(username='user1')
        self.user2 = User.objects.create(username='user2')
        self.project1 = Project.objects.create(
            title='project1', description='Test Project Description')
        self.project2 = Project.objects.create(
            title='project2', description='Test Project Description')
        self.user_in_project1 = UsersInProject.objects.create(
            user=self.user1, project=self.project1)
        self.user_in_project2 = UsersInProject.objects.create(
            user=self.user2, project=self.project1)
        self.user_in_project3 = UsersInProject.objects.create(
            user=self.user1, project=self.project2)

    def tearDown(self):
        self.user1.delete()
        self.user2.delete()
        self.project1.delete()
        self.project2.delete()
        self.user_in_project1.delete()
        self.user_in_project2.delete()
        self.user_in_project3.delete()

    def test_get_projects_by_username_success(self):
        print("users: Running test_get_projects_by_username_success")
        response = self.client.get(
            '/api/users/projects-by-username/?user=user1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        usernames = []
        for user in response_data:
            user_dict = dict(user)
            usernames.append(user_dict['user'].split(' ')[-1].strip('()'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.user_in_project1.user.username, usernames)
        self.assertIn(self.user_in_project3.user.username, usernames)
        self.assertNotIn(self.user_in_project2.user.username, usernames)

    def test_user_with_no_projects(self):
        print("users: Running test_user_with_no_projects")
        response = self.client.get(
            '/api/users/projects-by-username/?user=fakeuser')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # returns empty dictionary
        self.assertEqual(response.data, {"No projects found"})

    def test_get_projects_by_user_invalid_request(self):
        print("users: Running test_get_users_by_invalid_request")
        response = self.client.get('/api/users/projects-by-username/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class GetIsUserAssignedToProjectTesTCase(TestCase):
    """
        tests for checking if a user is assigned to a project - is-assigned
    """

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username='user1')
        self.user2 = User.objects.create(username='user2')
        self.project = Project.objects.create(
            title='project', description='Test Project Description')
        self.user_in_project = UsersInProject.objects.create(
            user=self.user1, project=self.project)

    def tearDown(self):
        self.user1.delete()
        self.user2.delete()
        self.project.delete()

    def test_user_is_assigned(self):
        print("users: Running test_user_is_assigned")
        response = self.client.get(
            '/api/users/is-assigned?username=user1&project_id='+self.project.project_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Assigned"], True)

    def test_user_is_not_assigned(self):
        print("users: Running test_user_is_not_assigned")
        response = self.client.get(
            '/api/users/is-assigned?username=user2&project_id='+self.project.project_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["Assigned"], False)

    def test_user_project_doesnt_exist(self):
        print("users: Running test_user_assigned")
        response = self.client.get(
            '/api/users/is-assigned?username=user1&project_id=ABC')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class GetUsersByProject(TestCase):
    """
        tests for getting all users for a given project

    """
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create(username='user1')
        self.user2 = User.objects.create(username='user2')
        self.project = Project.objects.create(title='project', description='Test Project Description')
        self.project2 = Project.objects.create(title='project2', description='Test Project Description')
        self.user_in_project = UsersInProject.objects.create(
            user=self.user1, project=self.project)
        self.user_in_project = UsersInProject.objects.create(
            user=self.user2, project=self.project)
        
    def tearDown(self):
        self.user1.delete()
        self.user2.delete()
        self.project.delete()
        self.project2.delete()

    def test_users_by_project(self):
        print("users: Running test_users_by_project")
        response = self.client.get('/api/users/users-by-project/?project='+self.project.project_id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_by_project_no_users(self):
        print("users: Running test_users_by_project_no_users")
        response = self.client.get('/api/users/users-by-project/?project='+self.project2.project_id)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_users_by_project_bad_request(self):
        print("users: Running test_users_by_project_bad_request")
        response = self.client.get('/api/users/users-by-project/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

