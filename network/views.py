from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Post


def index(request):
    return render(request, "network/index.html", {
        "filter": "all"
    })

@csrf_exempt
def user_page(request, username):
    user = User.objects.get(username=username)
    followers = user.followers.count()
    following = user.following.count()

    if request.method == "PUT":
        data = json.loads(request.body)
        currentUser = request.user

        if data["follow"] == 'true':
            currentUser.following.add(user)
            currentUser.save()
        
        elif data["follow"] == 'false':
            currentUser.following.remove(user)
            currentUser.save()
        
        return render(request, "network/index.html", {
        "filter": "all"
        })
    
    return render(request, "network/user.html", {
        "username": username, 
        "followers": followers,
        "following": following
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def new_post(request):
    if request.method == 'POST':
        user = request.user
        content = request.POST['content']

        p = Post(content=content, user = user)
        p.save()

    return HttpResponseRedirect(reverse("index"))

def posts(request, filter):
    if filter == 'all':
        try:
            posts = Post.objects.all()
        
        except Post.DoesNotExist:
            return JsonResponse({"error": "Posts not found."}, status=404)
        
    else:
        try:
            user = User.objects.get(username=filter)
            posts = Post.objects.filter(user=user)
        
        except Post.DoesNotExist:
            return JsonResponse({"error": "Posts not found."}, status=404)

    posts = posts.order_by("-timestamp").all()

    return JsonResponse([post.serialize() for post in posts], safe=False)
