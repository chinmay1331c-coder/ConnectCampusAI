// app/features/ai-accelerator/page.tsx

"use client";

import { useEffect, useState } from "react";
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
  description: string;
  thumbnail: string;
  duration: string;
  rating: string;
  about?: string;
  video?: string;
};

export default function AIAcceleratorPage() {
  // =========================
  // IDEA GENERATOR
  // =========================

  const [loadingIdea, setLoadingIdea] =
    useState(false);

  const [generatedIdea, setGeneratedIdea] =
    useState<any>(null);

  const [ideaForm, setIdeaForm] =
    useState({
      domain: "",
      problem: "",
      audience: "",
      budget: "",
      stage: "",
    });

  // =========================
  // INVESTOR MEMO
  // =========================

  const [memoLoading, setMemoLoading] =
    useState(false);

  const [generatedMemo, setGeneratedMemo] =
    useState<any>(null);

  const [memoForm, setMemoForm] =
    useState({
      startupName: "",
      domain: "",
      problem: "",
      solution: "",
      market: "",
      businessModel: "",
      revenue: "",
      team: "",
      funding: "",
    });

  // =========================
  // QUIZ
  // =========================

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [quizData, setQuizData] =
    useState<any>(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [practiceAnswer, setPracticeAnswer] =
    useState("");

  const [aiFeedback, setAiFeedback] =
    useState("");

  const [practiceMode, setPracticeMode] =
    useState(false);

  const [quizForm, setQuizForm] =
    useState({
      topic: "",
      domain: "",
      difficulty: "",
      description: "",
    });

  // =========================
  // STUDY PARTNER
  // =========================

  const [studyLoading, setStudyLoading] =
    useState(false);

  const [studyResponse, setStudyResponse] =
    useState<any>(null);

  const [studyForm, setStudyForm] =
    useState({
      question: "",
      interest: "",
      level: "",
      goal: "",
    });

  // =========================
  // COURSES
  // =========================

  const [courses, setCourses] =
    useState<Course[]>([]);

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
      }
    );

    return () => unsub();
  }, []);

  // =========================
  // IDEA GENERATOR
  // =========================

  const generateIdea = async () => {
    setLoadingIdea(true);

    try {
      const response = await fetch(
        "/api/ai-idea",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            ideaForm
          ),
        }
      );

      const data =
        await response.json();

      setGeneratedIdea(data);
    } catch (error) {
      console.log(error);
    }

    setLoadingIdea(false);
  };

  // =========================
  // MEMO GENERATOR
  // =========================

  const generateInvestorMemo =
    async () => {
      setMemoLoading(true);

      try {
        const response = await fetch(
          "/api/ai-investor-memo",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              memoForm
            ),
          }
        );

        const data =
          await response.json();

        setGeneratedMemo(data);
      } catch (error) {
        console.log(error);
      }

      setMemoLoading(false);
    };

  // =========================
  // QUIZ GENERATOR
  // =========================

  const generateQuiz =
    async () => {
      setQuizLoading(true);

      try {
        const response = await fetch(
          "/api/ai-quiz",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              quizForm
            ),
          }
        );

        const data =
          await response.json();

        setQuizData(data);

        setCurrentQuestion(0);

        setPracticeAnswer("");

        setAiFeedback("");
      } catch (error) {
        console.log(error);
      }

      setQuizLoading(false);
    };

  const evaluateAnswer = () => {
    if (!practiceAnswer) return;

    let feedback =
      "Good answer. ";

    if (
      practiceAnswer.length < 50
    ) {
      feedback +=
        "Add more detail and market validation.";
    } else {
      feedback +=
        "Strong response with good clarity.";
    }

    setAiFeedback(feedback);
  };

  const nextQuestion = () => {
    if (
      currentQuestion <
      quizData.questions.length -
        1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );

      setPracticeAnswer("");

      setAiFeedback("");
    }
  };

  // =========================
  // STUDY PARTNER
  // =========================

  const askStudyPartner =
    async () => {
      setStudyLoading(true);

      try {
        const response = await fetch(
          "/api/ai-study-partner",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              studyForm
            ),
          }
        );

        const data =
          await response.json();

        setStudyResponse(data);
      } catch (error) {
        console.log(error);
      }

      setStudyLoading(false);
    };

  const quickPrompt = (
    text: string
  ) => {
    setStudyForm({
      ...studyForm,
      question: text,
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HERO */}

        <div className="glass-card">
          <h1 className="text-6xl font-black">
            AI Accelerator ⚡
          </h1>

          <p className="text-slate-500 text-xl mt-4">
            Build, learn, and grow
            your startup using AI.
          </p>
        </div>

        {/* IDEA GENERATOR */}

        <div className="glass-card">
          <h2 className="title">
            🚀 AI Startup Idea
            Generator
          </h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Domain"
              className="input-box"
              value={ideaForm.domain}
              onChange={(e) =>
                setIdeaForm({
                  ...ideaForm,
                  domain:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Target Audience"
              className="input-box"
              value={ideaForm.audience}
              onChange={(e) =>
                setIdeaForm({
                  ...ideaForm,
                  audience:
                    e.target.value,
                })
              }
            />

            <textarea
              placeholder="Problem"
              className="input-box h-32 lg:col-span-2"
              value={ideaForm.problem}
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
            onClick={generateIdea}
            className="primary-btn mt-8"
          >
            Generate Idea ⚡
          </button>

          {loadingIdea && (
            <div className="mt-8 animate-pulse font-black text-2xl">
              AI generating idea...
            </div>
          )}

          {generatedIdea && (
            <div className="grid lg:grid-cols-2 gap-6 mt-10">
              <div className="result-card">
                <h3>
                  🚀 Startup Name
                </h3>

                <p>
                  {
                    generatedIdea.startupName
                  }
                </p>
              </div>

              <div className="result-card">
                <h3>
                  💡 Description
                </h3>

                <p>
                  {
                    generatedIdea.description
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* INVESTOR MEMO */}

        <div className="glass-card">
          <h2 className="title">
            💰 AI Investor Memo
            Generator
          </h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Startup Name"
              className="input-box"
              value={
                memoForm.startupName
              }
              onChange={(e) =>
                setMemoForm({
                  ...memoForm,
                  startupName:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Domain"
              className="input-box"
              value={memoForm.domain}
              onChange={(e) =>
                setMemoForm({
                  ...memoForm,
                  domain:
                    e.target.value,
                })
              }
            />

            <textarea
              placeholder="Problem"
              className="input-box h-32"
              value={memoForm.problem}
              onChange={(e) =>
                setMemoForm({
                  ...memoForm,
                  problem:
                    e.target.value,
                })
              }
            />

            <textarea
              placeholder="Solution"
              className="input-box h-32"
              value={memoForm.solution}
              onChange={(e) =>
                setMemoForm({
                  ...memoForm,
                  solution:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={
              generateInvestorMemo
            }
            className="primary-btn mt-8"
          >
            Generate Memo ⚡
          </button>

          {memoLoading && (
            <div className="mt-8 animate-pulse font-black text-2xl">
              AI generating memo...
            </div>
          )}

          {generatedMemo && (
            <div className="space-y-6 mt-10">
              <div className="result-card">
                <h3>
                  📌 Executive Summary
                </h3>

                <p>
                  {
                    generatedMemo.executiveSummary
                  }
                </p>
              </div>

              <div className="result-card">
                <h3>💰 Funding</h3>

                <p>
                  {
                    generatedMemo.fundingAsk
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* QUIZ */}

        <div className="glass-card">
          <h2 className="title">
            🎤 AI Interview Practice
          </h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Topic"
              className="input-box"
              value={quizForm.topic}
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
              value={quizForm.domain}
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
            onClick={generateQuiz}
            className="primary-btn mt-8"
          >
            Start Practice ⚡
          </button>

          {quizLoading && (
            <div className="mt-8 animate-pulse font-black text-2xl">
              AI generating questions...
            </div>
          )}

          {quizData && (
            <div className="mt-10">
              <div className="result-card">
                <h3>
                  ❓{" "}
                  {
                    quizData.questions[
                      currentQuestion
                    ].question
                  }
                </h3>

                <textarea
                  placeholder="Type answer..."
                  className="input-box h-40 mt-6"
                  value={
                    practiceAnswer
                  }
                  onChange={(e) =>
                    setPracticeAnswer(
                      e.target.value
                    )
                  }
                />

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={
                      evaluateAnswer
                    }
                    className="primary-btn"
                  >
                    Evaluate
                  </button>

                  <button
                    onClick={
                      nextQuestion
                    }
                    className="secondary-btn"
                  >
                    Next
                  </button>
                </div>

                {aiFeedback && (
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-3xl p-6">
                    <h4 className="font-black text-2xl">
                      🤖 AI Feedback
                    </h4>

                    <p className="mt-4">
                      {aiFeedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* STUDY PARTNER */}

        <div className="glass-card">
          <h2 className="title">
            📚 AI Course Assistant
          </h2>

          <div className="flex gap-4 flex-wrap mt-8">
            <button
              onClick={() =>
                quickPrompt(
                  "Explain AI basics"
                )
              }
              className="quick-btn"
            >
              Learn AI Basics
            </button>

            <button
              onClick={() =>
                quickPrompt(
                  "Recommend React courses"
                )
              }
              className="quick-btn"
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
            onClick={
              askStudyPartner
            }
            className="primary-btn mt-8"
          >
            Ask AI Tutor ⚡
          </button>

          {studyLoading && (
            <div className="mt-8 animate-pulse font-black text-2xl">
              AI Tutor thinking...
            </div>
          )}

          {studyResponse && (
            <div className="space-y-6 mt-10">
              <div className="result-card">
                <h3>
                  📖 Explanation
                </h3>

                <p>
                  {
                    studyResponse.explanation
                  }
                </p>
              </div>

              <div className="result-card">
                <h3>
                  🎓 Recommended
                  Courses
                </h3>

                <div className="grid lg:grid-cols-2 gap-4 mt-5">
                  {studyResponse.recommendedCourses.map(
                    (
                      course: string,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-5 font-black"
                      >
                        🎥 {course}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COURSES */}

        <div className="glass-card">
          <h2 className="title">
            🎓 Learning Hub
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-[30px] border border-[#dbe4f0] p-6"
              >
                <div className="text-7xl">
                  {course.thumbnail}
                </div>

                <h3 className="text-3xl font-black mt-5">
                  {course.title}
                </h3>

                <p className="text-slate-600 mt-4">
                  {
                    course.description
                  }
                </p>

                <div className="flex gap-4 mt-6 flex-wrap">
                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                    ⭐{" "}
                    {course.rating}
                  </div>

                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                    ⏱️{" "}
                    {course.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .glass-card {
          background: white;
          border-radius: 40px;
          padding: 40px;
          box-shadow: 0 20px 60px
            rgba(15, 23, 42, 0.08);
        }

        .title {
          font-size: 48px;
          font-weight: 900;
        }

        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 18px;
          border-radius: 18px;
          outline: none;
          font-size: 15px;
        }

        .primary-btn {
          background: #07162b;
          color: white;
          padding: 18px 28px;
          border-radius: 20px;
          font-weight: 900;
        }

        .secondary-btn {
          background: #2563eb;
          color: white;
          padding: 18px 28px;
          border-radius: 20px;
          font-weight: 900;
        }

        .quick-btn {
          background: #e0edff;
          color: #2563eb;
          padding: 14px 22px;
          border-radius: 18px;
          font-weight: 900;
        }

        .result-card {
          background: #f8fbff;
          border: 1px solid #dbe4f0;
          border-radius: 24px;
          padding: 24px;
        }

        .result-card h3 {
          font-size: 24px;
          font-weight: 900;
        }

        .result-card p {
          margin-top: 14px;
          color: #475569;
          line-height: 1.8;
        }
      `}</style>
    </main>
  );
}