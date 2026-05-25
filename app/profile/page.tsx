"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [projects, setProjects] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("campusProfile");

    if (stored) {
      const profile = JSON.parse(stored);

      setName(profile.name || "");
      setCollege(profile.college || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
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
      alert("Image must be below 1MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    if (
      !name.trim() ||
      !college.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !bio.trim() ||
      !skills.trim() ||
      !interests.trim() ||
      !projects.trim() ||
      !github.trim() ||
      !linkedin.trim() ||
      !image.trim()
    ) {
      alert("Please fill all fields and upload profile image");
      return;
    }

    localStorage.setItem(
      "campusProfile",
      JSON.stringify({
        name,
        college,
        email,
        phone,
        bio,
        skills,
        interests,
        projects,
        github,
        linkedin,
        image,
      })
    );

    alert("Profile saved successfully 🚀");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.30),transparent_35%)]" />

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl rounded-full border border-white/70 bg-white/45 backdrop-blur-2xl shadow-2xl shadow-blue-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/80 border border-white rounded-2xl p-2 shadow-lg">
            <img
              src="/campusconnectai.png"
              alt="CampusConnectAI Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              CampusConnect<span className="text-blue-600">AI</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[2px] text-blue-700/70">
              Innovation Ecosystem
            </p>
          </div>
        </div>

        <Link href="/dashboard">
          <button className="magic-btn bg-[#07162b] text-white px-6 py-3 rounded-full font-semibold shadow-lg transition">
            Dashboard
          </button>
        </Link>
      </nav>

      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-40 pb-24">
        <div className="rounded-[48px] border border-white/80 bg-white/55 backdrop-blur-3xl shadow-2xl shadow-blue-500/10 p-10 md:p-14">
          <h1 className="text-5xl font-black mb-3">
            Edit Student Profile 👨‍🎓
          </h1>

          <p className="text-slate-600 text-lg mb-10">
            All fields are mandatory. Complete your innovation profile.
          </p>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <div className="rounded-[36px] bg-white/70 border border-white/80 p-8 shadow-xl text-center">
                <div className="w-44 h-44 mx-auto rounded-[36px] overflow-hidden bg-white border border-white/80 shadow-xl flex items-center justify-center">
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

                <label className="magic-btn mt-6 inline-block bg-blue-600 text-white px-7 py-4 rounded-full font-bold shadow-xl cursor-pointer transition">
                  Upload Image *
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
                    className="mt-4 w-full bg-red-100 text-red-600 px-6 py-3 rounded-full font-bold"
                  >
                    Remove Image
                  </button>
                )}

                <p className="text-xs text-slate-500 mt-4">
                  Required. Image below 1MB.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name *"
                  className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
                />

                <input
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="College Name *"
                  className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
                />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
                />

                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number *"
                  className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
                />
              </div>

              <textarea
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio: Tell about yourself... *"
                className="w-full h-32 p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none resize-none focus:border-blue-500 shadow-inner"
              />

              <textarea
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills: React, Firebase, AI, UI/UX... *"
                className="w-full h-28 p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none resize-none focus:border-blue-500 shadow-inner"
              />

              <textarea
                required
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Interests: Startups, Hackathons, AI, Robotics... *"
                className="w-full h-28 p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none resize-none focus:border-blue-500 shadow-inner"
              />

              <textarea
                required
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder="Projects: CampusConnectAI, AI Study Buddy... *"
                className="w-full h-32 p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none resize-none focus:border-blue-500 shadow-inner"
              />

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  required
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="GitHub Link *"
                  className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
                />

                <input
                  required
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn Link *"
                  className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
                />
              </div>

              <button
                onClick={saveProfile}
                className="magic-btn w-full bg-blue-600 text-white py-5 rounded-full text-xl font-black shadow-2xl shadow-blue-500/30 transition"
              >
                Save Profile 🚀
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}