import random
import string
from django.db import models
from api.project.models import Project

def generate_unique_code():  
    length = 6

    while True:
        id = ''.join(random.choices(string.ascii_uppercase, k=length))
        # checking if other project has his id
        if UsersInProject.objects.filter(project_id=id).count() == 0:
            break
    return id


class User(models.Model):
    username = models.CharField(max_length=500, unique=True, primary_key=True)
    is_project_manager = models.BooleanField(default=False)


class UsersInProject(models.Model):
    mapping_id = models.CharField(max_length=8, default=generate_unique_code, unique=True, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    project_manager = models.CharField(max_length=20, default='')