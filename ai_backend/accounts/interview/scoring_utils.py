# accounts/interview/scoring_utils.py
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def evaluate_answer_with_bert(candidate_answer, ideal_answer):
    try:
        if not ideal_answer:
            return 0.0, "No ideal answer provided for scoring."

        embeddings = model.encode([candidate_answer, ideal_answer])
        score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        feedback = "Answer evaluated successfully."

        if score < 0.4:
            feedback = "Try to include more relevant technical details."
        elif score < 0.7:
            feedback = "Decent answer, but could be more specific."
        else:
            feedback = "Good, well-aligned with expected response."

        return round(score * 10, 2), feedback  # Score out of 10

    except Exception as e:
        return 0.0, f"Error during evaluation: {str(e)}"
