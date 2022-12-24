from rest_framework import serializers
from .models import Project, File
from django import forms


class ProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, default='')

    class Meta:
        model = Project
        fields = ('project_id', 'title', 'description',
                  'meta_tagging', 'project_manager', 'created_at')


class CreateProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, default='')

    class Meta:
        model = Project
        fields = ('title', 'description', 'meta_tagging')


# class EditProjectSerializer(serializers.ModelSerializer):
#     description = serializers.CharField(allow_blank=True, default='')
#     project_id = serializers.CharField(validators=[])
#     class Meta:
#         model = Project
#         fields = ('title', 'description', 'project_id')

class FileSerializer(serializers.ModelSerializer):
    file = forms.FileField()
    # project_id = serializers.CharField()

    class Meta:
        model = File
        fields = ['file_id','file', 'project']
