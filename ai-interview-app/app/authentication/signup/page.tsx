"use client";

import { signIn } from 'next-auth/react';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import GoogleAuthSync from "@/components/GoogleAuthSync";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validatePassword = (pwd: string): string => {
    if (pwd.length < 8 || pwd.length > 16) {
      return "Password must be 8–16 characters long.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!/\d/.test(pwd)) {
      return "Password must include at least one digit.";
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return "Password must include at least one special character.";
    }
    return "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const pwdError = validatePassword(password);
    setPasswordError(pwdError);
    if (pwdError) return;

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsError(false);
      setMessage("Signup successful!");
      setTimeout(() => {
        setMessage("");
        router.push("/dashboard");
      }, 2000);
    } else {
      if (data.error === "User already exists.") {
        setEmailError("This email is already registered.");
      } else {
        setIsError(true);
        setMessage(data.error || "Signup failed");
        setTimeout(() => setMessage(""), 2000);
      }
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-[#eadcf7] font-roboto">
      {/* ✅ Google Auth Sync */}
      <GoogleAuthSync />
      
      {/* ✅ Top-Center Floating Message */}
      {message && (
        <div
          className={`absolute top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-lg shadow-md text-base font-medium z-50 transition-all duration-300
            ${isError ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-800"}
          `}
        >
          {message}
        </div>
      )}

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
        <div className="w-1/2 flex flex-col justify-start items-center pt-3 relative">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">REGISTER</h2>

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
                  className="w-full px-4 py-2 border rounded-md text-gray-600 placeholder:text-gray-300 focus:outline-none border-gray-300 focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-4 py-2 border rounded-md text-gray-600 placeholder:text-gray-300 focus:outline-none border-gray-300 focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-4 py-2 border rounded-md text-gray-600 placeholder:text-gray-300 focus:outline-none border-gray-300 focus:ring-2 focus:ring-purple-500"
                />
                {emailError && (
                  <p className="text-sm text-red-600 mt-1">{emailError}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-800 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md text-gray-600 placeholder:text-gray-300 focus:outline-none border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </span>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                )}
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
              onClick={() => signIn("google", { callbackUrl: "/" })}
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
