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
  updateDoc,
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

type Complaint = {
  id: string;
  issueType: string;
  description: string;
  details: string;
  status: "pending" | "resolved";
  adminResponse: string;
};

export default function OrganizerDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [events, setEvents] = useState<Competition[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintFilter, setComplaintFilter] = useState("all");
  const [responseInputs, setResponseInputs] = useState<Record<string, string>>(
    {}
  );

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    fullDescription: "",
    thumbnail: "🏆",
    registrationLink: "",
    category: "",
    deadline: "",
    rules: "",
    eligibility: "",
  });

  const sidebarItems = [
    "Dashboard",
    "Users",
    "Verification",
    "Events",
    "CMS",
    "Support",
    "AI Tools",
    "Notifications",
    "Analytics",
    "Courses",
    "Security",
    "Settings",
  ];

  useEffect(() => {
    const loggedIn = localStorage.getItem("organizerLoggedIn");
    const pinVerified = localStorage.getItem("organizerPinVerified");

    if (loggedIn !== "true") {
      router.push("/organizer-login");
      return;
    }

    if (pinVerified !== "true") {
      router.push("/organizer-pin");
    }
  }, [router]);

  useEffect(() => {
    const q = query(collection(db, "competitions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Competition[];

      setEvents(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Complaint[];

      setComplaints(data);
    });

    return () => unsubscribe();
  }, []);

  const createEvent = async () => {
    if (
      !eventForm.title ||
      !eventForm.description ||
      !eventForm.thumbnail ||
      !eventForm.registrationLink
    ) {
      alert("Please fill all event fields");
      return;
    }

    await addDoc(collection(db, "competitions"), {
      title: eventForm.title,
      organizer: "CampusConnect Organizer",
      thumbnail: eventForm.thumbnail,
      shortDescription: eventForm.description,
      fullDescription: eventForm.fullDescription || eventForm.description,
      category: eventForm.category || "Hackathon",
      deadline: eventForm.deadline || "2026-12-31",
      rules:
        eventForm.rules ||
        "Follow organizer rules and submit before deadline.",
      eligibility:
        eventForm.eligibility ||
        "Open to startups, students and founders.",
      link: eventForm.registrationLink,
      featured: true,
      participants: 0,
      createdAt: serverTimestamp(),
    });

    alert("Event published to Startup Competitions ✅");

    setEventForm({
      title: "",
      description: "",
      fullDescription: "",
      thumbnail: "🏆",
      registrationLink: "",
      category: "",
      deadline: "",
      rules: "",
      eligibility: "",
    });
  };

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, "competitions", id));
  };

  const resolveComplaint = async (id: string) => {
    await updateDoc(doc(db, "complaints", id), {
      status: "resolved",
      adminResponse: responseInputs[id] || "Complaint resolved by admin.",
      resolvedAt: serverTimestamp(),
    });

    setResponseInputs((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const filteredComplaints = useMemo(() => {
    if (complaintFilter === "all") return complaints;

    return complaints.filter((item) => item.status === complaintFilter);
  }, [complaints, complaintFilter]);

  const stats = useMemo(
    () => [
      { title: "Total Startups", value: 120 },
      { title: "Total Investors", value: 45 },
      { title: "Total Mentors", value: 80 },
      { title: "Service Providers", value: 60 },
      { title: "Total Events", value: events.length },
      {
        title: "Participants",
        value: events.reduce((sum, e) => sum + (e.participants || 0), 0),
      },
      { title: "Complaints", value: complaints.length },
      { title: "Pending Complaints", value: complaints.filter((c) => c.status === "pending").length },
    ],
    [events, complaints]
  );

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] flex">
      <aside className="w-[300px] bg-white border-r border-slate-200 p-6 flex flex-col">
        <h1 className="text-4xl font-black">Organizer</h1>
        <p className="text-slate-500 mt-2">Admin Control Center</p>

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
          className="w-full mt-auto bg-red-600 text-white py-4 rounded-2xl font-black"
        >
          Logout
        </button>
      </aside>

      <section className="flex-1 p-8 overflow-y-auto">
        {activeTab === "Dashboard" && (
          <>
            <div className="bg-white rounded-[40px] shadow-xl p-10">
              <h1 className="text-6xl font-black">Dashboard</h1>
              <p className="text-slate-500 text-xl mt-3">
                Manage platform operations dynamically.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mt-10">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-[30px] p-8 shadow-xl"
                >
                  <p className="text-slate-500 font-bold">{item.title}</p>
                  <h2 className="text-4xl font-black mt-4">{item.value}</h2>
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

              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <input
                  placeholder="Event Title"
                  className="input-box"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                />

                <textarea
                  placeholder="Description"
                  className="input-box h-24"
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Thumbnail Image URL / Emoji"
                  className="input-box"
                  value={eventForm.thumbnail}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, thumbnail: e.target.value })
                  }
                />

                <input
                  placeholder="Registration Link"
                  className="input-box"
                  value={eventForm.registrationLink}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      registrationLink: e.target.value,
                    })
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

                <textarea
                  placeholder="Rules"
                  className="input-box h-24"
                  value={eventForm.rules}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, rules: e.target.value })
                  }
                />

                <textarea
                  placeholder="Eligibility"
                  className="input-box h-24"
                  value={eventForm.eligibility}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      eligibility: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={createEvent}
                className="mt-6 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black"
              >
                Create Event
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

                  <h2 className="text-3xl font-black mt-6">{event.title}</h2>
                  <p className="text-slate-500 mt-3">
                    {event.shortDescription}
                  </p>
                  <p className="font-black mt-4">
                    Participants: {event.participants || 0}
                  </p>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="mt-5 bg-red-500 text-white px-6 py-3 rounded-2xl font-black"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Support" && (
          <>
            <div className="bg-white rounded-[40px] shadow-xl p-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-black">
                    Complaint & Support System 📩
                  </h1>
                  <p className="text-slate-500 text-xl mt-4">
                    Complaints raised from Global AI Chatbot appear here realtime.
                  </p>
                </div>

                <select
                  className="input-box max-w-[220px]"
                  value={complaintFilter}
                  onChange={(e) => setComplaintFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="space-y-6 mt-10">
              {filteredComplaints.length === 0 && (
                <div className="bg-white rounded-[30px] p-10 shadow-xl text-center">
                  <h2 className="text-3xl font-black">No complaints found.</h2>
                </div>
              )}

              {filteredComplaints.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[35px] shadow-xl p-8"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span
                        className={`px-5 py-2 rounded-full font-bold ${
                          item.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>

                      <h2 className="text-3xl font-black mt-5">
                        {item.issueType}
                      </h2>

                      <p className="text-slate-600 mt-4">
                        {item.description}
                      </p>

                      {item.details && (
                        <p className="text-blue-600 font-bold mt-3">
                          Details: {item.details}
                        </p>
                      )}

                      {item.adminResponse && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mt-5">
                          <h3 className="font-black text-blue-700">
                            Admin Response
                          </h3>
                          <p className="text-slate-600 mt-2">
                            {item.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.status !== "resolved" && (
                    <div className="mt-6 flex gap-4">
                      <input
                        placeholder="Write admin response..."
                        className="input-box"
                        value={responseInputs[item.id] || ""}
                        onChange={(e) =>
                          setResponseInputs((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                      />

                      <button
                        onClick={() => resolveComplaint(item.id)}
                        className="bg-green-600 text-white px-8 rounded-2xl font-black"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab !== "Dashboard" &&
          activeTab !== "Events" &&
          activeTab !== "Support" && (
            <Section
              title={activeTab}
              text="This module is ready for expansion."
            />
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
      `}</style>
    </main>
  );
}

function Section({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-[40px] shadow-xl p-10">
      <h1 className="text-5xl font-black">{title}</h1>
      <p className="text-slate-500 text-xl mt-4">{text}</p>
    </div>
  );
}