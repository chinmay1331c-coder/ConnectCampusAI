"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import AuthCheck from "@/components/AuthCheck";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const [profileImage, setProfileImage] = useState("");
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    const savedProfile = localStorage.getItem("campusProfile");

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setProfileImage(profile.image || "");
      setStudentName(profile.name || "Student");
    }
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <AuthCheck>
      <main className="min-h-screen bg-[#020817] text-white flex">

        {/* Sidebar */}
        <aside className="w-72 bg-[#07111f] border-r border-white/10 p-6 hidden lg:flex flex-col justify-between">

          <div>
            {/* Logo */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-xl shadow-blue-500/20">
                <img
                  src="/logo.png"
                  alt="CampusConnect Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  CampusConnect
                </h1>
                <p className="text-xs text-gray-400">
                  AI Platform
                </p>
              </div>
            </div>

            {/* Menu */}
            <nav className="space-y-3">
              <button className="w-full text-left p-4 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                Dashboard
              </button>

              <button
                onClick={() => (window.location.href = "/profile")}
                className="w-full text-left p-4 rounded-2xl hover:bg-white/10 transition"
              >
                Profile
              </button>

              <button
                onClick={() => (window.location.href = "/projects")}
                className="w-full text-left p-4 rounded-2xl hover:bg-white/10 transition"
              >
                Projects
              </button>

              <button className="w-full text-left p-4 rounded-2xl hover:bg-white/10 transition">
                Network
              </button>

              <button className="w-full text-left p-4 rounded-2xl hover:bg-white/10 transition">
                Hackathons
              </button>

              <button className="w-full text-left p-4 rounded-2xl hover:bg-white/10 transition">
                AI Tools
              </button>
            </nav>
          </div>

          <button
            onClick={logout}
            className="w-full p-4 rounded-2xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition"
          >
            Logout
          </button>
        </aside>

        {/* Main */}
        <section className="flex-1 p-8 overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-5xl font-black mb-3">
                Dashboard 🚀
              </h1>
              <p className="text-gray-400 text-lg">
                Welcome back, {studentName}. Build, collaborate and innovate with AI.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/profile")}
              className="flex items-center gap-3 bg-[#0f172a] border border-white/10 px-4 py-3 rounded-2xl hover:bg-white/10 transition"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  👤
                </div>
              )}

              <div className="text-left">
                <p className="font-semibold">{studentName}</p>
                <p className="text-xs text-gray-400">Edit Profile</p>
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {[
              ["Active Projects", "08", "text-blue-400"],
              ["Team Matches", "12", "text-green-400"],
              ["Hackathons", "05", "text-purple-400"],
              ["AI Suggestions", "24", "text-yellow-400"],
            ].map(([title, value, color]) => (
              <div
                key={title}
                className="bg-[#0f172a] border border-white/10 rounded-[28px] p-6 shadow-xl"
              >
                <p className="text-gray-400 mb-3">{title}</p>
                <h2 className={`text-5xl font-black ${color}`}>
                  {value}
                </h2>
                <p className="text-green-400 mt-3 text-sm">
                  ↑ growing this week
                </p>
              </div>
            ))}
          </div>

          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 rounded-[36px] p-10 mb-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-5 py-2 rounded-full mb-5">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">AI Collaboration Ecosystem</span>
                </div>

                <h2 className="text-5xl font-black mb-5">
                  Build Your Startup Team With AI
                </h2>

                <p className="text-white/80 text-xl max-w-3xl leading-relaxed">
                  Find teammates, manage projects, generate startup ideas,
                  prepare pitches, join hackathons and showcase your skills.
                </p>
              </div>

              <button
                onClick={() => (window.location.href = "/projects")}
                className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-200 transition"
              >
                Open Projects
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid xl:grid-cols-3 gap-6">

            {/* Active Projects */}
            <div className="xl:col-span-2 bg-[#0f172a] border border-white/10 rounded-[28px] p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Active Projects
                </h2>
                <button
                  onClick={() => (window.location.href = "/projects")}
                  className="text-blue-400"
                >
                  View all
                </button>
              </div>

              {[
                ["AI Study Buddy", "Educational Platform", "75%"],
                ["CampusConnect AI", "Main Platform", "90%"],
                ["HealthAI Predictor", "ML Model", "45%"],
                ["FinTrack", "Finance App", "60%"],
              ].map(([name, type, progress]) => (
                <div
                  key={name}
                  className="border-b border-white/10 py-5 last:border-none"
                >
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{name}</h3>
                      <p className="text-gray-400 text-sm">{type}</p>
                    </div>
                    <span className="text-blue-400">{progress}</span>
                  </div>

                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: progress }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            <div className="bg-[#0f172a] border border-white/10 rounded-[28px] p-6">
              <h2 className="text-2xl font-bold mb-6">
                AI Suggestions ✨
              </h2>

              <div className="space-y-4">
                {[
                  "Find UI/UX designer for CampusConnect",
                  "Prepare pitch deck for AI Study Buddy",
                  "Join upcoming hackathon this week",
                  "Improve profile with GitHub projects",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-[#020817] border border-white/10 rounded-2xl p-4"
                  >
                    <p className="text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="xl:col-span-3 bg-[#0f172a] border border-white/10 rounded-[28px] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Quick Actions
              </h2>

              <div className="grid md:grid-cols-4 gap-5">
                {[
                  ["👤 Update Profile", "/profile"],
                  ["🚀 Project Dashboard", "/projects"],
                  ["🤝 Find Teammates", "#"],
                  ["🏆 Hackathon Ideas", "#"],
                ].map(([label, link]) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (link !== "#") window.location.href = link;
                    }}
                    className="bg-[#020817] border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition text-left"
                  >
                    <p className="text-xl font-bold">{label}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Open feature
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Innovation Leaderboard */}
            <div className="xl:col-span-2 bg-[#0f172a] border border-white/10 rounded-[28px] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Innovation Leaderboard 🏅
              </h2>

              {[
                ["Rahul Sharma", "AI Study Buddy", "980 pts"],
                ["Priya Patel", "HealthAI Predictor", "870 pts"],
                ["Ankit Verma", "Smart Waste IoT", "820 pts"],
              ].map(([name, project, points], index) => (
                <div
                  key={name}
                  className="flex justify-between items-center bg-[#020817] border border-white/10 rounded-2xl p-4 mb-4"
                >
                  <div>
                    <p className="font-semibold">
                      #{index + 1} {name}
                    </p>
                    <p className="text-gray-400 text-sm">{project}</p>
                  </div>

                  <span className="text-yellow-400 font-bold">
                    {points}
                  </span>
                </div>
              ))}
            </div>

            {/* Upcoming Hackathons */}
            <div className="bg-[#0f172a] border border-white/10 rounded-[28px] p-6">
              <h2 className="text-2xl font-bold mb-6">
                Upcoming Hackathons 🏆
              </h2>

              {[
                ["AI Innovation Challenge", "5 days left"],
                ["Campus Startup Sprint", "9 days left"],
                ["GreenTech Hackathon", "15 days left"],
              ].map(([name, date]) => (
                <div
                  key={name}
                  className="bg-[#020817] border border-white/10 rounded-2xl p-4 mb-4"
                >
                  <p className="font-semibold">{name}</p>
                  <p className="text-green-400 text-sm mt-1">{date}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>
    </AuthCheck>
  );
}