from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from accounts.models import JobRole, InterviewSession
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
def start_interview(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    role_id = request.POST.get('role')
    resume = request.FILES.get('resume')
    
    # Default fallback for unauthenticated user (if auth is not yet implemented)
    user = request.user if request.user.is_authenticated else User.objects.first()

    if not role_id:
        return JsonResponse({'error': 'Role is required.'}, status=400)

    try:
        role = JobRole.objects.get(id=role_id)
    except JobRole.DoesNotExist:
        return JsonResponse({'error': f'Invalid role ID: {role_id}'}, status=404)

    # Debug log (optional)
    print(f"🎯 Creating interview for user: {user.email}, role: {role.title}")

    interview = InterviewSession.objects.create(
        user=user,
        role=role,
        resume=resume
    )

    return JsonResponse({'interview_id': interview.id}, status=201)
