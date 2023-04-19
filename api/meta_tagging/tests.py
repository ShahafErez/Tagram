from django.test import TestCase
from api.project.models import MetaTagging
from rest_framework.test import APIClient
from api.users.models import User
from rest_framework.views import status

class CreateMetaTaggingTestCase(TestCase):
    """
        tests for creating new meta tagging 
    """
    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()

    def tearDown(self):
        self.metaTagging.delete()

    def test_create_meta_tagging(self):
        print("MetaTagging_CreateMetaTaggingTestCase: Running test_create_meta_tagging")
        data = {'title': 'metaTagging2'}
        response = self.client.post('/api/meta-tagging/create', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MetaTagging.objects.count(), 2)
        MetaTagging.objects.get(title='metaTagging2').delete()

    def test_create_meta_tagging_invalid_param(self):
        print("MetaTagging_CreateMetaTaggingTestCase: Running test_create_meta_tagging_invalid_param")
        data = {'invalid': 'metaTagging2'}
        response = self.client.post('/api/meta-tagging/create', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(MetaTagging.objects.count(), 1)

    def test_create_meta_tagging_no_title(self):
        print("MetaTagging_CreateMetaTaggingTestCase: Running test_create_meta_tagging_no_title")
        data = {'title': ''}
        response = self.client.post('/api/meta-tagging/create', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(MetaTagging.objects.count(), 1)

class CreateMetaTaggingLabelView(TestCase):
    """
        tests for creating new labels in meta-tagging
    """
    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()

    def tearDown(self):
        self.metaTagging.delete()

    def test_create_label_invalid_id(self):
        print("CreateMetaTaggingLabelView: Running test_create_label")
        session = self.client.session
        session.save()
        data = {
            'meta_tagging': 1234,
            'labels': [
                {'name': 'label1', 'type': 'relation', 'color': 'color1'},
                {'name': 'label2', 'type': 'class', 'color': 'color2'},
            ],
        }
        response = self.client.post('/api/meta-tagging/create-labels', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_label(self):
        print("CreateMetaTaggingLabelView: Running test_create_label")
        session = self.client.session
        session.save()
        data = {
            'meta_tagging': self.metaTagging.meta_tagging_id,
            'labels': [
                {'name': 'label1', 'type': 'relation', 'color': 'color1'},
                {'name': 'label2', 'type': 'class', 'color': 'color2'},
            ],
        }
        response = self.client.post('/api/meta-tagging/create-labels', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invalid_meta_tagging_id(self):
        print("CreateMetaTaggingLabelView: Running test_invalid_meta_tagging_id")
        session = self.client.session
        session.save()
        data = {
            'meta_tagging': 'invalid_id',
            'labels': [
                {'name': 'label1', 'type': 'type1', 'color': 'color1'},
                {'name': 'label2', 'type': 'type2', 'color': 'color2'},
            ],
        }
        response = self.client.post('/api/meta-tagging/create-labels', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_meta_tagging_no_labels(self):
        print("CreateMetaTaggingLabelView: Running test_meta_tagging_no_labels")
        session = self.client.session
        session.save()
        data = {
            'meta_tagging': self.metaTagging.meta_tagging_id,
            'labels': [],
        }
        response = self.client.post('/api/meta-tagging/create-labels', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class GetLabelsByMetaTaggingId(TestCase):
    """
        Get all labels for a given meta tagging id
    """
    def setUp(self):
        self.client = APIClient()
        self.metaTagging = MetaTagging.objects.create(title='metaTagging1')
        self.metaTagging.save()
        session = self.client.session
        session.save()
        data = {
            'meta_tagging': 'invalid_id',
            'labels': [
                {'name': 'aggregation', 'type': 'relation', 'color': 'color1'},
                {'name': 'attribute', 'type': 'class', 'color': 'color2'},
            ],
        }
        self.client.post('/api/meta-tagging/create-labels', data, format='json')

    def tearDown(self):
        self.metaTagging.delete()        

    def test_get_labels_by_meta_tagging_id(self):
        print("GetLabelsByMetaTaggingId: Running test_get_labels_by_meta_tagging_id")
        print(f'/api/meta-tagging/labels-by-id?meta-tagging-id={self.metaTagging.meta_tagging_id}')
        response = self.client.get(f'/api/meta-tagging/labels-by-id?meta-tagging-id={self.metaTagging.meta_tagging_id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # parse the response and extract the labels
        print(response.content)

        # define the expected labels
        #expected_labels = [
        #{'name': 'aggregation', 'type': 'relation', 'color': 'color1'},
        #{'name': 'attribute', 'type': 'class', 'color': 'color2'},
        #]

        # check that the labels in the response match the expected labels
        #self.assertListEqual(labels, expected_labels)

    def test_get_labels_by_meta_tagging_id_invalid_id(self):
        print("GetLabelsByMetaTaggingId: Running test_get_labels_by_meta_tagging_id_invalid_id")
        response = self.client.get(f"/api/users/projects-by-username/get?id=invalid")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

