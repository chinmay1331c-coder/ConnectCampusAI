// app/mentor-portal/page.tsx

"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/lib/firebase";

type Availability = {
  id: string;
  mentorId: string;
  day: string;
  start: string;
  end: string;
};

type MentorRequest = {
  id: string;
  mentorId: string;
  studentName: string;
  message: string;
  area: string;
  status:
    | "pending"
    | "accepted"
    | "rejected";
};

type Message = {
  id: string;
  sender: string;
  text: string;
};

type Follower = {
  id: string;
  mentorId: string;
  name: string;
  query: string;
};

export default function MentorPortalPage() {
  const [user, setUser] =
    useState<any>(null);

  const [mentorProfile, setMentorProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  // -----------------------------
  // AVAILABILITY
  // -----------------------------
  const [availability, setAvailability] =
    useState<Availability[]>([]);

  const [day, setDay] =
    useState("");

  const [start, setStart] =
    useState("");

  const [end, setEnd] =
    useState("");

  const [editingSlotId, setEditingSlotId] =
    useState<string | null>(
      null
    );

  // -----------------------------
  // REQUESTS
  // -----------------------------
  const [requests, setRequests] =
    useState<MentorRequest[]>(
      []
    );

  const [filter, setFilter] =
    useState<
      | "all"
      | "pending"
      | "accepted"
      | "rejected"
    >("all");

  // -----------------------------
  // CHAT
  // -----------------------------
  const [selectedRequest, setSelectedRequest] =
    useState<MentorRequest | null>(
      null
    );

  const [chatInput, setChatInput] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  // -----------------------------
  // FOLLOWERS
  // -----------------------------
  const [followers, setFollowers] =
    useState<Follower[]>(
      []
    );

  // -----------------------------
  // NOTIFICATIONS
  // -----------------------------
  const [notifications, setNotifications] =
    useState<string[]>(
      []
    );

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

  // -----------------------------
  // AUTH CHECK
  // -----------------------------
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          currentUser
        ) => {
          if (
            !currentUser
          ) {
            window.location.href =
              "/mentor-dashboard";

            return;
          }

          setUser(
            currentUser
          );

          const mentorRef =
            doc(
              db,
              "mentorProfiles",
              currentUser.uid
            );

          const mentorSnap =
            await getDoc(
              mentorRef
            );

          if (
            !mentorSnap.exists()
          ) {
            window.location.href =
              "/mentor-onboarding";

            return;
          }

          setMentorProfile(
            mentorSnap.data()
          );

          setLoading(
            false
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // -----------------------------
  // FETCH AVAILABILITY
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(
        db,
        "mentorAvailability"
      ),
      where(
        "mentorId",
        "==",
        user.uid
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (
          snapshot
        ) => {
          const data =
            snapshot.docs.map(
              (
                doc
              ) => ({
                id: doc.id,
                ...(doc.data() as any),
              })
            );

          setAvailability(
            data
          );
        }
      );

    return () =>
      unsubscribe();
  }, [user]);

  // -----------------------------
  // FETCH REQUESTS
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(
        db,
        "mentorRequests"
      ),
      where(
        "mentorId",
        "==",
        user.uid
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (
          snapshot
        ) => {
          const data =
            snapshot.docs.map(
              (
                doc
              ) => ({
                id: doc.id,
                ...(doc.data() as any),
              })
            );

          setRequests(
            data
          );
        }
      );

    return () =>
      unsubscribe();
  }, [user]);

  // -----------------------------
  // FETCH FOLLOWERS
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(
        db,
        "mentorFollowers"
      ),
      where(
        "mentorId",
        "==",
        user.uid
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (
          snapshot
        ) => {
          const data =
            snapshot.docs.map(
              (
                doc
              ) => ({
                id: doc.id,
                ...(doc.data() as any),
              })
            );

          setFollowers(
            data
          );
        }
      );

    return () =>
      unsubscribe();
  }, [user]);

  // -----------------------------
  // FETCH MESSAGES
  // -----------------------------
  useEffect(() => {
    if (
      !selectedRequest ||
      !user
    )
      return;

    const chatId = `${user.uid}_${selectedRequest.id}`;

    const q = query(
      collection(
        db,
        "mentorMessages"
      ),
      where(
        "chatId",
        "==",
        chatId
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (
          snapshot
        ) => {
          const data =
            snapshot.docs.map(
              (
                doc
              ) => ({
                id: doc.id,
                ...(doc.data() as any),
              })
            );

          setMessages(
            data
          );
        }
      );

    return () =>
      unsubscribe();
  }, [
    selectedRequest,
    user,
  ]);

  // -----------------------------
  // FILTERED REQUESTS
  // -----------------------------
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

  // -----------------------------
  // ADD / UPDATE AVAILABILITY
  // -----------------------------
  const saveAvailability =
    async () => {
      if (
        !day ||
        !start ||
        !end
      ) {
        alert(
          "Please fill all fields"
        );

        return;
      }

      if (
        editingSlotId
      ) {
        await updateDoc(
          doc(
            db,
            "mentorAvailability",
            editingSlotId
          ),
          {
            day,
            start,
            end,
          }
        );

        notify(
          "Availability updated"
        );

        setEditingSlotId(
          null
        );
      } else {
        await addDoc(
          collection(
            db,
            "mentorAvailability"
          ),
          {
            mentorId:
              user.uid,
            day,
            start,
            end,
            createdAt:
              serverTimestamp(),
          }
        );

        notify(
          "Availability added"
        );
      }

      setDay("");
      setStart("");
      setEnd("");
    };

  // -----------------------------
  // EDIT SLOT
  // -----------------------------
  const editSlot = (
    slot: Availability
  ) => {
    setEditingSlotId(
      slot.id
    );

    setDay(slot.day);

    setStart(
      slot.start
    );

    setEnd(slot.end);
  };

  // -----------------------------
  // DELETE SLOT
  // -----------------------------
  const deleteSlot =
    async (
      id: string
    ) => {
      await deleteDoc(
        doc(
          db,
          "mentorAvailability",
          id
        )
      );

      notify(
        "Availability deleted"
      );
    };

  // -----------------------------
  // REQUEST ACTIONS
  // -----------------------------
  const updateRequestStatus =
    async (
      request: MentorRequest,
      status:
        | "accepted"
        | "rejected"
    ) => {
      await updateDoc(
        doc(
          db,
          "mentorRequests",
          request.id
        ),
        {
          status,
        }
      );

      notify(
        `Request ${status}`
      );

      if (
        status ===
        "accepted"
      ) {
        setSelectedRequest(
          {
            ...request,
            status,
          }
        );
      }
    };

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const sendMessage =
    async () => {
      if (
        !chatInput ||
        !selectedRequest
      )
        return;

      const chatId = `${user.uid}_${selectedRequest.id}`;

      await addDoc(
        collection(
          db,
          "mentorMessages"
        ),
        {
          chatId,
          sender:
            "mentor",
          text: chatInput,
          createdAt:
            serverTimestamp(),
        }
      );

      setChatInput(
        ""
      );

      notify(
        "Message sent"
      );
    };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout =
    async () => {
      await signOut(
        auth
      );

      localStorage.clear();

      window.location.href =
        "/mentor-dashboard";
    };

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
      {/* NOTIFICATIONS */}
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
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl overflow-hidden">
              {mentorProfile?.profilePhoto ? (
                <img
                  src={
                    mentorProfile.profilePhoto
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                "👨‍🏫"
              )}
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
              value={
                end
              }
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

        {/* REQUESTS */}
        <div className="bg-white rounded-[30px] shadow-xl p-8 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">
              Mentorship
              Requests
            </h2>

            <select
              value={
                filter
              }
              onChange={(
                e
              ) =>
                setFilter(
                  e.target
                    .value as any
                )
              }
              className="input-box max-w-[220px]"
            >
              <option value="all">
                All
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="accepted">
                Accepted
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {filteredRequests.map(
              (
                request
              ) => (
                <div
                  key={
                    request.id
                  }
                  className="border rounded-3xl p-6 bg-slate-50"
                >
                  <h3 className="text-2xl font-bold">
                    {
                      request.studentName
                    }
                  </h3>

                  <p className="text-slate-600 mt-3">
                    {
                      request.message
                    }
                  </p>

                  <p className="mt-3 text-blue-600 font-semibold">
                    Area:{" "}
                    {
                      request.area
                    }
                  </p>

                  <div className="mt-5">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        request.status ===
                        "accepted"
                          ? "bg-green-100 text-green-700"
                          : request.status ===
                            "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {
                        request.status
                      }
                    </span>
                  </div>

                  {request.status ===
                    "pending" && (
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() =>
                          updateRequestStatus(
                            request,
                            "accepted"
                          )
                        }
                        className="bg-green-500 text-white px-5 py-3 rounded-xl"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateRequestStatus(
                            request,
                            "rejected"
                          )
                        }
                        className="bg-red-500 text-white px-5 py-3 rounded-xl"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status ===
                    "accepted" && (
                    <button
                      onClick={() =>
                        setSelectedRequest(
                          request
                        )
                      }
                      className="mt-5 bg-[#071739] text-white px-5 py-3 rounded-xl"
                    >
                      Open Chat
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* CHAT */}
        <div className="bg-white rounded-[30px] shadow-xl p-8 mt-8">
          <h2 className="text-3xl font-black mb-6">
            Communication
          </h2>

          {selectedRequest ? (
            <>
              <div className="border rounded-3xl h-[350px] overflow-y-auto p-5 bg-slate-50">
                {messages.map(
                  (
                    msg
                  ) => (
                    <div
                      key={
                        msg.id
                      }
                      className={`mb-4 flex ${
                        msg.sender ===
                        "mentor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-5 py-3 rounded-2xl max-w-[300px] ${
                          msg.sender ===
                          "mentor"
                            ? "bg-[#071739] text-white"
                            : "bg-white shadow"
                        }`}
                      >
                        {
                          msg.text
                        }
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="flex gap-4 mt-5">
                <input
                  value={
                    chatInput
                  }
                  onChange={(
                    e
                  ) =>
                    setChatInput(
                      e.target
                        .value
                    )
                  }
                  placeholder="Type message..."
                  className="input-box flex-1"
                />

                <button
                  onClick={
                    sendMessage
                  }
                  className="bg-[#071739] text-white px-8 rounded-2xl font-bold"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-500">
              Select a
              request to
              start chat
            </p>
          )}
        </div>

        {/* FOLLOWERS */}
        <div className="bg-white rounded-[30px] shadow-xl p-8 mt-8 mb-10">
          <h2 className="text-3xl font-black mb-6">
            Followers
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {followers.map(
              (
                follower
              ) => (
                <div
                  key={
                    follower.id
                  }
                  className="border rounded-3xl p-6 bg-slate-50"
                >
                  <h3 className="text-2xl font-bold">
                    {
                      follower.name
                    }
                  </h3>

                  <p className="text-slate-600 mt-3">
                    {
                      follower.query
                    }
                  </p>

                  <button className="mt-5 bg-[#071739] text-white px-5 py-3 rounded-xl">
                    Respond
                  </button>
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