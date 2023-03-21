from rest_framework import serializers
from .models import Project, User, UsersInProject
from django import forms


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(allow_blank=False)

    class Meta:
        model = User
        fields = ('username', 'is_project_manager')


class CreateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(allow_blank=False)

    class Meta:
        model = User
        fields = ('username',)


class UsersInProjectSerializer(serializers.ModelSerializer):
    user = serializers.CharField(allow_blank=False)
    project = serializers.CharField(allow_blank=False)

    class Meta:
        model = UsersInProject
        fields = ('mapping_id','user','project')


class CreateUsersInProjectSerializer(serializers.ModelSerializer):
    user = serializers.ListField(child=serializers.CharField(allow_blank=False))
    project = serializers.CharField(allow_blank=False)

    class Meta:
        model = UsersInProject
        fields = ('user','project')
