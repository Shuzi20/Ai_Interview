"use client";

import { useRouter } from "next/navigation";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";

export default function ChooseRolePage() {
  const router = useRouter();

  const handleSelect = (role: "candidate" | "admin") => {
    router.push(`/authentication/signup?role=${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          Select Your Role
        </h1>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div
            className="flex-1 p-6 rounded-xl shadow-md border-2 border-purple-300 bg-purple-50 cursor-pointer hover:border-purple-600 transition"
            onClick={() => handleSelect("candidate")}
          >
            <div className="flex flex-col items-center">
              <FaUserGraduate className="text-4xl text-purple-700 mb-2" />
              <p className="font-semibold text-lg text-purple-800">Candidate</p>
              <p className="text-sm text-gray-500">Take interviews and receive feedback.</p>
            </div>
          </div>

          <div
            className="flex-1 p-6 rounded-xl shadow-md border-2 border-purple-300 bg-purple-50 cursor-pointer hover:border-purple-600 transition"
            onClick={() => handleSelect("admin")}
          >
            <div className="flex flex-col items-center">
              <FaUserTie className="text-4xl text-purple-700 mb-2" />
              <p className="font-semibold text-lg text-purple-800">Company Admin</p>
              <p className="text-sm text-gray-500">Manage jobs and review candidates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
