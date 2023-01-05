from django.db import models

class User(models.Model):
    username = models.CharField(max_length=500)
    is_project_manager = models.BooleanField(default=False)