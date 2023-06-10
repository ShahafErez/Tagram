import random
import string

from django.db import models


def generate_unique_code_meta_tagging():
    length = 6

    while True:
        id = ''.join(random.choices(string.ascii_uppercase, k=length))
        # checking if other project has his id
        if MetaTagging.objects.filter(meta_tagging_id=id).count() == 0:
            break
    return id


class MetaTagging(models.Model):
    meta_tagging_id = models.CharField(max_length=8, default=generate_unique_code_meta_tagging,
                                       unique=True, primary_key=True)
    title = models.CharField(max_length=500)
    username = models.CharField(max_length=500)


def generate_unique_code_label():
    length = 6

    while True:
        id = ''.join(random.choices(string.ascii_uppercase, k=length))
        if MetaTaggingLabels.objects.filter(label_id=id).count() == 0:
            break
    return id


class MetaTaggingLabels(models.Model):
    meta_tagging = models.ForeignKey(MetaTagging, on_delete=models.CASCADE)
    label_id = models.CharField(
        max_length=8, default=generate_unique_code_label, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10)
    color = models.CharField(max_length=7)
