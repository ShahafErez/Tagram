from django.db import models
from api.meta_tagging.models import MetaTagging
import string
import random


def generate_project_unique_code():
    length = 6

    while True:
        id = ''.join(random.choices(string.ascii_uppercase, k=length))
        # checking if other project has his id
        if Project.objects.filter(project_id=id).count() == 0:
            break
    return id


class Project(models.Model):
    project_id = models.CharField(
        max_length=8, default=generate_project_unique_code, unique=True, primary_key=True)
    title = models.CharField(max_length=500)
    description = models.CharField(max_length=5000, blank=True, default='')
    meta_tagging = models.ForeignKey(
        MetaTagging, on_delete=models.SET_NULL, null=True)
    project_manager = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


def generate_file_unique_code():
    length = 6
    while True:
        id = ''.join(random.choices(string.ascii_uppercase, k=length))
        # checking if other file has his id
        if File.objects.filter(file_id=id).count() == 0:
            break
    return id


class File(models.Model):
    file_id = models.CharField(
        max_length=8, default=generate_file_unique_code, unique=True, primary_key=True)
    file = models.FileField(upload_to='./uploads')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


def generate_annotation_unique_code():
    length = 6

    while True:
        id = ''.join(random.choices(string.ascii_uppercase, k=length))
        # checking if other annotation has his id
        if Annotation.objects.filter(annotation_id=id).count() == 0:
            break
    return id


class Annotation(models.Model):
    annotation_id = models.CharField(
        max_length=10, default=generate_annotation_unique_code, unique=True, primary_key=True)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE)
    tags = models.CharField(max_length=4096, null=True)
    relations = models.CharField(max_length=4096, null=True)
    co_occcurrence = models.CharField(max_length=4096, null=True)
    tagger = models.CharField(max_length=20, null=False)
    # optional statuses: not_submitted, submitted, changes_requested
    annotation_status = models.CharField(
        max_length=20, default="not_submitted")
    
def generate_usermodel_unique_code():
    length = 6

    while True:
        id = ''.join(random.choices(string.ascii_uppercase, k=length))
        # checking if other annotation has his id
        if UserModel.objects.filter(model_id=id).count() == 0:
            break
    return id
class UserModel(models.Model):
    model_id = models.CharField(
    max_length=8, default=generate_usermodel_unique_code, unique=True, primary_key=True)
    user_model = models.FileField(upload_to='./user_models',unique=True)
    user_model_name = models.CharField(max_length=30, null=False)


