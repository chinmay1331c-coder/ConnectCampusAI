"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ServiceProviderProfilePage() {
  const router = useRouter();

  const [logoPreview, setLogoPreview] =
    useState("");

  const [profile, setProfile] =
    useState({
      companyName: "",
      category: "",
      about: "",
      experience: "",
      skills: "",
      teamSize: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      linkedin: "",
    });

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setProfile({
      ...profile,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // LOGO UPLOAD
  // =========================

  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      const imageUrl =
        URL.createObjectURL(file);

      setLogoPreview(imageUrl);

      localStorage.setItem(
        "serviceProviderLogo",
        imageUrl
      );
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = () => {
    localStorage.setItem(
      "serviceProviderProfile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "serviceProviderProfileCompleted",
      "true"
    );

    alert(
      "Profile Saved Successfully"
    );

    router.push(
      "/service-provider-dashboard"
    );
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] px-6 py-14">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}

        <div className="text-center">
          <div className="text-7xl">
            🛠️
          </div>

          <h1 className="text-6xl font-black text-[#071739] mt-6">
            Service Provider Profile
          </h1>

          <p className="text-slate-500 text-xl mt-4">
            Complete your company profile
          </p>
        </div>

        {/* FORM */}

        <div className="bg-white rounded-[35px] shadow-2xl border border-[#dbe4f0] p-10 mt-12">
          {/* COMPANY LOGO */}

          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#071739] mb-6">
              Company Logo
            </h2>

            <div className="flex items-center gap-8">
              {/* PREVIEW */}

              <div className="w-40 h-40 rounded-[30px] bg-[#f8fbff] border-2 border-dashed border-[#dbe4f0] flex items-center justify-center overflow-hidden shadow-lg">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">
                    🏢
                  </span>
                )}
              </div>

              {/* BUTTON */}

              <div>
                <label className="bg-[#071739] hover:bg-blue-700 transition text-white px-8 py-4 rounded-2xl font-black cursor-pointer inline-block shadow-xl">
                  Upload Logo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleLogoUpload
                    }
                    hidden
                  />
                </label>

                <p className="text-slate-500 mt-4">
                  PNG, JPG or SVG
                </p>
              </div>
            </div>
          </div>

          {/* FORM GRID */}

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <label className="label">
                Company Name
              </label>

              <input
                type="text"
                name="companyName"
                value={
                  profile.companyName
                }
                onChange={
                  handleChange
                }
                placeholder="TechNova Solutions"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Service Category
              </label>

              <input
                type="text"
                name="category"
                value={
                  profile.category
                }
                onChange={
                  handleChange
                }
                placeholder="AI Development"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={
                  profile.experience
                }
                onChange={
                  handleChange
                }
                placeholder="5 Years"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={
                  profile.skills
                }
                onChange={
                  handleChange
                }
                placeholder="React, AI, Firebase"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Team Size
              </label>

              <input
                type="text"
                name="teamSize"
                value={
                  profile.teamSize
                }
                onChange={
                  handleChange
                }
                placeholder="12"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={
                  profile.location
                }
                onChange={
                  handleChange
                }
                placeholder="Bangalore"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Contact Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  profile.email
                }
                onChange={
                  handleChange
                }
                placeholder="contact@company.com"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={
                  profile.phone
                }
                onChange={
                  handleChange
                }
                placeholder="+91 9999999999"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                Website
              </label>

              <input
                type="text"
                name="website"
                value={
                  profile.website
                }
                onChange={
                  handleChange
                }
                placeholder="https://company.com"
                className="input-box"
              />
            </div>

            <div>
              <label className="label">
                LinkedIn
              </label>

              <input
                type="text"
                name="linkedin"
                value={
                  profile.linkedin
                }
                onChange={
                  handleChange
                }
                placeholder="linkedin.com/company"
                className="input-box"
              />
            </div>
          </div>

          {/* ABOUT */}

          <div className="mt-8">
            <label className="label">
              About Description
            </label>

            <textarea
              name="about"
              value={profile.about}
              onChange={
                handleChange
              }
              placeholder="Describe your company..."
              rows={5}
              className="input-box resize-none"
            />
          </div>

          {/* SAVE */}

          <button
            onClick={handleSave}
            className="w-full mt-10 bg-[#071739] hover:bg-blue-700 transition text-white py-5 rounded-2xl text-xl font-black shadow-xl"
          >
            Save Profile →
          </button>
        </div>
      </div>

      {/* GLOBAL STYLES */}

      <style jsx global>{`
        .label {
          display: block;
          margin-bottom: 10px;
          font-weight: 700;
          color: #071739;
          font-size: 15px;
        }

        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 18px 20px;
          border-radius: 18px;
          outline: none;
          transition: 0.3s;
          font-size: 16px;
        }

        .input-box:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 4px
            rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </main>
  );
}