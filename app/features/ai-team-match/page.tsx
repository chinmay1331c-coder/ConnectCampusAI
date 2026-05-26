"use client";

import { useMemo, useState } from "react";

type UserType = {
  id: number;
  name: string;
  bio: string;
  skills: string[];
  interests: string[];
  role: string;
};

const users: UserType[] = [
  {
    id: 1,
    name: "Rahul AI",
    bio: "AI Engineer building ML startups",
    skills: ["AI", "Python", "ML"],
    interests: ["AI", "Startups"],
    role: "Developer",
  },

  {
    id: 2,
    name: "Sneha UX",
    bio: "Creative startup designer",
    skills: ["UI/UX", "Figma", "Branding"],
    interests: ["FinTech", "Startups"],
    role: "Designer",
  },

  {
    id: 3,
    name: "Arjun Biz",
    bio: "Business strategist for SaaS startups",
    skills: ["Marketing", "Sales", "Pitching"],
    interests: ["Business", "AI"],
    role: "Business",
  },

  {
    id: 4,
    name: "Meera Tech",
    bio: "Frontend developer & React expert",
    skills: ["React", "Next.js", "Firebase"],
    interests: ["HealthTech", "AI"],
    role: "Developer",
  },
];

export default function AITeamMatchPage() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [role, setRole] = useState("");
  const [idea, setIdea] = useState("");

  const [started, setStarted] = useState(false);

  const [teamRequests, setTeamRequests] = useState<any[]>([]);

  const matches = useMemo(() => {
    if (!started) return [];

    const userSkills = skills
      .toLowerCase()
      .split(",")
      .map((s) => s.trim());

    const userInterests = interests
      .toLowerCase()
      .split(",")
      .map((s) => s.trim());

    return users.map((user) => {
      const skillMatch =
        user.skills.filter((skill) =>
          userSkills.includes(skill.toLowerCase())
        ).length / Math.max(user.skills.length, 1);

      const interestMatch =
        user.interests.filter((interest) =>
          userInterests.includes(interest.toLowerCase())
        ).length / Math.max(user.interests.length, 1);

      const roleFit =
        user.role.toLowerCase() === role.toLowerCase()
          ? 1
          : 0.5;

      const matchScore =
        skillMatch * 0.4 +
        interestMatch * 0.3 +
        roleFit * 0.3;

      return {
        ...user,
        score: Math.round(matchScore * 100),
        reason:
          skillMatch > 0.5
            ? "Strong skill match"
            : interestMatch > 0.5
            ? "Shared startup interests"
            : "Complementary teammate profile",
      };
    });
  }, [started, skills, interests, role]);

  const inviteToTeam = (user: UserType) => {
    const request = {
      sender: "You",
      receiver: user.name,
      idea,
      roleRequired: role,
      status: "pending",
    };

    setTeamRequests((prev) => [...prev, request]);

    alert(`Invite sent to ${user.name} 🚀`);
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] p-8">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}

        <div className="glass p-10 rounded-[40px]">
          <h1 className="text-6xl font-black">
            AI Team Match 🤝
          </h1>

          <p className="text-slate-600 text-xl mt-5">
            Find the perfect teammates using AI-powered
            matching based on skills, startup interests
            and collaboration goals.
          </p>
        </div>

        {/* INPUT PANEL */}

        <div className="glass p-10 rounded-[40px] mt-10">
          <h2 className="text-4xl font-black">
            Find Your Perfect Teammates 🚀
          </h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Skills (React, AI, Marketing)"
              className="input"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <input
              placeholder="Interests (AI, FinTech)"
              className="input"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />

            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Preferred Role</option>
              <option>Developer</option>
              <option>Designer</option>
              <option>Business</option>
            </select>

            <input
              placeholder="Startup Idea"
              className="input"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
          </div>

          <button
            onClick={() => setStarted(true)}
            className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black hover:scale-105 transition"
          >
            Find Matches
          </button>
        </div>

        {/* MATCHES */}

        {started && (
          <div className="mt-10">
            <h2 className="text-5xl font-black mb-8">
              AI Match Results ⚡
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {matches.map((user) => (
                <div
                  key={user.id}
                  className="glass p-8 rounded-[35px] hover:-translate-y-2 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-4xl font-black">
                        {user.name}
                      </h2>

                      <p className="text-slate-500 mt-2">
                        {user.bio}
                      </p>
                    </div>

                    <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-black text-xl">
                      {user.score}%
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="font-bold">Skills</p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="tag-blue"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="font-bold">Interests</p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      {user.interests.map((interest) => (
                        <span
                          key={interest}
                          className="tag-green"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 bg-[#f4f8ff] rounded-2xl p-5">
                    <p className="font-black">AI Insight</p>

                    <p className="text-slate-600 mt-2">
                      {user.reason}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button className="btn-light">
                      🤝 Connect
                    </button>

                    <button className="btn-light">
                      💬 Chat
                    </button>

                    <button
                      onClick={() => inviteToTeam(user)}
                      className="btn-dark"
                    >
                      ➕ Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAM REQUESTS */}

        {teamRequests.length > 0 && (
          <div className="glass p-10 rounded-[40px] mt-14">
            <h2 className="text-4xl font-black">
              Team Invites 📩
            </h2>

            <div className="space-y-5 mt-8">
              {teamRequests.map((req, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black">
                        {req.receiver}
                      </h3>

                      <p className="text-slate-500 mt-2">
                        Startup Idea: {req.idea}
                      </p>

                      <p className="text-slate-500">
                        Required Role: {req.roleRequired}
                      </p>
                    </div>

                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .glass {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .input {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: white;
          padding: 18px;
          border-radius: 18px;
          outline: none;
        }

        .tag-blue {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 700;
        }

        .tag-green {
          background: #dcfce7;
          color: #15803d;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 700;
        }

        .btn-light {
          flex: 1;
          background: white;
          border: 1px solid #dbe4f0;
          padding: 14px;
          border-radius: 18px;
          font-weight: 800;
        }

        .btn-dark {
          flex: 1;
          background: #07162b;
          color: white;
          padding: 14px;
          border-radius: 18px;
          font-weight: 800;
        }
      `}</style>
    </main>
  );
}