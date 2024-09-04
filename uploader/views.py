from django.conf import settings
from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponseBadRequest, FileResponse, JsonResponse
import uuid
import os

from .utils.screenshot_video import take_screenshot

def upload_page(request):
    return render(request, 'uploader/upload.html')

def handle_upload(request):
    # print form data
    print(request.POST)
    if request.method == 'POST' and request.FILES:
        # get new uuid
        if 'uuid' not in request.session:
            request.session['uuid'] = str(uuid.uuid4())
        user_id = request.session['uuid'].replace('-', '')

        upload_dir = os.path.join(settings.MEDIA_ROOT, user_id)
        os.makedirs(upload_dir, exist_ok=True)

        print(f"request.FILES: {request.FILES}")

        video = request.FILES.get('video')
        captions = request.FILES.get('captions')

        if not video or not captions:
            return HttpResponseBadRequest('Both video and caption files are required.')
        if not video.content_type.startswith('video/'):
            return HttpResponseBadRequest('Invalid video file type. Please upload a video file.')
        if not captions.name.endswith('.srt'):
            return HttpResponseBadRequest('Invalid caption file type. Please upload an .srt file.')
        
        fs = FileSystemStorage(location=upload_dir)
        video_name = fs.save(video.name, video)
        captions_name = fs.save(captions.name, captions)

        # store files
        request.session['uploaded_files'] = {
            'video': video_name,
            'captions': captions_name,
        }
        
        return redirect('process_upload')
    
    return render(request, 'uploader/upload.html')

def process_upload(request):
    user_id = request.session.get('uuid').replace('-', '')
    uploaded_files = request.session.get('uploaded_files', {})

    if user_id and uploaded_files:
        video_path = uploaded_files.get('video', '')
        captions_path = uploaded_files.get('captions', '')

        context = {
            'video_url': os.path.join(settings.MEDIA_URL, user_id, video_path),
            'captions_url': os.path.join(settings.MEDIA_URL, user_id, captions_path)
        }
        return render(request, 'uploader/process.html', context)

    return redirect('upload_page')

def handle_video_prev(request):
    user_id = request.session.get('uuid').replace('-', '')
    slider_val = request.GET.get('slider')

    prev_dir = os.path.join(settings.MEDIA_ROOT, user_id, 'preview')
    os.makedirs(prev_dir, exist_ok=True)

    frame, frame_cnt, fps = take_screenshot(user_id, slider_val)
    return JsonResponse({ 'user_id': user_id, 'frame': frame, 'frame_cnt': frame_cnt, "fps": fps })

def handle_preview_img(request, user_id, frame_id):
    img_path = os.path.join(settings.MEDIA_ROOT, user_id, 'preview', f'video_{frame_id}.jpg')
    if not os.path.exists(img_path):
        return HttpResponseBadRequest('Image not found.')
    return FileResponse(open(img_path, 'rb'), content_type='image/jpg')
    