import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from accounts.models import AIQuestionSuggestion, JobRole

# Load the Hugging Face token from .env
load_dotenv()
token = os.getenv("HF_API_TOKEN")

# Initialize the inference client
client = InferenceClient(model="HuggingFaceH4/zephyr-7b-beta", token=token)

def generate_questions_for_role(role_id):
    print(f"▶️ generate_questions_for_role called {role_id}")

    try:
        # Get job role instance
        role = JobRole.objects.get(id=role_id)

        # Prepare the prompt
        prompt = (
            "[INST] You are a technical interviewer. Generate specific and realistic interview questions "
            f"for the job role of {role.title}. Number them. [/INST]"
        )

        # Get response from Hugging Face
        response = client.text_generation(
            prompt,
            max_new_tokens=300,
            temperature=0.7,
            do_sample=True,
            return_full_text=False
        )

        print("Raw output:", response)

        # Extract clean questions
        lines = response.strip().split("\n")
        seen = set()
        questions = []

        for line in lines:
            q = line.strip().lstrip("1234567890.- ").strip()
            if len(q) > 10 and q.lower() not in seen:
                seen.add(q.lower())
                questions.append(q)

        for q in questions:
            AIQuestionSuggestion.objects.create(role=role, question_text=q)

        return questions

    except Exception as e:
        print("❌ Error generating questions:", str(e))
        import traceback
        traceback.print_exc()
        return []
