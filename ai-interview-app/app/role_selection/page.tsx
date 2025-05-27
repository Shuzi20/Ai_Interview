"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Role = {
  id: number;
  title: string;
  icon: string;
};

export default function RoleSelection() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:8000/api/roles/')
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedRole && !resume) {
      alert('Please select a role or upload a resume to start the interview.');
      return;
    }

    const formData = new FormData();
    if (selectedRole) formData.append('role', selectedRole.toString());
    if (resume) formData.append('resume', resume);

    try {
      const response = await fetch('http://localhost:8000/api/start-interview/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to start interview');

      const data = await response.json();
      const interviewId = data.interview_id;
      router.push(`/interview/${interviewId}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Something went wrong while starting the interview.');
    }
  };


  return (
    <div className="min-h-screen bg-purple-100 p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-purple-700 mb-2">Choose Your Role</h1>
      <p className="text-sm text-gray-500 mb-8">We'll tailor the interview based on your selection</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`cursor-pointer rounded-xl p-6 shadow text-center transition-transform transform hover:scale-105 hover:shadow-lg ${
              selectedRole === role.id
                ? 'border-2 border-purple-600 bg-purple-100 text-purple-800'
                : 'bg-white text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mx-auto mb-4 text-2xl">
              {role.icon}
            </div>
            <div className="font-semibold text-lg">{role.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <label className="font-semibold text-purple-700 block mb-2">Upload your resume (optional)</label>

        <div className="flex flex-col items-center gap-2">
          <label className="cursor-pointer bg-white border border-purple-500 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition">
            Choose File
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
          </label>

          {resume && (
            <span className="text-sm text-gray-700">
              {resume.name}
            </span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}