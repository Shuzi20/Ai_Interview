from transformers import pipeline
from accounts.models import AIQuestionSuggestion, JobRole

# Load once
generator = pipeline("text2text-generation", model="google/flan-t5-base")

def generate_questions_for_role(role_id):
    role = JobRole.objects.get(id=role_id)
    prompt = f"Generate 5 interview questions for a {role.title}."

    result = generator(prompt, max_length=256, do_sample=False)[0]['generated_text']
    questions = result.strip().split('\n')

    for q in questions:
        if q.strip():
            AIQuestionSuggestion.objects.create(role=role, question_text=q.strip())

    return questions
