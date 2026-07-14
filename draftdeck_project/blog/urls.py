from django.urls import path
from . import views
from users import views as user_views

urlpatterns = [
    path('', views.home, name='blog-home'),
    path('about/', views.about, name='blog-about'),
    path('post/new/', views.create_post, name='post-create'),
    path('post/<int:pk>/update/', views.post_update, name='post-update'),
    path('post/<int:pk>/delete/', views.post_delete, name='post-delete'),
    path('address/update/', user_views.update_address, name='update_address'),
]