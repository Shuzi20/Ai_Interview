"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Answer {
  question: string;
  video_url: string | null;
  score: number | null;
  feedback: string;
}

interface SummaryData {
  interview_id: number;
  role: string;
  answers: Answer[];
  average_score: number | null;
}

export default function SummaryPage() {
  const { id } = useParams() as { id: string };
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/interview/${id}/summary/`)
      .then((res) => res.json())
      .then(setSummary)
      .catch((err) => console.error("Error fetching summary:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading summary...</p>;
  if (!summary) return <p className="text-center text-red-600 mt-20">Summary not available.</p>;

  return (
    <div className="min-h-screen bg-purple-100 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-purple-800 mb-4 text-center">Interview Summary</h1>
        <p className="text-center text-gray-600 mb-6">Role: {summary.role}</p>

        {summary.answers.map((ans, index) => (
          <div
            key={index}
            className="mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
          >
            <h3 className="text-md font-semibold text-purple-700 mb-2">Question {index + 1}</h3>
            <p className="text-gray-800 mb-2">{ans.question}</p>

            {ans.score !== null && (
              <p className="text-sm text-green-700">Score: {ans.score.toFixed(1)} / 10</p>
            )}
            {ans.feedback ? (
              <p className="text-sm text-gray-600 italic">Feedback: {ans.feedback}</p>
            ) : (
              <p className="text-sm italic text-red-500">No feedback provided.</p>
            )}
          </div>
        ))}

        {summary.average_score !== null && (
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold text-purple-800">
              Average Score: {summary.average_score.toFixed(2)} / 10
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
