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

type NetworkPost = {
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
  ownerCollege: string;
  ownerSkills: string;
  ownerInterests: string;
  ownerBio: string;
  likes: number;
  rating: number;
  comments: string[];
  connections: string[];
  createdAt: string;
};

export default function NetworkingPage() {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [roles, setRoles] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [tags, setTags] = useState("");

  const [commentText, setCommentText] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem("campusProfile");
    if (stored) setProfile(JSON.parse(stored));
    fetchPosts();
  }, []);

  const handleSearch = () => {
    alert("Search applied ✅");
  };

  const fetchPosts = async () => {
    const q = query(collection(db, "networkingPosts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as NetworkPost[];

    setPosts(data);
  };

  const createPost = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const postData = {
      title,
      description,
      problem,
      solution,
      roles,
      skillsNeeded,
      tags,
      ownerUid: user.uid,
      ownerName: profile?.name || "Student User",
      ownerCollege: profile?.college || "",
      ownerSkills: profile?.skills || "",
      ownerInterests: profile?.interests || "",
      ownerBio: profile?.bio || "",
      likes: 0,
      rating: 0,
      comments: [],
      connections: [],
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db, "networkingPosts"), postData);

    setTitle("");
    setDescription("");
    setProblem("");
    setSolution("");
    setRoles("");
    setSkillsNeeded("");
    setTags("");

    alert("Networking post created 🚀");
    fetchPosts();
  };

  const likePost = async (post: NetworkPost) => {
    await updateDoc(doc(db, "networkingPosts", post.id), {
      likes: post.likes + 1,
    });

    fetchPosts();
  };

  const ratePost = async (post: NetworkPost) => {
    const rating = prompt("Rate from 1-5");
    if (!rating) return;

    await updateDoc(doc(db, "networkingPosts", post.id), {
      rating: Number(rating),
    });

    fetchPosts();
  };

  const addComment = async (post: NetworkPost) => {
    const text = commentText[post.id];
    if (!text?.trim()) return;

    await updateDoc(doc(db, "networkingPosts", post.id), {
      comments: [...post.comments, `${profile?.name || "User"}: ${text}`],
    });

    setCommentText({
      ...commentText,
      [post.id]: "",
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
      ${post.tags}
      ${post.ownerName}
      ${post.ownerCollege}
      ${post.ownerSkills}
      ${post.ownerInterests}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard">
          <button className="mb-8 bg-black text-white px-6 py-3 rounded-full font-bold">
            ← Back Dashboard
          </button>
        </Link>

        <div className="bg-white p-10 rounded-[40px] mb-10">
          <h1 className="text-5xl font-black mb-4">
            Networking 🌐
          </h1>

          <div className="flex gap-4 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search startup ideas..."
              className="flex-1 p-5 rounded-2xl border outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black hover:scale-105 transition"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[40px] h-fit">
            <h2 className="text-3xl font-black mb-6">
              Create Startup Post 🚀
            </h2>

            <div className="space-y-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Startup Title" className="w-full p-4 rounded-2xl border" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full h-24 p-4 rounded-2xl border" />
              <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Problem" className="w-full h-24 p-4 rounded-2xl border" />
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Solution" className="w-full h-24 p-4 rounded-2xl border" />
              <input value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="Roles" className="w-full p-4 rounded-2xl border" />
              <input value={skillsNeeded} onChange={(e) => setSkillsNeeded(e.target.value)} placeholder="Skills Needed" className="w-full p-4 rounded-2xl border" />
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags" className="w-full p-4 rounded-2xl border" />

              <button
                onClick={createPost}
                className="w-full bg-blue-600 text-white py-4 rounded-full font-black"
              >
                Publish Startup Post
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {filteredPosts.map((post) => {
              const isHighlighted =
                search &&
                `
                  ${post.title}
                  ${post.description}
                  ${post.problem}
                  ${post.solution}
                  ${post.roles}
                  ${post.skillsNeeded}
                  ${post.tags}
                  ${post.ownerName}
                  ${post.ownerCollege}
                  ${post.ownerSkills}
                  ${post.ownerInterests}
                `
                  .toLowerCase()
                  .includes(search.toLowerCase());

              return (
                <div
                  key={post.id}
                  className={`p-8 rounded-[40px] transition-all duration-500 ${
                    isHighlighted
                      ? "bg-blue-50 border border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.6)] scale-[1.02]"
                      : "bg-white"
                  }`}
                >
                  <h2 className="text-4xl font-black mb-3">
                    {post.title}
                  </h2>

                  <p className="mb-6">
                    By {post.ownerName}
                  </p>

                  <p className="mb-6">
                    {post.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <button onClick={() => likePost(post)} className="bg-blue-600 text-white py-4 rounded-full font-black">
                      👍 {post.likes}
                    </button>

                    <button onClick={() => ratePost(post)} className="bg-yellow-400 py-4 rounded-full font-black">
                      ⭐ {post.rating}/5
                    </button>

                    <button className="bg-green-600 text-white py-4 rounded-full font-black">
                      🤝 {post.connections.length}
                    </button>
                  </div>

                  <div className="space-y-3 mb-5">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="bg-[#f4f8ff] p-4 rounded-2xl">
                        {comment}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      value={commentText[post.id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [post.id]: e.target.value,
                        })
                      }
                      placeholder="Write comment..."
                      className="flex-1 p-4 rounded-full border"
                    />

                    <button
                      onClick={() => addComment(post)}
                      className="bg-black text-white px-6 rounded-full font-black"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}