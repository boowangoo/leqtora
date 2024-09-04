from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_page, name='upload_page'),
    path('upload/', views.handle_upload, name='handle_upload'),
    path('process/', views.process_upload, name='process_upload'),
    path('video_preview/', views.handle_video_prev, name='video_preview'),
    path('handle_preview_img/<str:user_id>/<str:frame_id>/', views.handle_preview_img, name='handle_preview_img'),

]