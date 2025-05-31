from django.http import JsonResponse
from accounts.models import InterviewSession, InterviewAnswer

def interview_detail(request, interview_id):
    try:
        session = InterviewSession.objects.select_related("user", "role").get(id=interview_id)
        answers = InterviewAnswer.objects.filter(session=session).select_related("question")

        response_data = {
            "interview_id": session.id,
            "user": session.user.email,
            "role": session.role.title if session.role else "No Role",
            "started_at": session.started_at.isoformat(),
            "answers": []
        }

        for answer in answers:
            response_data["answers"].append({
                "question": answer.question.question_text,
                "video_url": answer.video_file.url if answer.video_file else None,
                "score": answer.score,
                "feedback": answer.feedback
            })

        return JsonResponse(response_data)

    except InterviewSession.DoesNotExist:
        return JsonResponse({"error": "Interview not found"}, status=404)
