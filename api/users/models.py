import random
import string
from django.db import models
from api.project.models import Project
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings



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

    def send_new_user_notification(self):
            subject = 'New User asked to be a project manager on Tagram'
            message = 'A new user has registered on your site and asked to be a project manager. Username: %s, Email: %s' % (self.username, self.email)
            from_email = settings.EMAIL_HOST_USER
            recipient_list = ['shanirah@post.bgu.ac.il']  # Replace with the actual email address of the system manager
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)



class UsersInProject(models.Model):
    mapping_id = models.CharField(
        max_length=8, default=generate_unique_code, unique=True, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    project_manager = models.CharField(max_length=20)
