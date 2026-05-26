// app/organizer-dashboard/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole =
  | "Startup"
  | "Investor"
  | "Mentor"
  | "Service Provider"
  | "Organizer";

type UserItem = {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  verification_status: "pending" | "approved" | "rejected";
  status: "Active" | "Suspended";
  activity: number;
};

type EventItem = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  registrationLink: string;
  participants: number;
};

type CourseItem = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  learn: string;
  audience: string;
  video: string;
  aiGenerated: {
    about: string;
    outcomes: string[];
    topics: string[];
    difficulty: string;
    duration: string;
    tags: string[];
    rating: number;
  };
  enrollments: number;
};

type CmsItem = {
  id: number;
  type: string;
  title: string;
  content: string;
};

type Complaint = {
  id: number;
  user: string;
  issue: string;
  status: "Pending" | "Resolved";
  adminResponse?: string;
};

type Notification = {
  id: number;
  message: string;
  audience: string;
};

export default function OrganizerDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");

  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 1,
      name: "Rahul Startup",
      role: "Startup",
      email: "rahul@startup.com",
      verification_status: "pending",
      status: "Active",
      activity: 82,
    },
    {
      id: 2,
      name: "Priya Investor",
      role: "Investor",
      email: "priya@investor.com",
      verification_status: "approved",
      status: "Active",
      activity: 76,
    },
    {
      id: 3,
      name: "Amit Mentor",
      role: "Mentor",
      email: "amit@mentor.com",
      verification_status: "pending",
      status: "Active",
      activity: 18,
    },
    {
      id: 4,
      name: "TechNova Services",
      role: "Service Provider",
      email: "contact@technova.com",
      verification_status: "approved",
      status: "Active",
      activity: 64,
    },
  ]);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [cmsData, setCmsData] = useState<CmsItem[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 1,
      user: "Rahul Startup",
      issue: "Fake investor message received",
      status: "Pending",
    },
    {
      id: 2,
      user: "TechNova Services",
      issue: "Payment discussion issue",
      status: "Pending",
    },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    registrationLink: "",
  });

  const [cmsForm, setCmsForm] = useState({
    type: "Announcement",
    title: "",
    content: "",
  });

  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAudience, setNotificationAudience] = useState("All Users");

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    learn: "",
    audience: "",
    video: "",
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
  }
}, [router]);

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

  const dashboardStats = useMemo(() => {
    const totalStartups = users.filter((u) => u.role === "Startup").length;
    const totalInvestors = users.filter((u) => u.role === "Investor").length;
    const totalMentors = users.filter((u) => u.role === "Mentor").length;
    const totalServiceProviders = users.filter(
      (u) => u.role === "Service Provider"
    ).length;
    const pendingVerifications = users.filter(
      (u) => u.verification_status === "pending"
    ).length;

    return {
      totalStartups,
      totalInvestors,
      totalMentors,
      totalServiceProviders,
      totalInvestments: 1280000,
      activeProjects: 42,
      pendingVerifications,
      totalRevenue: 245000,
    };
  }, [users]);

  const updateVerification = (
    id: number,
    status: "approved" | "rejected"
  ) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, verification_status: status } : user
      )
    );
  };

  const suspendUser = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: "Suspended" } : user
      )
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const createEvent = () => {
    if (!eventForm.title || !eventForm.description) {
      alert("Please fill event details");
      return;
    }

    setEvents([
      {
        id: Date.now(),
        ...eventForm,
        participants: 0,
      },
      ...events,
    ]);

    setEventForm({
      title: "",
      description: "",
      thumbnail: "",
      registrationLink: "",
    });
  };

  const addParticipant = (id: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, participants: event.participants + 1 }
          : event
      )
    );
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const addCms = () => {
    if (!cmsForm.title || !cmsForm.content) {
      alert("Please fill CMS details");
      return;
    }

    setCmsData([
      {
        id: Date.now(),
        ...cmsForm,
      },
      ...cmsData,
    ]);

    setCmsForm({
      type: "Announcement",
      title: "",
      content: "",
    });
  };

  const deleteCms = (id: number) => {
    setCmsData((prev) => prev.filter((item) => item.id !== id));
  };

  const respondComplaint = (id: number) => {
    const response = prompt("Enter admin response");

    if (!response) return;

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

  const sendNotification = () => {
    if (!notificationMessage) {
      alert("Enter notification message");
      return;
    }

    setNotifications([
      {
        id: Date.now(),
        message: notificationMessage,
        audience: notificationAudience,
      },
      ...notifications,
    ]);

    setNotificationMessage("");
  };

  const createCourse = () => {
    if (!courseForm.title || !courseForm.description || !courseForm.video) {
      alert("Please fill course title, description and video link");
      return;
    }

    const title = courseForm.title.toLowerCase();

    let difficulty = "Intermediate";
    let tags = ["Startup", "Business"];
    let topics = ["Startup Basics", "Execution", "Growth"];

    if (title.includes("ai")) {
      difficulty = "Beginner";
      tags = ["AI", "ML", "Automation"];
      topics = ["AI Basics", "Machine Learning", "AI Startup Ideas"];
    }

    if (title.includes("marketing")) {
      difficulty = "Advanced";
      tags = ["Marketing", "Growth", "Branding"];
      topics = ["Growth Strategy", "Funnels", "Campaign Planning"];
    }

    const newCourse: CourseItem = {
      id: Date.now(),
      ...courseForm,
      aiGenerated: {
        about:
          "This course is generated to help startup founders learn practical skills with structured guidance.",
        outcomes: [
          "Understand core concepts",
          "Apply learning to startup projects",
          "Build practical execution confidence",
        ],
        topics,
        difficulty,
        duration: "6 Weeks",
        tags,
        rating: 4.8,
      },
      enrollments: Math.floor(Math.random() * 500) + 50,
    };

    setCourses([newCourse, ...courses]);

    setCourseForm({
      title: "",
      description: "",
      thumbnail: "",
      learn: "",
      audience: "",
      video: "",
    });
  };

  const suspiciousUsers = users.filter((u) => u.activity < 25);

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] flex">
      <aside className="w-[300px] bg-white border-r border-slate-200 p-6 fixed h-screen overflow-y-auto">
        <h1 className="text-4xl font-black">Organizer</h1>
        <p className="text-slate-500 mt-2">Admin Control Panel</p>

        <div className="mt-8 space-y-3">
          {sidebarItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition ${
                activeTab === item
                  ? "bg-blue-600 text-white shadow-xl"
                  : "bg-[#f5f7fb] hover:bg-blue-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("organizerPinVerified");
            router.push("/organizer-login");
          }}
          className="mt-8 w-full bg-red-500 text-white py-4 rounded-2xl font-black"
        >
          Logout
        </button>
      </aside>

      <section className="ml-[300px] flex-1 p-8">
        <div className="bg-white rounded-[35px] shadow-xl p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black">{activeTab}</h1>
            <p className="text-slate-500 mt-2">
              Manage platform operations dynamically.
            </p>
          </div>

          <div className="text-6xl">🛡️</div>
        </div>

        {activeTab === "Dashboard" && (
          <>
            <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
              <DashboardCard title="Total Startups" value={dashboardStats.totalStartups} />
              <DashboardCard title="Total Investors" value={dashboardStats.totalInvestors} />
              <DashboardCard title="Total Mentors" value={dashboardStats.totalMentors} />
              <DashboardCard
                title="Service Providers"
                value={dashboardStats.totalServiceProviders}
              />
              <DashboardCard
                title="Total Investments"
                value={`₹${dashboardStats.totalInvestments.toLocaleString()}`}
              />
              <DashboardCard title="Active Projects" value={dashboardStats.activeProjects} />
              <DashboardCard
                title="Pending Verifications"
                value={dashboardStats.pendingVerifications}
              />
              <DashboardCard
                title="Total Revenue"
                value={`₹${dashboardStats.totalRevenue.toLocaleString()}`}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <ChartCard
                title="User Growth Graph 📈"
                data={[
                  ["Jan", 30],
                  ["Feb", 55],
                  ["Mar", 75],
                  ["Apr", 110],
                  ["May", 160],
                ]}
              />

              <ChartCard
                title="Investment Trends 💰"
                data={[
                  ["AI", 80],
                  ["FinTech", 60],
                  ["Health", 45],
                  ["EdTech", 70],
                ]}
              />
            </div>
          </>
        )}

        {activeTab === "Users" && (
          <div className="space-y-5">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onApprove={() => updateVerification(user.id, "approved")}
                onReject={() => updateVerification(user.id, "rejected")}
                onSuspend={() => suspendUser(user.id)}
                onDelete={() => deleteUser(user.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "Verification" && (
          <div className="space-y-5">
            {users
              .filter((u) => u.verification_status === "pending")
              .map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onApprove={() => updateVerification(user.id, "approved")}
                  onReject={() => updateVerification(user.id, "rejected")}
                  onSuspend={() => suspendUser(user.id)}
                  onDelete={() => deleteUser(user.id)}
                />
              ))}

            {users.filter((u) => u.verification_status === "pending").length === 0 && (
              <Empty text="No pending verifications." />
            )}
          </div>
        )}

        {activeTab === "Events" && (
          <>
            <FormCard title="Create Event / Hackathon 🎉">
              <input
                className="input-box"
                placeholder="Event Title"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
              />

              <textarea
                className="input-box h-28"
                placeholder="Description"
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
              />

              <input
                className="input-box"
                placeholder="Thumbnail Image URL"
                value={eventForm.thumbnail}
                onChange={(e) =>
                  setEventForm({ ...eventForm, thumbnail: e.target.value })
                }
              />

              <input
                className="input-box"
                placeholder="Registration Link"
                value={eventForm.registrationLink}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    registrationLink: e.target.value,
                  })
                }
              />

              <button onClick={createEvent} className="primary-btn">
                Create Event
              </button>
            </FormCard>

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-[30px] p-6 shadow-xl">
                  {event.thumbnail && (
                    <img
                      src={event.thumbnail}
                      className="w-full h-52 object-cover rounded-[24px] mb-5"
                    />
                  )}

                  <h2 className="text-3xl font-black">{event.title}</h2>
                  <p className="text-slate-500 mt-3">{event.description}</p>

                  <p className="font-black mt-4">
                    Participants: {event.participants}
                  </p>

                  <div className="flex gap-3 mt-5">
                    <button onClick={() => addParticipant(event.id)} className="primary-btn">
                      + Participant
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="danger-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "CMS" && (
          <>
            <FormCard title="Content Management 📰">
              <select
                className="input-box"
                value={cmsForm.type}
                onChange={(e) => setCmsForm({ ...cmsForm, type: e.target.value })}
              >
                <option>Announcement</option>
                <option>Banner</option>
                <option>Blog</option>
                <option>Success Story</option>
                <option>Featured Startup</option>
              </select>

              <input
                className="input-box"
                placeholder="Title"
                value={cmsForm.title}
                onChange={(e) => setCmsForm({ ...cmsForm, title: e.target.value })}
              />

              <textarea
                className="input-box h-28"
                placeholder="Content"
                value={cmsForm.content}
                onChange={(e) =>
                  setCmsForm({ ...cmsForm, content: e.target.value })
                }
              />

              <button onClick={addCms} className="primary-btn">
                Add Content
              </button>
            </FormCard>

            <div className="space-y-5 mt-8">
              {cmsData.map((item) => (
                <div key={item.id} className="bg-white rounded-[28px] p-6 shadow-xl">
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                    {item.type}
                  </span>
                  <h2 className="text-3xl font-black mt-4">{item.title}</h2>
                  <p className="text-slate-500 mt-3">{item.content}</p>

                  <button
                    onClick={() => deleteCms(item.id)}
                    className="danger-btn mt-5"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Support" && (
          <div className="space-y-5">
            {complaints.map((item) => (
              <div key={item.id} className="bg-white rounded-[28px] p-6 shadow-xl">
                <h2 className="text-2xl font-black">{item.user}</h2>
                <p className="text-slate-500 mt-2">{item.issue}</p>
                <p className="mt-3 font-black">Status: {item.status}</p>

                {item.adminResponse && (
                  <p className="mt-3 bg-green-50 p-4 rounded-2xl">
                    Admin Response: {item.adminResponse}
                  </p>
                )}

                {item.status === "Pending" && (
                  <button
                    onClick={() => respondComplaint(item.id)}
                    className="primary-btn mt-5"
                  >
                    Respond & Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "AI Tools" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <AiCard
              title="AI Fraud Detection"
              value={`${suspiciousUsers.length} suspicious users`}
              desc="Users with low activity are flagged automatically."
            />
            <AiCard
              title="Trending Industry"
              value="AI / SaaS"
              desc="Calculated from user activity and investment patterns."
            />
            <AiCard
              title="AI Moderation"
              value="Spam Filter Active"
              desc="Fake content and spam detection logic enabled."
            />
          </div>
        )}

        {activeTab === "Notifications" && (
          <>
            <FormCard title="Send Notification 🔔">
              <select
                className="input-box"
                value={notificationAudience}
                onChange={(e) => setNotificationAudience(e.target.value)}
              >
                <option>All Users</option>
                <option>Startups</option>
                <option>Investors</option>
                <option>Mentors</option>
                <option>Service Providers</option>
              </select>

              <textarea
                className="input-box h-28"
                placeholder="Notification message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />

              <button onClick={sendNotification} className="primary-btn">
                Send Notification
              </button>
            </FormCard>

            <div className="space-y-5 mt-8">
              {notifications.map((item) => (
                <div key={item.id} className="bg-white rounded-[28px] p-6 shadow-xl">
                  <h2 className="font-black text-xl">{item.audience}</h2>
                  <p className="text-slate-500 mt-2">{item.message}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Analytics" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <ChartCard
              title="Daily Active Users"
              data={[
                ["Mon", 50],
                ["Tue", 70],
                ["Wed", 120],
                ["Thu", 90],
                ["Fri", 150],
              ]}
            />

            <ChartCard
              title="Mentor Engagement"
              data={[
                ["Requests", 80],
                ["Accepted", 55],
                ["Chats", 45],
                ["Reviews", 30],
              ]}
            />

            <ChartCard
              title="Service Provider Performance"
              data={[
                ["Requests", 75],
                ["Completed", 45],
                ["Revenue", 95],
              ]}
            />

            <ChartCard
              title="Startup Success Rate"
              data={[
                ["Idea", 40],
                ["MVP", 65],
                ["Growth", 85],
              ]}
            />
          </div>
        )}

        {activeTab === "Courses" && (
          <>
            <FormCard title="AI Course Management 🎓">
              <input
                className="input-box"
                placeholder="Course Title"
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, title: e.target.value })
                }
              />

              <textarea
                className="input-box h-28"
                placeholder="Course Description"
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, description: e.target.value })
                }
              />

              <input
                className="input-box"
                placeholder="Thumbnail Image URL"
                value={courseForm.thumbnail}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, thumbnail: e.target.value })
                }
              />

              <input
                className="input-box"
                placeholder="What will you learn?"
                value={courseForm.learn}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, learn: e.target.value })
                }
              />

              <input
                className="input-box"
                placeholder="Who is this for?"
                value={courseForm.audience}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, audience: e.target.value })
                }
              />

              <input
                className="input-box"
                placeholder="Course Video Link"
                value={courseForm.video}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, video: e.target.value })
                }
              />

              <button onClick={createCourse} className="primary-btn">
                Create Course + AI Generate
              </button>
            </FormCard>

            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-[30px] shadow-xl p-6">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      className="w-full h-56 object-cover rounded-[24px] mb-5"
                    />
                  )}

                  <h2 className="text-3xl font-black">{course.title}</h2>
                  <p className="text-slate-500 mt-3">{course.description}</p>

                  <div className="mt-5 bg-blue-50 rounded-2xl p-5">
                    <h3 className="font-black text-xl">AI Generated Details</h3>
                    <p className="mt-3">{course.aiGenerated.about}</p>

                    <p className="font-bold mt-3">
                      Difficulty: {course.aiGenerated.difficulty}
                    </p>
                    <p className="font-bold">Duration: {course.aiGenerated.duration}</p>
                    <p className="font-bold">Rating: ⭐ {course.aiGenerated.rating}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {course.aiGenerated.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 font-black">
                    Enrollments: {course.enrollments}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Security" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <SecurityCard title="Activity Logs" text="Admin viewed dashboard and managed users." />
            <SecurityCard title="Login History" text="Last login: Today, 10:30 AM" />
            <SecurityCard title="Role-Based Access" text="Organizer/Admin permissions active." />
            <SecurityCard title="Backup System" text="Daily backup enabled." />
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="bg-white rounded-[35px] p-8 shadow-xl">
            <h2 className="text-4xl font-black">Admin Settings ⚙️</h2>
            <p className="text-slate-500 mt-3">
              PIN protection, security and admin preferences can be managed here.
            </p>

            <button
              onClick={() => {
                localStorage.removeItem("organizerPinVerified");
                router.push("/organizer-pin");
              }}
              className="primary-btn mt-8"
            >
              Re-Verify PIN
            </button>
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

        .primary-btn {
          background: #07162b;
          color: white;
          padding: 14px 22px;
          border-radius: 16px;
          font-weight: 900;
          transition: 0.25s;
        }

        .primary-btn:hover {
          background: #2563eb;
        }

        .danger-btn {
          background: #ef4444;
          color: white;
          padding: 14px 22px;
          border-radius: 16px;
          font-weight: 900;
        }
      `}</style>
    </main>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-[30px] p-6 shadow-xl">
      <p className="text-slate-500 font-bold">{title}</p>
      <h2 className="text-4xl font-black mt-3">{value}</h2>
    </div>
  );
}

function FormCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[35px] shadow-xl p-8">
      <h2 className="text-4xl font-black mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function UserCard({
  user,
  onApprove,
  onReject,
  onSuspend,
  onDelete,
}: {
  user: UserItem;
  onApprove: () => void;
  onReject: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-[28px] p-6 shadow-xl flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-black">{user.name}</h2>
        <p className="text-slate-500">{user.email}</p>
        <p className="font-bold mt-2">{user.role}</p>
        <p className="mt-2">
          Verification:{" "}
          <span className="font-black">{user.verification_status}</span>
        </p>
        <p>
          Status: <span className="font-black">{user.status}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onApprove} className="bg-green-600 text-white px-5 py-3 rounded-2xl font-bold">
          Approve
        </button>
        <button onClick={onReject} className="bg-red-600 text-white px-5 py-3 rounded-2xl font-bold">
          Reject
        </button>
        <button onClick={onSuspend} className="bg-yellow-500 text-white px-5 py-3 rounded-2xl font-bold">
          Suspend
        </button>
        <button onClick={onDelete} className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold">
          Delete
        </button>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  data,
}: {
  title: string;
  data: [string, number][];
}) {
  const max = Math.max(...data.map((d) => d[1]), 1);

  return (
    <div className="bg-white rounded-[30px] p-8 shadow-xl">
      <h2 className="text-3xl font-black mb-6">{title}</h2>

      <div className="space-y-5">
        {data.map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between mb-2 font-bold">
              <span>{label}</span>
              <span>{value}</span>
            </div>

            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${(value / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-[30px] p-8 shadow-xl">
      <div className="text-5xl">🤖</div>
      <h2 className="text-3xl font-black mt-5">{title}</h2>
      <p className="text-blue-600 font-black text-xl mt-3">{value}</p>
      <p className="text-slate-500 mt-3">{desc}</p>
    </div>
  );
}

function SecurityCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-[30px] p-8 shadow-xl">
      <div className="text-5xl">🔐</div>
      <h2 className="text-3xl font-black mt-5">{title}</h2>
      <p className="text-slate-500 mt-3">{text}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-[30px] p-10 shadow-xl text-center">
      <h2 className="text-3xl font-black">{text}</h2>
    </div>
  );
}