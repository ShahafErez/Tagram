from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('project_id', 'title', 'project_manager', 'created_at')


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('title',)


class EditProjectSerializer(serializers.ModelSerializer):
    project_id = serializers.CharField(validators=[])
    class Meta:
        model = Project
        fields = ('title', 'project_id')