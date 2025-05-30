# accounts/interview/submit_answer.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from accounts.models import InterviewSession, InterviewQuestion, InterviewAnswer
from .scoring_utils import evaluate_answer_with_bert

@csrf_exempt
def submit_answer(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        body = json.loads(request.body)
        interview_id = body.get('interview_id')
        question_id = body.get('question_id')
        answer_text = body.get('answer_text', '').strip()

        if not (interview_id and question_id and answer_text):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        session = InterviewSession.objects.get(id=interview_id)
        question = InterviewQuestion.objects.get(id=question_id)

        score, feedback = evaluate_answer_with_bert(answer_text, question.ideal_answer or "")

        answer_obj = InterviewAnswer.objects.create(
            session=session,
            question=question,
            answer_text=answer_text,
            score=score,
            feedback=feedback
        )

        return JsonResponse({'score': score, 'feedback': feedback}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
