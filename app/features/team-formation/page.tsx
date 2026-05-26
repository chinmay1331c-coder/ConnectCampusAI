// app/features/team-formation/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CollabPost = {
  id: number;
  title: string;
  domain: string;
  description: string;
  roles: string;
  skillsNeeded: string;
  ownerName: string;
  requests: {
    name: string;
    skills: string;
    message: string;
    status: "Pending" | "Accepted" | "Rejected";
  }[];
  teamMembers: string[];
};

export default function TeamFormationPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<CollabPost[]>([
    {
      id: 1,
      title: "AI Study Assistant",
      domain: "AI / EdTech",
      description:
        "Building an AI-powered study assistant for students and founders.",
      roles: "Developer, Designer, Business",
      skillsNeeded: "React, AI, UI/UX, Marketing",
      ownerName: "Startup Builder",
      requests: [],
      teamMembers: ["Startup Builder"],
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    domain: "",
    description: "",
    roles: "",
    skillsNeeded: "",
    ownerName: "",
  });

  const [requestForm, setRequestForm] = useState({
    postId: 0,
    name: "",
    skills: "",
    message: "",
  });

  const createPost = () => {
    if (
      !form.title ||
      !form.domain ||
      !form.description ||
      !form.roles ||
      !form.skillsNeeded ||
      !form.ownerName
    ) {
      alert("Please fill all fields");
      return;
    }

    const newPost: CollabPost = {
      id: Date.now(),
      ...form,
      requests: [],
      teamMembers: [form.ownerName],
    };

    setPosts([newPost, ...posts]);

    setForm({
      title: "",
      domain: "",
      description: "",
      roles: "",
      skillsNeeded: "",
      ownerName: "",
    });
  };

  const sendRequest = () => {
    if (
      !requestForm.postId ||
      !requestForm.name ||
      !requestForm.skills ||
      !requestForm.message
    ) {
      alert("Please fill request details");
      return;
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === requestForm.postId
          ? {
              ...post,
              requests: [
                ...post.requests,
                {
                  name: requestForm.name,
                  skills: requestForm.skills,
                  message: requestForm.message,
                  status: "Pending",
                },
              ],
            }
          : post
      )
    );

    setRequestForm({
      postId: 0,
      name: "",
      skills: "",
      message: "",
    });
  };

  const updateRequest = (
    postId: number,
    requestIndex: number,
    status: "Accepted" | "Rejected"
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const updatedRequests = [...post.requests];

        updatedRequests[requestIndex] = {
          ...updatedRequests[requestIndex],
          status,
        };

        const updatedMembers =
          status === "Accepted"
            ? [...post.teamMembers, updatedRequests[requestIndex].name]
            : post.teamMembers;

        return {
          ...post,
          requests: updatedRequests,
          teamMembers: updatedMembers,
        };
      })
    );
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] px-6 py-10 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="rounded-full border border-white/70 bg-white/60 backdrop-blur-2xl shadow-2xl px-6 py-4 flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-black">
              Team Formation 🤝
            </h1>

            <p className="text-slate-500">
              Create teams, send requests and find AI-powered matches.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#07162b] text-white px-6 py-3 rounded-full font-bold"
          >
            Back Dashboard
          </button>
        </div>

        {/* HERO */}

        <div className="rounded-[50px] bg-white/70 border border-white/80 backdrop-blur-2xl shadow-2xl p-12 mb-12">
          <h1 className="text-7xl font-black leading-[0.9]">
            Build Your
            <br />
            Startup Team 🚀
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mt-8 max-w-3xl">
            Post your startup idea, find collaborators, receive team requests
            and use AI Team Match to discover the best teammates based on
            skills, interests and roles.
          </p>
        </div>

        {/* AI TEAM MATCH CARD */}

        <div className="rounded-[40px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-10 shadow-[0_30px_80px_rgba(59,130,246,0.35)] mb-12">
          <div className="text-7xl">🤖</div>

          <h2 className="text-5xl font-black mt-6">
            Find Your Perfect Teammates with AI
          </h2>

          <p className="text-blue-100 text-xl leading-relaxed mt-5 max-w-3xl">
            AI matches teammates based on skills, interests, preferred role and
            startup idea compatibility.
          </p>

          <button
            onClick={() => router.push("/features/ai-team-match")}
            className="mt-8 bg-white text-[#07162b] px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition shadow-xl"
          >
            Find Matches →
          </button>
        </div>

        {/* CREATE POST */}

        <div className="rounded-[40px] bg-white/80 border border-white shadow-2xl p-10">
          <h2 className="text-5xl font-black">
            Create Collaboration Post ✍️
          </h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Startup / Project Title"
              className="input-box"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <input
              placeholder="Domain / Category"
              className="input-box"
              value={form.domain}
              onChange={(e) =>
                setForm({
                  ...form,
                  domain: e.target.value,
                })
              }
            />

            <input
              placeholder="Required Roles"
              className="input-box"
              value={form.roles}
              onChange={(e) =>
                setForm({
                  ...form,
                  roles: e.target.value,
                })
              }
            />

            <input
              placeholder="Skills Needed"
              className="input-box"
              value={form.skillsNeeded}
              onChange={(e) =>
                setForm({
                  ...form,
                  skillsNeeded: e.target.value,
                })
              }
            />

            <input
              placeholder="Your Name"
              className="input-box"
              value={form.ownerName}
              onChange={(e) =>
                setForm({
                  ...form,
                  ownerName: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Project Description"
              className="input-box h-28 lg:col-span-2"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={createPost}
            className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black"
          >
            Create Post
          </button>
        </div>

        {/* POSTS */}

        <div className="space-y-10 mt-12">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-[40px] bg-white/80 border border-white shadow-2xl p-10"
            >
              <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-bold">
                {post.domain}
              </span>

              <h2 className="text-5xl font-black mt-5">
                {post.title}
              </h2>

              <p className="text-slate-600 text-lg mt-5 leading-relaxed">
                {post.description}
              </p>

              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <InfoBox title="Required Roles" value={post.roles} />
                <InfoBox title="Skills Needed" value={post.skillsNeeded} />
              </div>

              {/* TEAM MEMBERS */}

              <div className="bg-[#f4f8ff] rounded-[28px] p-6 mt-8">
                <h3 className="text-3xl font-black">
                  Team Members 👥
                </h3>

                <div className="flex flex-wrap gap-3 mt-5">
                  {post.teamMembers.map((member, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEND REQUEST */}

              <div className="bg-white rounded-[28px] border border-[#dbe4f0] p-6 mt-8">
                <h3 className="text-3xl font-black">
                  Send Join Request 📩
                </h3>

                <div className="grid lg:grid-cols-3 gap-4 mt-5">
                  <input
                    placeholder="Your Name"
                    className="input-box"
                    value={
                      requestForm.postId === post.id
                        ? requestForm.name
                        : ""
                    }
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        postId: post.id,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="Your Skills"
                    className="input-box"
                    value={
                      requestForm.postId === post.id
                        ? requestForm.skills
                        : ""
                    }
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        postId: post.id,
                        skills: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="Message"
                    className="input-box"
                    value={
                      requestForm.postId === post.id
                        ? requestForm.message
                        : ""
                    }
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        postId: post.id,
                        message: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  onClick={sendRequest}
                  className="mt-5 bg-[#07162b] text-white px-8 py-4 rounded-2xl font-black"
                >
                  Send Request
                </button>
              </div>

              {/* REQUESTS */}

              <div className="bg-[#f4f8ff] rounded-[28px] p-6 mt-8">
                <h3 className="text-3xl font-black">
                  Incoming Requests 📬
                </h3>

                <div className="space-y-5 mt-5">
                  {post.requests.length === 0 && (
                    <p className="text-slate-500">
                      No requests yet.
                    </p>
                  )}

                  {post.requests.map((req, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-[25px] p-6 flex items-center justify-between gap-5"
                    >
                      <div>
                        <h4 className="text-2xl font-black">
                          {req.name}
                        </h4>

                        <p className="text-slate-500 mt-2">
                          Skills: {req.skills}
                        </p>

                        <p className="text-slate-600 mt-2">
                          {req.message}
                        </p>

                        <p className="font-bold mt-3">
                          Status: {req.status}
                        </p>
                      </div>

                      {req.status === "Pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              updateRequest(post.id, index, "Accepted")
                            }
                            className="bg-green-600 text-white px-5 py-3 rounded-2xl font-black"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateRequest(post.id, index, "Rejected")
                            }
                            className="bg-red-600 text-white px-5 py-3 rounded-2xl font-black"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-[#f4f8ff] rounded-[24px] p-6">
      <h3 className="text-2xl font-black">
        {title}
      </h3>

      <p className="text-slate-600 mt-3">
        {value}
      </p>
    </div>
  );
}