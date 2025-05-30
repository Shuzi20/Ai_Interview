"""
URL configuration for ai_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from accounts.views import RegisterView, LoginView, GoogleAuthView
from accounts.jobrole_selection import roles, start_interview
from accounts.admin import adminapi
from accounts.interview import fetch_questions
from accounts.interview import submit_media_answers
from accounts.interview import interview_summary

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view()),
    path('api/login/', LoginView.as_view()),
    path('api/register-google-user/', GoogleAuthView.as_view()),
    path('api/roles/', roles.get_roles, name='get_roles'),
    path('api/start-interview/', start_interview.start_interview),
    path('api/generate-questions/', adminapi.generate_ai_questions),
    path('api/save-approved-questions/', adminapi.save_approved_questions),
    path('api/interview/<int:interview_id>/questions/', fetch_questions.get_interview_questions),
    path("api/submit-media-answer/", submit_media_answers.submit_media_answer),
    path("api/interview/<int:interview_id>/summary/", interview_summary.interview_summary),
]


from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
