from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
