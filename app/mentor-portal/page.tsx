"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Availability = {
  id: string;
  day: string;
  start: string;
  end: string;
};

type MentorRequest = {
  id: string;
  studentName: string;
  message: string;
  area: string;
  status: "pending" | "accepted" | "rejected";
};

type Message = {
  id: string;
  sender: string;
  text: string;
};

type Follower = {
  id: string;
  name: string;
  query: string;
};

export default function MentorPortalPage() {
  const [loading, setLoading] = useState(true);

  const [mentorProfile, setMentorProfile] =
    useState<any>(null);

  const [availability, setAvailability] =
    useState<Availability[]>([]);

  const [requests, setRequests] =
    useState<MentorRequest[]>([
      {
        id: "1",
        studentName: "Rahul",
        message: "Need startup guidance",
        area: "AI Startup",
        status: "pending",
      },
    ]);

  const [followers, setFollowers] =
    useState<Follower[]>([
      {
        id: "1",
        name: "Aman",
        query: "Need help with pitch deck",
      },
    ]);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [selectedRequest, setSelectedRequest] =
    useState<MentorRequest | null>(null);

  const [chatInput, setChatInput] =
    useState("");

  const [day, setDay] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [editingSlotId, setEditingSlotId] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<
      | "all"
      | "pending"
      | "accepted"
      | "rejected"
    >("all");

  const [notifications, setNotifications] =
    useState<string[]>([]);

  // ------------------------
  // LOGIN CHECK
  // ------------------------
  useEffect(() => {
    const mentorLoggedIn =
      localStorage.getItem(
        "mentorLoggedIn"
      );

    if (
      mentorLoggedIn !== "true"
    ) {
      window.location.href =
        "/mentor-login";

      return;
    }

    setMentorProfile({
      mentorName:
        "Demo Mentor",
      profilePhoto: "",
    });

    setLoading(false);
  }, []);

  // ------------------------
  // NOTIFICATION
  // ------------------------
  const notify = (
    message: string
  ) => {
    setNotifications(
      (prev) => [
        message,
        ...prev,
      ]
    );

    setTimeout(() => {
      setNotifications(
        (prev) =>
          prev.slice(
            0,
            prev.length - 1
          )
      );
    }, 3000);
  };

  // ------------------------
  // FILTER
  // ------------------------
  const filteredRequests =
    useMemo(() => {
      if (
        filter ===
        "all"
      )
        return requests;

      return requests.filter(
        (
          request
        ) =>
          request.status ===
          filter
      );
    }, [
      requests,
      filter,
    ]);

  // ------------------------
  // SAVE SLOT
  // ------------------------
  const saveAvailability =
    () => {
      if (
        !day ||
        !start ||
        !end
      ) {
        alert(
          "Fill all fields"
        );

        return;
      }

      if (
        editingSlotId
      ) {
        setAvailability(
          (
            prev
          ) =>
            prev.map(
              (
                slot
              ) =>
                slot.id ===
                editingSlotId
                  ? {
                      ...slot,
                      day,
                      start,
                      end,
                    }
                  : slot
            )
        );

        notify(
          "Availability updated"
        );

        setEditingSlotId(
          null
        );
      } else {
        setAvailability(
          (
            prev
          ) => [
            ...prev,
            {
              id: Date.now().toString(),
              day,
              start,
              end,
            },
          ]
        );

        notify(
          "Availability added"
        );
      }

      setDay("");
      setStart("");
      setEnd("");
    };

  // ------------------------
  // EDIT SLOT
  // ------------------------
  const editSlot = (
    slot: Availability
  ) => {
    setEditingSlotId(
      slot.id
    );

    setDay(slot.day);
    setStart(slot.start);
    setEnd(slot.end);
  };

  // ------------------------
  // DELETE SLOT
  // ------------------------
  const deleteSlot = (
    id: string
  ) => {
    setAvailability(
      (prev) =>
        prev.filter(
          (
            slot
          ) =>
            slot.id !==
            id
        )
    );

    notify(
      "Availability deleted"
    );
  };

  // ------------------------
  // REQUEST ACTION
  // ------------------------
  const updateRequestStatus =
    (
      request: MentorRequest,
      status:
        | "accepted"
        | "rejected"
    ) => {
      setRequests(
        (
          prev
        ) =>
          prev.map(
            (
              item
            ) =>
              item.id ===
              request.id
                ? {
                    ...item,
                    status,
                  }
                : item
          )
      );

      notify(
        `Request ${status}`
      );
    };

  // ------------------------
  // SEND MESSAGE
  // ------------------------
  const sendMessage =
    () => {
      if (
        !chatInput
      )
        return;

      setMessages(
        (
          prev
        ) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender:
              "mentor",
            text: chatInput,
          },
        ]
      );

      setChatInput("");

      notify(
        "Message sent"
      );
    };

  // ------------------------
  // LOGOUT
  // ------------------------
  const logout = () => {
    localStorage.removeItem(
      "mentorLoggedIn"
    );

    window.location.href =
      "/mentor-login";
  };

  // ------------------------
  // LOADING
  // ------------------------
  if (
    loading
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#eef4ff]">
        <h1 className="text-5xl font-black text-[#071739]">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef4ff] p-6">
      
      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {notifications.map(
          (
            note,
            index
          ) => (
            <div
              key={
                index
              }
              className="bg-[#071739] text-white px-5 py-3 rounded-2xl shadow-xl"
            >
              {note}
            </div>
          )
        )}
      </div>

      <div className="max-w-7xl mx-auto">

        {/* TOP */}
        <div className="bg-white rounded-[30px] shadow-xl p-6 flex items-center justify-between">
          
          <div className="flex items-center gap-5">
            
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
              👨‍🏫
            </div>

            <div>
              <h1 className="text-4xl font-black text-[#071739]">
                Mentor Dashboard
              </h1>

              <p className="text-slate-500 mt-2">
                Welcome{" "}
                {
                  mentorProfile?.mentorName
                }
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            
            <Link
              href="/mentor-profile"
              className="bg-slate-100 px-6 py-3 rounded-2xl font-bold"
            >
              Profile
            </Link>

            <button
              onClick={
                logout
              }
              className="bg-[#071739] text-white px-6 py-3 rounded-2xl font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          
          <StatCard
            title="Availability"
            value={
              availability.length
            }
          />

          <StatCard
            title="Requests"
            value={
              requests.length
            }
          />

          <StatCard
            title="Followers"
            value={
              followers.length
            }
          />

          <StatCard
            title="Messages"
            value={
              messages.length
            }
          />
        </div>

        {/* AVAILABILITY */}
        <div className="bg-white rounded-[30px] shadow-xl p-8 mt-8">
          
          <h2 className="text-3xl font-black mb-6">
            Availability
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            
            <input
              placeholder="Day"
              value={day}
              onChange={(
                e
              ) =>
                setDay(
                  e.target
                    .value
                )
              }
              className="input-box"
            />

            <input
              type="time"
              value={
                start
              }
              onChange={(
                e
              ) =>
                setStart(
                  e.target
                    .value
                )
              }
              className="input-box"
            />

            <input
              type="time"
              value={end}
              onChange={(
                e
              ) =>
                setEnd(
                  e.target
                    .value
                )
              }
              className="input-box"
            />

            <button
              onClick={
                saveAvailability
              }
              className="bg-[#071739] text-white rounded-2xl font-bold"
            >
              {editingSlotId
                ? "Update"
                : "Add Slot"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {availability.map(
              (
                slot
              ) => (
                <div
                  key={
                    slot.id
                  }
                  className="border rounded-3xl p-6 bg-slate-50"
                >
                  <h3 className="text-2xl font-bold">
                    {
                      slot.day
                    }
                  </h3>

                  <p className="text-slate-500 mt-2">
                    {
                      slot.start
                    }{" "}
                    -{" "}
                    {
                      slot.end
                    }
                  </p>

                  <div className="flex gap-3 mt-5">
                    
                    <button
                      onClick={() =>
                        editSlot(
                          slot
                        )
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteSlot(
                          slot.id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          border-radius: 18px;
          padding: 16px;
          outline: none;
          background: white;
        }

        .input-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px
            rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="text-5xl font-black text-[#071739] mt-3">
        {value}
      </h2>
    </div>
  );
}