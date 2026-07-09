from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Post, Profile

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
    # Safely fetch your profile
    user_profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        # Check if the browser successfully sent an image file
        if 'avatar' in request.FILES:
            user_profile.avatar = request.FILES['avatar']
            user_profile.save()
            messages.success(request, 'Your profile picture has been updated!')
            return redirect('profile')
        else:
            messages.error(request, 'No image was received by the server.')
            
    # Explicitly pass the fresh profile to the template
    context = {'profile': user_profile}
    return render(request, 'blog/profile.html', context)