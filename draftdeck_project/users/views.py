from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm
from blog.models import Profile, Post 

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}! You can now log in.')
            return redirect('login')
    else:
        form = UserRegisterForm()
        
    return render(request, 'users/register.html', {'form': form})


@login_required
def profile(request):
    print("Method Used:", request.method)

    user_profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        print("Files Received:", request.FILES)

        if 'avatar' in request.FILES:
            user_profile.avatar = request.FILES['avatar']
            user_profile.save()
            messages.success(request, 'Image saved to database successfully!')
            print("Status: SUCCESS! Image saved.")
        else:
            messages.error(request, 'Django blocked it: No image found.')
            print("Status: FAILED. No file detected in request.")

        return redirect('profile')

    user_posts = Post.objects.filter(author=request.user).order_by('-date_posted')

    context = {
        'profile': user_profile,
        'user_posts': user_posts
    }
    return render(request, 'users/profile.html', context)

@login_required
def update_address(request):
    user_profile, created = Profile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        user_profile.address = request.POST.get('address')
        user_profile.save()
        messages.success(request, 'Your address has been successfully updated!')
        return redirect('profile')
        
    return render(request, 'users/update_address.html', {'profile': user_profile})