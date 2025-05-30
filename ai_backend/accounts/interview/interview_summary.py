from django.http import JsonResponse
from accounts.models import InterviewSession, InterviewAnswer

def interview_summary(request, interview_id):
    try:
        session = InterviewSession.objects.select_related('role').get(id=interview_id)
        answers = InterviewAnswer.objects.filter(session=session).select_related('question')

        summary_data = []
        total_score = 0
        scored_count = 0

        for answer in answers:
            if answer.score is not None:
                total_score += answer.score
                scored_count += 1

            summary_data.append({
                "question": answer.question.question_text,
                "video_url": answer.video_file.url if answer.video_file else None,
                "score": answer.score,
                "feedback": answer.feedback,
            })

        average_score = round(total_score / scored_count, 2) if scored_count > 0 else None

        return JsonResponse({
            "interview_id": session.id,
            "role": session.role.title if session.role else "Unknown Role",
            "answers": summary_data,
            "average_score": average_score
        }, status=200)

    except InterviewSession.DoesNotExist:
        return JsonResponse({"error": "Interview not found"}, status=404)
