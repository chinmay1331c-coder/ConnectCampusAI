// app/features/ai-accelerator/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Course = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  category: string;
  difficulty: string;
  duration: string;
  video: string;
};

export default function AIAcceleratorPage() {
  // =========================================
  // AI STARTUP IDEA GENERATOR
  // =========================================

  const [ideaForm, setIdeaForm] =
    useState({
      domain: "",
      problem: "",
      audience: "",
      budget: "",
    });

  const [generatedIdea, setGeneratedIdea] =
    useState<any>(null);

  const [ideaLoading, setIdeaLoading] =
    useState(false);

  const generateIdea = async () => {
    setIdeaLoading(true);

    setTimeout(() => {
      setGeneratedIdea({
        startupName:
          "NeuroFlow AI",
        description:
          "An AI-powered productivity assistant for startup founders.",
        problem:
          "Founders struggle with productivity and task management.",
        solution:
          "AI automates workflows and optimizes startup operations.",
        revenue:
          "Subscription SaaS Model",
        market:
          "Tech Startups",
        techStack:
          "Next.js + OpenAI + Firebase",
      });

      setIdeaLoading(false);
    }, 1500);
  };

  // =========================================
  // AI INVESTOR MEMO
  // =========================================

  const [memoForm, setMemoForm] =
    useState({
      startupName: "",
      domain: "",
      problem: "",
      solution: "",
      market: "",
      businessModel: "",
      funding: "",
    });

  const [memoLoading, setMemoLoading] =
    useState(false);

  const [generatedMemo, setGeneratedMemo] =
    useState<any>(null);

  const generateMemo = async () => {
    setMemoLoading(true);

    setTimeout(() => {
      setGeneratedMemo({
        executive:
          "NeuroFlow AI helps startups automate productivity workflows using AI.",
        problem:
          "Startups waste time on repetitive tasks.",
        solution:
          "AI-driven automation platform.",
        market:
          "Growing SaaS productivity market.",
        funding:
          "$250K Seed Round",
      });

      setMemoLoading(false);
    }, 1500);
  };

  // =========================================
  // AI INTERVIEW PRACTICE
  // =========================================

  const [quizForm, setQuizForm] =
    useState({
      topic: "",
      domain: "",
    });

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [quizQuestions, setQuizQuestions] =
    useState<any[]>([]);

  const startPractice = async () => {
    setQuizLoading(true);

    setTimeout(() => {
      setQuizQuestions([
        {
          question:
            "What problem does your startup solve?",
          answer:
            "Our startup automates founder workflows using AI.",
        },
        {
          question:
            "Why is your solution unique?",
          answer:
            "We combine automation with predictive AI systems.",
        },
      ]);

      setQuizLoading(false);
    }, 1200);
  };

  // =========================================
  // AI COURSE ASSISTANT
  // =========================================

  const [studyForm, setStudyForm] =
    useState({
      question: "",
      interest: "",
    });

  const [studyLoading, setStudyLoading] =
    useState(false);

  const [studyResponse, setStudyResponse] =
    useState("");

  const askTutor = async () => {
    setStudyLoading(true);

    setTimeout(() => {
      setStudyResponse(`
📌 Simple Explanation:
AI allows systems to simulate human intelligence.

💡 Example:
Netflix recommendation engine.

🚀 Key Points:
• Machine Learning
• Neural Networks
• Data Training

🎯 Use Case:
AI is used in startups for automation and personalization.
      `);

      setStudyLoading(false);
    }, 1200);
  };

  // =========================================
  // LEARNING HUB
  // =========================================

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [difficultyFilter, setDifficultyFilter] =
    useState("");

  const [studyQuestion, setStudyQuestion] =
    useState("");

  const [studyAnswer, setStudyAnswer] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  // =========================================
  // REALTIME COURSE FETCH
  // =========================================

  useEffect(() => {
    const q = query(
      collection(db, "courses"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Course[];

        setCourses(data);

        setLoadingCourses(false);
      }
    );

    return () => unsub();
  }, []);

  // =========================================
  // FILTERS
  // =========================================

  const filteredCourses =
    useMemo(() => {
      return courses.filter(
        (course) => {
          const matchesSearch =
            course.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesCategory =
            categoryFilter
              ? course.category ===
                categoryFilter
              : true;

          const matchesDifficulty =
            difficultyFilter
              ? course.difficulty ===
                difficultyFilter
              : true;

          return (
            matchesSearch &&
            matchesCategory &&
            matchesDifficulty
          );
        }
      );
    }, [
      courses,
      search,
      categoryFilter,
      difficultyFilter,
    ]);

  const recommendedCourses =
    useMemo(() => {
      return courses.slice(0, 3);
    }, [courses]);

  // =========================================
  // AI COURSE SUPPORT
  // =========================================

  const askAI = async () => {
    if (!studyQuestion) return;

    setAiLoading(true);

    setTimeout(() => {
      setStudyAnswer(`
📌 AI Explanation:
${studyQuestion} is important for startups and AI systems.

💡 Example:
AI recommendation systems are used by Netflix.

🚀 Skills:
• AI Thinking
• Startup Building
• Product Strategy
      `);

      setAiLoading(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HERO */}

        <div className="glass-card">
          <h1 className="text-6xl font-black text-[#07162b]">
            AI Accelerator ⚡
          </h1>

          <p className="text-slate-500 text-xl mt-4">
            Build, learn, and
            grow your startup
            using AI.
          </p>
        </div>

        {/* IDEA GENERATOR */}

        <div className="glass-card">
          <h2 className="section-title">
            🚀 AI Startup Idea
            Generator
          </h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Domain"
              className="input-box"
              value={
                ideaForm.domain
              }
              onChange={(e) =>
                setIdeaForm({
                  ...ideaForm,
                  domain:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Problem"
              className="input-box"
              value={
                ideaForm.problem
              }
              onChange={(e) =>
                setIdeaForm({
                  ...ideaForm,
                  problem:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={
              generateIdea
            }
            className="primary-btn mt-8"
          >
            Generate Idea ⚡
          </button>

          {ideaLoading && (
            <div className="loading">
              Generating AI Idea...
            </div>
          )}

          {generatedIdea && (
            <div className="result-card mt-8">
              <h3>
                🚀{" "}
                {
                  generatedIdea.startupName
                }
              </h3>

              <p>
                {
                  generatedIdea.description
                }
              </p>
            </div>
          )}
        </div>

        {/* INTERVIEW */}

        <div className="glass-card">
          <h2 className="section-title">
            🎤 AI Interview
            Practice
          </h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Topic"
              className="input-box"
              value={
                quizForm.topic
              }
              onChange={(e) =>
                setQuizForm({
                  ...quizForm,
                  topic:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Domain"
              className="input-box"
              value={
                quizForm.domain
              }
              onChange={(e) =>
                setQuizForm({
                  ...quizForm,
                  domain:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={
              startPractice
            }
            className="primary-btn mt-8"
          >
            Start Practice ⚡
          </button>

          {quizLoading && (
            <div className="loading">
              Generating
              Questions...
            </div>
          )}

          {quizQuestions.length >
            0 && (
            <div className="space-y-5 mt-8">
              {quizQuestions.map(
                (
                  q,
                  index
                ) => (
                  <div
                    key={index}
                    className="result-card"
                  >
                    <h3>
                      Q
                      {index +
                        1}
                      :{" "}
                      {
                        q.question
                      }
                    </h3>

                    <p>
                      💡{" "}
                      {
                        q.answer
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* COURSE ASSISTANT */}

        <div className="glass-card">
          <h2 className="section-title">
            📚 AI Course
            Assistant
          </h2>

          <div className="flex gap-4 flex-wrap mt-6">
            <button
              onClick={() =>
                setStudyForm({
                  ...studyForm,
                  question:
                    "Explain AI Basics",
                })
              }
              className="chip"
            >
              Learn AI Basics
            </button>

            <button
              onClick={() =>
                setStudyForm({
                  ...studyForm,
                  question:
                    "Recommend Courses",
                })
              }
              className="chip"
            >
              Recommend Courses
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Ask question..."
              className="input-box"
              value={
                studyForm.question
              }
              onChange={(e) =>
                setStudyForm({
                  ...studyForm,
                  question:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Interest"
              className="input-box"
              value={
                studyForm.interest
              }
              onChange={(e) =>
                setStudyForm({
                  ...studyForm,
                  interest:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={askTutor}
            className="primary-btn mt-8"
          >
            Ask AI Tutor ⚡
          </button>

          {studyLoading && (
            <div className="loading">
              AI Tutor Thinking...
            </div>
          )}

          {studyResponse && (
            <div className="result-card mt-8 whitespace-pre-line">
              {
                studyResponse
              }
            </div>
          )}
        </div>

        {/* LEARNING HUB */}

        <div className="glass-card mt-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-5xl font-black">
                🎓 Learning Hub
              </h2>

              <p className="text-slate-500 text-xl mt-4">
                Access organizer
                uploaded courses in
                real-time.
              </p>
            </div>

            <div className="bg-blue-100 text-blue-700 px-6 py-4 rounded-full font-black">
              {courses.length}{" "}
              Courses 🚀
            </div>
          </div>

          {/* FILTERS */}

          <div className="grid lg:grid-cols-4 gap-5 mt-10">
            <input
              placeholder="Search courses..."
              className="input-box"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              className="input-box"
              value={
                categoryFilter
              }
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Categories
              </option>

              <option value="AI">
                AI
              </option>

              <option value="Business">
                Business
              </option>

              <option value="Tech">
                Tech
              </option>
            </select>

            <select
              className="input-box"
              value={
                difficultyFilter
              }
              onChange={(e) =>
                setDifficultyFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Difficulty
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>

            <div className="dark-chip">
              AI Learning ⚡
            </div>
          </div>

          {/* COURSES */}

          {loadingCourses ? (
            <div className="loading mt-10">
              Loading Courses...
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 mt-12">
              {filteredCourses.map(
                (course) => (
                  <div
                    key={course.id}
                    className="course-card"
                  >
                    <div className="course-image">
                      {
                        course.thumbnail
                      }
                    </div>

                    <div className="p-7">
                      <div className="flex gap-3 flex-wrap">
                        <div className="chip">
                          {
                            course.category
                          }
                        </div>

                        <div className="purple-chip">
                          {
                            course.difficulty
                          }
                        </div>
                      </div>

                      <h3 className="text-3xl font-black mt-5">
                        {
                          course.title
                        }
                      </h3>

                      <p className="text-slate-500 mt-4">
                        {
                          course.shortDescription
                        }
                      </p>

                      <button
                        onClick={() =>
                          setSelectedCourse(
                            course
                          )
                        }
                        className="primary-btn mt-6"
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* COURSE MODAL */}

        {selectedCourse && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-[40px] max-w-6xl w-full p-10 relative overflow-y-auto max-h-[95vh]">
              <button
                onClick={() =>
                  setSelectedCourse(
                    null
                  )
                }
                className="absolute top-6 right-6 w-14 h-14 bg-red-500 text-white rounded-full text-2xl font-black"
              >
                ×
              </button>

              <h2 className="text-5xl font-black">
                {
                  selectedCourse.title
                }
              </h2>

              <p className="text-slate-500 text-xl mt-4">
                {
                  selectedCourse.fullDescription
                }
              </p>

              <video
                controls
                className="w-full rounded-[30px] mt-10"
              >
                <source
                  src={
                    selectedCourse.video
                  }
                />
              </video>

              <div className="result-card mt-10">
                <h3>
                  🤖 AI Course
                  Support
                </h3>

                <textarea
                  placeholder="Ask anything..."
                  value={
                    studyQuestion
                  }
                  onChange={(e) =>
                    setStudyQuestion(
                      e.target
                        .value
                    )
                  }
                  className="input-box h-40 mt-5"
                />

                <button
                  onClick={askAI}
                  className="primary-btn mt-5"
                >
                  Ask AI Tutor ⚡
                </button>

                {studyAnswer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mt-6 whitespace-pre-line">
                    {
                      studyAnswer
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GLOBAL STYLES */}

      <style jsx global>{`
        .glass-card {
          background: white;
          border-radius: 40px;
          padding: 40px;
          box-shadow: 0 10px 40px
            rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-size: 54px;
          font-weight: 900;
          color: #07162b;
        }

        .input-box {
          width: 100%;
          height: 68px;
          border-radius: 22px;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 0 22px;
          font-size: 16px;
          outline: none;
        }

        .primary-btn {
          background: #07162b;
          color: white;
          padding: 18px 28px;
          border-radius: 22px;
          font-weight: 900;
        }

        .loading {
          margin-top: 30px;
          font-size: 22px;
          font-weight: 900;
          animation: pulse 1s infinite;
        }

        .result-card {
          background: #f8fbff;
          border: 1px solid #dbe4f0;
          border-radius: 30px;
          padding: 30px;
        }

        .chip {
          background: #dbeafe;
          color: #2563eb;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 800;
        }

        .purple-chip {
          background: #ede9fe;
          color: #7c3aed;
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 800;
        }

        .dark-chip {
          background: #07162b;
          color: white;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .course-card {
          background: white;
          border-radius: 35px;
          overflow: hidden;
          border: 1px solid #dbe4f0;
          box-shadow: 0 10px 40px
            rgba(0, 0, 0, 0.05);
        }

        .course-image {
          height: 220px;
          background: linear-gradient(
            to right,
            #2563eb,
            #06b6d4
          );
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
        }
      `}</style>
    </main>
  );
}