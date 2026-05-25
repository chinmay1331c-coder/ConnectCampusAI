"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminOnboardingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    organization: "",
    role: "Organizer Admin",
    email: "",
    phone: "",
    permissions: "Full Access",
    security: "2FA Enabled",
    photo: "",
  });

  const submitProfile = () => {
    localStorage.setItem("adminProfile", JSON.stringify(form));
    localStorage.setItem("adminProfileCompleted", "true");

    router.push("/admin-dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-100 flex items-center justify-center px-6 py-12 overflow-hidden relative">
      
      {/* Glow Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200/40 blur-[120px] rounded-full" />

      <section className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg mb-8 border border-white/60">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-sm font-bold text-slate-700">
              Organizer Admin Setup
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-black text-slate-950 leading-[0.9] mb-8">
            Complete <br />
            Profile 🏢
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-2xl leading-relaxed max-w-xl">
            Setup your organizer profile to access platform
            management, analytics, AI systems and governance tools.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-12 flex-wrap">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[30px] shadow-2xl border border-white/60 p-8 w-44 hover:scale-105 transition-all">
              <h3 className="text-5xl font-black text-blue-600">
                24/7
              </h3>

              <p className="font-bold text-slate-600 mt-3">
                Monitoring
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-2xl rounded-[30px] shadow-2xl border border-white/60 p-8 w-44 hover:scale-105 transition-all">
              <h3 className="text-5xl font-black text-cyan-600">
                AI
              </h3>

              <p className="font-bold text-slate-600 mt-3">
                Powered
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/70 p-10 hover:shadow-blue-200/50 transition-all duration-300">
          
          {/* Icon */}
          <div className="w-20 h-20 rounded-[28px] bg-blue-100 shadow-lg flex items-center justify-center text-4xl mb-7">
            🏢
          </div>

          {/* Title */}
          <h2 className="text-5xl font-black text-slate-950 leading-none mb-3">
            Admin <br />
            Setup
          </h2>

          <p className="text-slate-500 font-medium mb-8">
            Complete onboarding to continue
          </p>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <Input
              placeholder="Admin Name"
              value={form.name}
              onChange={(v) =>
                setForm({ ...form, name: v })
              }
            />

            <Input
              placeholder="Organization"
              value={form.organization}
              onChange={(v) =>
                setForm({ ...form, organization: v })
              }
            />

            <Input
              placeholder="Email"
              value={form.email}
              onChange={(v) =>
                setForm({ ...form, email: v })
              }
            />

            <Input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(v) =>
                setForm({ ...form, phone: v })
              }
            />

            <Input
              placeholder="Profile Photo URL"
              value={form.photo}
              onChange={(v) =>
                setForm({ ...form, photo: v })
              }
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
              className="h-16 rounded-2xl border border-slate-200 bg-white/90 px-5 outline-none text-slate-700 font-medium shadow-sm focus:ring-4 focus:ring-blue-200 transition-all"
            >
              <option>Organizer Admin</option>
              <option>Super Admin</option>
              <option>Verification Admin</option>
              <option>Event Manager</option>
            </select>

            <select
              value={form.permissions}
              onChange={(e) =>
                setForm({
                  ...form,
                  permissions: e.target.value,
                })
              }
              className="h-16 rounded-2xl border border-slate-200 bg-white/90 px-5 outline-none text-slate-700 font-medium shadow-sm focus:ring-4 focus:ring-blue-200 transition-all"
            >
              <option>Full Access</option>
              <option>Moderate Access</option>
              <option>Read Only</option>
            </select>

            <select
              value={form.security}
              onChange={(e) =>
                setForm({
                  ...form,
                  security: e.target.value,
                })
              }
              className="h-16 rounded-2xl border border-slate-200 bg-white/90 px-5 outline-none text-slate-700 font-medium shadow-sm focus:ring-4 focus:ring-blue-200 transition-all"
            >
              <option>2FA Enabled</option>
              <option>Password Only</option>
              <option>Restricted Login</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={submitProfile}
            className="w-full h-16 rounded-2xl bg-slate-950 text-white font-black text-lg shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 mt-8"
          >
            Complete Setup →
          </button>
        </div>
      </section>
    </main>
  );
}

type InputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function Input({
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-16 rounded-2xl border border-slate-200 bg-white/90 px-5 outline-none text-slate-700 font-medium shadow-sm focus:ring-4 focus:ring-blue-200 transition-all"
    />
  );
}