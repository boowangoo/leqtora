from django import forms
from .models import LectureUpload

class LectureUploadForm(forms.ModelForm):
    class Meta:
        model = LectureUpload
        fields = ['video', 'captions']