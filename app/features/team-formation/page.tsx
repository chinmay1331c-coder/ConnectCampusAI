"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type RequestType = {
  userId: string;
  userName: string;
  skills: string;
  interests: string;
  bio: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected";
};

type PostType = {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  roles: string;
  skillsNeeded: string;
  domain: string;
  tags: string;
  ownerUid: string;
  ownerName: string;
  ownerSkills: string;
  ownerInterests: string;
  ownerBio: string;
  likes: number;
  rating: number;
  requests: RequestType[];
  teamMembers: string[];
  createdAt: string;
};

const domains = [
  "AI",
  "Web Development",
  "Healthcare",
  "Finance",
  "EdTech",
  "Web3",
  "Other",
];

export default function CollabPage() {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [roles, setRoles] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [domain, setDomain] = useState("");
  const [tags, setTags] = useState("");

  const [requestMessage, setRequestMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem("campusProfile");
    if (stored) setProfile(JSON.parse(stored));
    fetchPosts();
  }, []);

  const handleSearch = () => {
    alert("Search applied ✅");
  };

  const fetchPosts = async () => {
    const q = query(collection(db, "collabPosts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as PostType[];

    setPosts(data);
  };

  const createPost = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !problem.trim() ||
      !solution.trim() ||
      !roles.trim() ||
      !skillsNeeded.trim() ||
      !domain.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    const postData = {
      title,
      description,
      problem,
      solution,
      roles,
      skillsNeeded,
      domain,
      tags,
      ownerUid: user.uid,
      ownerName: profile?.name || "Student User",
      ownerSkills: profile?.skills || "",
      ownerInterests: profile?.interests || "",
      ownerBio: profile?.bio || "",
      likes: 0,
      rating: 0,
      requests: [],
      teamMembers: [profile?.name || "Creator"],
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, "collabPosts"), postData);

    setTitle("");
    setDescription("");
    setProblem("");
    setSolution("");
    setRoles("");
    setSkillsNeeded("");
    setDomain("");
    setTags("");

    alert("Collaboration post created 🚀");
    fetchPosts();
  };

  const likePost = async (post: PostType) => {
    await updateDoc(doc(db, "collabPosts", post.id), {
      likes: post.likes + 1,
    });

    fetchPosts();
  };

  const ratePost = async (post: PostType) => {
    const rating = prompt("Rate this startup idea (1-5)");
    if (!rating) return;

    const value = Number(rating);

    if (value < 1 || value > 5) {
      alert("Enter rating between 1-5");
      return;
    }

    await updateDoc(doc(db, "collabPosts", post.id), {
      rating: value,
    });

    fetchPosts();
  };

  const sendRequest = async (post: PostType) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const message = requestMessage[post.id];

    if (!message?.trim()) {
      alert("Write why you want to join");
      return;
    }

    const newRequest: RequestType = {
      userId: user.uid,
      userName: profile?.name || "Student User",
      skills: profile?.skills || "",
      interests: profile?.interests || "",
      bio: profile?.bio || "",
      message,
      status: "Pending",
    };

    await updateDoc(doc(db, "collabPosts", post.id), {
      requests: [...post.requests, newRequest],
    });

    setRequestMessage({
      ...requestMessage,
      [post.id]: "",
    });

    alert("Request sent ✅");
    fetchPosts();
  };

  const updateRequestStatus = async (
    post: PostType,
    requestIndex: number,
    status: "Accepted" | "Rejected"
  ) => {
    const updatedRequests = [...post.requests];

    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      status,
    };

    const updatedMembers =
      status === "Accepted"
        ? [...post.teamMembers, updatedRequests[requestIndex].userName]
        : post.teamMembers;

    await updateDoc(doc(db, "collabPosts", post.id), {
      requests: updatedRequests,
      teamMembers: updatedMembers,
    });

    fetchPosts();
  };

  const filteredPosts = posts.filter((post) => {
    const text = `
      ${post.title}
      ${post.description}
      ${post.problem}
      ${post.solution}
      ${post.roles}
      ${post.skillsNeeded}
      ${post.domain}
      ${post.tags}
    `.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesDomain = domainFilter === "All" || post.domain === domainFilter;

    return matchesSearch && matchesDomain;
  });

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8 relative overflow-hidden text-[#07162b]">
      <div className="relative z-10 max-w-7xl mx-auto">
        <Link href="/dashboard">
          <button className="mb-8 bg-[#07162b] text-white px-6 py-3 rounded-full font-bold">
            ← Back Dashboard
          </button>
        </Link>

        <div className="rounded-[48px] bg-white/60 backdrop-blur-3xl border border-white/80 shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black mb-4">
            Collab Page 🤝
          </h1>

          <p className="text-xl text-slate-600 mb-8">
            Discover ideas, join teams and build startups together.
          </p>

          <div className="flex gap-4 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search collaboration posts..."
              className="flex-1 p-5 rounded-[24px] bg-white/80 border border-white outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-[#07162b] text-white px-10 py-5 rounded-[24px] font-black hover:scale-105 transition"
            >
              Search
            </button>

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="p-5 rounded-[24px] bg-white/80 border border-white outline-none"
            >
              <option value="All">All Domains</option>
              {domains.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="rounded-[40px] bg-white/60 backdrop-blur-3xl border border-white shadow-xl p-8 h-fit">
            <h2 className="text-3xl font-black mb-6">
              Create Collaboration Post 🚀
            </h2>

            <div className="space-y-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Startup / Project Title" className="w-full p-4 rounded-[20px] bg-white border border-white outline-none" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full h-24 p-4 rounded-[20px] bg-white border border-white outline-none resize-none" />
              <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Problem Statement" className="w-full h-24 p-4 rounded-[20px] bg-white border border-white outline-none resize-none" />
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Proposed Solution" className="w-full h-24 p-4 rounded-[20px] bg-white border border-white outline-none resize-none" />
              <input value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="Required Roles" className="w-full p-4 rounded-[20px] bg-white border border-white outline-none" />
              <input value={skillsNeeded} onChange={(e) => setSkillsNeeded(e.target.value)} placeholder="Skills Needed" className="w-full p-4 rounded-[20px] bg-white border border-white outline-none" />

              <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full p-4 rounded-[20px] bg-white border border-white outline-none">
                <option value="">Select Domain</option>
                {domains.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags" className="w-full p-4 rounded-[20px] bg-white border border-white outline-none" />

              <button onClick={createPost} className="w-full bg-blue-600 text-white py-4 rounded-full font-black shadow-xl">
                Publish Collab Post
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {filteredPosts.map((post) => {
              const isOwner = auth.currentUser?.uid === post.ownerUid;

              const isHighlighted =
                search &&
                `
                  ${post.title}
                  ${post.description}
                  ${post.problem}
                  ${post.solution}
                  ${post.roles}
                  ${post.skillsNeeded}
                  ${post.domain}
                  ${post.tags}
                `
                  .toLowerCase()
                  .includes(search.toLowerCase());

              return (
                <div
                  key={post.id}
                  className={`rounded-[40px] backdrop-blur-3xl border p-8 transition-all duration-500 ${
                    isHighlighted
                      ? "bg-blue-50 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.6)] scale-[1.02]"
                      : "bg-white/60 border-white shadow-xl"
                  }`}
                >
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
                    {post.domain}
                  </span>

                  <h2 className="text-4xl font-black my-4">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 mb-6">
                    By <b>{post.ownerName}</b>
                  </p>

                  <p className="text-lg text-slate-700 mb-6">
                    {post.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <button onClick={() => likePost(post)} className="bg-blue-600 text-white py-4 rounded-full font-black">
                      👍 {post.likes}
                    </button>

                    <button onClick={() => ratePost(post)} className="bg-yellow-400 py-4 rounded-full font-black">
                      ⭐ {post.rating}/5
                    </button>

                    <button className="bg-[#07162b] text-white py-4 rounded-full font-black">
                      👥 {post.teamMembers.length}
                    </button>
                  </div>

                  {!isOwner && (
                    <div className="rounded-[28px] bg-white p-5 mb-6">
                      <h3 className="text-2xl font-black mb-4">
                        Request to Join 🤝
                      </h3>

                      <textarea
                        value={requestMessage[post.id] || ""}
                        onChange={(e) =>
                          setRequestMessage({
                            ...requestMessage,
                            [post.id]: e.target.value,
                          })
                        }
                        placeholder="Why do you want to join?"
                        className="w-full h-24 p-4 rounded-[20px] bg-[#f4f8ff] outline-none resize-none"
                      />

                      <button onClick={() => sendRequest(post)} className="mt-4 bg-green-600 text-white px-8 py-4 rounded-full font-black">
                        Request to Join
                      </button>
                    </div>
                  )}

                  {isOwner && post.requests.length > 0 && (
                    <div className="rounded-[28px] bg-white p-5">
                      <h3 className="text-2xl font-black mb-4">
                        Incoming Requests 📩
                      </h3>

                      {post.requests.map((request, index) => (
                        <div key={index} className="rounded-[22px] bg-[#f4f8ff] p-5 mb-4">
                          <h4 className="font-black text-xl">
                            {request.userName}
                          </h4>

                          <p className="mt-2">{request.message}</p>

                          <p className="mt-2 font-black">
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}