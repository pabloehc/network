from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    posts = models.ManyToManyField('Post', blank=True, related_name='user')
    following = models.ManyToManyField(User, blank=True, related_name='followers')

class Post(models.Model):
    time = models.DateField(auto_now=True)
    content = models.TextField()
    liked_by = models.ManyToManyField(User, blank=True, related_name='liked_posts')