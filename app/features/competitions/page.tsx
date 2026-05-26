"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Competition = {
  id: number;
  title: string;
  organizer: string;
  thumbnail: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  deadline: string;
  rules: string;
  eligibility: string;
  link: string;
  featured: boolean;
};

const defaultCompetitions: Competition[] = [
  {
    id: 1,
    title: "AI Startup Hackathon",
    organizer: "CampusConnectAI",
    thumbnail: "🤖",
    shortDescription: "Build AI solutions for real startup problems.",
    fullDescription:
      "A national-level AI hackathon where startups and students solve real-world problems using AI, ML and automation.",
    category: "AI",
    deadline: "2026-07-20",
    rules: "Team size 1-4. Original work only. Submit prototype and pitch deck.",
    eligibility: "Open to students, founders and early-stage startups.",
    link: "https://example.com/register-ai-hackathon",
    featured: true,
  },
  {
    id: 2,
    title: "FinTech Innovation Challenge",
    organizer: "FinTech Labs",
    thumbnail: "💰",
    shortDescription: "Pitch fintech solutions for digital payments.",
    fullDescription:
      "A startup competition focused on payment, lending, financial inclusion and banking technology ideas.",
    category: "FinTech",
    deadline: "2026-08-10",
    rules: "Submit idea deck, demo video and business model.",
    eligibility: "Open for MVP-stage startups.",
    link: "https://example.com/register-fintech",
    featured: false,
  },
];

export default function CompetitionsPage() {
  const [competitions] = useState<Competition[]>(() => {
    if (typeof window === "undefined") return defaultCompetitions;

    const saved = localStorage.getItem("organizerCompetitions");

    return saved ? JSON.parse(saved) : defaultCompetitions;
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Competition | null>(null);

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.organizer.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "All" || item.category === category;

      return matchSearch && matchCategory;
    });
  }, [competitions, search, category]);

  const categories = ["All", ...Array.from(new Set(competitions.map((c) => c.category)))];

  const joinCompetition = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] px-6 py-10 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="rounded-full border border-white/70 bg-white/60 backdrop-blur-2xl shadow-2xl px-6 py-4 flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-black">Competitions 🏆</h1>
            <p className="text-slate-500">
              Explore startup competitions, hackathons and innovation challenges
            </p>
          </div>

          <Link href="/dashboard">
            <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-bold">
              Back Dashboard
            </button>
          </Link>
        </div>

        <div className="rounded-[45px] bg-white/70 border border-white/80 backdrop-blur-2xl shadow-2xl p-10 mb-10">
          <h2 className="text-6xl font-black">Explore Opportunities 🚀</h2>
          <p className="text-xl text-slate-600 mt-5">
            Discover featured competitions posted by organizers and join using official registration links.
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-10">
            <input
              placeholder="Search by title, category or organizer..."
              className="input-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input-box"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {filteredCompetitions.map((item) => (
            <div
              key={item.id}
              className="rounded-[36px] bg-white/80 border border-white p-8 shadow-xl hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(59,130,246,0.25)] transition duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="text-7xl">{item.thumbnail}</div>

                <div>
                  {item.featured && (
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-black">
                      Featured
                    </span>
                  )}

                  <h2 className="text-4xl font-black mt-4">{item.title}</h2>

                  <p className="text-blue-600 font-bold mt-2">
                    By {item.organizer}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 mt-6 leading-relaxed">
                {item.shortDescription}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                  {item.category}
                </span>

                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                  Deadline: {item.deadline}
                </span>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setSelected(item)}
                  className="flex-1 bg-white border border-[#dbe4f0] py-4 rounded-2xl font-black"
                >
                  View Details
                </button>

                <button
                  onClick={() => joinCompetition(item.link)}
                  className="flex-1 bg-[#07162b] text-white py-4 rounded-2xl font-black"
                >
                  Join Competition
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCompetitions.length === 0 && (
          <div className="rounded-[36px] bg-white/80 p-10 text-center shadow-xl mt-10">
            <h2 className="text-3xl font-black">No competitions found.</h2>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[35px] p-8 max-w-3xl w-full shadow-2xl">
            <div className="flex items-start gap-5">
              <div className="text-7xl">{selected.thumbnail}</div>

              <div>
                <h2 className="text-5xl font-black">{selected.title}</h2>
                <p className="text-blue-600 font-bold mt-2">
                  Organizer: {selected.organizer}
                </p>
              </div>
            </div>

            <div className="space-y-5 mt-8">
              <Info title="Full Description" value={selected.fullDescription} />
              <Info title="Rules & Guidelines" value={selected.rules} />
              <Info title="Eligibility" value={selected.eligibility} />
              <Info title="Deadline" value={selected.deadline} />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => joinCompetition(selected.link)}
                className="flex-1 bg-[#07162b] text-white py-4 rounded-2xl font-black"
              >
                Join Now
              </button>

              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 16px 18px;
          border-radius: 18px;
          outline: none;
          font-size: 15px;
        }

        .input-box:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </main>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#f4f8ff] rounded-[22px] p-5">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="text-slate-600 mt-2">{value}</p>
    </div>
  );
}