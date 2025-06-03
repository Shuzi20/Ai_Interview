// app/page.tsx

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-purple-700">AI INTERVIEW</h1>
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <Link href="#features" className="hover:text-purple-600">Features</Link>
          <Link href="/choose-role" className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition">Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 sm:px-12 py-20 bg-white grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
        <div className="text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Transform Your Hiring with AI-Powered Interviews
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-md">
            Experience intelligent mock interviews tailored to your desired role with real-time feedback and comprehensive evaluations.
          </p>
          <Link href="/choose-role">
            <button className="bg-purple-600 text-white px-6 py-3 text-base rounded-full hover:scale-105 hover:bg-purple-700 transition-transform shadow-md">
              Get Started
            </button>
          </Link>
        </div>

        <div className="w-full flex justify-center lg:justify-end">
          <Image
            src="/illustration.png"
            alt="AI Interview Illustration"
            width={460}
            height={460}
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "💼",
              title: "Role-Based Mock Interviews",
              desc: "Tailored interviews for various job roles to match your aspirations."
            },
            {
              icon: "🎥",
              title: "Recorded Responses",
              desc: "Record and review your answers to enhance your interview performance."
            },
            {
              icon: "⚡",
              title: "AI-Driven Feedback",
              desc: "Receive real-time insights and evaluations powered by artificial intelligence."
            },
            {
              icon: "🔒",
              title: "Secure Authentication",
              desc: "Sign up with email or Google – fully protected and reliable."
            },
            {
              icon: "📊",
              title: "Admin Dashboard",
              desc: "Manage and review interviews and question sets with ease."
            },
            {
              icon: "📎",
              title: "Resume Integration",
              desc: "Upload resumes to personalize and contextualize the interview."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-100">
        &copy; {new Date().getFullYear()} AI Interview. All rights reserved.
      </footer>
    </main>
  );
}
