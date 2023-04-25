from django.test import TestCase
from api.project.models import MetaTagging
from api.project.models import Project
from api.users.models import User
from rest_framework.test import APIClient
from rest_framework.views import status

class CreateProject(TestCase):
    """
        tests for creating new project
    """
    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()
        session = self.client.session
        session.save()
        self.user = User.objects.create(username='user')
        self.manager = User.objects.create(username='manager', is_project_manager=True)

    def tearDown(self):
        self.metaTagging.delete()
        self.user.delete()
        self.manager.delete()
    
    def test_create_project(self):
        print("CreateProject: Running test_create_project")
        data = {'title':'test_project', 'description':'test_description', 'meta_tagging':self.metaTagging.meta_tagging_id, 'project_manager':self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.get().project_manager, self.manager.username)
        self.assertEqual(Project.objects.get().meta_tagging.meta_tagging_id, self.metaTagging.meta_tagging_id)
        self.assertEqual(Project.objects.get().title, 'test_project')
        self.assertEqual(Project.objects.get().description, 'test_description')
        self.assertEqual(Project.objects.count(), 1)
        Project.objects.get(title='test_project').delete()

    def test_create_project_no_title(self):
        print("CreateProject: Running test_create_project_no_title")
        data = {'title':'', 'description':'test_description', 'meta_tagging':self.metaTagging.meta_tagging_id, 'project_manager':self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Project.objects.count(), 0)

    def test_create_project_no_description(self):
        print("CreateProject: Running test_create_project_no_description")
        data = {'title':'test_project', 'description':'', 'meta_tagging':self.metaTagging.meta_tagging_id, 'project_manager':self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.get().project_manager, self.manager.username)
        self.assertEqual(Project.objects.get().meta_tagging.meta_tagging_id, self.metaTagging.meta_tagging_id)
        self.assertEqual(Project.objects.get().title, 'test_project')
        self.assertEqual(Project.objects.get().description, '')
        self.assertEqual(Project.objects.count(), 1)
        Project.objects.get(title='test_project').delete()

    def test_create_project_invalid_data(self):
        print("CreateProject: Running test_create_project_invalid_data")
        data = {'title':'', 'description':'test_description', 'project_manager':self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Project.objects.count(), 0)


class getProject(TestCase):
    """
        tests for getting project by id or by project manager
    """
    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()
        session = self.client.session
        session.save()
        self.manager1 = User.objects.create(username='manager1', is_project_manager=True)
        self.manager2 = User.objects.create(username='manager2', is_project_manager=True)
        self.project1 = Project.objects.create(title='project_title1', description='project_description', meta_tagging=self.metaTagging, project_manager=self.manager1.username)
        self.project2 = Project.objects.create(title='project_title2', description='project_description', meta_tagging=self.metaTagging, project_manager=self.manager2.username)
        self.project3 = Project.objects.create(title='project_title2', description='project_description', meta_tagging=self.metaTagging, project_manager=self.manager2.username)

    def tearDown(self):
        self.metaTagging.delete()
        self.manager1.delete()
        self.manager2.delete()
        self.project1.delete()
        self.project2.delete()
        self.project3.delete()

    def test_get_project_by_id(self):
        print("getProject: Running test_get_project_by_id")
        response = self.client.get(f'/api/project/get?project_id={self.project1.project_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['project_id'], self.project1.project_id)

    def test_get_project_invalid_id(self):
        print("getProject: Running test_get_project_invalid_id")
        response = self.client.get(f'/api/project/get?project_id=123')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_project_invalid_request(self):
        print("getProject: Running test_get_project_invalid_id")
        response = self.client.get(f'/api/project/get?project')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
