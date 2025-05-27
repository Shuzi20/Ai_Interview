from django.db import models

# Create your models here.
class JobRole(models.Model):
    title = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)  # Store emoji or icon name

    def __str__(self):
        return self.title