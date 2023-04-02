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
    project_title = serializers.SerializerMethodField()
    project_description = serializers.SerializerMethodField()
    project_created_at = serializers.SerializerMethodField()

    class Meta:
        model = UsersInProject
        fields = ('mapping_id', 'user', 'project', 'project_title',
                  'project_description', 'project_created_at')

    def get_project_title(self, obj):
        project = obj.project
        if project:
            return project.title
        else:
            return None

    def get_project_description(self, obj):
        project = obj.project
        if project:
            return project.description
        else:
            return None

    def get_project_created_at(self, obj):
        project = obj.project
        if project:
            return project.created_at
        else:
            return None


class CreateUsersInProjectSerializer(serializers.ModelSerializer):
    user = serializers.ListField(
        child=serializers.CharField(allow_blank=False))
    project = serializers.CharField(allow_blank=False)

    class Meta:
        model = UsersInProject
        fields = ('user', 'project')
