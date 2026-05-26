// app/organizer-dashboard/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function OrganizerDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [events, setEvents] = useState<Competition[]>([]);

  const [eventForm, setEventForm] = useState({
    title: "",
    organizer: "CampusConnect Organizer",
    thumbnail: "🏆",
    shortDescription: "",
    fullDescription: "",
    category: "Hackathon",
    deadline: "",
    rules: "",
    eligibility: "",
    link: "",
    featured: true,
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("organizerLoggedIn");
    const pinVerified = localStorage.getItem("organizerPinVerified");

    if (loggedIn !== "true") {
      router.push("/organizer-login");
      return;
    }

    if (pinVerified !== "true") {
      router.push("/organizer-pin");
      return;
    }
  }, [router]);

  useEffect(() => {
    const q = query(
      collection(db, "competitions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Competition[];

      setEvents(data);
    });

    return () => unsubscribe();
  }, []);

  const createEvent = async () => {
    if (
      !eventForm.title ||
      !eventForm.organizer ||
      !eventForm.thumbnail ||
      !eventForm.shortDescription ||
      !eventForm.fullDescription ||
      !eventForm.category ||
      !eventForm.deadline ||
      !eventForm.rules ||
      !eventForm.eligibility ||
      !eventForm.link
    ) {
      alert("Please fill all event fields");
      return;
    }

    await addDoc(collection(db, "competitions"), {
      ...eventForm,
      participants: 0,
      createdAt: serverTimestamp(),
    });

    setEventForm({
      title: "",
      organizer: "CampusConnect Organizer",
      thumbnail: "🏆",
      shortDescription: "",
      fullDescription: "",
      category: "Hackathon",
      deadline: "",
      rules: "",
      eligibility: "",
      link: "",
      featured: true,
    });

    alert("Event created and published to Startup Competitions ✅");
  };

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, "competitions", id));
  };

  const stats = useMemo(
    () => [
      {
        title: "Total Events",
        value: events.length,
      },
      {
        title: "Featured Events",
        value: events.filter((e) => e.featured).length,
      },
      {
        title: "Participants",
        value: events.reduce((sum, e) => sum + (e.participants || 0), 0),
      },
      {
        title: "Active Categories",
        value: new Set(events.map((e) => e.category)).size,
      },
    ],
    [events]
  );

  const sidebarItems = [
    "Dashboard",
    "Events",
    "Users",
    "Courses",
    "Analytics",
    "Support",
    "Settings",
  ];

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] flex">
      <aside className="w-[300px] bg-white border-r border-slate-200 p-6">
        <h1 className="text-4xl font-black">Organizer</h1>
        <p className="text-slate-500 mt-2">Admin Control Panel</p>

        <div className="mt-10 space-y-3">
          {sidebarItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition ${
                activeTab === item ? "bg-blue-600 text-white" : "bg-[#f5f7fb]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("organizerLoggedIn");
            localStorage.removeItem("organizerPinVerified");
            router.push("/organizer-login");
          }}
          className="w-full mt-10 bg-red-600 text-white py-4 rounded-2xl font-black"
        >
          Logout
        </button>
      </aside>

      <section className="flex-1 p-8 overflow-y-auto">
        {activeTab === "Dashboard" && (
          <>
            <div className="bg-white rounded-[40px] shadow-xl p-10">
              <h1 className="text-6xl font-black">Organizer Dashboard 🎤</h1>
              <p className="text-slate-500 text-xl mt-3">
                Manage events, hackathons and startup competitions in realtime.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mt-10">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-[30px] p-8 shadow-xl"
                >
                  <p className="text-slate-500 font-bold">{item.title}</p>
                  <h2 className="text-5xl font-black mt-4">{item.value}</h2>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Events" && (
          <>
            <div className="bg-white rounded-[40px] shadow-xl p-10">
              <h1 className="text-5xl font-black">
                Create Event / Hackathon 🎉
              </h1>
              <p className="text-slate-500 text-lg mt-3">
                Created events will appear instantly in Startup Competitions.
              </p>

              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <input
                  placeholder="Competition Title"
                  className="input-box"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                />

                <input
                  placeholder="Organizer Name"
                  className="input-box"
                  value={eventForm.organizer}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, organizer: e.target.value })
                  }
                />

                <input
                  placeholder="Thumbnail Emoji / Image URL"
                  className="input-box"
                  value={eventForm.thumbnail}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, thumbnail: e.target.value })
                  }
                />

                <input
                  placeholder="Category"
                  className="input-box"
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, category: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="input-box"
                  value={eventForm.deadline}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, deadline: e.target.value })
                  }
                />

                <input
                  placeholder="Registration Link"
                  className="input-box"
                  value={eventForm.link}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, link: e.target.value })
                  }
                />

                <textarea
                  placeholder="Short Description"
                  className="input-box h-28 lg:col-span-2"
                  value={eventForm.shortDescription}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      shortDescription: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Full Description"
                  className="input-box h-28 lg:col-span-2"
                  value={eventForm.fullDescription}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      fullDescription: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Rules & Guidelines"
                  className="input-box h-28"
                  value={eventForm.rules}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, rules: e.target.value })
                  }
                />

                <textarea
                  placeholder="Eligibility"
                  className="input-box h-28"
                  value={eventForm.eligibility}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, eligibility: e.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-3 mt-6 font-bold">
                <input
                  type="checkbox"
                  checked={eventForm.featured}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      featured: e.target.checked,
                    })
                  }
                />
                Featured Event
              </label>

              <button
                onClick={createEvent}
                className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black"
              >
                Publish Event
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-[35px] shadow-xl p-8"
                >
                  <div className="text-7xl">
                    {event.thumbnail?.startsWith("http") ? (
                      <img
                        src={event.thumbnail}
                        alt="thumbnail"
                        className="w-24 h-24 rounded-2xl object-cover"
                      />
                    ) : (
                      event.thumbnail || "🏆"
                    )}
                  </div>

                  <h2 className="text-4xl font-black mt-6">{event.title}</h2>

                  <p className="text-blue-600 font-bold mt-2">
                    {event.category}
                  </p>

                  <p className="text-slate-600 mt-4">
                    {event.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                      Deadline: {event.deadline}
                    </span>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                      Participants: {event.participants || 0}
                    </span>

                    {event.featured && (
                      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                        Featured
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="mt-6 bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab !== "Dashboard" && activeTab !== "Events" && (
          <div className="bg-white rounded-[40px] shadow-xl p-10">
            <h1 className="text-5xl font-black">{activeTab}</h1>
            <p className="text-slate-500 text-xl mt-4">
              This module is ready for expansion.
            </p>
          </div>
        )}
      </section>

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