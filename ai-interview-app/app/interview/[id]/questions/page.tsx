"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

type Question = {
  id: number;
  question_text: string;
};

export default function QuestionsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/interview/${id}/questions/`);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestions();
  }, [id]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userStream);
        if (videoRef.current) videoRef.current.srcObject = userStream;
      } catch (err) {
        alert("Camera and mic permission is required.");
      }
    };

    getMedia();

    // ✅ Cleanup when navigating away or unmounting
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setStream(null);
    };
  }, []);

  const startRecording = () => {
    if (!stream) return;
    recordedChunks.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    recorder.onstop = handleUpload;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", blob);
    formData.append("interview_id", String(id));
    formData.append("question_id", String(questions[currentIndex].id));

    await fetch("http://localhost:8000/api/submit-media-answer/", {
      method: "POST",
      body: formData,
    });
  };

  const handleNext = () => {
    stopRecording();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // ✅ Stop camera & mic fully at the end
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setStream(null);

      router.push(`/interview/${id}/summary`);
    }
  };

  const handleStart = () => {
    if (stream) startRecording();
  };

  useEffect(() => {
    if (questions.length > 0 && stream) {
      // Ensure consistent height box but don't auto-start recording
    }
  }, [questions, stream]);

  if (loading) return <p className="text-center mt-20">Loading interview...</p>;
  if (!questions || questions.length === 0)
    return <p className="text-center mt-20 text-red-600">No questions available for this role.</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl w-full text-center min-h-[600px] flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <div className="text-gray-700 mb-4 overflow-hidden max-h-[100px] min-h-[100px]">
            <p className="line-clamp-none break-words whitespace-pre-wrap">{currentQuestion.question_text}</p>
          </div>

          <video ref={videoRef} autoPlay muted className="rounded shadow mb-4 w-full min-h-[280px]" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {!isRecording && (
            <button
              onClick={handleStart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Recording
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Stop Recording
            </button>
          )}

          <button
            onClick={handleNext}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {currentIndex === questions.length - 1 ? "Finish Interview" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
