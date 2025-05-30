from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from accounts.models import InterviewSession, InterviewQuestion, InterviewAnswer

@csrf_exempt
def submit_media_answer(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        interview_id = request.POST.get('interview_id')
        question_id = request.POST.get('question_id')
        video = request.FILES.get('video')

        if not interview_id or not question_id or not video:
            return JsonResponse({'error': 'Missing interview_id, question_id or video file'}, status=400)

        print("📽️ Received video:", video.name)
        print("➡️ interview_id:", interview_id)
        print("➡️ question_id:", question_id)

        session = InterviewSession.objects.get(id=interview_id)
        question = InterviewQuestion.objects.get(id=question_id)

        InterviewAnswer.objects.create(
            session=session,
            question=question,
            video_file=video
        )

        return JsonResponse({'status': 'success'}, status=201)

    except InterviewSession.DoesNotExist:
        return JsonResponse({'error': 'Interview session not found'}, status=404)
    except InterviewQuestion.DoesNotExist:
        return JsonResponse({'error': 'Question not found'}, status=404)
    except Exception as e:
        print("❌ Internal server error:", str(e))
        return JsonResponse({'error': str(e)}, status=500)
