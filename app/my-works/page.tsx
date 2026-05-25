"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type NetworkingPost = {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  roles: string;
  skillsNeeded: string;
  tags: string;
  ownerUid: string;
  ownerName: string;
  likes: number;
  rating: number;
  comments: string[];
};

type CollabRequest = {
  userId: string;
  userName: string;
  skills: string;
  interests: string;
  bio: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected";
};

type CollabPost = {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  roles: string;
  skillsNeeded: string;
  domain: string;
  ownerUid: string;
  ownerName: string;
  requests: CollabRequest[];
  teamMembers: string[];
};

const courses = [
  {
    title: "Startup Fundamentals",
    status: "Ongoing",
    progress: "65%",
  },
  {
    title: "AI for Entrepreneurs",
    status: "Ongoing",
    progress: "40%",
  },
  {
    title: "Pitch Deck Masterclass",
    status: "Completed",
    progress: "100%",
  },
];

export default function MyWorksPage() {
  const [activeTab, setActiveTab] = useState("networking");
  const [networkingPosts, setNetworkingPosts] = useState<NetworkingPost[]>([]);
  const [collabPosts, setCollabPosts] = useState<CollabPost[]>([]);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchMyWorks();
  }, []);

  const fetchMyWorks = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    const networkingQuery = query(
      collection(db, "networkingPosts"),
      orderBy("createdAt", "desc")
    );

    const networkingSnapshot = await getDocs(networkingQuery);

    const allNetworkingPosts = networkingSnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as NetworkingPost[];

    setNetworkingPosts(
      allNetworkingPosts.filter((post) => post.ownerUid === user.uid)
    );

    const collabQuery = query(
      collection(db, "collabPosts"),
      orderBy("createdAt", "desc")
    );

    const collabSnapshot = await getDocs(collabQuery);

    const allCollabPosts = collabSnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as CollabPost[];

    setCollabPosts(allCollabPosts.filter((post) => post.ownerUid === user.uid));
  };

  const updateRequestStatus = async (
    post: CollabPost,
    requestIndex: number,
    status: "Accepted" | "Rejected"
  ) => {
    const updatedRequests = [...post.requests];

    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      status,
    };

    const updatedTeamMembers =
      status === "Accepted"
        ? [...post.teamMembers, updatedRequests[requestIndex].userName]
        : post.teamMembers;

    await updateDoc(doc(db, "collabPosts", post.id), {
      requests: updatedRequests,
      teamMembers: updatedTeamMembers,
    });

    fetchMyWorks();
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8 text-[#07162b] relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.30),transparent_35%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Link href="/dashboard">
          <button className="magic-btn mb-8 bg-[#07162b] text-white px-6 py-3 rounded-full font-bold">
            ← Back Dashboard
          </button>
        </Link>

        <div className="rounded-[48px] bg-white/60 backdrop-blur-3xl border border-white/80 shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black mb-4">
            My Works 📂
          </h1>

          <p className="text-xl text-slate-600">
            Manage your networking posts, collaboration requests and enrolled courses.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            {[
              ["networking", "🌐 Networking"],
              ["collab", "🤝 Collab Requests"],
              ["courses", "🎓 Courses"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-8 py-4 rounded-full font-black transition ${
                  activeTab === key
                    ? "bg-blue-600 text-white shadow-xl"
                    : "bg-white/80 text-[#07162b]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "networking" && (
          <div className="space-y-8">
            {networkingPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-[40px] bg-white/70 border border-white/80 shadow-xl p-8"
              >
                <h2 className="text-4xl font-black mb-3">{post.title}</h2>

                <p className="text-slate-600 mb-5">{post.description}</p>

                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div className="rounded-[24px] bg-white p-5">
                    <h3 className="font-black text-xl mb-2">Problem</h3>
                    <p>{post.problem}</p>
                  </div>

                  <div className="rounded-[24px] bg-white p-5">
                    <h3 className="font-black text-xl mb-2">Solution</h3>
                    <p>{post.solution}</p>
                  </div>

                  <div className="rounded-[24px] bg-white p-5">
                    <h3 className="font-black text-xl mb-2">Roles</h3>
                    <p>{post.roles}</p>
                  </div>

                  <div className="rounded-[24px] bg-white p-5">
                    <h3 className="font-black text-xl mb-2">Skills Needed</h3>
                    <p>{post.skillsNeeded}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="bg-blue-100 text-blue-700 px-5 py-3 rounded-full font-bold">
                    👍 Likes: {post.likes}
                  </span>

                  <span className="bg-yellow-100 text-yellow-700 px-5 py-3 rounded-full font-bold">
                    ⭐ Rating: {post.rating}/5
                  </span>

                  <span className="bg-cyan-100 text-cyan-700 px-5 py-3 rounded-full font-bold">
                    Tags: {post.tags}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setShowComments({
                      ...showComments,
                      [post.id]: !showComments[post.id],
                    })
                  }
                  className="bg-[#07162b] text-white px-6 py-3 rounded-full font-black"
                >
                  {showComments[post.id] ? "Hide Comments" : "Show Comments"}
                </button>

                {showComments[post.id] && (
                  <div className="mt-5 space-y-3">
                    {post.comments?.length > 0 ? (
                      post.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="rounded-[20px] bg-[#f4f8ff] p-4"
                        >
                          {comment}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">No comments yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {networkingPosts.length === 0 && (
              <EmptyCard text="No networking posts created yet." />
            )}
          </div>
        )}

        {activeTab === "collab" && (
          <div className="space-y-8">
            {collabPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-[40px] bg-white/70 border border-white/80 shadow-xl p-8"
              >
                <span className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold">
                  {post.domain}
                </span>

                <h2 className="text-4xl font-black my-4">{post.title}</h2>

                <p className="text-slate-600 mb-6">{post.description}</p>

                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div className="rounded-[24px] bg-white p-5">
                    <h3 className="font-black text-xl mb-2">Related Problem</h3>
                    <p>{post.problem}</p>
                  </div>

                  <div className="rounded-[24px] bg-white p-5">
                    <h3 className="font-black text-xl mb-2">Required Roles</h3>
                    <p>{post.roles}</p>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-5 mb-6">
                  <h3 className="text-2xl font-black mb-4">
                    Team Members 👥
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {post.teamMembers?.map((member, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-white p-5">
                  <h3 className="text-2xl font-black mb-4">
                    Incoming Requests 📩
                  </h3>

                  {post.requests?.length > 0 ? (
                    <div className="space-y-4">
                      {post.requests.map((request, index) => (
                        <div
                          key={index}
                          className="rounded-[22px] bg-[#f4f8ff] p-5"
                        >
                          <h4 className="text-xl font-black">
                            {request.userName}
                          </h4>

                          <p className="mt-2 text-slate-600">
                            Bio: {request.bio || "Not added"}
                          </p>

                          <p className="text-slate-600">
                            Skills: {request.skills || "Not added"}
                          </p>

                          <p className="text-slate-600">
                            Interests: {request.interests || "Not added"}
                          </p>

                          <p className="mt-3">
                            Message: {request.message}
                          </p>

                          <p className="mt-3 font-black">
                            Status: {request.status}
                          </p>

                          {request.status === "Pending" && (
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() =>
                                  updateRequestStatus(post, index, "Accepted")
                                }
                                className="bg-green-600 text-white px-5 py-3 rounded-full font-black"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  updateRequestStatus(post, index, "Rejected")
                                }
                                className="bg-red-600 text-white px-5 py-3 rounded-full font-black"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">No requests received yet.</p>
                  )}
                </div>
              </div>
            ))}

            {collabPosts.length === 0 && (
              <EmptyCard text="No collaboration posts created yet." />
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.title}
                className="rounded-[40px] bg-white/70 border border-white/80 shadow-xl p-8"
              >
                <div className="text-5xl mb-5">🎓</div>

                <h2 className="text-3xl font-black mb-3">
                  {course.title}
                </h2>

                <p
                  className={`inline-block px-5 py-2 rounded-full font-bold ${
                    course.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {course.status}
                </p>

                <div className="mt-6 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: course.progress }}
                  />
                </div>

                <p className="mt-3 text-slate-600">
                  Progress: {course.progress}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-[40px] bg-white/70 border border-white/80 shadow-xl p-10 text-center">
      <h2 className="text-3xl font-black">{text}</h2>
    </div>
  );
}