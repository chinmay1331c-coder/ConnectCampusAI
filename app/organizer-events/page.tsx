"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Competition = {
  id: string;
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
  participants: number;
};

export default function OrganizerEventsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  const [form, setForm] = useState({
    title: "",
    organizer: "",
    thumbnail: "🏆",
    shortDescription: "",
    fullDescription: "",
    category: "",
    deadline: "",
    rules: "",
    eligibility: "",
    link: "",
    featured: false,
  });

  useEffect(() => {
    const q = query(
      collection(db, "competitions"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Competition[];

      setCompetitions(data);
    });

    return () => unsub();
  }, []);

  const createCompetition = async () => {
    if (
      !form.title ||
      !form.organizer ||
      !form.shortDescription ||
      !form.fullDescription ||
      !form.category ||
      !form.deadline ||
      !form.rules ||
      !form.eligibility ||
      !form.link
    ) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "competitions"), {
      ...form,
      participants: 0,
      createdAt: serverTimestamp(),
    });

    setForm({
      title: "",
      organizer: "",
      thumbnail: "🏆",
      shortDescription: "",
      fullDescription: "",
      category: "",
      deadline: "",
      rules: "",
      eligibility: "",
      link: "",
      featured: false,
    });
  };

  const deleteCompetition = async (id: string) => {
    await deleteDoc(doc(db, "competitions", id));
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8 text-[#07162b]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-xl p-10">
          <h1 className="text-6xl font-black">Organizer Events 🏆</h1>
          <p className="text-slate-500 text-xl mt-3">
            Create competitions. They appear realtime in Startup Portal.
          </p>
        </div>

        <div className="bg-white rounded-[40px] shadow-xl p-10 mt-10">
          <h2 className="text-4xl font-black">Create Competition</h2>

          <div className="grid lg:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Competition Title"
              className="input-box"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              placeholder="Organizer Name"
              className="input-box"
              value={form.organizer}
              onChange={(e) => setForm({ ...form, organizer: e.target.value })}
            />

            <input
              placeholder="Thumbnail Emoji / Image URL"
              className="input-box"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            />

            <input
              placeholder="Category"
              className="input-box"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <input
              type="date"
              className="input-box"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />

            <input
              placeholder="Registration Link"
              className="input-box"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />

            <textarea
              placeholder="Short Description"
              className="input-box h-28 lg:col-span-2"
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
            />

            <textarea
              placeholder="Full Description"
              className="input-box h-28 lg:col-span-2"
              value={form.fullDescription}
              onChange={(e) =>
                setForm({ ...form, fullDescription: e.target.value })
              }
            />

            <textarea
              placeholder="Rules & Guidelines"
              className="input-box h-28"
              value={form.rules}
              onChange={(e) => setForm({ ...form, rules: e.target.value })}
            />

            <textarea
              placeholder="Eligibility"
              className="input-box h-28"
              value={form.eligibility}
              onChange={(e) =>
                setForm({ ...form, eligibility: e.target.value })
              }
            />
          </div>

          <label className="flex items-center gap-3 mt-6 font-bold">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
            />
            Featured Competition
          </label>

          <button
            onClick={createCompetition}
            className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black"
          >
            Create Event
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {competitions.map((item) => (
            <div key={item.id} className="bg-white rounded-[35px] shadow-xl p-8">
              <div className="text-7xl">
                {item.thumbnail?.startsWith("http") ? (
                  <img
                    src={item.thumbnail}
                    alt="thumbnail"
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  item.thumbnail || "🏆"
                )}
              </div>

              <h2 className="text-4xl font-black mt-6">{item.title}</h2>

              <p className="text-blue-600 font-bold mt-2">{item.category}</p>

              <p className="text-slate-600 mt-4">{item.shortDescription}</p>

              <p className="text-red-600 font-bold mt-4">
                Deadline: {item.deadline}
              </p>

              <p className="text-green-600 font-bold mt-2">
                Participants: {item.participants || 0}
              </p>

              <button
                onClick={() => deleteCompetition(item.id)}
                className="mt-6 bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
              >
                Delete
              </button>
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
        }
      `}</style>
    </main>
  );
}