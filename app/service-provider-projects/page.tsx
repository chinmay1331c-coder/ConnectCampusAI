// app/service-provider-projects/page.tsx

"use client";

import { useState } from "react";

type Project = {
  id: number;
  startup: string;
  projectName: string;
  budget: string;
  deadline: string;
  status: string;
  tasks: {
    name: string;
    completed: boolean;
  }[];
  updates: string[];
};

export default function ServiceProviderProjectsPage() {
  // =========================
  // PROJECTS
  // =========================

  const [projects, setProjects] =
    useState<Project[]>([
      {
        id: 1,
        startup: "AI Startup",
        projectName:
          "AI SaaS Platform",
        budget: "$5000",
        deadline:
          "2026-06-10",
        status:
          "In Progress",
        tasks: [
          {
            name:
              "UI Design",
            completed: true,
          },
          {
            name:
              "Backend API",
            completed: false,
          },
        ],
        updates: [
          "Homepage completed",
        ],
      },
    ]);

  // =========================
  // ADD TASK
  // =========================

  const addTask = (
    projectId: number
  ) => {
    const task =
      prompt("Enter Task");

    if (!task) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id ===
        projectId
          ? {
              ...project,
              tasks: [
                ...project.tasks,
                {
                  name: task,
                  completed: false,
                },
              ],
            }
          : project
      )
    );
  };

  // =========================
  // TOGGLE TASK
  // =========================

  const toggleTask = (
    projectId: number,
    taskIndex: number
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id ===
        projectId
          ? {
              ...project,
              tasks:
                project.tasks.map(
                  (
                    task,
                    index
                  ) =>
                    index ===
                    taskIndex
                      ? {
                          ...task,
                          completed:
                            !task.completed,
                        }
                      : task
                ),
            }
          : project
      )
    );
  };

  // =========================
  // ADD UPDATE
  // =========================

  const addUpdate = (
    projectId: number
  ) => {
    const update =
      prompt(
        "Add Progress Update"
      );

    if (!update) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id ===
        projectId
          ? {
              ...project,
              updates: [
                ...project.updates,
                update,
              ],
            }
          : project
      )
    );
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = (
    projectId: number,
    status: string
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id ===
        projectId
          ? {
              ...project,
              status,
            }
          : project
      )
    );
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const deleteProject = (
    id: number
  ) => {
    setProjects(
      projects.filter(
        (project) =>
          project.id !== id
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
              Project
              Management 📊
            </h1>

            <p className="text-slate-500 mt-3 text-lg">
              Manage startup
              projects, tasks,
              progress and
              delivery.
            </p>
          </div>

          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-5xl shadow-2xl">
            🚀
          </div>
        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Total Projects
            </p>

            <h2 className="text-5xl font-black text-[#071739] mt-3">
              {
                projects.length
              }
            </h2>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              In Progress
            </p>

            <h2 className="text-5xl font-black text-blue-600 mt-3">
              {
                projects.filter(
                  (
                    p
                  ) =>
                    p.status ===
                    "In Progress"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Completed
            </p>

            <h2 className="text-5xl font-black text-green-600 mt-3">
              {
                projects.filter(
                  (
                    p
                  ) =>
                    p.status ===
                    "Completed"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Pending
            </p>

            <h2 className="text-5xl font-black text-yellow-500 mt-3">
              {
                projects.filter(
                  (
                    p
                  ) =>
                    p.status ===
                    "Pending"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* PROJECTS */}

        <div className="space-y-8 mt-10">
          {projects.map(
            (project) => (
              <div
                key={
                  project.id
                }
                className="bg-white rounded-[35px] shadow-xl p-8"
              >
                {/* TOP */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-black text-[#071739]">
                      {
                        project.projectName
                      }
                    </h2>

                    <p className="text-slate-500 mt-3">
                      Startup:{" "}
                      {
                        project.startup
                      }
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                        {
                          project.budget
                        }
                      </div>

                      <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                        Deadline:{" "}
                        {
                          project.deadline
                        }
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="flex items-center gap-4">
                    <select
                      value={
                        project.status
                      }
                      onChange={(
                        e
                      ) =>
                        updateStatus(
                          project.id,
                          e
                            .target
                            .value
                        )
                      }
                      className="input-box w-[220px]"
                    >
                      <option>
                        Pending
                      </option>

                      <option>
                        Accepted
                      </option>

                      <option>
                        In Progress
                      </option>

                      <option>
                        Completed
                      </option>
                    </select>

                    <button
                      onClick={() =>
                        deleteProject(
                          project.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* TASKS */}

                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-[#071739]">
                      ✅ Tasks
                    </h3>

                    <button
                      onClick={() =>
                        addTask(
                          project.id
                        )
                      }
                      className="bg-[#071739] hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold"
                    >
                      Add Task
                    </button>
                  </div>

                  <div className="space-y-4 mt-6">
                    {project.tasks.map(
                      (
                        task,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="bg-[#f8fbff] border border-[#dbe4f0] rounded-[22px] p-5 flex items-center gap-4"
                        >
                          <input
                            type="checkbox"
                            checked={
                              task.completed
                            }
                            onChange={() =>
                              toggleTask(
                                project.id,
                                index
                              )
                            }
                            className="w-6 h-6"
                          />

                          <p
                            className={`text-lg font-semibold ${
                              task.completed
                                ? "line-through text-slate-400"
                                : "text-[#071739]"
                            }`}
                          >
                            {
                              task.name
                            }
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* UPDATES */}

                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-[#071739]">
                      📝 Work
                      Updates
                    </h3>

                    <button
                      onClick={() =>
                        addUpdate(
                          project.id
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold"
                    >
                      Add Update
                    </button>
                  </div>

                  <div className="space-y-4 mt-6">
                    {project.updates.map(
                      (
                        update,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="bg-blue-50 border border-blue-100 rounded-[22px] p-5"
                        >
                          <p className="text-[#071739] font-medium">
                            {update}
                          </p>
                        </div>
                      )
                    )}
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