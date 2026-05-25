"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [projects, setProjects] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem("campusProfile");

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setName(profile.name || "");
      setCollege(profile.college || "");
      setBio(profile.bio || "");
      setSkills(profile.skills || "");
      setInterests(profile.interests || "");
      setProjects(profile.projects || "");
      setGithub(profile.github || "");
      setLinkedin(profile.linkedin || "");
      setImage(profile.image || "");
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Upload image below 1MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    localStorage.setItem(
      "campusProfile",
      JSON.stringify({
        name,
        college,
        bio,
        skills,
        interests,
        projects,
        github,
        linkedin,
        image,
      })
    );

    alert("Profile Saved Successfully 🚀");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white p-8 relative overflow-hidden">

      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-600/30 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black mb-3">
              Student Profile 👨‍🎓
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your startup profile, skills, projects and portfolio
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-[#0f172a] border border-white/10 hover:bg-white/10 px-6 py-4 rounded-2xl transition"
          >
            ← Back Dashboard
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="bg-[#0f172a] border border-white/10 rounded-[32px] p-8 h-fit text-center shadow-2xl">
            <div className="w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-blue-600 bg-[#020817] flex items-center justify-center shadow-lg shadow-blue-600/20">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl">👤</span>
              )}
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <label className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl cursor-pointer font-semibold transition">
                {image ? "Edit Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {image && (
                <button
                  onClick={() => setImage("")}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/30 px-5 py-3 rounded-2xl font-semibold transition"
                >
                  Remove
                </button>
              )}
            </div>

            <h2 className="text-3xl font-bold mt-8">
              {name || "Student Founder"}
            </h2>

            <p className="text-gray-400 mt-2">
              {college || "College Name"}
            </p>

            <div className="flex gap-3 justify-center mt-6">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm"
                >
                  GitHub
                </a>
              )}

              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0f172a] border border-white/10 rounded-[32px] p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8">
              Edit Profile Details
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none focus:border-blue-500"
              />

              <input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="College Name"
                className="p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none focus:border-blue-500"
              />

              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="GitHub Profile Link"
                className="p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none focus:border-blue-500"
              />

              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn Profile Link"
                className="p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none focus:border-blue-500"
              />
            </div>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio: Tell us about yourself..."
              className="w-full h-28 mt-5 p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none resize-none focus:border-blue-500"
            />

            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Skills: React, AI, Python, UI/UX..."
              className="w-full h-28 mt-5 p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none resize-none focus:border-blue-500"
            />

            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Interests: Startups, AI, Robotics, FinTech..."
              className="w-full h-28 mt-5 p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none resize-none focus:border-blue-500"
            />

            <textarea
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder="Projects: CampusConnect, AI Chatbot..."
              className="w-full h-32 mt-5 p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none resize-none focus:border-blue-500"
            />

            <button
              onClick={saveProfile}
              className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-[1.02] transition px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-blue-600/20"
            >
              Save Profile 🚀
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}