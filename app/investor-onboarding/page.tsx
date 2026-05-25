"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function InvestorOnboardingPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    company: "",
    investorType: "",
    bio: "",
    industries: "",
    budget: "",
    stage: "",
    linkedin: "",
    email: "",
  });

  useEffect(() => {
    const checkExistingProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        router.push("/investor-dashboard");
        return;
      }

      const profileRef = doc(db, "investorProfiles", user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists() && profileSnap.data().profileCompleted === true) {
        router.push("/investor-portal");
        return;
      }

      setForm((prev) => ({
        ...prev,
        email: user.email || "",
        name: user.displayName || "",
      }));

      setChecking(false);
    };

    checkExistingProfile();
  }, [router]);

  const uploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Photo must be below 1MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "Required";
      }
    });

    if (!photo) {
      newErrors.photo = "Required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validate()) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      router.push("/investor-dashboard");
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        uid: user.uid,
        ...form,
        photo,
        profileCompleted: true,
        role: "Investor",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "investorProfiles", user.uid), profileData, {
        merge: true,
      });

      localStorage.setItem("investorProfileCompleted", "true");
      localStorage.setItem("investorProfile", JSON.stringify(profileData));

      router.push("/investor-portal");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] flex items-center justify-center">
        <h1 className="text-4xl font-black text-[#07162b]">
          Checking investor profile...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] relative overflow-hidden px-6 py-12">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.20),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.25),transparent_35%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="rounded-[48px] bg-white/70 border border-white/80 shadow-2xl p-10 mb-10">
          <div className="inline-flex items-center gap-3 bg-white/80 border border-white rounded-full px-5 py-3 shadow-xl mb-8">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />

            <span className="text-sm font-bold text-slate-700">
              Mandatory First-Time Investor Setup
            </span>
          </div>

          <h1 className="text-6xl font-black text-[#07162b] mb-5">
            Investor Profile Setup 💰
          </h1>

          <p className="text-xl text-slate-600 max-w-4xl">
            Investors must complete a mandatory profile form on first entry
            before accessing the platform.
          </p>
        </div>

        <div className="rounded-[48px] bg-white/75 border border-white/80 shadow-2xl p-10">
          <div className="mb-10">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[80%] bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
            </div>

            <p className="text-slate-500 mt-3 font-semibold">
              Complete all required details
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-4xl font-black mb-8">
              👤 Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Investor Name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter investor name"
                  className="input-box"
                />
              </Field>

              <Field label="Company / Firm Name" error={errors.company}>
                <input
                  value={form.company}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: e.target.value,
                    })
                  }
                  placeholder="Company / firm name"
                  className="input-box"
                />
              </Field>
            </div>

            <div className="mt-6">
              <label className="font-black text-slate-700 block mb-3">
                Profile Photo *
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={uploadPhoto}
                className="w-full bg-white border border-slate-200 p-5 rounded-[22px]"
              />

              {errors.photo && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.photo}
                </p>
              )}

              {photo && (
                <img
                  src={photo}
                  alt="Investor"
                  className="w-32 h-32 mt-5 rounded-[28px] object-cover shadow-xl"
                />
              )}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-4xl font-black mb-8">
              💼 Investor Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Investor Type" error={errors.investorType}>
                <select
                  value={form.investorType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      investorType: e.target.value,
                    })
                  }
                  className="input-box"
                >
                  <option value="">Select Investor Type</option>
                  <option>Angel Investor</option>
                  <option>Venture Capitalist</option>
                  <option>Mentor</option>
                  <option>Corporate Investor</option>
                </select>
              </Field>

              <Field label="Preferred Industries" error={errors.industries}>
                <input
                  value={form.industries}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      industries: e.target.value,
                    })
                  }
                  placeholder="AI, FinTech, HealthTech..."
                  className="input-box"
                />
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Bio / Experience" error={errors.bio}>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bio: e.target.value,
                    })
                  }
                  placeholder="Describe your investment experience"
                  className="input-box h-36 resize-none"
                />
              </Field>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-4xl font-black mb-8">
              🎯 Investment Preferences
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Investment Budget Range" error={errors.budget}>
                <input
                  value={form.budget}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      budget: e.target.value,
                    })
                  }
                  placeholder="$10K - $1M"
                  className="input-box"
                />
              </Field>

              <Field label="Preferred Startup Stage" error={errors.stage}>
                <select
                  value={form.stage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stage: e.target.value,
                    })
                  }
                  className="input-box"
                >
                  <option value="">Select Startup Stage</option>
                  <option>Idea</option>
                  <option>MVP</option>
                  <option>Growth</option>
                  <option>Scale</option>
                </select>
              </Field>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-4xl font-black mb-8">
              🔗 Contact Info
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="LinkedIn / Website" error={errors.linkedin}>
                <input
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      linkedin: e.target.value,
                    })
                  }
                  placeholder="https://linkedin.com/..."
                  className="input-box"
                />
              </Field>

              <Field label="Contact Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="investor@email.com"
                  className="input-box"
                />
              </Field>
            </div>
          </section>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full bg-[#07162b] hover:bg-blue-700 transition text-white py-6 rounded-[24px] font-black text-xl shadow-[0_20px_50px_rgba(15,23,42,0.25)]"
          >
            {saving ? "Saving Profile..." : "Save & Continue →"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          padding: 20px;
          border-radius: 22px;
          border: 1px solid #e2e8f0;
          background: white;
          outline: none;
          font-size: 16px;
        }

        .input-box:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="font-black text-slate-700 block mb-3">
        {label} *
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}