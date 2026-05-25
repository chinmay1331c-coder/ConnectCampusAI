// app/organizer-dashboard/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  role: "Startup" | "Investor" | "Mentor" | "Service Provider";
  email: string;
  status: "active" | "suspended";
  verification: "pending" | "approved" | "rejected";
  activity: number;
  reports: number;
};

type EventItem = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
  participants: number;
};

type Course = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  about: string;
  outcomes: string[];
  topics: string[];
  level: string;
  duration: string;
  tags: string[];
  rating: number;
  enrollments: number;
};

type CmsItem = {
  id: number;
  type: "Banner" | "Blog" | "Announcement" | "Success Story";
  title: string;
  content: string;
};

type Complaint = {
  id: number;
  user: string;
  issue: string;
  status: "pending" | "resolved";
  reply: string;
};

export default function OrganizerDashboardPage() {
  const router = useRouter();

  const [active, setActive] = useState("Dashboard");

  const [adminProfile, setAdminProfile] = useState({
    name: "",
    photo: "",
    organization: "",
    role: "",
    email: "",
    phone: "",
    permission: "Super Admin",
    security: "PIN Enabled",
  });

  const [profileCompleted, setProfileCompleted] = useState(false);

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Startup Alpha",
      role: "Startup",
      email: "startup@demo.com",
      status: "active",
      verification: "pending",
      activity: 85,
      reports: 0,
    },
    {
      id: 2,
      name: "Investor One",
      role: "Investor",
      email: "investor@demo.com",
      status: "active",
      verification: "approved",
      activity: 65,
      reports: 1,
    },
    {
      id: 3,
      name: "Mentor Pro",
      role: "Mentor",
      email: "mentor@demo.com",
      status: "active",
      verification: "pending",
      activity: 42,
      reports: 0,
    },
    {
      id: 4,
      name: "ServiceX",
      role: "Service Provider",
      email: "service@demo.com",
      status: "active",
      verification: "rejected",
      activity: 12,
      reports: 3,
    },
  ]);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [cms, setCms] = useState<CmsItem[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 1,
      user: "Startup Alpha",
      issue: "Fake investor message",
      status: "pending",
      reply: "",
    },
  ]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    link: "",
  });

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    video: "",
  });

  const [cmsForm, setCmsForm] = useState({
    type: "Announcement" as CmsItem["type"],
    title: "",
    content: "",
  });

  const [notice, setNotice] = useState("");

  useEffect(() => {
    const pinAccess = localStorage.getItem("organizerPinAccess");

    if (pinAccess !== "true") {
      router.push("/organizer-pin");
      return;
    }

    const saved = localStorage.getItem("organizerProfile");

    if (saved) {
      setAdminProfile(JSON.parse(saved));
      setProfileCompleted(true);
    }
  }, [router]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`${new Date().toLocaleString()} - ${msg}`, ...prev]);
  };

  const stats = useMemo(() => {
    return {
      startups: users.filter((u) => u.role === "Startup").length,
      investors: users.filter((u) => u.role === "Investor").length,
      mentors: users.filter((u) => u.role === "Mentor").length,
      providers: users.filter((u) => u.role === "Service Provider").length,
      investments: 24,
      projects: 18,
      pending: users.filter((u) => u.verification === "pending").length,
      revenue: "₹8.5L",
    };
  }, [users]);

  const saveProfile = () => {
    const valid = Object.values(adminProfile).every(Boolean);

    if (!valid) {
      alert("Please fill all admin profile fields");
      return;
    }

    localStorage.setItem("organizerProfile", JSON.stringify(adminProfile));
    setProfileCompleted(true);
    addLog("Admin profile completed");
  };

  const updateVerification = (
    id: number,
    verification: User["verification"]
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, verification } : u))
    );
    addLog(`User verification changed to ${verification}`);
  };

  const suspendUser = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "active" ? "suspended" : "active",
            }
          : u
      )
    );
    addLog("User status updated");
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addLog("User removed");
  };

  const uploadImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    cb: (img: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  };

  const createEvent = () => {
    if (!eventForm.title || !eventForm.description || !eventForm.link) {
      alert("Fill event details");
      return;
    }

    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...eventForm,
        participants: 0,
      },
    ]);

    setEventForm({
      title: "",
      description: "",
      thumbnail: "",
      link: "",
    });

    addLog("New event created");
  };

  const increaseParticipants = (id: number) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, participants: e.participants + 1 } : e
      )
    );
  };

  const generateAIContent = (title: string, description: string) => {
    const isAI = title.toLowerCase().includes("ai");

    return {
      about: `${title} is designed to help startups learn practical concepts and apply them in real projects.`,
      outcomes: isAI
        ? ["Understand AI basics", "Learn ML workflow", "Build AI startup ideas"]
        : ["Understand fundamentals", "Apply practical skills", "Build projects"],
      topics: isAI
        ? ["AI Basics", "Machine Learning", "Prompt Engineering"]
        : ["Introduction", "Core Concepts", "Startup Application"],
      level: isAI ? "Beginner" : "Intermediate",
      duration: isAI ? "4 Hours" : "3 Hours",
      tags: isAI ? ["AI", "ML", "Startup"] : ["Startup", "Business"],
      rating: isAI ? 4.8 : 4.5,
    };
  };

  const createCourse = () => {
    if (!courseForm.title || !courseForm.description || !courseForm.video) {
      alert("Fill course details");
      return;
    }

    const ai = generateAIContent(courseForm.title, courseForm.description);

    setCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...courseForm,
        ...ai,
        enrollments: 0,
      },
    ]);

    setCourseForm({
      title: "",
      description: "",
      thumbnail: "",
      video: "",
    });

    addLog("Course created with AI content");
  };

  const addCms = () => {
  if (!cmsForm.title || !cmsForm.content) {
    alert("Please fill all CMS fields");
    return;
  }

  const newCms = {
    id: Date.now(),
    ...cmsForm,
    createdAt: new Date().toISOString(),
  };

  setCmsData([newCms, ...cmsData]);

  setCmsForm({
    type: "Announcement",
    title: "",
    content: "",
  });
};

// ==============================
// ADD SUPPORT RESPONSE
// ==============================

const respondComplaint = (
  id: number,
  response: string
) => {
  setComplaints((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            adminResponse: response,
            status: "Resolved",
          }
        : item
    )
  );
};

// ==============================
// SEND NOTIFICATION
// ==============================

const sendNotification = () => {
  if (!notificationMessage) {
    alert("Enter notification message");
    return;
  }

  const newNotification = {
    id: Date.now(),
    message: notificationMessage,
    audience: notificationAudience,
    createdAt: new Date().toISOString(),
  };

  setNotifications([
    newNotification,
    ...notifications,
  ]);

  setNotificationMessage("");
};

// ==============================
// CREATE COURSE
// ==============================

const createCourse = () => {
  if (
    !courseForm.title ||
    !courseForm.description ||
    !courseForm.video
  ) {
    alert("Fill all course fields");
    return;
  }

  let difficulty = "Intermediate";
  let tags = ["Startup"];

  if (
    courseForm.title
      .toLowerCase()
      .includes("ai")
  ) {
    difficulty = "Beginner";

    tags = [
      "AI",
      "Machine Learning",
      "Tech",
    ];
  }

  if (
    courseForm.title
      .toLowerCase()
      .includes("marketing")
  ) {
    difficulty = "Advanced";

    tags = [
      "Marketing",
      "Growth",
    ];
  }

  const newCourse = {
    id: Date.now(),
    ...courseForm,
    aiGenerated: {
      about:
        "This course helps founders master practical startup execution strategies.",

      outcomes: [
        "Understand startup concepts",
        "Build real products",
        "Learn execution",
      ],

      topics: [
        "Business",
        "Growth",
        "Scaling",
      ],

      difficulty,

      duration: "6 Weeks",

      tags,

      rating: 4.8,
    },

    enrollments:
      Math.floor(
        Math.random() * 500
      ) + 50,

    progress: 0,
  };

  setCourses([
    newCourse,
    ...courses,
  ]);

  setCourseForm({
    title: "",
    description: "",
    thumbnail: "",
    learn: "",
    audience: "",
    video: "",
  });
};

// ==============================
// ANALYTICS
// ==============================

const totalUsers =
  users.length;

const approvedUsers =
  users.filter(
    (u) =>
      u.verification_status ===
      "approved"
  ).length;

const suspiciousUsers =
  users.filter(
    (u) =>
      u.activity < 20
  ).length;

const totalRevenue =
  investments.reduce(
    (acc, item) =>
      acc + item.amount,
    0
  );

// ==============================
// RETURN
// ==============================

return (
  <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] flex">
    {/* SIDEBAR */}

    <aside className="w-[320px] bg-white border-r border-slate-200 p-6 flex flex-col">
      <div>
        <h1 className="text-4xl font-black">
          Organizer
        </h1>

        <p className="text-slate-500 mt-2">
          Admin Control Panel
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {sidebarItems.map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                setActiveTab(item)
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition ${
                activeTab === item
                  ? "bg-blue-600 text-white"
                  : "bg-[#f5f7fb]"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>
    </aside>

    {/* MAIN */}

    <section className="flex-1 p-8 overflow-y-auto">
      {/* DASHBOARD */}

      {activeTab ===
        "Dashboard" && (
        <>
          <div className="grid grid-cols-4 gap-6">
            <DashboardCard
              title="Total Users"
              value={totalUsers}
            />

            <DashboardCard
              title="Approved Users"
              value={approvedUsers}
            />

            <DashboardCard
              title="Suspicious Accounts"
              value={
                suspiciousUsers
              }
            />

            <DashboardCard
              title="Revenue"
              value={`₹${totalRevenue}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-[30px] p-8 shadow-xl">
              <h2 className="text-3xl font-black mb-6">
                User Growth 📈
              </h2>

              <div className="space-y-4">
                {analyticsData.map(
                  (item) => (
                    <div
                      key={
                        item.month
                      }
                    >
                      <div className="flex justify-between mb-2">
                        <span>
                          {
                            item.month
                          }
                        </span>

                        <span>
                          {
                            item.users
                          }
                        </span>
                      </div>

                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${item.users / 10}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white rounded-[30px] p-8 shadow-xl">
              <h2 className="text-3xl font-black mb-6">
                Investment Trends 💰
              </h2>

              <div className="space-y-4">
                {investments.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="flex items-center justify-between bg-[#f5f7fb] p-4 rounded-2xl"
                    >
                      <span className="font-bold">
                        {
                          item.startup
                        }
                      </span>

                      <span className="text-green-600 font-black">
                        ₹
                        {
                          item.amount
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* USERS */}

      {activeTab ===
        "Users" && (
        <div className="space-y-5">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-[28px] p-6 shadow-xl flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-black">
                  {user.name}
                </h2>

                <p className="text-slate-500">
                  {user.role}
                </p>

                <p className="mt-2">
                  Verification:
                  <span className="font-bold ml-2">
                    {
                      user.verification_status
                    }
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    updateVerification(
                      user.id,
                      "approved"
                    )
                  }
                  className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateVerification(
                      user.id,
                      "rejected"
                    )
                  }
                  className="bg-red-600 text-white px-5 py-3 rounded-2xl font-bold"
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    suspendUser(
                      user.id
                    )
                  }
                  className="bg-yellow-500 text-white px-5 py-3 rounded-2xl font-bold"
                >
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}