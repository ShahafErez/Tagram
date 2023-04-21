from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.views import status

class GetConnextra(TestCase):
    """
        tests for getting Connextra
    """
    def setUp(self):
        self.client = APIClient()

    def test_get_connextra(self):
        print("GetConnextra: Running test_get_connextra")
        data = {
        "text":
        ["As a RuleAuthor, I want to have the pattesrns and syntax checked, So that my business rules comply with the standards.\n",
                "As a RuleAuthor, I want to have the semantics to be checked, So that I don't look like a fool."]
        }
        response = self.client.post('/api/correctness/connextra', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['1']['Defect kind'], 'atomic')

    def test_get_connextra_empty_text(self):
        print("GetConnextra: Running test_get_connextra_empty_text")
        data = {
        "text": [""]
        }
        response = self.client.post('/api/correctness/connextra', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)