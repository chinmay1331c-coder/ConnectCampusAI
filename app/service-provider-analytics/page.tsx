// app/service-provider-analytics/page.tsx

"use client";

import { useMemo, useState } from "react";

export default function ServiceProviderAnalyticsPage() {
  // =========================
  // MOCK DATA
  // =========================

  const [projects] = useState([
    {
      id: 1,
      status: "Completed",
      revenue: 5000,
    },

    {
      id: 2,
      status: "In Progress",
      revenue: 3500,
    },

    {
      id: 3,
      status: "Completed",
      revenue: 7200,
    },

    {
      id: 4,
      status: "Pending",
      revenue: 1800,
    },
  ]);

  const [ratings] = useState([
    5, 4, 5, 5, 4,
  ]);

  const [monthlyGrowth] =
    useState([
      {
        month: "Jan",
        value: 20,
      },

      {
        month: "Feb",
        value: 35,
      },

      {
        month: "Mar",
        value: 50,
      },

      {
        month: "Apr",
        value: 70,
      },

      {
        month: "May",
        value: 85,
      },
    ]);

  // =========================
  // ANALYTICS
  // =========================

  const totalRevenue =
    projects.reduce(
      (acc, curr) =>
        acc + curr.revenue,
      0
    );

  const completedProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Completed"
    ).length;

  const activeProjects =
    projects.filter(
      (project) =>
        project.status ===
        "In Progress"
    ).length;

  const pendingProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Pending"
    ).length;

  const averageRating =
    useMemo(() => {
      return (
        ratings.reduce(
          (a, b) => a + b,
          0
        ) / ratings.length
      ).toFixed(1);
    }, [ratings]);

  const completionRate =
    Math.round(
      (completedProjects /
        projects.length) *
        100
    );

  return (
    <main className="min-h-screen bg-[#eef4ff] p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-[#071739]">
              Analytics
              Dashboard 📈
            </h1>

            <p className="text-slate-500 mt-3 text-lg">
              Track growth,
              earnings, projects
              and overall
              provider
              performance.
            </p>
          </div>

          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-5xl shadow-2xl">
            📊
          </div>
        </div>

        {/* STATS */}

        <div className="grid lg:grid-cols-4 gap-6 mt-8">
          {/* REVENUE */}

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Total Revenue
            </p>

            <h2 className="text-5xl font-black text-green-600 mt-4">
              $
              {totalRevenue.toLocaleString()}
            </h2>
          </div>

          {/* COMPLETED */}

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Completed
              Projects
            </p>

            <h2 className="text-5xl font-black text-blue-600 mt-4">
              {
                completedProjects
              }
            </h2>
          </div>

          {/* ACTIVE */}

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Active Projects
            </p>

            <h2 className="text-5xl font-black text-cyan-600 mt-4">
              {activeProjects}
            </h2>
          </div>

          {/* RATING */}

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Average Rating
            </p>

            <h2 className="text-5xl font-black text-yellow-500 mt-4">
              ⭐{" "}
              {
                averageRating
              }
            </h2>
          </div>
        </div>

        {/* SECOND ROW */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* COMPLETION */}

          <div className="bg-white rounded-[35px] shadow-xl p-8">
            <h2 className="text-3xl font-black text-[#071739]">
              Completion
              Rate
            </h2>

            <div className="mt-8">
              <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>

              <p className="text-5xl font-black text-[#071739] mt-6">
                {
                  completionRate
                }
                %
              </p>
            </div>
          </div>

          {/* PROJECT STATUS */}

          <div className="bg-white rounded-[35px] shadow-xl p-8">
            <h2 className="text-3xl font-black text-[#071739]">
              Project Status
            </h2>

            <div className="space-y-5 mt-8">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  Completed
                </p>

                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                  {
                    completedProjects
                  }
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  In Progress
                </p>

                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                  {activeProjects}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  Pending
                </p>

                <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                  {
                    pendingProjects
                  }
                </div>
              </div>
            </div>
          </div>

          {/* VERIFIED */}

          <div className="bg-white rounded-[35px] shadow-xl p-8 flex flex-col justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white text-5xl shadow-2xl">
              ✅
            </div>

            <h2 className="text-3xl font-black text-[#071739] mt-6">
              Verified Provider
            </h2>

            <p className="text-slate-500 mt-3">
              Your account is
              trusted and verified
              by startups.
            </p>
          </div>
        </div>

        {/* MONTHLY GROWTH */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-[#071739]">
              Monthly Growth
              📈
            </h2>

            <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-full font-black">
              +85% Growth
            </div>
          </div>

          {/* CHART */}

          <div className="flex items-end gap-6 h-[350px] mt-12">
            {monthlyGrowth.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full rounded-t-[24px] bg-gradient-to-t from-blue-600 to-cyan-400 transition-all hover:scale-105"
                    style={{
                      height: `${item.value * 2.5}px`,
                    }}
                  />

                  <p className="mt-4 text-lg font-bold text-[#071739]">
                    {item.month}
                  </p>

                  <p className="text-slate-500 mt-1">
                    {item.value}%
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* PERFORMANCE */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* SUCCESS */}

          <div className="bg-white rounded-[35px] shadow-xl p-8">
            <h2 className="text-3xl font-black text-[#071739]">
              Success Score
            </h2>

            <div className="mt-10 flex items-center gap-8">
              <div className="w-44 h-44 rounded-full border-[16px] border-blue-500 flex items-center justify-center">
                <span className="text-5xl font-black text-[#071739]">
                  96%
                </span>
              </div>

              <div>
                <p className="text-xl font-semibold text-slate-600">
                  Excellent
                  Provider
                  Performance
                </p>

                <p className="text-slate-500 mt-3 leading-relaxed">
                  High client
                  satisfaction and
                  project delivery
                  success.
                </p>
              </div>
            </div>
          </div>

          {/* CLIENT FEEDBACK */}

          <div className="bg-white rounded-[35px] shadow-xl p-8">
            <h2 className="text-3xl font-black text-[#071739]">
              Client Feedback
            </h2>

            <div className="space-y-5 mt-8">
              <div className="bg-blue-50 rounded-[24px] p-5">
                <p className="italic text-slate-700">
                  “Amazing work and
                  excellent support
                  throughout the
                  project.”
                </p>

                <p className="font-black text-[#071739] mt-4">
                  — AI Startup
                </p>
              </div>

              <div className="bg-green-50 rounded-[24px] p-5">
                <p className="italic text-slate-700">
                  “Highly
                  professional and
                  delivered before
                  deadline.”
                </p>

                <p className="font-black text-[#071739] mt-4">
                  — FinTech Labs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}