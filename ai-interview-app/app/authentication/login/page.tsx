"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eadcf7] font-roboto">
      <div className="flex w-full max-w-5xl bg-[#eadcf7] p-6">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center items-center text-center px-10">
            <h1 className="text-5xl font-normal text-[#521283] leading-none font-roboto whitespace-nowrap">
            AI INTERVIEW
            </h1>
            <p className="text-xl text-[#7d4ca2] mt-2 font-roboto">
                Redefining Interviews with Intelligence
            </p>
        </div>

        {/* Right Section - Form Card */}
        <div className="w-1/2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl text-gray-800 font-bold text-center mb-6">LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-800 mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>

          {/* OR Separator */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
          >
            <FcGoogle size={20} />
            <span className="text-gray-700">Continue with Google</span>
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link href="/authentication/signup" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
