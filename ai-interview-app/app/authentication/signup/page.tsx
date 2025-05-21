"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async(e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Signup successful");
    } else {
        alert(data.error || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#eadcf7] font-roboto">
        <div className="flex w-full max-w-6xl h-[90%] bg-[#eadcf7] px-12 gap-x-12">

            {/* Left Branding Section */}
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


            {/* Right Form Section */}
            <div className="w-1/2 flex justify-center items-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">REGISTER</h2>
                    <form onSubmit={handleRegister} className="space-y-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm text-gray-800 mb-1">First Name</label>
                        <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    {/* Last Name */}
                    <div>
                        <label className="block text-sm text-gray-800 mb-1">Last Name</label>
                        <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    {/* Email */}
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
                    {/* Password */}
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
                        REGISTER
                    </button>
                    </form>

                    {/* OR Separator */}
                    <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    {/* Google Auth */}
                    <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                    <FcGoogle size={20} />
                    <span className="text-gray-700">Continue with Google</span>
                    </button>

                    <p className="text-sm text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link href="/authentication/login" className="text-purple-600 hover:underline">
                        Login
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>

  );
}
