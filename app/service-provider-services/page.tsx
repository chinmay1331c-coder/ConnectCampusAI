// app/service-provider-services/page.tsx

"use client";

import { useState } from "react";

type Service = {
  id: number;
  title: string;
  description: string;
  price: string;
  delivery: string;
  technologies: string;
  projects: string;
  github: string;
  testimonial: string;
  caseStudy: string;
  image: string;
};

export default function ServiceProviderServicesPage() {
  // =========================
  // SERVICES STATE
  // =========================

  const [services, setServices] =
    useState<Service[]>([]);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      price: "",
      delivery: "",
      technologies: "",
      projects: "",
      github: "",
      testimonial: "",
      caseStudy: "",
      image: "",
    });

  // =========================
  // SAVE SERVICE
  // =========================

  const saveService = () => {
    if (
      !form.title ||
      !form.description ||
      !form.price
    ) {
      alert(
        "Please fill required fields"
      );

      return;
    }

    if (editingId) {
      setServices((prev) =>
        prev.map((service) =>
          service.id ===
          editingId
            ? {
                ...service,
                ...form,
              }
            : service
        )
      );

      setEditingId(null);
    } else {
      setServices([
        ...services,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    // RESET

    setForm({
      title: "",
      description: "",
      price: "",
      delivery: "",
      technologies: "",
      projects: "",
      github: "",
      testimonial: "",
      caseStudy: "",
      image: "",
    });
  };

  // =========================
  // EDIT SERVICE
  // =========================

  const editService = (
    service: Service
  ) => {
    setEditingId(service.id);

    setForm({
      title: service.title,
      description:
        service.description,
      price: service.price,
      delivery:
        service.delivery,
      technologies:
        service.technologies,
      projects:
        service.projects,
      github: service.github,
      testimonial:
        service.testimonial,
      caseStudy:
        service.caseStudy,
      image: service.image,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE SERVICE
  // =========================

  const deleteService = (
    id: number
  ) => {
    setServices(
      services.filter(
        (service) =>
          service.id !== id
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-[#071739]">
              Service Posting
              System 🛠️
            </h1>

            <p className="text-slate-500 mt-3 text-lg">
              Create, edit and
              manage professional
              startup services.
            </p>
          </div>

          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-5xl shadow-2xl">
            ⚡
          </div>
        </div>

        {/* FORM */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 mt-8">
          <h2 className="text-4xl font-black text-[#071739]">
            {editingId
              ? "✏️ Edit Service"
              : "➕ Create Service"}
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <input
              placeholder="Service Title"
              className="input-box"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Price Range"
              className="input-box"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price:
                    e.target.value,
                })
              }
            />

            <textarea
              placeholder="Description"
              className="input-box h-32 md:col-span-2"
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Delivery Time"
              className="input-box"
              value={
                form.delivery
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  delivery:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Technologies Used"
              className="input-box"
              value={
                form.technologies
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  technologies:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Previous Projects"
              className="input-box"
              value={
                form.projects
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  projects:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="GitHub Link"
              className="input-box"
              value={
                form.github
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  github:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Client Testimonial"
              className="input-box"
              value={
                form.testimonial
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  testimonial:
                    e.target.value,
                })
              }
            />

            <input
              placeholder="Case Study"
              className="input-box"
              value={
                form.caseStudy
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  caseStudy:
                    e.target.value,
                })
              }
            />

            {/* IMAGE */}

            <div className="md:col-span-2 bg-[#f8fbff] border rounded-[28px] p-6">
              <label className="font-black text-xl block mb-5">
                📸 Upload Service
                Image
              </label>

              <div className="flex items-center gap-8">
                {form.image ? (
                  <img
                    src={form.image}
                    className="w-40 h-40 rounded-[28px] object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-[28px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-6xl text-white">
                    🛠️
                  </div>
                )}

                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-blue-300 rounded-[28px] p-8 text-center bg-white">
                    <div className="text-5xl">
                      ☁️
                    </div>

                    <p className="mt-4 font-bold">
                      Click to Upload
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file =
                        e.target
                          .files?.[0];

                      if (!file)
                        return;

                      const reader =
                        new FileReader();

                      reader.onloadend =
                        () => {
                          setForm({
                            ...form,
                            image:
                              reader.result as string,
                          });
                        };

                      reader.readAsDataURL(
                        file
                      );
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* BUTTON */}

          <button
            onClick={
              saveService
            }
            className="bg-[#071739] hover:bg-blue-700 transition text-white px-8 py-5 rounded-2xl font-black text-lg mt-8"
          >
            {editingId
              ? "Update Service"
              : "Publish Service"}
          </button>
        </div>

        {/* SERVICES LIST */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {services.map(
            (service) => (
              <div
                key={
                  service.id
                }
                className="bg-white rounded-[35px] shadow-xl overflow-hidden"
              >
                {/* IMAGE */}

                {service.image && (
                  <img
                    src={
                      service.image
                    }
                    className="w-full h-72 object-cover"
                  />
                )}

                <div className="p-8">
                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black text-[#071739]">
                        {
                          service.title
                        }
                      </h2>

                      <p className="text-blue-600 font-black text-xl mt-3">
                        {
                          service.price
                        }
                      </p>
                    </div>

                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                      {
                        service.delivery
                      }
                    </div>
                  </div>

                  {/* DESC */}

                  <p className="text-slate-500 mt-6 leading-relaxed">
                    {
                      service.description
                    }
                  </p>

                  {/* TECH */}

                  <div className="mt-6">
                    <h3 className="font-black text-lg text-[#071739]">
                      ⚙️ Technologies
                    </h3>

                    <p className="text-slate-600 mt-2">
                      {
                        service.technologies
                      }
                    </p>
                  </div>

                  {/* PROJECTS */}

                  <div className="mt-6">
                    <h3 className="font-black text-lg text-[#071739]">
                      📁 Previous
                      Projects
                    </h3>

                    <p className="text-slate-600 mt-2">
                      {
                        service.projects
                      }
                    </p>
                  </div>

                  {/* TESTIMONIAL */}

                  <div className="mt-6 bg-blue-50 rounded-[24px] p-5">
                    <h3 className="font-black text-lg text-[#071739]">
                      ⭐ Client
                      Testimonial
                    </h3>

                    <p className="text-slate-600 mt-2 italic">
                      “
                      {
                        service.testimonial
                      }
                      ”
                    </p>
                  </div>

                  {/* CASE STUDY */}

                  <div className="mt-6">
                    <h3 className="font-black text-lg text-[#071739]">
                      📊 Case Study
                    </h3>

                    <p className="text-slate-600 mt-2">
                      {
                        service.caseStudy
                      }
                    </p>
                  </div>

                  {/* GITHUB */}

                  {service.github && (
                    <a
                      href={
                        service.github
                      }
                      target="_blank"
                      className="inline-block text-blue-600 font-bold mt-6"
                    >
                      🔗 GitHub Link
                    </a>
                  )}

                  {/* ACTIONS */}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() =>
                        editService(
                          service
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteService(
                          service.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* GLOBAL STYLE */}

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