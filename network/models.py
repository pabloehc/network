from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('User', blank=True, related_name='followers')

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    timestamp = models.DateField(auto_now=True)
    content = models.TextField()
    liked_by = models.ManyToManyField(User, blank=True, related_name='liked_posts')

    def serialize(self):
        return {
            "user": self.user,
            "content": self.content,
            "timestamp": self.time.strftime("%b %-d %Y, %-I:%M %p"),
            "likes": self.liked_by.all().count()
        }
