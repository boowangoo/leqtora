from django.conf import settings
import numpy as np
import cv2
import os

def take_screenshot(uuid, slider_val):
    print(f"take_screenshot: {uuid}, {slider_val}")
    lec_path = os.path.join(settings.MEDIA_ROOT, uuid)
    # find video file in directory
    for file in os.listdir(lec_path):
        if file.endswith('.mp4'):
            video = os.path.join(lec_path, file)
            break

    cap = cv2.VideoCapture(video)
    frame = np.floor(cap.get(cv2.CAP_PROP_FRAME_COUNT) * (float(slider_val) / 128.)).astype(int)
    
    img_file = f'video_{frame:09}.jpg'
    img_path = os.path.join(lec_path, 'preview', img_file)

    # check if file exists
    if not os.path.exists(img_path):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame)
        _, img = cap.read()
        img = cv2.resize(img, (640, 480))
        # save img
        img_path = os.path.join(lec_path, 'preview', img_file)
        cv2.imwrite(img_path, img, [int(cv2.IMWRITE_JPEG_QUALITY), 100])

    frame_cnt = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()

    return str(frame), str(frame_cnt), str(fps)

if __name__ == "__main__":
    pass