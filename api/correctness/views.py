from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .aqusa.aqusacore import getConnextra
from .swagger_api import *
import json
from drf_yasg.utils import swagger_auto_schema


class GetConnextra(APIView):
    @swagger_auto_schema(**get_connextra())
    def post(self, request, format=None):
        text = json.loads(request.body.decode('utf-8')).get("text")
        output = getConnextra(text)
        return Response(output, status=status.HTTP_200_OK)
