"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  duration: string;
  category: string;
  video: string;
  outcomes: string[];
};

export default function AIAcceleratorPage() {
  // =========================
  // IDEA GENERATOR
  // =========================

  const [ideaInput, setIdeaInput] = useState({
    domain: "",
    problem: "",
    interests: "",
  });

  const [ideaResult, setIdeaResult] = useState<any>(null);

  const generateIdea = () => {
    if (
      !ideaInput.domain ||
      !ideaInput.problem ||
      !ideaInput.interests
    ) {
      alert("Fill all fields");
      return;
    }

    setIdeaResult({
      name: `${ideaInput.domain}X AI`,
      description: `An AI-powered startup solving ${ideaInput.problem} using smart automation and analytics.`,
      users: "Students, startups and businesses",
      uvp: "AI-driven platform with automation, insights and scalable workflows.",
    });
  };

  // =========================
  // INVESTOR MEMO
  // =========================

  const [memoInput, setMemoInput] = useState({
    startup: "",
    problem: "",
    solution: "",
    market: "",
    revenue: "",
  });

  const [memo, setMemo] = useState<any>(null);

  const generateMemo = () => {
    if (
      !memoInput.startup ||
      !memoInput.problem ||
      !memoInput.solution ||
      !memoInput.market ||
      !memoInput.revenue
    ) {
      alert("Fill all fields");
      return;
    }

    setMemo({
      problem: memoInput.problem,
      solution: memoInput.solution,
      market: memoInput.market,
      model: memoInput.revenue,
      vision: `To become a leading AI-powered startup in ${memoInput.market}.`,
    });
  };

  // =========================
  // PITCH PRACTICE
  // =========================

  const practiceQuestions = [
    "What problem are you solving?",
    "Who are your target users?",
    "What is your revenue model?",
    "Why now?",
    "How are you different from competitors?",
  ];

  // =========================
  // COURSE ASSISTANT
  // =========================

  const [courseInput, setCourseInput] = useState({
    interest: "",
    level: "",
    goal: "",
  });

  const [recommendations, setRecommendations] = useState<string[]>([]);

  const recommendCourses = () => {
    const interest =
      courseInput.interest.toLowerCase();

    if (interest.includes("ai")) {
      setRecommendations([
        "Intro to AI",
        "Machine Learning Basics",
        "AI Product Building",
      ]);

      return;
    }

    if (interest.includes("business")) {
      setRecommendations([
        "Startup Growth",
        "Business Fundamentals",
        "Investor Pitching",
      ]);

      return;
    }

    setRecommendations([
      "Startup Fundamentals",
      "MVP Building",
      "Growth Strategy",
    ]);
  };

  // =========================
  // ORGANIZER COURSES
  // =========================

  const courses = useMemo(() => {
    if (typeof window === "undefined") return [];

    const organizerCourses = JSON.parse(
      localStorage.getItem("organizerCourses") || "[]"
    );

    if (organizerCourses.length > 0) {
      return organizerCourses;
    }

    return [
      {
        id: 1,
        title: "Intro to AI",
        description:
          "Learn AI fundamentals and startup AI integration.",
        thumbnail: "🤖",
        rating: 4.8,
        duration: "6 Weeks",
        category: "AI",
        video: "https://www.youtube.com/embed/2ePf9rue1Ao",
        outcomes: [
          "Understand AI basics",
          "Learn ML workflows",
          "Build AI startup ideas",
        ],
      },

      {
        id: 2,
        title: "Startup Pitch Mastery",
        description:
          "Create investor-ready pitch decks and business strategies.",
        thumbnail: "🚀",
        rating: 4.7,
        duration: "4 Weeks",
        category: "Business",
        video: "https://www.youtube.com/embed/8S0FDjFBj8o",
        outcomes: [
          "Pitch confidently",
          "Understand VC expectations",
          "Build investor memos",
        ],
      },
    ];
  }, []);

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] px-6 py-10 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="rounded-[45px] bg-white/70 border border-white shadow-2xl p-10 flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-black">
              AI Accelerator ⚡
            </h1>

            <p className="text-xl text-slate-600 mt-5">
              Build, learn and grow your startup using AI tools and courses.
            </p>
          </div>

          <Link href="/dashboard">
            <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-bold">
              Back Dashboard
            </button>
          </Link>
        </div>

        {/* TOOLS */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {/* IDEA */}

          <div className="glass-card">
            <h2 className="tool-title">
              🚀 Startup Idea Generator
            </h2>

            <div className="space-y-4 mt-6">
              <input
                placeholder="Domain"
                className="input-box"
                value={ideaInput.domain}
                onChange={(e) =>
                  setIdeaInput({
                    ...ideaInput,
                    domain: e.target.value,
                  })
                }
              />

              <input
                placeholder="Problem Area"
                className="input-box"
                value={ideaInput.problem}
                onChange={(e) =>
                  setIdeaInput({
                    ...ideaInput,
                    problem: e.target.value,
                  })
                }
              />

              <input
                placeholder="Interests"
                className="input-box"
                value={ideaInput.interests}
                onChange={(e) =>
                  setIdeaInput({
                    ...ideaInput,
                    interests: e.target.value,
                  })
                }
              />

              <button
                onClick={generateIdea}
                className="primary-btn"
              >
                Generate Idea
              </button>
            </div>

            {ideaResult && (
              <div className="result-box">
                <h3 className="text-3xl font-black">
                  {ideaResult.name}
                </h3>

                <p className="mt-4">
                  {ideaResult.description}
                </p>

                <p className="mt-4">
                  <b>Target Users:</b>{" "}
                  {ideaResult.users}
                </p>

                <p className="mt-4">
                  <b>UVP:</b>{" "}
                  {ideaResult.uvp}
                </p>
              </div>
            )}
          </div>

          {/* INVESTOR MEMO */}

          <div className="glass-card">
            <h2 className="tool-title">
              💰 Investor Memo Generator
            </h2>

            <div className="space-y-4 mt-6">
              {[
                ["Startup Name", "startup"],
                ["Problem", "problem"],
                ["Solution", "solution"],
                ["Market", "market"],
                ["Revenue Model", "revenue"],
              ].map(([placeholder, key]) => (
                <input
                  key={key}
                  placeholder={placeholder}
                  className="input-box"
                  value={(memoInput as any)[key]}
                  onChange={(e) =>
                    setMemoInput({
                      ...memoInput,
                      [key]: e.target.value,
                    })
                  }
                />
              ))}

              <button
                onClick={generateMemo}
                className="primary-btn"
              >
                Generate Memo
              </button>
            </div>

            {memo && (
              <div className="result-box">
                <p>
                  <b>Problem:</b>{" "}
                  {memo.problem}
                </p>

                <p className="mt-4">
                  <b>Solution:</b>{" "}
                  {memo.solution}
                </p>

                <p className="mt-4">
                  <b>Market:</b>{" "}
                  {memo.market}
                </p>

                <p className="mt-4">
                  <b>Business Model:</b>{" "}
                  {memo.model}
                </p>

                <p className="mt-4">
                  <b>Vision:</b>{" "}
                  {memo.vision}
                </p>
              </div>
            )}
          </div>

          {/* PRACTICE */}

          <div className="glass-card">
            <h2 className="tool-title">
              🎤 Pitch & Interview Practice
            </h2>

            <div className="space-y-4 mt-6">
              {practiceQuestions.map((q) => (
                <div
                  key={q}
                  className="bg-[#f4f8ff] rounded-[22px] p-5"
                >
                  <h3 className="font-black text-xl">
                    {q}
                  </h3>

                  <textarea
                    placeholder="Practice your answer..."
                    className="input-box h-28 mt-4"
                  />

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-4">
                    <p className="font-bold text-blue-700">
                      Sample Answer:
                    </p>

                    <p className="text-slate-600 mt-2">
                      Clearly explain the startup problem, market need and why your solution is unique.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COURSE ASSISTANT */}

          <div className="glass-card">
            <h2 className="tool-title">
              🎓 Smart Course Assistant
            </h2>

            <div className="space-y-4 mt-6">
              <input
                placeholder="Interest"
                className="input-box"
                value={courseInput.interest}
                onChange={(e) =>
                  setCourseInput({
                    ...courseInput,
                    interest: e.target.value,
                  })
                }
              />

              <select
                className="input-box"
                value={courseInput.level}
                onChange={(e) =>
                  setCourseInput({
                    ...courseInput,
                    level: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Skill Level
                </option>

                <option>
                  Beginner
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>
              </select>

              <input
                placeholder="Goal"
                className="input-box"
                value={courseInput.goal}
                onChange={(e) =>
                  setCourseInput({
                    ...courseInput,
                    goal: e.target.value,
                  })
                }
              />

              <button
                onClick={recommendCourses}
                className="primary-btn"
              >
                Generate Learning Path
              </button>
            </div>

            {recommendations.length > 0 && (
              <div className="result-box">
                <h3 className="text-2xl font-black">
                  Recommended Courses
                </h3>

                <div className="space-y-3 mt-5">
                  {recommendations.map(
                    (item) => (
                      <div
                        key={item}
                        className="bg-white rounded-2xl p-4 border"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COURSES */}

        <div className="mt-16">
          <h2 className="text-5xl font-black">
            Learning Hub 🎓
          </h2>

          <p className="text-slate-600 text-xl mt-4">
            Courses uploaded by organizers are displayed here automatically.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            {courses.map((course: Course) => (
              <div
                key={course.id}
                className="glass-card"
              >
                <div className="text-7xl">
                  {course.thumbnail}
                </div>

                <h2 className="text-4xl font-black mt-6">
                  {course.title}
                </h2>

                <p className="text-slate-600 mt-4">
                  {course.description}
                </p>

                <div className="flex gap-4 mt-6">
                  <span className="tag-blue">
                    ⭐ {course.rating}
                  </span>

                  <span className="tag-green">
                    ⏱️ {course.duration}
                  </span>

                  <span className="tag-orange">
                    {course.category}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setSelectedCourse(course)
                  }
                  className="primary-btn mt-8"
                >
                  View Course
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COURSE MODAL */}

      {selectedCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[35px] shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-5xl font-black">
              {selectedCourse.title}
            </h2>

            <div className="aspect-video rounded-[25px] overflow-hidden mt-8">
              <iframe
                src={selectedCourse.video}
                className="w-full h-full"
                allowFullScreen
              />
            </div>

            <div className="space-y-5 mt-8">
              <Info
                title="Course Description"
                value={
                  selectedCourse.description
                }
              />

              <Info
                title="AI Generated About"
                value="This course is designed to help startup founders and students gain practical knowledge and execution strategies."
              />

              <div className="bg-[#f4f8ff] rounded-[22px] p-5">
                <h3 className="text-2xl font-black">
                  Learning Outcomes
                </h3>

                <div className="space-y-3 mt-4">
                  {selectedCourse.outcomes.map(
                    (item) => (
                      <div
                        key={item}
                        className="bg-white rounded-2xl p-4"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setSelectedCourse(null)
              }
              className="primary-btn mt-8"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 36px;
          padding: 32px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
        }

        .tool-title {
          font-size: 36px;
          font-weight: 900;
        }

        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 16px 18px;
          border-radius: 18px;
          outline: none;
        }

        .primary-btn {
          width: 100%;
          background: #07162b;
          color: white;
          padding: 16px;
          border-radius: 18px;
          font-weight: 900;
          transition: 0.3s;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
        }

        .result-box {
          background: #f4f8ff;
          border-radius: 24px;
          padding: 24px;
          margin-top: 24px;
        }

        .tag-blue,
        .tag-green,
        .tag-orange {
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 700;
        }

        .tag-blue {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .tag-green {
          background: #dcfce7;
          color: #15803d;
        }

        .tag-orange {
          background: #ffedd5;
          color: #ea580c;
        }
      `}</style>
    </main>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-[#f4f8ff] rounded-[22px] p-5">
      <h3 className="text-2xl font-black">
        {title}
      </h3>

      <p className="text-slate-600 mt-3">
        {value}
      </p>
    </div>
  );
}