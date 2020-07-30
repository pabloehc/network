
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new-post", views.new_post, name="new_post"),
    path("following", views.following, name="following"),
    path("user/<str:username>", views.user_page, name="user_page"),
    path("<str:filter>", views.posts, name="posts"), 
]
