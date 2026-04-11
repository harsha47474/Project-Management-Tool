import React, { useEffect, useState } from "react";
import { FolderPlus } from "lucide-react";
import { useProjectStore } from "../store/useProjectStore";
import ProjectCard from "../components/Projects/ProjectCard";
import CreateProjectModal from "../components/Projects/CreateProjectModal";

const ProjectsPage = () => {
  const { projects, loading, fetchProjects } = useProjectStore();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-[#000a2b] p-6 text-white">
      <div className="rounded-[28px] border border-white/10 bg-white/5 px-8 py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">All Projects</h1>
            <p className="mt-2 text-xl text-white/60">
              Manage your workspace projects
            </p>
          </div>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-lg font-medium text-white transition hover:bg-blue-700"
          >
            <FolderPlus size={20} />
            New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-white/60">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 px-6 py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
            <FolderPlus size={34} className="text-white/40" />
          </div>
          <h2 className="text-3xl font-semibold text-white/90">
            Create more projects to organize your work
          </h2>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="mt-8 rounded-2xl border border-white/10 bg-[#07133e] px-6 py-4 text-lg text-white transition hover:bg-white/10"
          >
            Create Project
          </button>
        </div>
      )}

      <CreateProjectModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />
    </div>
  );
};

export default ProjectsPage;