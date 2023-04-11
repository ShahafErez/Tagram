from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .aqusa.aqusacore import getConnextra
import json


class GetConnextra(APIView):
    def post(self, request, format=None):
        text = json.loads(request.body.decode('utf-8')).get("text")
        output = getConnextra(text)
        return Response(output, status=status.HTTP_200_OK)
