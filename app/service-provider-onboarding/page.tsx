"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ServiceProviderOnboardingPage() {
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  const categories = [
    "Web Development",
    "App Development",
    "AI/ML Services",
    "UI/UX Design",
    "Marketing",
    "Branding",
    "Legal Support",
    "Cloud Hosting",
    "IoT Development",
    "Business Consulting",
  ];

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(
        selectedCategories.filter((c) => c !== cat)
      );
    } else {
      setSelectedCategories([
        ...selectedCategories,
        cat,
      ]);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] py-14 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-10 shadow-2xl mb-10">
          <h1 className="text-6xl font-black text-[#07162b]">
            Create Service Provider Profile 🛠️
          </h1>

          <p className="text-slate-600 text-xl mt-5">
            Complete your provider profile before
            accessing the dashboard.
          </p>
        </div>

        {/* BASIC + ABOUT */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* BASIC */}
          <div className="bg-white rounded-[35px] shadow-2xl p-8">
            <h2 className="text-3xl font-black mb-8">
              👤 Basic Details
            </h2>

            <div className="space-y-5">
              <div className="w-40 h-40 rounded-[30px] bg-slate-100 overflow-hidden mx-auto shadow-xl">
                <img
                  src="https://i.pravatar.cc/300"
                  className="w-full h-full object-cover"
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-full font-black shadow-xl">
                Upload Logo •
              </button>

              <input
                placeholder="Company Name"
                className="input-box"
              />

              <input
                placeholder="Service Category"
                className="input-box"
              />

              <input
                placeholder="Experience"
                className="input-box"
              />

              <input
                placeholder="Team Size"
                className="input-box"
              />
            </div>
          </div>

          {/* ABOUT */}
          <div className="lg:col-span-2 bg-white rounded-[35px] shadow-2xl p-8">
            <h2 className="text-3xl font-black mb-8">
              📄 About & Services
            </h2>

            <div className="space-y-5">
              <textarea
                placeholder="About Description"
                className="input-box min-h-[160px]"
              />

              <textarea
                placeholder="Skills & Technologies"
                className="input-box min-h-[120px]"
              />

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  placeholder="Location"
                  className="input-box"
                />

                <input
                  placeholder="Contact Email"
                  className="input-box"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  placeholder="Phone Number"
                  className="input-box"
                />

                <input
                  placeholder="Website"
                  className="input-box"
                />
              </div>

              <input
                placeholder="LinkedIn Profile"
                className="input-box"
              />
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className="bg-white rounded-[35px] shadow-2xl p-8 mt-8">
          <h2 className="text-3xl font-black mb-8">
            🛠️ Services Offered
          </h2>

          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-6 py-4 rounded-full font-bold transition-all ${
                  selectedCategories.includes(cat)
                    ? "bg-blue-600 text-white shadow-xl"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-10">
            <input
              placeholder="Service Name"
              className="input-box"
            />

            <input
              placeholder="Price Range"
              className="input-box"
            />

            <input
              placeholder="Delivery Time"
              className="input-box"
            />

            <input
              placeholder="Support Availability"
              className="input-box"
            />
          </div>

          <textarea
            placeholder="Service Description"
            className="input-box min-h-[140px] mt-5"
          />
        </div>

        {/* PORTFOLIO */}
        <div className="bg-white rounded-[35px] shadow-2xl p-8 mt-8">
          <h2 className="text-3xl font-black mb-8">
            📦 Portfolio & Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <textarea
              placeholder="Previous Projects"
              className="input-box min-h-[140px]"
            />

            <textarea
              placeholder="Client Testimonials"
              className="input-box min-h-[140px]"
            />

            <input
              placeholder="GitHub Link"
              className="input-box"
            />

            <input
              placeholder="Behance / Dribbble"
              className="input-box"
            />
          </div>
        </div>

        {/* SAVE */}
        <button
          onClick={() =>
            router.push("/service-provider-portal")
          }
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-6 rounded-full text-2xl font-black shadow-2xl mt-10 hover:scale-[1.01] transition-all"
        >
          Save Profile 🚀
        </button>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          padding: 20px;
          border-radius: 24px;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          outline: none;
          font-size: 16px;
        }

        .input-box:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px
            rgba(59, 130, 246, 0.12);
        }
      `}</style>
    </main>
  );
}