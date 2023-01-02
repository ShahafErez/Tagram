from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.

class GetSessionDetails(APIView):
    """
        Get project details by a given path param
    """


    def get(self, request, format=None):
        if 'username' in request.session:
            username = request.session['username']
            return Response(username, status=status.HTTP_200_OK)
