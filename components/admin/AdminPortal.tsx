"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Rocket,
  HandCoins,
  GraduationCap,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Bell,
  Settings,
  MessageCircle,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

type UserRole = "startup" | "investor" | "mentor" | "service-provider";
type Verification = "pending" | "approved" | "rejected";

type PlatformUser = {
  id: number;
  name: string;
  role: UserRole;
  verification_status: Verification;
  activity: string;
  suspended: boolean;
};

type Course = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  learn: string;
  audience: string;
  about: string;
  outcomes: string[];
  topics: string[];
  level: string;
  duration: string;
  tags: string[];
  rating: number;
  enrollments: number;
};

type AdminProfile = {
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  permissions: string;
  security: string;
  photo: string;
};

type NavItem = [string, React.ElementType];

const navItems: NavItem[] = [
  ["Dashboard", LayoutDashboard],
  ["Users", Users],
  ["Startups", Rocket],
  ["Investors", HandCoins],
  ["Mentors", GraduationCap],
  ["Service Providers", ShieldCheck],
  ["Events", CalendarDays],
  ["Courses", BookOpen],
  ["Analytics", BarChart3],
  ["Reports", AlertTriangle],
  ["Support", MessageCircle],
  ["Settings", Settings],
];

export default function AdminPortal() {
  const [active, setActive] = useState<string>("Dashboard");
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  const [users, setUsers] = useState<PlatformUser[]>([
    {
      id: 1,
      name: "Aarav Startup",
      role: "startup",
      verification_status: "pending",
      activity: "High",
      suspended: false,
    },
    {
      id: 2,
      name: "Neha Investor",
      role: "investor",
      verification_status: "approved",
      activity: "Medium",
      suspended: false,
    },
    {
      id: 3,
      name: "Rahul Mentor",
      role: "mentor",
      verification_status: "pending",
      activity: "Low",
      suspended: false,
    },
    {
      id: 4,
      name: "TechServe Pro",
      role: "service-provider",
      verification_status: "rejected",
      activity: "Flagged",
      suspended: false,
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      name: "AI Startup Hackathon",
      thumbnail: "",
      description: "Build AI startup solutions.",
      link: "https://example.com",
      participants: 120,
    },
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "AI for Startup Founders",
      description: "Learn how startups can use AI tools.",
      thumbnail: "",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      learn: "AI basics, automation, startup growth",
      audience: "Startup founders and students",
      about:
        "This course helps startup founders understand AI use cases, automation, and growth workflows.",
      outcomes: [
        "Understand AI fundamentals",
        "Use AI for business growth",
        "Create AI-powered workflows",
      ],
      topics: ["AI Basics", "Machine Learning", "Automation", "Startup Use Cases"],
      level: "Beginner",
      duration: "3 hours",
      tags: ["AI", "ML", "Startup"],
      rating: 4.8,
      enrollments: 340,
    },
  ]);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    learn: "",
    audience: "",
    video: "",
  });

  const [eventForm, setEventForm] = useState({
    name: "",
    thumbnail: "",
    description: "",
    link: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("adminProfile");
    if (saved) {
      setAdmin(JSON.parse(saved) as AdminProfile);
    }
  }, []);

  const stats: [string, string | number][] = [
    ["Total Startups", users.filter((u) => u.role === "startup").length],
    ["Total Investors", users.filter((u) => u.role === "investor").length],
    ["Total Mentors", users.filter((u) => u.role === "mentor").length],
    ["Service Providers", users.filter((u) => u.role === "service-provider").length],
    ["Total Investments", "₹82L"],
    ["Active Projects", 42],
    ["Pending Verifications", users.filter((u) => u.verification_status === "pending").length],
    ["Total Revenue", "₹12.4L"],
  ];

  const updateVerification = (id: number, status: Verification) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, verification_status: status } : u))
    );
  };

  const suspendUser = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, suspended: !u.suspended } : u))
    );
  };

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const aiGenerateCourse = () => {
    if (!courseForm.title || !courseForm.description) return;

    const title = courseForm.title.toLowerCase();

    const level = title.includes("ai")
      ? "Beginner"
      : title.includes("advanced")
      ? "Advanced"
      : "Intermediate";

    const tags = title.includes("ai")
      ? ["AI", "ML", "Automation"]
      : ["Startup", "Business", "Growth"];

    const newCourse: Course = {
      id: Date.now(),
      title: courseForm.title,
      description: courseForm.description,
      thumbnail: courseForm.thumbnail,
      video: courseForm.video,
      learn: courseForm.learn,
      audience: courseForm.audience,
      about: `This course explains ${courseForm.title} in a simple, practical way for startup ecosystem users.`,
      outcomes: [
        `Understand core concepts of ${courseForm.title}`,
        "Apply learning to real startup problems",
        "Build confidence through guided examples",
      ],
      topics: ["Introduction", "Core Concepts", "Practical Use Cases", "Final Roadmap"],
      level,
      duration: title.includes("ai") ? "3 hours" : "2 hours",
      tags,
      rating: 4.7,
      enrollments: 0,
    };

    setCourses((prev) => [newCourse, ...prev]);
    setCourseForm({
      title: "",
      description: "",
      thumbnail: "",
      learn: "",
      audience: "",
      video: "",
    });
  };

  const createEvent = () => {
    if (!eventForm.name || !eventForm.description) return;

    setEvents((prev) => [
      {
        id: Date.now(),
        name: eventForm.name,
        thumbnail: eventForm.thumbnail,
        description: eventForm.description,
        link: eventForm.link,
        participants: 0,
      },
      ...prev,
    ]);

    setEventForm({
      name: "",
      thumbnail: "",
      description: "",
      link: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 p-5 hidden lg:block">
        <h1 className="text-2xl font-bold mb-8">CampusConnect AI</h1>

        <div className="space-y-2">
          {navItems.map(([label, Icon]) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${
                active === label ? "bg-blue-600" : "hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">{active}</h2>
            <p className="text-slate-400">Organizer Admin Control System</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden">
              {admin?.photo ? (
                <img src={admin.photo} alt="Admin" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div>
              <p className="font-semibold">{admin?.name || "Admin"}</p>
              <p className="text-xs text-slate-400">{admin?.role || "Organizer Admin"}</p>
            </div>
          </div>
        </div>

        {active === "Dashboard" && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {stats.map(([title, value]) => (
                <div key={title} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-slate-400 text-sm">{title}</p>
                  <h3 className="text-3xl font-bold mt-2">{value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Panel title="Analytics Overview">
                <div className="space-y-4">
                  <Progress label="User Growth" value={78} />
                  <Progress label="Investment Trends" value={64} />
                  <Progress label="Startup Success Rate" value={52} />
                  <Progress label="Mentor Engagement" value={71} />
                </div>
              </Panel>

              <Panel title="Admin Profile">
                <div className="space-y-2 text-slate-300">
                  <p>Name: {admin?.name || "Not set"}</p>
                  <p>Organization: {admin?.organization || "Not set"}</p>
                  <p>Email: {admin?.email || "Not set"}</p>
                  <p>Phone: {admin?.phone || "Not set"}</p>
                  <p>Permissions: {admin?.permissions || "Full Access"}</p>
                  <p>Security: {admin?.security || "2FA Enabled"}</p>
                </div>
              </Panel>
            </div>
          </section>
        )}

        {active === "Users" && (
          <Panel title="User Management & Verification">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-slate-400">
                  <tr>
                    <th className="p-3">User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-slate-800">
                      <td className="p-3">{u.name}</td>
                      <td>{u.role}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            u.verification_status === "approved"
                              ? "bg-green-600"
                              : u.verification_status === "rejected"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                          }`}
                        >
                          {u.verification_status}
                        </span>
                      </td>
                      <td>{u.suspended ? "Suspended" : u.activity}</td>
                      <td className="flex gap-2 py-3 flex-wrap">
                        <button onClick={() => updateVerification(u.id, "approved")} className="bg-green-600 px-3 py-1 rounded-lg">
                          <CheckCircle size={16} />
                        </button>
                        <button onClick={() => updateVerification(u.id, "rejected")} className="bg-red-600 px-3 py-1 rounded-lg">
                          <XCircle size={16} />
                        </button>
                        <button onClick={() => suspendUser(u.id)} className="bg-orange-600 px-3 py-1 rounded-lg">
                          {u.suspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button onClick={() => removeUser(u.id)} className="bg-slate-700 px-3 py-1 rounded-lg">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        {active === "Events" && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Panel title="Create Event / Hackathon">
              <Input label="Event Name" value={eventForm.name} onChange={(v: string) => setEventForm({ ...eventForm, name: v })} />
              <Input label="Thumbnail URL" value={eventForm.thumbnail} onChange={(v: string) => setEventForm({ ...eventForm, thumbnail: v })} />
              <Input label="Description" value={eventForm.description} onChange={(v: string) => setEventForm({ ...eventForm, description: v })} />
              <Input label="Registration Link" value={eventForm.link} onChange={(v: string) => setEventForm({ ...eventForm, link: v })} />
              <button onClick={createEvent} className="bg-blue-600 px-5 py-3 rounded-xl mt-3">
                Create Event
              </button>
            </Panel>

            <Panel title="Event Analytics">
              {events.map((e) => (
                <div key={e.id} className="bg-slate-800 rounded-xl p-4 mb-3">
                  <h3 className="font-bold">{e.name}</h3>
                  <p className="text-slate-400">{e.description}</p>
                  <p className="mt-2">Participants: {e.participants}</p>
                </div>
              ))}
            </Panel>
          </section>
        )}

        {active === "Courses" && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Panel title="AI Course Creator">
              <Input label="Course Title" value={courseForm.title} onChange={(v: string) => setCourseForm({ ...courseForm, title: v })} />
              <Input label="Course Description" value={courseForm.description} onChange={(v: string) => setCourseForm({ ...courseForm, description: v })} />
              <Input label="Thumbnail Image URL" value={courseForm.thumbnail} onChange={(v: string) => setCourseForm({ ...courseForm, thumbnail: v })} />
              <Input label="What will you learn?" value={courseForm.learn} onChange={(v: string) => setCourseForm({ ...courseForm, learn: v })} />
              <Input label="Who is this for?" value={courseForm.audience} onChange={(v: string) => setCourseForm({ ...courseForm, audience: v })} />
              <Input label="Course Video Link / Embed URL" value={courseForm.video} onChange={(v: string) => setCourseForm({ ...courseForm, video: v })} />

              <button onClick={aiGenerateCourse} className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl mt-3">
                Generate Course With AI
              </button>
            </Panel>

            <Panel title="Course Display">
              {courses.map((c) => (
                <div key={c.id} className="bg-slate-800 rounded-2xl p-4 mb-4">
                  <div className="h-36 bg-slate-700 rounded-xl mb-3 overflow-hidden">
                    {c.thumbnail ? <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" /> : null}
                  </div>
                  <h3 className="text-xl font-bold">{c.title}</h3>
                  <p className="text-slate-400">{c.description}</p>
                  <p className="mt-2">⭐ {c.rating} • {c.duration} • {c.level}</p>
                  <p className="text-sm text-blue-400 mt-2">{c.tags.join(", ")}</p>
                  <p className="mt-3 text-slate-300">{c.about}</p>
                </div>
              ))}
            </Panel>
          </section>
        )}

        {["Analytics", "Reports", "Support", "Settings", "Startups", "Investors", "Mentors", "Service Providers"].includes(active) && (
          <Panel title={`${active} Module`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MiniCard title="AI Fraud Detection" value="7 suspicious accounts" />
              <MiniCard title="AI Moderation" value="18 spam items filtered" />
              <MiniCard title="AI Analytics" value="AI, FinTech trending" />
              <MiniCard title="Activity Logs" value="246 actions today" />
              <MiniCard title="Login History" value="12 admin logins" />
              <MiniCard title="Notifications" value="Broadcast ready" />
            </div>

            <button className="mt-5 bg-blue-600 px-5 py-3 rounded-xl flex items-center gap-2">
              <Bell size={18} /> Send Announcement
            </button>
          </Panel>
        )}
      </main>
    </div>
  );
}

type PanelProps = {
  title: string;
  children: React.ReactNode;
};

function Panel({ title, children }: PanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

type MiniCardProps = {
  title: string;
  value: string;
};

function MiniCard({ title, value }: MiniCardProps) {
  return (
    <div className="bg-slate-800 rounded-2xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-xl font-bold mt-2">{value}</h3>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Input({ label, value, onChange }: InputProps) {
  return (
    <input
      className="w-full p-3 rounded-xl bg-slate-800 mb-3 outline-none border border-slate-700 focus:border-blue-500"
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

type ProgressProps = {
  label: string;
  value: number;
};

function Progress({ label, value }: ProgressProps) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full">
        <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}