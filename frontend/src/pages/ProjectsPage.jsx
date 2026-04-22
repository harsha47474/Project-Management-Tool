import React, { useEffect, useState } from "react";
import { FolderPlus } from "lucide-react";
import { useProjectStore } from "../store/useProjectStore";
import ProjectCard from "../components/Projects/ProjectCard";
import CreateProjectModal from "../components/Projects/CreateProjectModal";

const ProjectCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-border bg-card p-6">
    <div className="mb-6 flex items-start gap-4">
      <div className="h-16 w-16 rounded-xl bg-muted" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-3/4 rounded bg-muted" />
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="h-16 rounded-xl bg-muted" />
      <div className="h-16 rounded-xl bg-muted" />
    </div>
  </div>
);

const ProjectsPage = () => {
  const { projects, loading, fetchProjects } = useProjectStore();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const isFirstLoad = loading && projects.length === 0;
  const isRefetching = loading && projects.length > 0;

  return (
    <div className="min-h-screen p-2 text-foreground">
      {isRefetching && (
        <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-muted">
          <div className="h-full w-1/3 animate-pulse bg-blue-500" />
        </div>
      )}

      {openCreateModal && (
        <div className="fixed inset-0 bg-background-900/40 backdrop-blur-sm z-40" />
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

      {isFirstLoad ? (
        <div className="mt-5 grid gap-6 px-6 xl:grid-cols-2">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : projects.length > 0 ? (
        <div className={`mt-5 px-6 transition-opacity duration-300 ${isRefetching ? "opacity-60" : "opacity-100"}`}>
          <div className="grid gap-6 xl:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 mx-6 rounded-xl border border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-muted">
            <FolderPlus size={34} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Create your first project &amp; organize your work
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