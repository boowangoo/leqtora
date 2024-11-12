from django.conf import settings
import numpy as np
import cv2
import os

def _get_cap(user_id):
    lec_path = os.path.join(settings.MEDIA_ROOT, user_id)
    # find video file in directory
    for file in os.listdir(lec_path):
        if file.endswith('.mp4'):
            video = os.path.join(lec_path, file)
            break

    cap = cv2.VideoCapture(video)
    return cap

def get_video_info(user_id):
    cap = _get_cap(user_id)
    frame_cnt = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    cap.release()
    return int(frame_cnt), fps, int(width), int(height)

def take_screenshot(user_id, frame):
    cap = _get_cap(user_id)
    
    lec_path = os.path.join(settings.MEDIA_ROOT, user_id)
    img_file = f'video_{frame:09}.jpg'
    img_path = os.path.join(lec_path, 'preview', img_file)

    # check if file exists
    if not os.path.exists(img_path):
        print(f"frame: {frame}")
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame)
        _, img = cap.read()
        img_w, img_h = img.shape[1], img.shape[0]
        new_h = 480
        new_w = int(new_h * img_w / img_h)
        img = cv2.resize(img, (new_w, new_h))
        # save img
        img_path = os.path.join(lec_path, 'preview', img_file)
        cv2.imwrite(img_path, img, [int(cv2.IMWRITE_JPEG_QUALITY), 100])
    cap.release()

if __name__ == "__main__":
    pass