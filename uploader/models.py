from django.db import models

class LectureUpload(models.Model):
    video = models.FileField(upload_to='lectures/videos/')
    captions = models.FileField(upload_to='lectures/captions/', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)