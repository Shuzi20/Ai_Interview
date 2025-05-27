from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from accounts.models import JobRole, InterviewSession
from django.contrib.auth.models import User

@csrf_exempt
def start_interview(request):
    if request.method == 'POST':
        role_id = request.POST.get('role')
        resume = request.FILES.get('resume')
        user = request.user if request.user.is_authenticated else User.objects.first()

        if not role_id and not resume:
            return JsonResponse({'error': 'Please provide a role or upload a resume.'}, status=400)

        role = None
        if role_id:
            try:
                role = JobRole.objects.get(id=role_id)
            except JobRole.DoesNotExist:
                return JsonResponse({'error': 'Invalid role'}, status=404)

        interview = InterviewSession.objects.create(user=user, role=role, resume=resume)
        return JsonResponse({'interview_id': interview.id}, status=201)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

