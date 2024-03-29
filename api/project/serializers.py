from rest_framework import serializers
from .models import Project, File, Annotation, UserModel
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
        fields = ('title', 'description', 'meta_tagging', 'project_manager')


class EditProjectSerializer(serializers.ModelSerializer):
    description = serializers.CharField(allow_blank=True, default='')

    class Meta:
        model = Project
        fields = ('title', 'description')


class FileSerializer(serializers.ModelSerializer):
    file = forms.FileField()

    class Meta:
        model = File
        fields = ('file_id', 'file', 'project')


class SaveAnnotationSerializer(serializers.ModelSerializer):
    project_id = serializers.CharField(allow_blank=False)
    tagger = serializers.CharField(allow_blank=False)

    class Meta:
        model = Annotation
        fields = ('project_id', 'tagger', 'tags',
                  'relations', 'co_occcurrence')


class EditAnnotationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ('annotation_status')


class GetAnnotationSerializer(serializers.ModelSerializer):
    tags = serializers.CharField(allow_blank=True, default='')
    relations = serializers.CharField(allow_blank=True, default='')
    co_occcurrence = serializers.CharField(allow_blank=True, default='')

    class Meta:
        model = Annotation
        fields = ('project_id', 'tagger', 'tags',
                  'relations', 'co_occcurrence', 'annotation_status')


class UserModelSerializer(serializers.ModelSerializer):
    user_model = forms.FileField()
    user_model_name = serializers.CharField(allow_blank=False)

    class Meta:
        model = UserModel
        fields = ('model_id', 'user_model', 'user_model_name')
