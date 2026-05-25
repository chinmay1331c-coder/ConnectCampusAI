"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const industryOptions = [
  "AI",
  "Robotics",
  "Web Development",
  "Business",
  "Healthcare",
  "FinTech",
];

export default function InvestorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [profile, setProfile] = useState({
    mentorName: "",
    designation: "",
    organization: "",
    bio: "",
    experience: "",
    linkedin: "",
    website: "",
    email: "",
    languages: "",
    photo: "",
    skills: [] as string[],
    industries: [] as string[],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      window.location.href = "/investor-dashboard";
      return;
    }

    const snap = await getDoc(doc(db, "investorProfiles", user.uid));

    if (snap.exists()) {
      const data = snap.data();

      setProfile({
        mentorName: data.mentorName || data.name || user.displayName || "",
        designation: data.designation || data.investorType || "",
        organization: data.organization || data.company || "",
        bio: data.bio || "",
        experience: data.experience || "",
        linkedin: data.linkedin || "",
        website: data.website || "",
        email: data.email || user.email || "",
        languages: data.languages || "",
        photo: data.photo || "",
        skills: data.skills || [],
        industries: data.industriesArray || [],
      });
    } else {
      setProfile((prev) => ({
        ...prev,
        mentorName: user.displayName || "",
        email: user.email || "",
      }));
    }

    setLoading(false);
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Image must be below 1MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile({
        ...profile,
        photo: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (profile.skills.includes(value)) return;

    setProfile({
      ...profile,
      skills: [...profile.skills, value],
    });

    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((item) => item !== skill),
    });
  };

  const toggleIndustry = (industry: string) => {
    if (profile.industries.includes(industry)) {
      setProfile({
        ...profile,
        industries: profile.industries.filter((item) => item !== industry),
      });
    } else {
      setProfile({
        ...profile,
        industries: [...profile.industries, industry],
      });
    }
  };

  const saveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    if (
      !profile.mentorName ||
      !profile.photo ||
      !profile.designation ||
      !profile.organization ||
      !profile.bio ||
      !profile.experience ||
      profile.skills.length === 0 ||
      profile.industries.length === 0 ||
      !profile.linkedin ||
      !profile.website ||
      !profile.email ||
      !profile.languages
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        uid: user.uid,

        name: profile.mentorName,
        mentorName: profile.mentorName,

        company: profile.organization,
        organization: profile.organization,

        investorType: profile.designation,
        designation: profile.designation,

        bio: profile.bio,
        experience: profile.experience,

        industries: profile.industries.join(", "),
        industriesArray: profile.industries,

        skills: profile.skills,

        linkedin: profile.linkedin,
        website: profile.website,
        email: profile.email,
        languages: profile.languages,
        photo: profile.photo,

        role: "Investor",
        profileCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "investorProfiles", user.uid), profileData, {
        merge: true,
      });

      localStorage.setItem("investorProfile", JSON.stringify(profileData));
      localStorage.setItem("investorProfileCompleted", "true");

      alert("Profile saved successfully ✅");
      window.location.href = "/investor-portal";
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] flex items-center justify-center">
        <h1 className="text-4xl font-black text-[#07162b]">
          Loading Profile...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] relative overflow-hidden px-6 py-10">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.28),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.28),transparent_35%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* TOP NAV */}
        <div className="rounded-full bg-white/60 border border-white/80 backdrop-blur-2xl shadow-2xl px-6 py-4 flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                "💰"
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black">
                CampusConnect
                <span className="text-blue-600">AI</span>
              </h1>

              <p className="text-[10px] uppercase tracking-[2px] text-blue-700/70">
                Investor Profile
              </p>
            </div>
          </div>

          <Link href="/investor-portal">
            <button className="bg-[#07162b] text-white px-7 py-3 rounded-full font-bold shadow-xl">
              Investor Portal
            </button>
          </Link>
        </div>

        {/* HEADER */}
        <div className="rounded-[48px] bg-white/60 border border-white/80 backdrop-blur-2xl shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black mb-4">
            Create Investor Profile 💰
          </h1>

          <p className="text-slate-600 text-lg">
            A clean card-based profile form that organizes mentor details into
            structured sections for a modern onboarding experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* BASIC CARD */}
          <section className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-8">
            <h2 className="text-3xl font-black mb-6">
              👤 Basic Details
            </h2>

            <div className="w-44 h-44 mx-auto rounded-[32px] bg-blue-100 overflow-hidden flex items-center justify-center text-7xl shadow-xl mb-6">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Investor"
                  className="w-full h-full object-cover"
                />
              ) : (
                "💰"
              )}
            </div>

            <label className="block text-center bg-blue-600 text-white px-7 py-4 rounded-full font-black cursor-pointer shadow-xl mb-5">
              Upload Photo *
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="hidden"
              />
            </label>

            <input
              placeholder="Mentor Name *"
              value={profile.mentorName}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  mentorName: e.target.value,
                })
              }
              className="input-box mb-5"
            />

            <input
              placeholder="Designation *"
              value={profile.designation}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  designation: e.target.value,
                })
              }
              className="input-box mb-5"
            />

            <input
              placeholder="Company / Organization *"
              value={profile.organization}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  organization: e.target.value,
                })
              }
              className="input-box"
            />
          </section>

          {/* ABOUT CARD */}
          <section className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-8 lg:col-span-2">
            <h2 className="text-3xl font-black mb-6">
              📄 About & Experience
            </h2>

            <textarea
              placeholder="Bio / About *"
              value={profile.bio}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio: e.target.value,
                })
              }
              className="input-box h-40 resize-none mb-5"
            />

            <input
              placeholder="Experience Years *"
              value={profile.experience}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  experience: e.target.value,
                })
              }
              className="input-box mb-5"
            />

            <div>
              <label className="font-black text-slate-700 block mb-3">
                Skills & Expertise *
              </label>

              <div className="flex gap-3 mb-4">
                <input
                  placeholder="Add skill and press Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="input-box"
                />

                <button
                  onClick={addSkill}
                  className="bg-[#07162b] text-white px-7 rounded-[22px] font-black"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold"
                  >
                    {skill} ✕
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* INDUSTRIES CARD */}
          <section className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-8 lg:col-span-3">
            <h2 className="text-3xl font-black mb-6">
              🎯 Industries Specialized
            </h2>

            <div className="flex flex-wrap gap-4">
              {industryOptions.map((industry) => (
                <button
                  key={industry}
                  onClick={() => toggleIndustry(industry)}
                  className={`px-6 py-4 rounded-full font-black transition ${
                    profile.industries.includes(industry)
                      ? "bg-blue-600 text-white shadow-xl"
                      : "bg-white text-[#07162b] border border-slate-200"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </section>

          {/* CONTACT CARD */}
          <section className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-8 lg:col-span-3">
            <h2 className="text-3xl font-black mb-6">
              🔗 Contact & Links
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                placeholder="LinkedIn Profile *"
                value={profile.linkedin}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    linkedin: e.target.value,
                  })
                }
                className="input-box"
              />

              <input
                placeholder="Website / Portfolio *"
                value={profile.website}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    website: e.target.value,
                  })
                }
                className="input-box"
              />

              <input
                placeholder="Email *"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                className="input-box"
              />

              <input
                placeholder="Languages Known *"
                value={profile.languages}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    languages: e.target.value,
                  })
                }
                className="input-box"
              />
            </div>
          </section>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full mt-10 bg-blue-600 text-white py-6 rounded-full text-xl font-black shadow-2xl disabled:opacity-60 hover:scale-[1.01] transition"
        >
          {saving ? "Saving..." : "Save Profile 🚀"}
        </button>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          padding: 20px;
          border-radius: 22px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: rgba(255, 255, 255, 0.95);
          outline: none;
          font-size: 16px;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
        }

        .input-box:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }
      `}</style>
    </main>
  );
}