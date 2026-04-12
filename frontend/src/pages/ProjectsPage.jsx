import React, { useEffect, useState } from "react";
import { FolderPlus, Loader } from "lucide-react";
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
    <div className="min-h-screen p-2 text-foreground">
      {openCreateModal && (
        <div className="fixed inset-0 bg-background-900/40 backdrop-blur-sm z-40"></div>
      )}
      <div className="px-6 py-2">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Projects</h1>
            <p className="mt-2 text-base text-muted-foreground">
              Manage your workspace projects
            </p>
          </div>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex items-center gap-3 rounded-xl bg-blue-600 px-3 py-3 text-lg font-medium text-white transition hover:bg-blue-700"
          >
            <FolderPlus size={20} />
            New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-muted-foreground"><div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div></div>
      ) : projects.length > 0 ? (
        <div className="mt-5 grid gap-6 xl:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-muted">
            <FolderPlus size={34} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground text-opacity-90">
            Create more projects to organize your work
          </h2>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="mt-8 rounded-xl border border-border bg-card px-6 py-3 text-base text-foreground transition hover:bg-muted"
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