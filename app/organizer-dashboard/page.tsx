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
  issueType?: string;
  issue?: string;
  description?: string;
  details?: string;
  status: "pending" | "resolved";
  adminResponse?: string;
};

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

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  targetRole: string;
  link: string;
  isBroadcast: boolean;
};

export default function OrganizerDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");

  const [events, setEvents] = useState<Competition[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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

  const [courseForm, setCourseForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    thumbnail: "🎓",
    category: "",
    difficulty: "",
    duration: "",
    video: "",
  });

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    targetRole: "all",
    link: "",
  });

  const [courseLoading, setCourseLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

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
    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Competition[]
      );
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setComplaints(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Complaint[]
      );
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setCourses(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Course[]
      );
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as NotificationItem[]
      );
    });

    return () => unsub();
  }, []);

  const createEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.registrationLink) {
      alert("Please fill Event Title, Description and Registration Link");
      return;
    }

    await addDoc(collection(db, "competitions"), {
      title: eventForm.title,
      organizer: "CampusConnect Organizer",
      thumbnail: eventForm.thumbnail || "🏆",
      shortDescription: eventForm.description,
      fullDescription: eventForm.fullDescription || eventForm.description,
      category: eventForm.category || "Hackathon",
      deadline: eventForm.deadline || "2026-12-31",
      rules: eventForm.rules || "Follow organizer rules and submit before deadline.",
      eligibility:
        eventForm.eligibility || "Open to startups, students and founders.",
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

  const uploadCourse = async () => {
    if (!courseForm.title || !courseForm.shortDescription) {
      alert("Please fill Course Title and Short Description");
      return;
    }

    try {
      setCourseLoading(true);

      await addDoc(collection(db, "courses"), {
        title: courseForm.title,
        shortDescription: courseForm.shortDescription,
        fullDescription: courseForm.fullDescription,
        thumbnail: courseForm.thumbnail || "🎓",
        category: courseForm.category || "AI",
        difficulty: courseForm.difficulty || "Beginner",
        duration: courseForm.duration || "2 Hours",
        video: courseForm.video,
        createdAt: serverTimestamp(),
      });

      alert("Course uploaded to Learning Hub 🚀");

      setCourseForm({
        title: "",
        shortDescription: "",
        fullDescription: "",
        thumbnail: "🎓",
        category: "",
        difficulty: "",
        duration: "",
        video: "",
      });
    } catch (error) {
      console.log(error);
      alert("Course upload failed");
    }

    setCourseLoading(false);
  };

  const deleteCourse = async (id: string) => {
    await deleteDoc(doc(db, "courses", id));
  };

  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      alert("Please enter notification title and message");
      return;
    }

    try {
      setNotificationLoading(true);

      await addDoc(collection(db, "notifications"), {
        title: notificationForm.title,
        message: notificationForm.message,
        targetRole: notificationForm.targetRole,
        link: notificationForm.link,
        isBroadcast: notificationForm.targetRole === "all",
        createdAt: serverTimestamp(),
      });

      alert("Notification sent successfully 🔔");

      setNotificationForm({
        title: "",
        message: "",
        targetRole: "all",
        link: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to send notification");
    }

    setNotificationLoading(false);
  };

  const deleteNotification = async (id: string) => {
    await deleteDoc(doc(db, "notifications", id));
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
      { title: "Courses", value: courses.length },
      { title: "Notifications", value: notifications.length },
      { title: "Pending Complaints", value: complaints.filter((c) => c.status !== "resolved").length },
    ],
    [events, courses, notifications, complaints]
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
            <Header
              title="Dashboard"
              text="Manage platform operations dynamically."
            />

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
              <h1 className="text-5xl font-black">Create Event / Hackathon 🎉</h1>

              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <input
                  placeholder="Event Title"
                  className="input-box"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
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

                <textarea
                  placeholder="Short Description"
                  className="input-box h-24"
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                />

                <textarea
                  placeholder="Full Description"
                  className="input-box h-24"
                  value={eventForm.fullDescription}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      fullDescription: e.target.value,
                    })
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
                  className="input-box h-24 lg:col-span-2"
                  value={eventForm.eligibility}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, eligibility: e.target.value })
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

        {activeTab === "Courses" && (
          <>
            <div className="bg-white rounded-[40px] shadow-xl p-10">
              <h1 className="text-5xl font-black">📚 Upload Course</h1>
              <p className="text-slate-500 text-xl mt-4">
                Courses uploaded here appear live in Startup Learning Hub.
              </p>

              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <input
                  placeholder="Course Title"
                  className="input-box"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                />

                <input
                  placeholder="Thumbnail Emoji / Image URL"
                  className="input-box"
                  value={courseForm.thumbnail}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, thumbnail: e.target.value })
                  }
                />

                <input
                  placeholder="Short Description"
                  className="input-box"
                  value={courseForm.shortDescription}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      shortDescription: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Category: AI / Business / Tech"
                  className="input-box"
                  value={courseForm.category}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, category: e.target.value })
                  }
                />

                <input
                  placeholder="Difficulty: Beginner / Intermediate / Advanced"
                  className="input-box"
                  value={courseForm.difficulty}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      difficulty: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Duration"
                  className="input-box"
                  value={courseForm.duration}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration: e.target.value })
                  }
                />

                <input
                  placeholder="Video URL"
                  className="input-box lg:col-span-2"
                  value={courseForm.video}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, video: e.target.value })
                  }
                />

                <textarea
                  placeholder="Full Course Description"
                  className="input-box h-32 lg:col-span-2"
                  value={courseForm.fullDescription}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      fullDescription: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={uploadCourse}
                className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black"
              >
                {courseLoading ? "Uploading..." : "Upload Course 🚀"}
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mt-10">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-[35px] shadow-xl overflow-hidden"
                >
                  <div className="h-52 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-7xl">
                    {course.thumbnail?.startsWith("http") ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      course.thumbnail || "🎓"
                    )}
                  </div>

                  <div className="p-7">
                    <div className="flex gap-3 flex-wrap">
                      <span className="chip">{course.category}</span>
                      <span className="purple-chip">{course.difficulty}</span>
                    </div>

                    <h3 className="text-3xl font-black mt-5">{course.title}</h3>
                    <p className="text-slate-500 mt-4">
                      {course.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                      <span className="font-black">⏱️ {course.duration}</span>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="bg-red-500 text-white px-5 py-3 rounded-2xl font-black"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Notifications" && (
          <>
            <div className="bg-white rounded-[40px] shadow-xl p-10">
              <h1 className="text-5xl font-black">🔔 Notification System</h1>
              <p className="text-slate-500 text-xl mt-4">
                Send real-time notifications to users by role.
              </p>

              <div className="grid lg:grid-cols-2 gap-5 mt-8">
                <input
                  placeholder="Notification Title"
                  className="input-box"
                  value={notificationForm.title}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      title: e.target.value,
                    })
                  }
                />

                <select
                  className="input-box"
                  value={notificationForm.targetRole}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      targetRole: e.target.value,
                    })
                  }
                >
                  <option value="all">All Users</option>
                  <option value="startup">Startups</option>
                  <option value="investor">Investors</option>
                  <option value="mentor">Mentors</option>
                  <option value="service-provider">Service Providers</option>
                </select>

                <input
                  placeholder="Optional Link / Redirect URL"
                  className="input-box lg:col-span-2"
                  value={notificationForm.link}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      link: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Notification Message"
                  className="input-box h-32 lg:col-span-2"
                  value={notificationForm.message}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      message: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={sendNotification}
                className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-3xl text-xl font-black shadow-xl"
              >
                {notificationLoading ? "Sending..." : "Send Notification 🚀"}
              </button>
            </div>

            <div className="bg-white rounded-[40px] shadow-xl p-10 mt-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-5xl font-black">Sent Notifications</h2>
                  <p className="text-slate-500 text-xl mt-4">
                    Real-time notification history.
                  </p>
                </div>

                <div className="bg-blue-100 text-blue-700 px-6 py-4 rounded-full font-black">
                  {notifications.length} Sent
                </div>
              </div>

              <div className="space-y-5 mt-10">
                {notifications.length === 0 && (
                  <div className="bg-[#f8fbff] rounded-[30px] p-10 text-center">
                    <h3 className="text-3xl font-black">No notifications yet</h3>
                  </div>
                )}

                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f8fbff] rounded-[30px] p-7 border border-slate-200"
                  >
                    <div className="flex justify-between gap-5">
                      <div>
                        <div className="flex gap-3 flex-wrap">
                          <span className="chip">{item.targetRole}</span>

                          {item.isBroadcast && (
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black text-sm">
                              Broadcast
                            </span>
                          )}
                        </div>

                        <h3 className="text-3xl font-black mt-5">
                          {item.title}
                        </h3>

                        <p className="text-slate-600 mt-3">{item.message}</p>

                        {item.link && (
                          <p className="text-blue-600 font-bold mt-3">
                            Link: {item.link}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => deleteNotification(item.id)}
                        className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black h-fit"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                  <span
                    className={`px-5 py-2 rounded-full font-bold ${
                      item.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status || "pending"}
                  </span>

                  <h2 className="text-3xl font-black mt-5">
                    {item.issueType || "Complaint"}
                  </h2>

                  <p className="text-slate-600 mt-4">
                    {item.description || item.issue}
                  </p>

                  {item.details && (
                    <p className="text-blue-600 font-bold mt-3">
                      Details: {item.details}
                    </p>
                  )}

                  {item.adminResponse && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mt-5">
                      <h3 className="font-black text-blue-700">Admin Response</h3>
                      <p className="text-slate-600 mt-2">{item.adminResponse}</p>
                    </div>
                  )}

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
          activeTab !== "Support" &&
          activeTab !== "Courses" &&
          activeTab !== "Notifications" && (
            <Header
              title={activeTab}
              text="This module is ready for expansion. Existing design preserved."
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

        textarea.input-box {
          height: auto;
          padding-top: 16px;
        }

        .chip {
          background: #dbeafe;
          color: #2563eb;
          padding: 10px 18px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 14px;
        }

        .purple-chip {
          background: #ede9fe;
          color: #7c3aed;
          padding: 10px 18px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}

function Header({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white rounded-[40px] shadow-xl p-10">
      <h1 className="text-5xl font-black">{title}</h1>
      <p className="text-slate-500 text-xl mt-4">{text}</p>
    </div>
  );
}