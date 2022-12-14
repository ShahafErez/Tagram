from django.db import models
import string
import random


def generate_unique_code():
    length = 6

    while True:
        id= ''.join(random.choices(string.ascii_uppercase, k=length))
        # checking if other project has his id
        if Project.objects.filter(project_id=id).count() == 0:
            break
    return id

class Project(models.Model):
    project_id = models.CharField(max_length=8, default=generate_unique_code, unique=True, primary_key=True)
    title = models.CharField(max_length=500)
    description = models.CharField(max_length=5000, blank=True, default='')
    project_manager = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class File(models.Model):
    file = models.FileField( upload_to='./uploads')
    project_id = models.CharField(max_length=8, primary_key=True)