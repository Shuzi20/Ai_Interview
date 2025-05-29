from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from accounts.models import JobRole, InterviewQuestion
from accounts.admin.generate_questions import generate_questions_for_role
import json

@csrf_exempt
def generate_ai_questions(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        role_id = body.get('role_id')
        if not role_id:
            return JsonResponse({'error': 'role_id required'}, status=400)

        try:
            questions = generate_questions_for_role(role_id)
            return JsonResponse({'questions': questions}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def save_approved_questions(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        role_id = body.get('role_id')
        questions = body.get('questions', [])

        if not role_id or not questions:
            return JsonResponse({'error': 'Missing role_id or questions'}, status=400)

        try:
            role = JobRole.objects.get(id=role_id)
            for q_text in questions:
                InterviewQuestion.objects.create(role=role, question_text=q_text)
            return JsonResponse({'status': 'success'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)