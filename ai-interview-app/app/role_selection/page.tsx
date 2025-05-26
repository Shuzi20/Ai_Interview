"use client";

import { useState, useEffect } from 'react';

type Role = {
  id: number;
  title: string;
  icon: string;
};

export default function RoleSelection() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/roles/')
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedRole) return alert('Select a role first.');

    const formData = new FormData();
    formData.append('role', selectedRole.toString());
    if (resume) formData.append('resume', resume);

    // Later you’ll use this formData to POST to a Django endpoint
    console.log('Ready to submit:', formData);
  };

  return (
    <div className="min-h-screen bg-purple-100 p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Select a Role</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`cursor-pointer rounded-xl p-4 shadow text-center ${
              selectedRole === role.id ? 'bg-purple-200 border-2 border-purple-600' : 'bg-white'
            }`}
          >
            <div className="text-3xl mb-2">{role.icon}</div>
            <div className="font-medium">{role.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <label className="font-semibold text-purple-700">Upload your resume (optional)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          className="block mt-2"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleSubmit}
          className="mt-4 bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
