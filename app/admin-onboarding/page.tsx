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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Complete Admin Profile</h1>
        <p className="text-slate-400 mb-6">First-time setup is mandatory.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["name", "Admin Name"],
            ["organization", "Organization Name"],
            ["email", "Email"],
            ["phone", "Phone Number"],
            ["photo", "Profile Photo URL"],
          ].map(([key, label]) => (
            <input
              key={key}
              className="p-3 rounded-xl bg-slate-800"
              placeholder={label}
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}

          <select className="p-3 rounded-xl bg-slate-800" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Organizer Admin</option>
            <option>Super Admin</option>
            <option>Event Manager</option>
            <option>Verification Admin</option>
          </select>

          <select className="p-3 rounded-xl bg-slate-800" value={form.permissions} onChange={(e) => setForm({ ...form, permissions: e.target.value })}>
            <option>Full Access</option>
            <option>Moderate Access</option>
            <option>Read Only</option>
          </select>

          <select className="p-3 rounded-xl bg-slate-800" value={form.security} onChange={(e) => setForm({ ...form, security: e.target.value })}>
            <option>2FA Enabled</option>
            <option>Password Only</option>
            <option>Restricted Login</option>
          </select>
        </div>

        <button onClick={submitProfile} className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold">
          Save & Enter Dashboard
        </button>
      </div>
    </div>
  );
}