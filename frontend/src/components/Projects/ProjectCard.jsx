import React from "react";
import { FolderKanban, GitBranch, Users, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status = "active") => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
    case "paused":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
    default:
      return "bg-green-500/15 text-green-400 border border-green-500/20";
  }
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group cursor-pointer rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(41,98,255,0.18),_transparent_35%),_#020b2d] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <FolderKanban className="text-white" size={28} />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-white">{project.name}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status || "active"}
              </span>
            </div>

            <p className="text-sm text-white/50">
              Key: {project.name?.slice(0, 4)?.toUpperCase()}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <p className="min-h-[56px] text-lg leading-7 text-white/80">
        {project.description || "No description added for this project yet."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-white/60">
            <Users size={18} />
            <span>Team</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {project.members?.length || 1}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-white/60">
            <GitBranch size={18} />
            <span>Repo</span>
          </div>
          <p className="truncate text-base font-medium text-white">
            {project.githubRepo ? "Connected" : "Not added"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;