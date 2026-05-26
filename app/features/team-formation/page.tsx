// app/features/team-formation/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type CollabPost = {
  id: string;
  name?: string;
  role?: string;
  skills?: string[];
  interests?: string[];
  domain?: string;
  idea?: string;
  bio?: string;
};

type MatchResult = CollabPost & {
  matchScore: number;
  reasons: string[];
};

export default function TeamFormationPage() {
  const [posts, setPosts] = useState<CollabPost[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  const [filters, setFilters] = useState({
    domain: "",
    skill: "",
    minScore: 0,
  });

  const [userInput, setUserInput] = useState({
    skills: "",
    interests: "",
    role: "",
    domain: "",
    idea: "",
  });

  const [newPost, setNewPost] = useState({
    name: "",
    role: "",
    skills: "",
    interests: "",
    domain: "",
    idea: "",
    bio: "",
  });

  // REALTIME POSTS

  useEffect(() => {
    const q = query(
      collection(db, "collabPosts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CollabPost[];

      setPosts(data);
    });

    return () => unsub();
  }, []);

  // CREATE POST

  const createPost = async () => {
    if (
      !newPost.name ||
      !newPost.role ||
      !newPost.skills ||
      !newPost.domain ||
      !newPost.idea
    ) {
      alert("Please fill all required fields");
      return;
    }

    await addDoc(collection(db, "collabPosts"), {
      name: newPost.name,
      role: newPost.role,
      skills: newPost.skills
        .split(",")
        .map((s) => s.trim()),

      interests: newPost.interests
        .split(",")
        .map((s) => s.trim()),

      domain: newPost.domain,
      idea: newPost.idea,
      bio: newPost.bio,

      createdAt: serverTimestamp(),
    });

    alert("Collab post created 🚀");

    setNewPost({
      name: "",
      role: "",
      skills: "",
      interests: "",
      domain: "",
      idea: "",
      bio: "",
    });

    setShowCreate(false);
  };

  // AI MATCHING

  const runMatchingAlgorithm = () => {
    setLoading(true);

    const userSkills = userInput.skills
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const userInterests = userInput.interests
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setTimeout(() => {
      const calculatedMatches: MatchResult[] =
        posts.map((post) => {
          const postSkills = (
            post.skills || []
          ).map((s) =>
            s.toLowerCase()
          );

          const postInterests = (
            post.interests || []
          ).map((s) =>
            s.toLowerCase()
          );

          let skillMatch = 0;
          let domainMatch = 0;
          let roleMatch = 0;
          let ideaMatch = 0;

          const reasons: string[] = [];

          // SKILLS

          const commonSkills =
            userSkills.filter((skill) =>
              postSkills.includes(skill)
            );

          skillMatch =
            commonSkills.length /
            Math.max(
              userSkills.length || 1,
              1
            );

          if (commonSkills.length > 0) {
            reasons.push(
              `Strong skill alignment (${commonSkills.join(
                ", "
              )})`
            );
          }

          // DOMAIN

          if (
            (post.domain || "")
              .toLowerCase()
              .includes(
                userInput.domain.toLowerCase()
              )
          ) {
            domainMatch = 1;

            reasons.push(
              `Same domain (${post.domain})`
            );
          }

          // ROLE

          if (
            (post.role || "")
              .toLowerCase() !==
            userInput.role.toLowerCase()
          ) {
            roleMatch = 1;

            reasons.push(
              `Complementary role (${post.role})`
            );
          }

          // IDEA

          const ideaWords = userInput.idea
            .toLowerCase()
            .split(" ");

          const postIdea = (
            post.idea || ""
          ).toLowerCase();

          const commonIdeaWords =
            ideaWords.filter((word) =>
              postIdea.includes(word)
            );

          ideaMatch =
            commonIdeaWords.length /
            Math.max(
              ideaWords.length || 1,
              1
            );

          if (ideaMatch > 0.3) {
            reasons.push(
              "Startup idea compatibility detected"
            );
          }

          // INTERESTS

          const interestOverlap =
            userInterests.filter(
              (interest) =>
                postInterests.includes(
                  interest
                )
            );

          if (interestOverlap.length > 0) {
            reasons.push(
              `Shared interests (${interestOverlap.join(
                ", "
              )})`
            );
          }

          // TOTAL SCORE

          const totalScore =
            skillMatch * 0.4 +
            domainMatch * 0.3 +
            roleMatch * 0.2 +
            ideaMatch * 0.1;

          return {
            ...post,
            matchScore: Math.round(
              totalScore * 100
            ),
            reasons,
          };
        });

      const sorted =
        calculatedMatches
          .filter(
            (m) =>
              m.matchScore >=
              filters.minScore
          )
          .filter((m) =>
            filters.domain
              ? (
                  m.domain || ""
                )
                  .toLowerCase()
                  .includes(
                    filters.domain.toLowerCase()
                  )
              : true
          )
          .filter((m) =>
            filters.skill
              ? (
                  m.skills || []
                )
                  .join(" ")
                  .toLowerCase()
                  .includes(
                    filters.skill.toLowerCase()
                  )
              : true
          )
          .sort(
            (a, b) =>
              b.matchScore -
              a.matchScore
          );

      setMatches(sorted);

      setLoading(false);
    }, 1200);
  };

  // SEND REQUEST

  const sendTeamRequest = async (
    match: MatchResult
  ) => {
    await addDoc(collection(db, "teamRequests"), {
      sender: "Startup User",
      receiver: match.name,
      roleNeeded: match.role,
      idea: userInput.idea,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert(
      "Collaboration request sent 🚀"
    );
  };

  const filteredMatches = useMemo(() => {
    return matches;
  }, [matches]);

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] p-8">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}

        <div className="bg-white rounded-[40px] shadow-xl p-10">
          <div className="flex justify-between items-center flex-wrap gap-5">
            <div>
              <h1 className="text-6xl font-black">
                Team Formation 🤝
              </h1>

              <p className="text-slate-500 text-xl mt-4">
                Create startup collab
                posts and use AI to find
                the best teammates.
              </p>
            </div>

            <button
              onClick={() =>
                setShowCreate(true)
              }
              className="bg-[#07162b] text-white px-8 py-5 rounded-2xl font-black"
            >
              ➕ Create Post
            </button>
          </div>
        </div>

        {/* POSTS */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-[35px] shadow-xl p-8"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black">
                    {post.name}
                  </h2>

                  <p className="text-blue-600 font-bold mt-2">
                    {post.role}
                  </p>
                </div>

                <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-black">
                  {post.domain}
                </div>
              </div>

              <p className="text-slate-600 mt-6">
                {post.bio}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {(post.skills || []).map(
                  (skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-black text-xl">
                  Startup Idea
                </h3>

                <p className="text-slate-600 mt-2">
                  {post.idea}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI MATCH */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 mt-10">
          <h2 className="text-5xl font-black">
            AI Team Match ⚡
          </h2>

          <p className="text-slate-500 text-xl mt-4">
            Find teammates using live
            collab data.
          </p>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Skills"
              className="input-box"
              value={userInput.skills}
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  skills: e.target.value,
                })
              }
            />

            <input
              placeholder="Interests"
              className="input-box"
              value={userInput.interests}
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  interests:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Preferred Role"
              className="input-box"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  role: e.target.value,
                })
              }
            />

            <input
              placeholder="Domain"
              className="input-box"
              value={userInput.domain}
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  domain:
                    e.target.value,
                })
              }
            />

            <textarea
              placeholder="Startup Idea"
              className="input-box h-28 lg:col-span-2"
              value={userInput.idea}
              onChange={(e) =>
                setUserInput({
                  ...userInput,
                  idea: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={
              runMatchingAlgorithm
            }
            className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black"
          >
            Find Matches 🚀
          </button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="text-center py-10 text-3xl font-black">
            AI is analyzing live
            collaboration data...
          </div>
        )}

        {/* MATCH RESULTS */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {filteredMatches.map(
            (match) => (
              <div
                key={match.id}
                className="bg-white rounded-[35px] shadow-xl p-8"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-4xl font-black">
                      {match.name}
                    </h2>

                    <p className="text-blue-600 font-bold mt-2">
                      {match.role}
                    </p>
                  </div>

                  <div className="bg-green-100 text-green-700 px-5 py-4 rounded-full font-black text-2xl">
                    {
                      match.matchScore
                    }
                    %
                  </div>
                </div>

                <p className="text-slate-600 mt-5">
                  {match.bio}
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  {(
                    match.skills || []
                  ).map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="bg-[#f4f8ff] rounded-[25px] p-5 mt-6">
                  <h3 className="font-black text-xl">
                    AI Match Reasons
                  </h3>

                  <div className="space-y-2 mt-4">
                    {match.reasons.map(
                      (
                        reason,
                        i
                      ) => (
                        <div
                          key={i}
                          className="bg-white px-4 py-3 rounded-xl text-sm font-semibold"
                        >
                          ✅ {reason}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  <button className="bg-[#07162b] text-white py-4 rounded-2xl font-black">
                    🤝 Connect
                  </button>

                  <button className="bg-blue-600 text-white py-4 rounded-2xl font-black">
                    💬 Chat
                  </button>

                  <button
                    onClick={() =>
                      sendTeamRequest(
                        match
                      )
                    }
                    className="bg-green-600 text-white py-4 rounded-2xl font-black"
                  >
                    ➕ Invite
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* CREATE MODAL */}

        {showCreate && (
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6">
            <div className="bg-white rounded-[35px] p-8 max-w-3xl w-full shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-5xl font-black">
                    Create Collab Post
                  </h2>

                  <p className="text-slate-500 mt-3">
                    Share your startup
                    idea and find
                    teammates.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowCreate(
                      false
                    )
                  }
                  className="text-4xl font-black"
                >
                  ×
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <input
                  placeholder="Your Name"
                  className="input-box"
                  value={newPost.name}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Role"
                  className="input-box"
                  value={newPost.role}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      role: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Skills"
                  className="input-box"
                  value={newPost.skills}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      skills:
                        e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Interests"
                  className="input-box"
                  value={
                    newPost.interests
                  }
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      interests:
                        e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Domain"
                  className="input-box"
                  value={newPost.domain}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      domain:
                        e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Bio"
                  className="input-box h-28"
                  value={newPost.bio}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      bio: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Startup Idea"
                  className="input-box h-32 lg:col-span-2"
                  value={newPost.idea}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      idea: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={createPost}
                className="w-full mt-8 bg-[#07162b] text-white py-5 rounded-2xl font-black text-xl"
              >
                Publish Collab Post 🚀
              </button>
            </div>
          </div>
        )}
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
      `}</style>
    </main>
  );
}