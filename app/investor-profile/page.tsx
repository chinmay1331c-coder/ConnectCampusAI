"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function InvestorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    company: "",
    investorType: "",
    phone: "",
    bio: "",
    industries: "",
    budget: "",
    stage: "",
    linkedin: "",
    email: "",
    photo: "",
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
        name: data.name || user.displayName || "",
        company: data.company || "",
        investorType: data.investorType || "",
        phone: data.phone || "",
        bio: data.bio || "",
        industries: data.industries || "",
        budget: data.budget || "",
        stage: data.stage || "",
        linkedin: data.linkedin || "",
        email: data.email || user.email || "",
        photo: data.photo || "",
      });
    } else {
      setProfile((prev) => ({
        ...prev,
        name: user.displayName || "",
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

  const saveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    if (
      !profile.name ||
      !profile.company ||
      !profile.investorType ||
      !profile.phone ||
      !profile.bio ||
      !profile.industries ||
      !profile.budget ||
      !profile.stage ||
      !profile.linkedin ||
      !profile.email ||
      !profile.photo
    ) {
      alert("All fields are mandatory");
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        uid: user.uid,
        ...profile,
        role: "Investor",
        profileCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "investorProfiles", user.uid), profileData, {
        merge: true,
      });

      localStorage.setItem("investorProfile", JSON.stringify(profileData));
      localStorage.setItem("investorProfileCompleted", "true");

      alert("Investor profile saved ✅");
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
          Loading Investor Profile...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] relative overflow-hidden px-6 py-10">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.28),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.28),transparent_35%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* TOP BAR */}
        <div className="rounded-full bg-white/55 border border-white/80 backdrop-blur-2xl shadow-2xl px-6 py-4 flex justify-between items-center mb-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
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

        {/* MAIN CARD */}
        <div className="max-w-5xl mx-auto rounded-[48px] bg-white/55 border border-white/80 backdrop-blur-2xl shadow-2xl p-10 mt-0">
          <h1 className="text-5xl font-black mb-3">
            Edit Investor Profile 💰
          </h1>

          <p className="text-slate-600 mb-10">
            All fields are mandatory. Complete your investor profile.
          </p>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* IMAGE CARD */}
            <div className="rounded-[36px] bg-white p-8 shadow-2xl text-center h-fit">
              <div className="w-44 h-44 mx-auto rounded-[32px] bg-blue-100 overflow-hidden flex items-center justify-center text-7xl shadow-xl">
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

              <label className="mt-7 inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-black cursor-pointer shadow-xl hover:scale-105 transition">
                Upload Image *
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="hidden"
                />
              </label>

              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    photo: "",
                  })
                }
                className="mt-6 w-full bg-red-100 text-red-600 px-7 py-4 rounded-full font-black"
              >
                Remove Image
              </button>

              <p className="text-slate-500 text-sm mt-6">
                Required. Image below 1MB.
              </p>
            </div>

            {/* FORM */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  placeholder="Investor Name *"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  className="input-box"
                />

                <input
                  placeholder="Company / Firm Name *"
                  value={profile.company}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      company: e.target.value,
                    })
                  }
                  className="input-box"
                />

                <select
                  value={profile.investorType}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      investorType: e.target.value,
                    })
                  }
                  className="input-box"
                >
                  <option value="">Investor Type *</option>
                  <option>Angel Investor</option>
                  <option>Venture Capitalist</option>
                  <option>Mentor</option>
                  <option>Corporate Investor</option>
                </select>

                <input
                  placeholder="Phone Number *"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                  className="input-box"
                />
              </div>

              <textarea
                placeholder="Bio / Experience *"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio: e.target.value,
                  })
                }
                className="input-box h-32 resize-none"
              />

              <textarea
                placeholder="Preferred Industries *"
                value={profile.industries}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    industries: e.target.value,
                  })
                }
                className="input-box h-28 resize-none"
              />

              <textarea
                placeholder="Investment Budget Range *"
                value={profile.budget}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    budget: e.target.value,
                  })
                }
                className="input-box h-28 resize-none"
              />

              <textarea
                placeholder="LinkedIn / Website *"
                value={profile.linkedin}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    linkedin: e.target.value,
                  })
                }
                className="input-box h-28 resize-none"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <select
                  value={profile.stage}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      stage: e.target.value,
                    })
                  }
                  className="input-box"
                >
                  <option value="">Preferred Startup Stage *</option>
                  <option>Idea</option>
                  <option>MVP</option>
                  <option>Growth</option>
                  <option>Scale</option>
                </select>

                <input
                  placeholder="Contact Email *"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                  className="input-box"
                />
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-5 rounded-full text-xl font-black shadow-2xl disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile 🚀"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          padding: 20px;
          border-radius: 22px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: rgba(255, 255, 255, 0.9);
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