from rest_framework import serializers
from .models import Project, File


class ProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, default='')
    class Meta:
        model = Project
        fields = ('project_id', 'title', 'description', 'project_manager', 'created_at')


class CreateProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, default='')
    class Meta:
        model = Project
        fields = ('title', 'description',)


class EditProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, default='')
    project_id = serializers.CharField(validators=[])
    class Meta:
        model = Project
        fields = ('title', 'description', 'project_id')

