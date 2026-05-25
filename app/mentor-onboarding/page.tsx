"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const industriesList = [
  "AI",
  "Robotics",
  "Web Development",
  "Business",
  "Healthcare",
  "FinTech",
];

export default function MentorOnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    mentorName: "",
    designation: "",
    organization: "",
    bio: "",
    experience: "",
    skills: "",
    linkedin: "",
    website: "",
    email: "",
    languages: "",
    photo: "",
    industries: [] as string[],
  });

  useEffect(() => {
    checkProfileStatus();
  }, []);

  const checkProfileStatus = async () => {
    const user = auth.currentUser;

    if (!user) {
      window.location.href = "/mentor-dashboard";
      return;
    }

    try {
      const mentorRef = doc(db, "mentorProfiles", user.uid);

      const mentorSnap = await getDoc(mentorRef);

      // ✅ EXISTING USER
      if (
        mentorSnap.exists() &&
        mentorSnap.data().profileCompleted === true
      ) {
        window.location.href = "/mentor-portal";
        return;
      }

      // ✅ FIRST TIME USER
      setProfile((prev) => ({
        ...prev,
        mentorName: user.displayName || "",
        email: user.email || "",
      }));

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const uploadPhoto = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const toggleIndustry = (industry: string) => {
    if (profile.industries.includes(industry)) {
      setProfile({
        ...profile,
        industries: profile.industries.filter(
          (i) => i !== industry
        ),
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
      !profile.skills ||
      !profile.linkedin ||
      !profile.website ||
      !profile.email ||
      !profile.languages ||
      profile.industries.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        uid: user.uid,

        mentorName: profile.mentorName,
        designation: profile.designation,
        organization: profile.organization,

        bio: profile.bio,
        experience: profile.experience,
        skills: profile.skills,

        industries: profile.industries,
        linkedin: profile.linkedin,
        website: profile.website,
        email: profile.email,
        languages: profile.languages,

        photo: profile.photo,

        role: "Mentor",
        profileCompleted: true,

        createdAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, "mentorProfiles", user.uid),
        profileData
      );

      localStorage.setItem(
        "mentorProfile",
        JSON.stringify(profileData)
      );

      localStorage.setItem(
        "mentorProfileCompleted",
        "true"
      );

      alert("Mentor profile created successfully ✅");

      window.location.href = "/mentor-portal";
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] flex items-center justify-center">
        <h1 className="text-5xl font-black text-[#07162b]">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] relative overflow-hidden px-6 py-10">
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* TOP BAR */}
        <div className="rounded-full bg-white/70 backdrop-blur-2xl border border-white/70 shadow-2xl px-6 py-4 flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl">
              👨‍🏫
            </div>

            <div>
              <h1 className="text-3xl font-black">
                CampusConnect
                <span className="text-blue-600">AI</span>
              </h1>

              <p className="text-[11px] uppercase tracking-[3px] text-blue-600/70">
                Mentor Onboarding
              </p>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black leading-[0.95] mb-5">
            Create Mentor
            <br />
            Profile 👨‍🏫
          </h1>

          <p className="text-lg text-slate-600 max-w-3xl">
            Complete your one-time onboarding profile before
            accessing the mentor dashboard.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* BASIC DETAILS */}
          <div className="bg-white rounded-[40px] p-8 shadow-2xl">
            <h2 className="text-3xl font-black mb-6">
              👤 Basic Details
            </h2>

            <div className="w-44 h-44 rounded-[30px] bg-slate-100 overflow-hidden mx-auto mb-6">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">
                  👨‍🏫
                </div>
              )}
            </div>

            <label className="block bg-blue-600 text-white text-center py-4 rounded-full font-bold cursor-pointer mb-5 hover:scale-105 transition">
              Upload Profile Photo
              <input
                type="file"
                className="hidden"
                onChange={uploadPhoto}
              />
            </label>

            <input
              placeholder="Mentor Name"
              value={profile.mentorName}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  mentorName: e.target.value,
                })
              }
              className="input-box mb-4"
            />

            <input
              placeholder="Designation"
              value={profile.designation}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  designation: e.target.value,
                })
              }
              className="input-box mb-4"
            />

            <input
              placeholder="Company / Organization"
              value={profile.organization}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  organization: e.target.value,
                })
              }
              className="input-box"
            />
          </div>

          {/* PROFESSIONAL INFO */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-2xl">
              <h2 className="text-3xl font-black mb-6">
                📄 Professional Info
              </h2>

              <textarea
                placeholder="Bio / About"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio: e.target.value,
                  })
                }
                className="input-box h-36 resize-none mb-5"
              />

              <input
                placeholder="Experience (Years)"
                value={profile.experience}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    experience: e.target.value,
                  })
                }
                className="input-box mb-5"
              />

              <input
                placeholder="Skills & Expertise"
                value={profile.skills}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    skills: e.target.value,
                  })
                }
                className="input-box"
              />
            </div>

            {/* INDUSTRIES */}
            <div className="bg-white rounded-[40px] p-8 shadow-2xl">
              <h2 className="text-3xl font-black mb-6">
                🎯 Industries Specialized
              </h2>

              <div className="flex flex-wrap gap-4">
                {industriesList.map((industry) => (
                  <button
                    key={industry}
                    onClick={() =>
                      toggleIndustry(industry)
                    }
                    className={`px-6 py-3 rounded-full font-bold transition ${
                      profile.industries.includes(
                        industry
                      )
                        ? "bg-blue-600 text-white shadow-xl"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTACT */}
            <div className="bg-white rounded-[40px] p-8 shadow-2xl">
              <h2 className="text-3xl font-black mb-6">
                🔗 Contact Info
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  placeholder="LinkedIn Profile"
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
                  placeholder="Website / Portfolio"
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
                  placeholder="Email"
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
                  placeholder="Languages Known"
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
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full text-xl font-black shadow-2xl transition"
        >
          {saving
            ? "Saving..."
            : "Save Profile & Continue 🚀"}
        </button>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          padding: 18px 20px;
          border-radius: 22px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 16px;
          outline: none;
          transition: 0.3s ease;
        }

        .input-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </main>
  );
}