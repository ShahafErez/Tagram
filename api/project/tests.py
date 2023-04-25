from django.test import TestCase
from api.project.models import Annotation, MetaTagging
from api.project.models import Project
from api.project.models import File
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
        print("project: Running test_create_project")
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
        print("project: Running test_create_project_no_title")
        data = {'title':'', 'description':'test_description', 'meta_tagging':self.metaTagging.meta_tagging_id, 'project_manager':self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Project.objects.count(), 0)

    def test_create_project_no_description(self):
        print("project: Running test_create_project_no_description")
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
        print("project: Running test_create_project_invalid_data")
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
        self.manager3 = User.objects.create(username='manager3', is_project_manager=True)
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
        print("project: Running test_get_project_by_id")
        response = self.client.get(f'/api/project/get?project_id={self.project1.project_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['project_id'], self.project1.project_id)

    def test_get_project_invalid_id(self):
        print("project: Running test_get_project_invalid_id")
        response = self.client.get(f'/api/project/get?project_id=123')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_project_invalid_request(self):
        print("project: Running test_get_project_invalid_request")
        response = self.client.get(f'/api/project/get?project')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_project_by_manager(self):
        print("project: Running test_get_project_by_manager")
        response1 = self.client.get(f'/api/project/get-by-project-manager?manager={self.manager1.username}')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response1.data[0]['project_id'], self.project1.project_id)
        response2 = self.client.get(f'/api/project/get-by-project-manager?manager={self.manager2.username}')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response2.data), 2)

    def test_no_projects(self):
        print("project: Running test_no_projects")
        response = self.client.get(f'/api/project/get-by-project-manager?manager={self.manager3.username}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_project_invalid_manager(self):
        print("project: Running test_get_project_invalid_manager")
        response = self.client.get(f'/api/project/get-by-project-manager?manager=invaid')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_project_by_manager_invalid_request(self):
        print("project: Running test_get_project_by_manager_invalid_request")
        response = self.client.get(f'/api/project/get-by-project-manager')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class file(TestCase):#TODO: fix
    """
        tests for getting file, uploading file or getting file contend
    """
    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()
        session = self.client.session
        session.save()
        self.manager1 = User.objects.create(username='manager1', is_project_manager=True)
        self.project = Project.objects.create(title='project_title', description='project_description', meta_tagging=self.metaTagging, project_manager=self.manager1.username)

    def tearDown(self):
        self.metaTagging.delete()
        self.manager1.delete()
        self.project.delete()

    def test_upload_file(self): 
        print("project: Running test_upload_file")


class saveAnnotation(TestCase):
    """
        tests for saving annotation
    """   
    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()
        session = self.client.session
        session.save()
        self.manager = User.objects.create(username='manager1', is_project_manager=True)        
        self.user = User.objects.create(username='user1')
        self.project = Project.objects.create(title='project_title', description='project_description', meta_tagging=self.metaTagging, project_manager=self.manager.username)
   
    def tearDown(self):
        self.metaTagging.delete()
        self.user.delete()
        self.manager.delete()
        self.project.delete()

    def test_save_annotation_success(self):
        print("project: Running test_save_annotation_success")
        data = {
            'project_id': self.project.project_id,
            'tagger': self.user.username,
            'tags': [{'id': 1, 'text': 'Tag1'}, {'id': 2, 'text': 'Tag2'}],
            'relations': [{'type': 'relation1', 'from': 1, 'to': 2}],
            'co_occcurrence': []
        }
        response = self.client.post('/api/project/save-annotation', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.filter(project=self.project, tagger=self.user.username).count(), 1)

    def test_save_annotation_project_not_found(self):
        print("project: Running test_save_annotation_project_not_found")
        data = {
            'project_id': 'invalid',
            'tagger': self.user.username,
            'tags': [{'id': 1, 'text': 'Tag1'}, {'id': 2, 'text': 'Tag2'}],
            'relations': [{'type': 'relation1', 'from': 1, 'to': 2}],
            'co_occcurrence': []
        }
        response = self.client.post('/api/project/save-annotation', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_save_annotation_project_bad_request(self):
        print("project: Running test_save_annotation_project_bad_request")
        data = {
            'project_id': None,
            'tagger': self.user.username,
            'tags': [{'id': 1, 'text': 'Tag1'}, {'id': 2, 'text': 'Tag2'}],
            'relations': [{'type': 'relation1', 'from': 1, 'to': 2}],
            'co_occcurrence': []
        }
        response = self.client.post('/api/project/save-annotation', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    


