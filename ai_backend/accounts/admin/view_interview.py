from django.http import JsonResponse
from accounts.models import InterviewSession
from django.contrib.auth.models import User

def list_interviews(request):
    sessions = InterviewSession.objects.select_related("user", "role").order_by("-started_at")

    data = [
        {
            "id": session.id,
            "user": session.user.email,
            "role": session.role.title if session.role else "No Role",
            "started_at": session.started_at.isoformat()
        }
        for session in sessions
    ]

    return JsonResponse(data, safe=False)
