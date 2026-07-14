from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Post, Profile
from django.shortcuts import get_object_or_404

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
        title = request.POST.get('title')
        content = request.POST.get('content')
        image = request.FILES.get('image') 

        Post.objects.create(
            title=title,
            content=content,
            author=request.user,
            image=image 
        )
        
        messages.success(request, 'Your post has been published!')
        return redirect('blog-home')
    return redirect('blog-home')

@login_required
def profile(request):
    user_profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        if 'avatar' in request.FILES:
            user_profile.avatar = request.FILES['avatar']
            user_profile.save()
            messages.success(request, 'Your profile picture has been updated!')
            return redirect('profile')
        else:
            messages.error(request, 'No image was received by the server.')
            
    context = {'profile': user_profile}
    return render(request, 'blog/profile.html', context)

@login_required
def post_delete(request, pk):
    post = get_object_or_404(Post, pk=pk)
    
    if post.author == request.user:
        if request.method == 'POST':
            post.delete()
            messages.success(request, 'Your post was permanently deleted.')
    else:
        messages.error(request, 'You do not have permission to delete this post.')
        
    return redirect('profile')

@login_required
def post_update(request, pk):
    post = get_object_or_404(Post, pk=pk)

    if post.author != request.user:
        messages.error(request, 'You cannot edit someone else\'s post.')
        return redirect('profile')

    if request.method == 'POST':
        post.title = request.POST.get('title')
        post.content = request.POST.get('content')
        
        if 'image' in request.FILES:
            post.image = request.FILES['image']
            
        post.save()
        messages.success(request, 'Your post has been updated!')
        return redirect('profile')

    return render(request, 'blog/post_edit.html', {'post': post})