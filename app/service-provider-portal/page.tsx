"use client";

import Link from "next/link";

export default function ServiceProviderPortalPage() {
  const providers = [
    {
      name: "AI Tech Studio",
      category: "AI/ML Services",
      price: "$5K - $15K",
      rating: "4.9",
    },
    {
      name: "CloudX Agency",
      category: "Cloud Hosting",
      price: "$2K - $8K",
      rating: "4.8",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f8ff] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* NAVBAR */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-full shadow-2xl px-8 py-4 flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#07162b]">
              CampusConnectAI
            </h1>

            <p className="text-sm text-blue-600 tracking-[2px] uppercase">
              Service Provider Portal
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/service-provider-profile">
              <button className="bg-white px-7 py-3 rounded-full font-black shadow-xl">
                Profile
              </button>
            </Link>

            <button className="bg-[#07162b] text-white px-7 py-3 rounded-full font-black shadow-xl">
              Logout
            </button>
          </div>
        </div>

        {/* HERO */}
        <div className="bg-white rounded-[40px] shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black text-[#07162b]">
            Service Provider Dashboard 🚀
          </h1>

          <p className="text-slate-600 text-xl mt-5 max-w-3xl">
            Showcase services, manage startup
            projects, communicate with clients and
            grow using AI-powered recommendations.
          </p>

          <div className="grid md:grid-cols-4 gap-5 mt-10">
            <StatCard
              title="Active Clients"
              value="24"
            />

            <StatCard
              title="Projects"
              value="89"
            />

            <StatCard
              title="Earnings"
              value="$120K"
            />

            <StatCard
              title="Rating"
              value="4.9 ⭐"
            />
          </div>
        </div>

        {/* FEATURES */}
        <div className="grid lg:grid-cols-2 gap-8">
          <FeatureCard
            emoji="📩"
            title="Hiring Requests"
            desc="Manage startup hiring requests and send proposals."
          />

          <FeatureCard
            emoji="📊"
            title="Project Tracking"
            desc="Track milestones, deadlines and project updates."
          />

          <FeatureCard
            emoji="🤖"
            title="AI Matching"
            desc="Get AI recommendations for best startup matches."
          />

          <FeatureCard
            emoji="💬"
            title="Communication"
            desc="Chat, video meetings and discussion rooms."
          />
        </div>

        {/* PROVIDERS */}
        <div className="mt-12">
          <h2 className="text-5xl font-black text-[#07162b] mb-8">
            🌟 Top Providers
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {providers.map((provider, index) => (
              <div
                key={index}
                className="bg-white rounded-[35px] shadow-2xl p-8"
              >
                <h2 className="text-4xl font-black text-[#07162b]">
                  {provider.name}
                </h2>

                <p className="text-slate-500 mt-3 text-lg">
                  {provider.category}
                </p>

                <div className="flex justify-between items-center mt-8">
                  <div>
                    <p className="text-slate-500 font-bold">
                      Price
                    </p>

                    <h3 className="text-2xl font-black text-blue-600">
                      {provider.price}
                    </h3>
                  </div>

                  <div>
                    <p className="text-slate-500 font-bold">
                      Rating
                    </p>

                    <h3 className="text-2xl font-black">
                      {provider.rating}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-black shadow-xl">
                    Hire Now
                  </button>

                  <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-black shadow-xl">
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 rounded-[30px] p-6 shadow-lg">
      <p className="text-slate-500 font-bold">
        {title}
      </p>

      <h2 className="text-4xl font-black mt-3 text-[#07162b]">
        {value}
      </h2>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-[35px] shadow-2xl p-8">
      <div className="text-6xl mb-6">
        {emoji}
      </div>

      <h2 className="text-4xl font-black text-[#07162b]">
        {title}
      </h2>

      <p className="text-slate-600 text-lg leading-relaxed mt-5">
        {desc}
      </p>
    </div>
  );
}