# accounts/models.py
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

#JobRole model to represent different job roles
class JobRole(models.Model):
    title = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)

    def __str__(self):
        return self.title
    

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('candidate', 'Candidate'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')

    def __str__(self):
        return f"{self.username} ({self.role})"


# InterviewSession model to represent an interview session
class InterviewSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.ForeignKey(JobRole, on_delete=models.CASCADE, null=True, blank=True)  # ✅ allow null
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interview #{self.id} - {self.user.username} - {self.role.title if self.role else 'No Role'}"


class InterviewQuestion(models.Model):
    role = models.ForeignKey(JobRole, on_delete=models.CASCADE)
    question_text = models.TextField()
    ideal_answer = models.TextField(blank=True)  # Optional, used for BERT scoring

    def __str__(self):
        return f"Q: {self.question_text[:60]}"

class InterviewAnswer(models.Model):
    session = models.ForeignKey('InterviewSession', on_delete=models.CASCADE)
    question = models.ForeignKey('InterviewQuestion', on_delete=models.CASCADE)
    score = models.FloatField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    video_file = models.FileField(upload_to='answers/videos/', null=True, blank=True)  # ✅ Add this
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer by {self.session.user.username} - Q#{self.question.id}"

class AIQuestionSuggestion(models.Model):
    role = models.ForeignKey(JobRole, on_delete=models.CASCADE)
    question_text = models.TextField()
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Suggested Q: {self.question_text[:60]}"
