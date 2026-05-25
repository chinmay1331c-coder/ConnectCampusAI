// app/service-provider-dashboard/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServiceProviderDashboard() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn =
      localStorage.getItem(
        "serviceProviderLoggedIn"
      );

    if (!loggedIn) {
      router.push(
        "/service-provider-login"
      );
    }
  }, [router]);

  const dashboardCards = [
    {
      title: "Services",
      icon: "🛠️",
      desc: "Create and manage startup services",
      route:
        "/service-provider-services",
      color:
        "from-orange-500 to-red-400",
    },

    {
      title: "Projects",
      icon: "📊",
      desc: "Track startup project progress",
      route:
        "/service-provider-projects",
      color:
        "from-blue-500 to-cyan-400",
    },

    {
      title: "Requests",
      icon: "📩",
      desc: "Accept or reject startup requests",
      route:
        "/service-provider-requests",
      color:
        "from-green-500 to-emerald-400",
    },

    {
      title: "Messages",
      icon: "💬",
      desc: "Chat with startup founders",
      route:
        "/service-provider-messages",
      color:
        "from-purple-500 to-pink-400",
    },

    {
      title: "Analytics",
      icon: "📈",
      desc: "View earnings and performance",
      route:
        "/service-provider-analytics",
      color:
        "from-yellow-500 to-orange-400",
    },

    {
      title: "Settings",
      icon: "⚙️",
      desc: "Manage account settings",
      route:
        "/service-provider-settings",
      color:
        "from-slate-600 to-slate-400",
    },
  ];

  return (
    <main className="min-h-screen bg-[#eef4ff]">
      {/* TOP HEADER */}

      <div className="bg-white border-b border-[#dbe4f0] px-10 py-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl">
        {/* LEFT */}

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center text-white text-3xl shadow-xl">
            🛠️
          </div>

          <div>
            <h1 className="text-3xl font-black text-[#071739]">
              Service Provider Dashboard
            </h1>

            <p className="text-slate-500">
              Manage services, projects and startup
              collaborations
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              router.push(
                "/service-provider-profile"
              )
            }
            className="bg-white border border-[#dbe4f0] hover:border-orange-400 transition px-6 py-3 rounded-2xl font-bold shadow-sm"
          >
            Profile
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                "serviceProviderLoggedIn"
              );

              router.push(
                "/service-provider-login"
              );
            }}
            className="bg-[#071739] hover:bg-red-600 transition text-white px-6 py-3 rounded-2xl font-bold shadow-xl"
          >
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}

      <div className="p-10">
        {/* HERO */}

        <div className="bg-gradient-to-r from-[#071739] to-blue-700 rounded-[35px] p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="w-24 h-24 rounded-[30px] bg-white/20 backdrop-blur-xl flex items-center justify-center text-5xl shadow-2xl">
              🚀
            </div>

            <h1 className="text-6xl font-black mt-8 leading-tight">
              Welcome Service Provider
            </h1>

            <p className="text-white/80 text-xl mt-5 max-w-3xl leading-relaxed">
              Offer professional startup services,
              manage projects, receive requests and
              grow your startup network inside
              CampusConnectAI.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/service-provider-services"
                )
              }
              className="mt-10 bg-white text-[#071739] hover:scale-105 transition px-10 py-5 rounded-2xl font-black text-xl shadow-2xl"
            >
              + Post New Service
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="grid lg:grid-cols-4 gap-6 mt-10">
          {[
            {
              title:
                "Active Projects",
              value: "12",
            },

            {
              title:
                "Startup Requests",
              value: "34",
            },

            {
              title:
                "Services Posted",
              value: "8",
            },

            {
              title:
                "Revenue",
              value: "₹2.4L",
            },
          ].map(
            (item, index) => (
              <div
                key={index}
                className="bg-white rounded-[30px] p-8 shadow-xl border border-[#dbe4f0]"
              >
                <h3 className="text-slate-500 font-semibold">
                  {item.title}
                </h3>

                <h1 className="text-5xl font-black text-[#071739] mt-4">
                  {item.value}
                </h1>
              </div>
            )
          )}
        </div>

        {/* DASHBOARD CARDS */}

        <div className="mt-14">
          <h2 className="text-4xl font-black text-[#071739]">
            Portal Features
          </h2>

          <p className="text-slate-500 text-lg mt-2">
            Access all service provider tools from
            one place.
          </p>

          <div className="grid lg:grid-cols-3 gap-8 mt-10">
            {dashboardCards.map(
              (card, index) => (
                <div
                  key={index}
                  onClick={() =>
                    router.push(
                      card.route
                    )
                  }
                  className="group cursor-pointer bg-white rounded-[35px] p-8 shadow-xl border border-[#dbe4f0] hover:-translate-y-3 hover:shadow-[0_0_55px_rgba(59,130,246,0.25)] transition-all duration-500 relative overflow-hidden"
                >
                  {/* SHIMMER */}

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full skew-x-12" />

                  {/* ICON */}

                  <div
                    className={`relative z-10 w-24 h-24 rounded-[28px] bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-5xl shadow-2xl group-hover:scale-110 transition duration-500`}
                  >
                    {card.icon}
                  </div>

                  {/* TEXT */}

                  <div className="relative z-10 mt-8">
                    <h2 className="text-4xl font-black text-[#071739]">
                      {card.title}
                    </h2>

                    <p className="text-slate-500 text-lg leading-relaxed mt-5">
                      {card.desc}
                    </p>
                  </div>

                  {/* LINE */}

                  <div className="relative z-10 mt-8 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700" />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}