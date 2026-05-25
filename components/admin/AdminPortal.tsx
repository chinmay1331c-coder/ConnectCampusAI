"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BarChart3,
  Bell,
  Settings,
  MessageCircle,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

const navItems = [
  ["Dashboard", LayoutDashboard],
  ["Users", Users],
  ["Events", CalendarDays],
  ["Courses", BookOpen],
  ["Analytics", BarChart3],
  ["Reports", AlertTriangle],
  ["Support", MessageCircle],
  ["Settings", Settings],
];

export default function AdminPortal() {
  const [active, setActive] = useState("Dashboard");
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("adminProfile");

    if (saved) {
      setAdmin(JSON.parse(saved));
    }
  }, []);

  const stats = [
    {
      title: "Total Startups",
      value: "1,248",
      color: "text-blue-600",
    },
    {
      title: "Investors",
      value: "324",
      color: "text-green-600",
    },
    {
      title: "Mentors",
      value: "182",
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: "₹12.4L",
      color: "text-cyan-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-100 flex overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200/40 blur-[120px] rounded-full" />

      {/* SIDEBAR */}
      <aside className="relative z-10 w-72 p-5 hidden lg:block shrink-0">
        <div className="bg-white/70 backdrop-blur-3xl border border-white/70 rounded-[36px] shadow-2xl p-5 h-full overflow-hidden">
          
          {/* Logo */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-3xl bg-blue-100 flex items-center justify-center text-2xl shadow-lg mb-4">
              🏢
            </div>

            <h1 className="text-2xl font-black text-slate-950 leading-tight break-words">
              CampusConnect AI
            </h1>

            <p className="text-slate-500 mt-2 text-sm">
              Organizer Dashboard
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            {navItems.map(([label, Icon]: any) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  active === label
                    ? "bg-slate-950 text-white shadow-xl"
                    : "hover:bg-white/80 text-slate-700"
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* AI Card */}
          <div className="mt-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[28px] p-5 text-white shadow-2xl">
            <h3 className="text-xl font-black mb-3">
              AI Monitoring
            </h3>

            <p className="text-blue-50 text-sm leading-relaxed">
              Real-time fraud detection and platform analytics running smoothly.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <section className="relative z-10 flex-1 p-5 overflow-y-auto">
        
        {/* TOPBAR */}
        <div className="bg-white/70 backdrop-blur-3xl border border-white/70 rounded-[36px] shadow-2xl p-6 flex items-center justify-between mb-8">
          
          <div>
            <h2 className="text-5xl font-black text-slate-950">
              {active}
            </h2>

            <p className="text-slate-500 mt-2">
              Welcome back to your organizer control system.
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:scale-105 transition-all">
              <Bell className="text-slate-700" />
            </button>

            <div className="bg-white shadow-xl rounded-3xl px-5 py-3 flex items-center gap-4">
              
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-blue-100">
                {admin?.photo ? (
                  <img
                    src={admin.photo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-black text-slate-950">
                  {admin?.name || "Admin"}
                </h3>

                <p className="text-slate-500 text-sm">
                  {admin?.role || "Organizer"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD */}
        {active === "Dashboard" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="bg-white/70 backdrop-blur-3xl border border-white/70 rounded-[34px] shadow-2xl p-7 hover:scale-[1.02] transition-all"
                >
                  <p className="text-slate-500 font-semibold mb-4">
                    {item.title}
                  </p>

                  <h3 className={`text-5xl font-black ${item.color}`}>
                    {item.value}
                  </h3>
                </div>
              ))}
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Chart */}
              <div className="xl:col-span-2 bg-white/70 backdrop-blur-3xl border border-white/70 rounded-[36px] shadow-2xl p-8">
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-slate-950">
                      Platform Analytics
                    </h3>

                    <p className="text-slate-500 mt-2">
                      Startup growth and engagement
                    </p>
                  </div>

                  <div className="bg-blue-100 text-blue-700 px-5 py-2 rounded-2xl font-bold">
                    Live
                  </div>
                </div>

                {/* Fake Chart */}
                <div className="h-[350px] rounded-[30px] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-end gap-5 p-8 overflow-hidden">
                  {[40, 65, 50, 80, 55, 95, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-3xl shadow-xl hover:scale-105 transition-all"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-8">
                
                {/* AI Insights */}
                <div className="bg-white/70 backdrop-blur-3xl border border-white/70 rounded-[36px] shadow-2xl p-8">
                  
                  <h3 className="text-2xl font-black text-slate-950 mb-6">
                    AI Insights
                  </h3>

                  <div className="space-y-5">
                    <Insight
                      title="Trending Industry"
                      value="AI & SaaS"
                    />

                    <Insight
                      title="Fraud Detection"
                      value="7 suspicious accounts"
                    />

                    <Insight
                      title="Top Category"
                      value="FinTech"
                    />
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-gradient-to-br from-slate-950 to-blue-900 rounded-[36px] shadow-2xl p-8 text-white">
                  
                  <h3 className="text-3xl font-black mb-4">
                    System Status
                  </h3>

                  <p className="text-slate-300 leading-relaxed">
                    All AI systems operational. Platform health excellent.
                  </p>

                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />

                    <span className="font-bold">
                      Running Smoothly
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* OTHER PAGES */}
        {active !== "Dashboard" && (
          <div className="bg-white/70 backdrop-blur-3xl border border-white/70 rounded-[40px] shadow-2xl p-12 min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              
              <h2 className="text-5xl font-black text-slate-950 mb-5">
                {active}
              </h2>

              <p className="text-slate-500 text-xl">
                iOS 26 themed module coming next...
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Insight({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg">
      <p className="text-slate-500 font-medium">
        {title}
      </p>

      <h4 className="text-2xl font-black text-slate-950 mt-2">
        {value}
      </h4>
    </div>
  );
}