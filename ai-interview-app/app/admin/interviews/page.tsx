"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Interview {
  id: number;
  user: string;
  role: string;
  started_at: string;
  average_score?: number | null;
}

export default function AdminInterviewListPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filtered, setFiltered] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [minScore, setMinScore] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/interviews/")
      .then((res) => res.json())
      .then(data => {
        setInterviews(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Failed to fetch interviews:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filteredData = interviews.filter((item) => {
      const matchesRole = roleFilter ? item.role === roleFilter : true;
      const matchesDate = dateFilter ? item.started_at.startsWith(dateFilter) : true;
      const matchesScore = minScore
        ? typeof item.average_score === "number" && item.average_score >= parseFloat(minScore)
        : true;
      return matchesRole && matchesDate && matchesScore;
    });
    setFiltered(filteredData);
  }, [roleFilter, dateFilter, minScore, interviews]);

  const uniqueRoles = Array.from(new Set(interviews.map(i => i.role)));

  if (loading) return <p className="text-center mt-20 text-sm text-gray-600">Loading interviews...</p>;

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center font-roboto">
          Admin: Interview Records
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none text-gray-800 placeholder-gray-400"

          >
            <option value="">All Roles</option>
            {uniqueRoles.map((role, idx) => (
              <option key={idx} value={role}>{role}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none text-gray-800 placeholder-gray-400"

          />

          <input
            type="number"
            placeholder="Min Score"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none text-gray-800 placeholder-gray-400"

          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm text-left bg-white">
            <thead className="bg-purple-100 text-purple-800 text-sm">
              <tr>
                <th className="px-5 py-3 border-b font-medium">Candidate</th>
                <th className="px-5 py-3 border-b font-medium">Role</th>
                <th className="px-5 py-3 border-b font-medium">Started At</th>
                <th className="px-5 py-3 border-b text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((interview) => (
                <tr key={interview.id} className="border-b hover:bg-purple-50">
                  <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{interview.user}</td>
                  <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{interview.role}</td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(interview.started_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => router.push(`/admin/interviews/${interview.id}`)}
                      className="bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 text-sm font-medium shadow-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
