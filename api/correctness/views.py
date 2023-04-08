from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from api.correctness.aqusa.aqusacore import getConnextra


class GetConnextra(APIView):
    def get(self, request, format=None):
        file_name = request.GET.get("file_name")
        # the folder all input files will be located at
        input_folder_path = "api/correctness/aqusa/input/"
        output = getConnextra(input_folder_path + file_name)
        return Response(output, status=status.HTTP_200_OK)
