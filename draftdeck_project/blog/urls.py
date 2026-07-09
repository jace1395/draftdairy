from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='blog-home'),
    path('about/', views.about, name='blog-about'),
    path('post/new/', views.create_post, name='post-create'), 
    path('profile/', views.profile, name='profile'),
]