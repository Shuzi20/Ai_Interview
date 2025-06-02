from django.http import JsonResponse
from accounts.models import InterviewSession, InterviewQuestion

def get_interview_questions(request, interview_id):
    try:
        interview = InterviewSession.objects.get(id=interview_id)
        role = interview.role

        print(f"📌 Interview ID: {interview.id}")
        print(f"👤 User: {interview.user.email}")
        print(f"🧠 Role: {role.title if role else 'None'}")

        if not role:
            return JsonResponse({'error': 'No job role associated with this interview.'}, status=400)

        questions = InterviewQuestion.objects.filter(role=role)
        print(f"❓ Total questions found: {questions.count()}")

        data = [{'id': q.id, 'question_text': q.question_text} for q in questions]
        return JsonResponse({'questions': data}, status=200)

    except InterviewSession.DoesNotExist:
        return JsonResponse({'error': 'Interview not found.'}, status=404)
