"use client";

import { useEffect, useState } from "react";

type Role = {
  id: number;
  title: string;
};

type AIQuestion = {
  question_text: string;
};

export default function AdminQuestionForm() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [aiQuestions, setAIQuestions] = useState<AIQuestion[]>([]);
  const [selectedAI, setSelectedAI] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/roles/")
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  const handleGenerateQuestions = async () => {
    if (!selectedRole) return alert("Please select a job role first.");
    setLoading(true);
    setAIQuestions([]);
    setSelectedAI([]);

    try {
      const res = await fetch("http://localhost:8000/api/generate-questions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id: selectedRole }),
      });

      const data = await res.json();
      if (res.ok) {
        const formatted = data.questions.map((q: string) => ({ question_text: q }));
        setAIQuestions(formatted);
        setSelectedAI(data.questions);
      } else {
        alert("Failed to generate questions.");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedRole || selectedAI.length === 0) {
      alert("Select a role and at least one question to save.");
      return;
    }

    const res = await fetch("http://localhost:8000/api/save-approved-questions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role_id: selectedRole,
        questions: selectedAI,
      }),
    });

    if (res.ok) {
      alert("Questions saved successfully!");
      setAIQuestions([]);
      setSelectedAI([]);
      setEditedText("");
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
          className="w-full p-2 rounded border border-gray-300 bg-white text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-200"
          onChange={(e) => setSelectedRole(Number(e.target.value))}
          value={selectedRole ?? ""}
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))}
        </select>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={handleGenerateQuestions}
            className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition w-full sm:w-auto"
          >
            Generate AI Questions
          </button>
          {!addingNew && (
            <button
              className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition w-full sm:w-auto"
              onClick={() => {
                setAddingNew(true);
                setEditedText("");
              }}
            >
              Add Custom Question
            </button>
          )}
        </div>

        {addingNew && (
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded p-2 text-gray-700"
              placeholder="Enter new question"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => {
                if (!editedText.trim()) return;
                const newQ = { question_text: editedText.trim() };
                setAIQuestions([...aiQuestions, newQ]);
                setSelectedAI([...selectedAI, newQ.question_text]);
                setAddingNew(false);
                setEditedText("");
              }}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={() => {
                setAddingNew(false);
                setEditedText("");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 italic">Loading AI-generated questions...</p>
        ) : aiQuestions.length > 0 ? (
          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Select Questions to Save:
            </h3>

            <ul className="space-y-3 mb-6">
              {aiQuestions.map((q, index) => (
                <li
                  key={index}
                  className={`border p-3 rounded text-gray-600 ${
                    selectedAI.includes(q.question_text)
                      ? "bg-purple-100 border-purple-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {editingIndex === index ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded p-2 text-gray-700"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => {
                          const updated = [...aiQuestions];
                          updated[index].question_text = editedText;
                          setAIQuestions(updated);

                          const newSelected = [...selectedAI];
                          newSelected[index] = editedText;
                          setSelectedAI(newSelected);

                          setEditingIndex(null);
                          setEditedText("");
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          setEditingIndex(null);
                          setEditedText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedAI((prev) =>
                            prev.includes(q.question_text)
                              ? prev.filter((t) => t !== q.question_text)
                              : [...prev, q.question_text]
                          )
                        }
                      >
                        {q.question_text}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setEditingIndex(index);
                            setEditedText(q.question_text);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => {
                            const updated = aiQuestions.filter((_, i) => i !== index);
                            setAIQuestions(updated);
                            setSelectedAI((prev) => prev.filter((t) => t !== q.question_text));
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={handleSave}
              className="bg-purple-700 text-white w-full py-3 rounded-xl text-lg font-semibold"
            >
              ✅ Save Approved Questions
            </button>
          </div>
        ) : (
          <p className="text-gray-500 italic">No AI questions generated yet.</p>
        )}
      </div>
    </div>
  );
}
