"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiDownload, FiThumbsUp, FiMessageCircle } from "react-icons/fi";

interface Answer {
  question: string;
  video_url: string | null;
  score: number | null;
  feedback: string;
}

interface InterviewDetails {
  interview_id: number;
  user: string;
  role: string;
  started_at: string;
  answers: Answer[];
}

export default function AdminInterviewDetailPage() {
  const { id } = useParams() as { id: string };
  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/admin/interviews/${id}/`)
      .then((res) => res.json())
      .then(setInterview)
      .catch((err) => console.error("Error loading interview:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading interview details...</p>;
  if (!interview) return <p className="text-center text-red-600 mt-20">Interview not found.</p>;

  const averageScore = (() => {
    const scores = interview.answers.filter(a => a.score !== null).map(a => a.score!);
    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;
  })();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Interview Details</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Candidate:</strong> {interview.user}</p>
            <p><strong>Role:</strong> {interview.role}</p>
            <p><strong>Started At:</strong> {new Date(interview.started_at).toLocaleString()}</p>
          </div>
        </div>

        {averageScore && (
          <div className="mb-6 text-lg text-center">
            <span className="font-semibold text-purple-700">Average Score:</span> {averageScore} / 10
          </div>
        )}

        <h2 className="text-xl font-semibold text-purple-700 mb-4">Recorded Answers</h2>

        <div className="space-y-12">
          {interview.answers.map((ans, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-6 items-start border-b pb-6"
            >
              <div className="flex-1 space-y-3">
                <h3 className="text-md font-semibold text-purple-700">Question {index + 1}</h3>
                <p className="text-gray-800 text-sm leading-relaxed">{ans.question}</p>

                {ans.score !== null && (
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <FiThumbsUp /> <span>Score: {ans.score.toFixed(1)} / 10</span>
                  </p>
                )}
                {ans.feedback && (
                  <p className="text-sm text-gray-600 italic flex items-center gap-2">
                    <FiMessageCircle /> <span>Feedback: {ans.feedback}</span>
                  </p>
                )}
              </div>

              <div className="w-full md:w-[320px] space-y-2">
                {ans.video_url ? (
                  <>
                    <video
                      src={`http://localhost:8000${ans.video_url}`}
                      controls
                      className="w-full h-[220px] object-cover rounded-lg bg-black"
                    />
                    <a
                      href={`http://localhost:8000${ans.video_url}`}
                      download
                      className="text-xs text-purple-600 flex items-center gap-1 hover:underline"
                    >
                      <FiDownload /> Download Video
                    </a>
                  </>
                ) : (
                  <p className="text-sm italic text-red-500">No video response recorded.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
