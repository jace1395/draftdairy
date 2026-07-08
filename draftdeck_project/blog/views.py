from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Post

def home(request):
    context = {
        'posts': Post.objects.all().order_by('-date_posted')
    }
    return render(request, 'blog/home.html', context)

def about(request):
    return render(request, 'blog/about.html', {'title': 'About'})

@login_required
def create_post(request):
    if request.method == 'POST':
        post_title = request.POST.get('title')
        post_content = request.POST.get('content')
        Post.objects.create(
            title=post_title,
            content=post_content,
            author=request.user
        )
        messages.success(request, 'Your post has been published!')
        return redirect('blog-home')
    return redirect('blog-home')