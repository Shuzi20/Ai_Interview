"use client";

import { useEffect, useState } from "react";

type Role = {
  id: number;
  title: string;
};

type Question = {
  text: string;
  mode: string;
};

export default function AdminQuestionForm() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [mode, setMode] = useState("manual");
  const [manualQuestion, setManualQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/roles/")
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  const handleAddQuestion = () => {
    if (manualQuestion.trim()) {
      setQuestions([...questions, { text: manualQuestion, mode }]);
      setManualQuestion("");
    }
  };

  const handleSave = async () => {
    if (!selectedRole || questions.length === 0) return;
    const res = await fetch("http://localhost:8000/api/save-approved-questions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role_id: selectedRole,
        questions: questions.map((q) => q.text),
      }),
    });
    if (res.ok) {
      alert("Questions saved successfully!");
      setQuestions([]);
    } else {
      alert("Error saving questions.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-purple-100 flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Manage Interview Questions</h1>

        <label className="block font-medium text-gray-700 mb-2">Select Job Role</label>
        <select
          className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-200"
          onChange={(e) => setSelectedRole(Number(e.target.value))}
          value={selectedRole ?? ""}
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option
              key={role.id}
              value={role.id}
              className="bg-white text-gray-800 focus:bg-purple-100"
            >
              {role.title}
            </option>
          ))}
        </select>

        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-xl font-semibold border ${
              mode === "manual" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border-purple-600"}`}
            onClick={() => setMode("manual")}
          >
            Manual Mode
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold border ${
              mode === "ai" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border-purple-600"}`}
            onClick={() => setMode("ai")}
          >
            AI-Generated Mode
          </button>
        </div>

        {mode === "manual" && (
          <div>
            <label className="block font-medium text-gray-700 mb-2">Enter a new question</label>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                className="flex-1 p-3 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Enter a new question"
                value={manualQuestion}
                onChange={(e) => setManualQuestion(e.target.value)}
              />
              <button
                onClick={handleAddQuestion}
                className="bg-purple-600 text-white px-5 py-2 rounded-xl"
              >
                + Add
              </button>
            </div>
          </div>
        )}

        <ul className="mb-6 space-y-3">
          {questions.map((q, i) => (
            <li
              key={i}
              className="p-3 bg-purple-50 rounded shadow flex justify-between items-center text-gray-800"
            >
              <span>{q.text}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSave}
          className="bg-purple-700 text-white w-full py-3 rounded-xl text-lg font-semibold"
        >
          Save All Questions to This Role
        </button>
      </div>
    </div>
  );
}
