import os

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.views import status

from api.project.models import Annotation, File, MetaTagging, Project
from api.users.models import User, UsersInProject


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
        self.manager = User.objects.create(
            username='manager', is_project_manager=True)

    def tearDown(self):
        self.metaTagging.delete()
        self.user.delete()
        self.manager.delete()

    def test_create_project(self):
        print("project: Running test_create_project")
        data = {'title': 'test_project', 'description': 'test_description',
                'meta_tagging': self.metaTagging.meta_tagging_id, 'project_manager': self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.get().project_manager,
                         self.manager.username)
        self.assertEqual(Project.objects.get(
        ).meta_tagging.meta_tagging_id, self.metaTagging.meta_tagging_id)
        self.assertEqual(Project.objects.get().title, 'test_project')
        self.assertEqual(Project.objects.get().description, 'test_description')
        self.assertEqual(Project.objects.count(), 1)
        Project.objects.get(title='test_project').delete()

    def test_create_project_no_title(self):
        print("project: Running test_create_project_no_title")
        data = {'title': '', 'description': 'test_description',
                'meta_tagging': self.metaTagging.meta_tagging_id, 'project_manager': self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Project.objects.count(), 0)

    def test_create_project_no_description(self):
        print("project: Running test_create_project_no_description")
        data = {'title': 'test_project', 'description': '',
                'meta_tagging': self.metaTagging.meta_tagging_id, 'project_manager': self.manager.username}
        response = self.client.post('/api/project/create', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.get().project_manager,
                         self.manager.username)
        self.assertEqual(Project.objects.get(
        ).meta_tagging.meta_tagging_id, self.metaTagging.meta_tagging_id)
        self.assertEqual(Project.objects.get().title, 'test_project')
        self.assertEqual(Project.objects.get().description, '')
        self.assertEqual(Project.objects.count(), 1)
        Project.objects.get(title='test_project').delete()

    def test_create_project_invalid_data(self):
        print("project: Running test_create_project_invalid_data")
        data = {'title': '', 'description': 'test_description',
                'project_manager': self.manager.username}
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
        self.manager1 = User.objects.create(
            username='manager1', is_project_manager=True)
        self.manager2 = User.objects.create(
            username='manager2', is_project_manager=True)
        self.manager3 = User.objects.create(
            username='manager3', is_project_manager=True)
        self.project1 = Project.objects.create(title='project_title1', description='project_description',
                                               meta_tagging=self.metaTagging, project_manager=self.manager1.username)
        self.project2 = Project.objects.create(title='project_title2', description='project_description',
                                               meta_tagging=self.metaTagging, project_manager=self.manager2.username)
        self.project3 = Project.objects.create(title='project_title2', description='project_description',
                                               meta_tagging=self.metaTagging, project_manager=self.manager2.username)

    def tearDown(self):
        self.metaTagging.delete()
        self.manager1.delete()
        self.manager2.delete()
        self.project1.delete()
        self.project2.delete()
        self.project3.delete()

    def test_get_project_by_id(self):
        print("project: Running test_get_project_by_id")
        response = self.client.get(
            f'/api/project/get?project_id={self.project1.project_id}')
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
        response1 = self.client.get(
            f'/api/project/get-by-project-manager?manager={self.manager1.username}')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response1.data[0]['project_id'], self.project1.project_id)
        response2 = self.client.get(
            f'/api/project/get-by-project-manager?manager={self.manager2.username}')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response2.data), 2)

    def test_no_projects(self):
        print("project: Running test_no_projects")
        response = self.client.get(
            f'/api/project/get-by-project-manager?manager={self.manager3.username}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_project_invalid_manager(self):
        print("project: Running test_get_project_invalid_manager")
        response = self.client.get(
            f'/api/project/get-by-project-manager?manager=invaid')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_project_by_manager_invalid_request(self):
        print("project: Running test_get_project_by_manager_invalid_request")
        response = self.client.get(f'/api/project/get-by-project-manager')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class file(TestCase):
    """
        tests for getting file, uploading file or getting file content
    """
    current_dir = os.getcwd()
    relative_path = 'api/project'
    relative_full_path = os.path.join(current_dir, relative_path)
    os.chdir(relative_full_path)

    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()
        session = self.client.session
        session.save()
        self.manager1 = User.objects.create(
            username='manager1', is_project_manager=True)
        self.project = Project.objects.create(title='project_title', description='project_description',
                                              meta_tagging=self.metaTagging, project_manager=self.manager1.username)
        self.file = open(r'test.txt', 'r')
        self.file_data = {
            'project_id': self.project.project_id,
            'myFile': self.file
        }

    def tearDown(self):
        self.metaTagging.delete()
        self.manager1.delete()
        self.project.delete()

    def test_upload_file(self):
        print("project: Running test_upload_file")
        response = self.client.post(
            '/api/project/uploadfile', self.file_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(File.objects.count(), 1)
        self.file.close()

    def test_upload_file_no_project(self):
        print("project: Running test_upload_file_no_project")
        self.file_data = {
            'project_id': 'invalid',
            'myFile': self.file
        }
        response = self.client.post(
            '/api/project/uploadfile', self.file_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_file(self):
        print("project: Running test_get_file")
        self.client.post('/api/project/uploadfile',
                         self.file_data, format='multipart')
        response = self.client.get(
            f'/api/project/get-file?project_id={self.project.project_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_file_invalid_project_id(self):
        print("project: Running test_get_file_invalid_project_id")
        self.client.post('/api/project/uploadfile',
                         self.file_data, format='multipart')
        response = self.client.get(f'/api/project/get-file?project_id=invalid')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_file_content(self):
        print("project: Running test_get_file_content")
        response = self.client.post(
            f'/api/project/get-file-content', self.file_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


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
        self.manager = User.objects.create(
            username='manager1', is_project_manager=True)
        self.user = User.objects.create(username='user1')
        self.project = Project.objects.create(title='project_title', description='project_description',
                                              meta_tagging=self.metaTagging, project_manager=self.manager.username)
        self.user_in_project = UsersInProject.objects.create(
            user=self.user, project=self.project)

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
        response = self.client.post(
            '/api/project/save-annotation', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.filter(
            project=self.project, tagger=self.user.username).count(), 1)

    def test_save_annotation_project_not_found(self):
        print("project: Running test_save_annotation_project_not_found")
        data = {
            'project_id': 'invalid',
            'tagger': self.user.username,
            'tags': [{'id': 1, 'text': 'Tag1'}, {'id': 2, 'text': 'Tag2'}],
            'relations': [{'type': 'relation1', 'from': 1, 'to': 2}],
            'co_occcurrence': []
        }
        response = self.client.post(
            '/api/project/save-annotation', data, format='json')
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
        response = self.client.post(
            '/api/project/save-annotation', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class getAnnotation(TestCase):
    """
        tests for getting annotation of tagger in a project and getting status
    """

    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()
        session = self.client.session
        session.save()
        self.manager = User.objects.create(
            username='manager1', is_project_manager=True)
        self.user = User.objects.create(username='user1')
        self.project = Project.objects.create(title='project_title', description='project_description',
                                              meta_tagging=self.metaTagging, project_manager=self.manager.username)
        self.user_in_project = UsersInProject.objects.create(
            user=self.user, project=self.project)
        self.project_no_annotation = Project.objects.create(
            title='project_no_annotation', description='project_description', meta_tagging=self.metaTagging, project_manager=self.manager.username)
        data = {
            'project_id': self.project.project_id,
            'tagger': self.user.username,
            'tags': [{'id': 1, 'text': 'Tag1'}, {'id': 2, 'text': 'Tag2'}],
            'relations': [{'type': 'relation1', 'from': 1, 'to': 2}],
            'co_occcurrence': []
        }
        self.client.post('/api/project/save-annotation', data, format='json')

    def tearDown(self):
        self.metaTagging.delete()
        self.user.delete()
        self.manager.delete()
        self.project.delete()
        self.project_no_annotation.delete()

    def test_get_annotation(self):
        print("project: Running test_get_annotation")
        response = self.client.get(
            f'/api/project/get-annotation-of-tagger?project_id={self.project.project_id}&tagger={self.user.username}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tagger'], self.user.username)
        self.assertEqual(response.data['project_id'], self.project.project_id)

    def test_get_annotation_invalid_project_id(self):
        print("project: Running test_get_annotation_invalid_project_id")
        response = self.client.get(
            f'/api/project/get-annotation-of-tagger?project_id=invalid&tagger={self.user.username}')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_annotation_bad_request(self):
        print("project: Running test_get_annotation_bad_request")
        response = self.client.get(
            f'/api/project/get-annotation-of-tagger?tagger={self.user.username}')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # getting annotators status

    def test_get_default_annotation_status(self):
        print("project: Running test_get_default_annotation_status")
        response = self.client.get(
            f'/api/project/get-annotators-status?project_id={self.project.project_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['annotators']
                         [0]['annotation_status'], 'not_submitted')

    def test_get_status_no_annotation(self):
        print("project: Running test_get_status_no_annotation")
        response = self.client.get(
            f'/api/project/get-annotators-status?project_id={self.project_no_annotation.project_id}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_status_bad_request(self):
        print("project: Running test_get_status_bad_request")
        response = self.client.get(
            f'/api/project/get-annotators-status?project_id')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # updating annotators status

    def test_update_annotators_status(self):
        print("project: Running test_update_annotators_status")
        data = {'annotation_status': 'changes_requested'}
        response = self.client.put(
            f'/api/project/edit-annotation-status?project_id={self.project.project_id}&tagger={self.user.username}', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_update_annotators_status_bad_request(self):
        print("project: Running test_update_annotators_status_bad_request")
        data = {'annotation_status': 'changes_requested'}
        response = self.client.put(
            f'/api/project/edit-annotation-status?&tagger={None}', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class algorithm(TestCase):
    """
        algorithm tests 
    """

    def test_send_to_algorithm(self):
        print("project: Running test_send_to_algorithm")
        data = {
            'project_id': 1,
            'tags': ['tag1', 'tag2', 'tag3']
        }
        response = self.client.post(
            '/api/project/send-to-algorithm', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_send_to_algorithm_bad_request(self):
        print("project: Running test_send_to_algorithm_bad_request")
        data = {
            'project_id': '',
            'tags': ['tag1', 'tag2', 'tag3']
        }
        response = self.client.post(
            '/api/project/send-to-algorithm', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
