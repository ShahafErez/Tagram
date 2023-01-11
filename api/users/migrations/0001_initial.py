# Generated by Django 4.1.5 on 2023-01-05 18:57

import api.users.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('project', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('username', models.CharField(max_length=500, primary_key=True, serialize=False, unique=True)),
                ('is_project_manager', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UsersInProject',
            fields=[
                ('mapping_id', models.CharField(default=api.users.models.generate_unique_code, max_length=8, primary_key=True, serialize=False, unique=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project.project')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
            ],
        ),
    ]