"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save tokens to localStorage
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        alert("Login successful!");

        // TODO: Redirect to dashboard if needed
        // router.push('/dashboard')
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error("Login error:", error);
    }
  };


  return (
    <div className="h-screen flex items-center justify-center bg-[#eadcf7] font-roboto">
      <div className="flex w-full max-w-6xl h-[90%] bg-[#eadcf7] px-12 gap-x-12">

        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center items-center text-center">
          <div className="max-w-sm">
            <h1 className="text-[65px] font-normal text-[#521283] leading-none whitespace-nowrap font-roboto">
              AI INTERVIEW
            </h1>
            <p className="text-xl text-[#7d4ca2] mt-2 font-roboto whitespace-nowrap">
              Redefining Interviews with Intelligence
            </p>
          </div>
        </div>



        {/* Right Section - Form Card */}
        <div className="w-1/2 flex justify-center items-center">
           <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
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
    </div>
  );
}
