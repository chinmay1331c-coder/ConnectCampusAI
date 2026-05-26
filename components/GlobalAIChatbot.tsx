"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Msg = {
  sender: "user" | "bot";
  text: string;
};

type UserState = {
  loggedIn: boolean;
  role: "guest" | "startup" | "investor" | "mentor" | "organizer" | "service-provider";
  email: string;
};

export default function GlobalAIChatbot() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"guide" | "complaint">("guide");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      sender: "bot",
      text: "Hi 👋 I’m CampusConnectAI Assistant. I can guide you based on whether you’re logged in or help you raise a complaint.",
    },
  ]);

  const [userState, setUserState] = useState<UserState>({
    loggedIn: false,
    role: "guest",
    email: "",
  });

  const [complaint, setComplaint] = useState({
    issueType: "Technical",
    description: "",
    details: "",
    contact: "",
  });

  useEffect(() => {
    const startup =
      localStorage.getItem("startupLoggedIn") === "true" ||
      localStorage.getItem("loggedIn") === "true";

    const investor =
      localStorage.getItem("investorLoggedIn") === "true";

    const mentor =
      localStorage.getItem("mentorLoggedIn") === "true";

    const organizer =
      localStorage.getItem("organizerLoggedIn") === "true";

    const serviceProvider =
      localStorage.getItem("serviceProviderLoggedIn") === "true";

    const startupUser =
      localStorage.getItem("startupUser") ||
      localStorage.getItem("user");

    const organizerUser =
      localStorage.getItem("organizerUser");

    let role: UserState["role"] = "guest";
    let email = "";

    if (startup || startupUser) {
      role = "startup";
      email = safeEmail(startupUser);
    } else if (investor) {
      role = "investor";
    } else if (mentor) {
      role = "mentor";
    } else if (organizer) {
      role = "organizer";
      email = safeEmail(organizerUser);
    } else if (serviceProvider) {
      role = "service-provider";
    }

    setUserState({
      loggedIn: role !== "guest",
      role,
      email,
    });
  }, [open]);

  const suggestions = useMemo(() => {
    if (!userState.loggedIn) {
      return ["Login", "Sign Up", "Explore Features", "Raise Complaint"];
    }

    if (userState.role === "startup") {
      return ["Find Team", "Find Mentors", "Explore Courses", "Competitions"];
    }

    if (userState.role === "investor") {
      return ["Networking", "View Startups", "Raise Complaint"];
    }

    if (userState.role === "mentor") {
      return ["Requests", "Messages", "Followers", "Raise Complaint"];
    }

    if (userState.role === "organizer") {
      return ["Events", "Support", "Courses", "Analytics"];
    }

    return ["Services", "Requests", "Projects", "Raise Complaint"];
  }, [userState]);

  const detectIntent = (text: string) => {
    const q = text.toLowerCase();

    if (
      q.includes("complaint") ||
      q.includes("issue") ||
      q.includes("problem") ||
      q.includes("report") ||
      q.includes("not working") ||
      q.includes("error")
    ) {
      return "complaint";
    }

    if (q.includes("login") || q.includes("log in") || q.includes("signin")) {
      return "login";
    }

    if (q.includes("signup") || q.includes("sign up") || q.includes("register")) {
      return "signup";
    }

    if (q.includes("team") || q.includes("collab") || q.includes("teammate")) {
      return "team";
    }

    if (q.includes("mentor")) {
      return "mentor";
    }

    if (q.includes("investor") || q.includes("funding")) {
      return "investor";
    }

    if (q.includes("service")) {
      return "service";
    }

    if (q.includes("course") || q.includes("learn") || q.includes("accelerator")) {
      return "course";
    }

    if (q.includes("competition") || q.includes("hackathon") || q.includes("event")) {
      return "competition";
    }

    if (q.includes("network") || q.includes("post") || q.includes("startup post")) {
      return "networking";
    }

    if (q.includes("dashboard")) {
      return "dashboard";
    }

    return "unknown";
  };

  const replyForGuest = (intent: string) => {
    if (intent === "login") {
      return "To login, click the Login button on the homepage. Enter your registered email and password. If you do not have an account, click Sign Up first.";
    }

    if (intent === "signup") {
      return "To sign up, open the homepage, click Sign Up, choose your role such as Startup, Investor, Mentor, Organizer, or Service Provider, then fill your details and create your account.";
    }

    if (intent === "complaint") {
      setMode("complaint");
      return "You can raise a complaint even without login. Please fill the complaint form below with your contact email so the organizer can respond.";
    }

    if (
      ["team", "mentor", "investor", "service", "course", "competition", "networking", "dashboard"].includes(
        intent
      )
    ) {
      return "Please login first to access this feature. After login, your dashboard will show the correct options based on your role.";
    }

    return "Welcome to CampusConnectAI. This platform helps startups connect with mentors, investors, service providers, competitions, courses, and teammates. To start, please Login or Sign Up.";
  };

  const replyForLoggedIn = (intent: string) => {
    if (intent === "complaint") {
      setMode("complaint");
      return "Sure. Please fill the complaint form below. It will be sent to the Organizer/Admin Support dashboard.";
    }

    if (intent === "login") {
      return `You are already logged in as ${userState.role}. You can continue using your portal.`;
    }

    if (intent === "signup") {
      return "You already have access. To create another role account, logout first and select a role from onboarding.";
    }

    if (intent === "team") {
      return userState.role === "startup"
        ? "Go to Startup Dashboard → Collab Page → AI Team Match → enter skills, interests, role and startup idea → Find Matches."
        : "Team matching is mainly for Startup users. Use your portal features, or login as Startup to access AI Team Match.";
    }

    if (intent === "mentor") {
      return userState.role === "startup"
        ? "Go to Startup Dashboard → Find Mentors → choose mentor → send request → chat after approval."
        : userState.role === "mentor"
        ? "Go to Mentor Portal → Requests to accept/reject mentorship requests, then use Communication to chat."
        : "Mentor discovery is available inside Startup Dashboard after login as Startup.";
    }

    if (intent === "investor") {
      return userState.role === "startup"
        ? "Go to Startup Dashboard → Investors → explore investor profiles and send funding request."
        : userState.role === "investor"
        ? "Open Investor Dashboard → Networking to explore startup posts, rate, comment and connect."
        : "Investor features depend on role. Login as Startup to find investors or as Investor to explore startups.";
    }

    if (intent === "service") {
      return userState.role === "startup"
        ? "Go to Startup Dashboard → Services → select provider → send project request."
        : userState.role === "service-provider"
        ? "Go to Service Provider Dashboard → Requests to accept projects, then manage work in Projects."
        : "Service features are available for Startup and Service Provider roles.";
    }

    if (intent === "course") {
      return userState.role === "startup"
        ? "Go to Startup Dashboard → AI Accelerator → Learning Hub to explore organizer-uploaded courses."
        : userState.role === "organizer"
        ? "Go to Organizer Dashboard → Courses to create and publish courses."
        : "Courses are mainly available through the Startup AI Accelerator.";
    }

    if (intent === "competition") {
      return userState.role === "startup"
        ? "Go to Startup Dashboard → Competitions → View Details → Join using the registration link."
        : userState.role === "organizer"
        ? "Go to Organizer Dashboard → Events → Create Event / Hackathon. It will appear in Startup Competitions."
        : "Competitions can be explored by Startups and created by Organizers.";
    }

    if (intent === "networking") {
      return userState.role === "investor"
        ? "Go to Investor Dashboard → Networking. You can view posts, comment, rate and connect, but cannot create posts."
        : userState.role === "startup"
        ? "Go to Startup Dashboard → Networking → Create startup post or interact with other posts."
        : "Networking is mainly available for Startup and Investor roles.";
    }

    if (intent === "dashboard") {
      return `You are logged in as ${userState.role}. Open your role dashboard to access the correct features.`;
    }

    return "Can you please clarify your question? I can help with login, signup, mentors, investors, services, competitions, courses, networking, teams, and complaints.";
  };

  const getAIReply = (text: string) => {
    const intent = detectIntent(text);

    if (!userState.loggedIn) {
      return replyForGuest(intent);
    }

    return replyForLoggedIn(intent);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Msg = {
      sender: "user",
      text: input,
    };

    const botMsg: Msg = {
      sender: "bot",
      text: getAIReply(input),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const submitComplaint = async () => {
    if (!complaint.description) {
      alert("Please enter complaint description");
      return;
    }

    if (!userState.loggedIn && !complaint.contact) {
      alert("Please enter email/contact so admin can respond");
      return;
    }

    await addDoc(collection(db, "complaints"), {
      issueType: complaint.issueType,
      description: complaint.description,
      details: complaint.details,
      contact: complaint.contact || userState.email || "Not provided",
      role: userState.role,
      status: "pending",
      adminResponse: "",
      createdAt: serverTimestamp(),
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Complaint submitted ✅ Organizer/Admin will review it in the Support dashboard.",
      },
    ]);

    setComplaint({
      issueType: "Technical",
      description: "",
      details: "",
      contact: "",
    });

    setMode("guide");
  };

  const quickAction = (label: string) => {
    if (label === "Raise Complaint") {
      setMode("complaint");
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: userState.loggedIn
            ? "Please fill the complaint form below."
            : "Please fill the complaint form below and include your contact email.",
        },
      ]);
      return;
    }

    const botMsg: Msg = {
      sender: "bot",
      text: getAIReply(label),
    };

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: label },
      botMsg,
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full bg-[#07162b] text-white text-3xl shadow-2xl hover:scale-110 transition"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 z-[9999] w-[390px] max-w-[92vw] bg-white rounded-[30px] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-[#07162b] text-white p-5 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black">CampusConnectAI</h2>
              <p className="text-white/70 text-sm">
                {userState.loggedIn
                  ? `Logged in as ${userState.role}`
                  : "Guest guide mode"}
              </p>
            </div>

            <button onClick={() => setOpen(false)} className="text-2xl">
              ×
            </button>
          </div>

          <div className="h-[380px] overflow-y-auto p-5 bg-[#f4f8ff] space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-4 rounded-[20px] text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white text-[#07162b]"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {mode === "complaint" && (
              <div className="bg-white rounded-[22px] p-4 space-y-3">
                <select
                  className="chat-input"
                  value={complaint.issueType}
                  onChange={(e) =>
                    setComplaint({
                      ...complaint,
                      issueType: e.target.value,
                    })
                  }
                >
                  <option>Technical</option>
                  <option>User Report</option>
                  <option>Payment</option>
                  <option>Other</option>
                </select>

                {!userState.loggedIn && (
                  <input
                    placeholder="Your email / contact"
                    className="chat-input"
                    value={complaint.contact}
                    onChange={(e) =>
                      setComplaint({
                        ...complaint,
                        contact: e.target.value,
                      })
                    }
                  />
                )}

                <textarea
                  placeholder="Describe issue"
                  className="chat-input h-20"
                  value={complaint.description}
                  onChange={(e) =>
                    setComplaint({
                      ...complaint,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Optional details / screenshot link"
                  className="chat-input"
                  value={complaint.details}
                  onChange={(e) =>
                    setComplaint({
                      ...complaint,
                      details: e.target.value,
                    })
                  }
                />

                <button
                  onClick={submitComplaint}
                  className="w-full bg-red-600 text-white py-3 rounded-2xl font-black"
                >
                  Submit Complaint
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => quickAction(item)}
                  className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-xs font-bold"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className="chat-input"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <button
                onClick={sendMessage}
                className="bg-[#07162b] text-white px-5 rounded-2xl font-black"
              >
                Send
              </button>
            </div>
          </div>

          <style jsx global>{`
            .chat-input {
              width: 100%;
              border: 1px solid #dbe4f0;
              background: #f8fbff;
              padding: 12px 14px;
              border-radius: 14px;
              outline: none;
              font-size: 14px;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

function safeEmail(raw: string | null) {
  try {
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed.email || "";
  } catch {
    return "";
  }
}