# accounts/models.py
from django.db import models
from django.contrib.auth.models import User

#JobRole model to represent different job roles
class JobRole(models.Model):
    title = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)

    def __str__(self):
        return self.title

# InterviewSession model to represent an interview session
class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(JobRole, on_delete=models.CASCADE, null=True, blank=True)  # ✅ allow null
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interview #{self.id} - {self.user.username} - {self.role.title if self.role else 'No Role'}"
