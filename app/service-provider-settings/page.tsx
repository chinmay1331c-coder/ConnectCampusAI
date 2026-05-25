// app/service-provider-settings/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ServiceProviderSettingsPage() {
  const router = useRouter();

  // =========================
  // PROFILE STATE
  // =========================

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      phone: "",
      website: "",
      linkedin: "",
      category: "",
      location: "",
      darkMode: false,
      notifications: true,
    });

  // =========================
  // LOAD SETTINGS
  // =========================

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "serviceProviderProfile"
      );

    if (saved) {
      const parsed =
        JSON.parse(saved);

      setProfile({
        name:
          parsed.name || "",
        email:
          parsed.email || "",
        phone:
          parsed.phone || "",
        website:
          parsed.website || "",
        linkedin:
          parsed.linkedin ||
          "",
        category:
          parsed.category ||
          "",
        location:
          parsed.location ||
          "",
        darkMode:
          parsed.darkMode ||
          false,
        notifications:
          parsed.notifications ??
          true,
      });
    }
  }, []);

  // =========================
  // SAVE SETTINGS
  // =========================

  const saveSettings = () => {
    localStorage.setItem(
      "serviceProviderProfile",
      JSON.stringify(profile)
    );

    alert(
      "Settings Updated Successfully ✅"
    );
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem(
      "serviceProviderLoggedIn"
    );

    router.push(
      "/service-provider-login"
    );
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-[#071739]">
              Settings ⚙️
            </h1>

            <p className="text-slate-500 mt-3 text-lg">
              Manage your
              account settings,
              preferences and
              profile options.
            </p>
          </div>

          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-5xl shadow-2xl">
            ⚙️
          </div>
        </div>

        {/* SETTINGS GRID */}

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* ACCOUNT SETTINGS */}

          <div className="bg-white rounded-[35px] shadow-xl p-8">
            <h2 className="text-3xl font-black text-[#071739]">
              👤 Account
              Settings
            </h2>

            <div className="space-y-5 mt-8">
              <input
                type="text"
                placeholder="Company Name"
                className="input-box"
                value={
                  profile.name
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="input-box"
                value={
                  profile.email
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Phone"
                className="input-box"
                value={
                  profile.phone
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Website"
                className="input-box"
                value={
                  profile.website
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    website:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="text"
                placeholder="LinkedIn"
                className="input-box"
                value={
                  profile.linkedin
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    linkedin:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Service Category"
                className="input-box"
                value={
                  profile.category
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    category:
                      e.target
                        .value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Location"
                className="input-box"
                value={
                  profile.location
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    location:
                      e.target
                        .value,
                  })
                }
              />
            </div>
          </div>

          {/* PREFERENCES */}

          <div className="space-y-8">
            {/* APP SETTINGS */}

            <div className="bg-white rounded-[35px] shadow-xl p-8">
              <h2 className="text-3xl font-black text-[#071739]">
                🎨 Preferences
              </h2>

              <div className="space-y-6 mt-8">
                {/* DARK MODE */}

                <div className="flex items-center justify-between bg-[#f8fbff] border border-[#dbe4f0] rounded-[24px] p-5">
                  <div>
                    <h3 className="text-xl font-black text-[#071739]">
                      Dark Mode
                    </h3>

                    <p className="text-slate-500 mt-1">
                      Enable dark
                      theme
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        darkMode:
                          !profile.darkMode,
                      })
                    }
                    className={`w-20 h-10 rounded-full transition flex items-center px-1 ${
                      profile.darkMode
                        ? "bg-blue-600 justify-end"
                        : "bg-slate-300 justify-start"
                    }`}
                  >
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg" />
                  </button>
                </div>

                {/* NOTIFICATIONS */}

                <div className="flex items-center justify-between bg-[#f8fbff] border border-[#dbe4f0] rounded-[24px] p-5">
                  <div>
                    <h3 className="text-xl font-black text-[#071739]">
                      Notifications
                    </h3>

                    <p className="text-slate-500 mt-1">
                      Enable alerts
                      and updates
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setProfile({
                        ...profile,
                        notifications:
                          !profile.notifications,
                      })
                    }
                    className={`w-20 h-10 rounded-full transition flex items-center px-1 ${
                      profile.notifications
                        ? "bg-green-500 justify-end"
                        : "bg-slate-300 justify-start"
                    }`}
                  >
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg" />
                  </button>
                </div>
              </div>
            </div>

            {/* SECURITY */}

            <div className="bg-white rounded-[35px] shadow-xl p-8">
              <h2 className="text-3xl font-black text-[#071739]">
                🔒 Security
              </h2>

              <div className="space-y-5 mt-8">
                <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-5 rounded-2xl text-lg font-black">
                  Change Password
                </button>

                <button className="w-full bg-yellow-500 hover:bg-yellow-600 transition text-white py-5 rounded-2xl text-lg font-black">
                  Two-Factor
                  Authentication
                </button>

                <button
                  onClick={
                    logout
                  }
                  className="w-full bg-red-500 hover:bg-red-600 transition text-white py-5 rounded-2xl text-lg font-black"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 mt-8">
          <button
            onClick={
              saveSettings
            }
            className="w-full bg-[#071739] hover:bg-blue-700 transition text-white py-6 rounded-2xl text-2xl font-black shadow-xl"
          >
            Save Settings 🚀
          </button>
        </div>
      </div>

      {/* GLOBAL STYLES */}

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 16px 18px;
          border-radius: 18px;
          outline: none;
          transition: 0.3s;
          font-size: 15px;
        }

        .input-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px
            rgba(37, 99, 235, 0.1);
          background: white;
        }
      `}</style>
    </main>
  );
}