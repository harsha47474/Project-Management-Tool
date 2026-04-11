import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    UserPlus,
    GitBranch,
    Users,
    ListTodo,
} from "lucide-react";
import { useProjectStore } from "../store/useProjectStore";
import EditProjectModal from "../components/Projects/EditProjectModal";
import InviteMemberModal from "../components/Projects/InviteMemberModal";

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

const getInitials = (name = "U") => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        currentProject,
        loading,
        actionLoading,
        fetchProjectById,
        deleteProject,
        removeMember,
    } = useProjectStore();

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openInviteModal, setOpenInviteModal] = useState(false);

    useEffect(() => {
        fetchProjectById(id);
    }, [id, fetchProjectById]);
    console.log(currentProject);


    const members = useMemo(() => currentProject?.members || [], [currentProject]);
    console.log(members)
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );
        if (!confirmDelete) return;

        const result = await deleteProject(id);
        if (result.success) {
            navigate("/projects");
        }
    };

    const handleRemoveMember = async (memberId) => {
        const result = await removeMember(id, memberId);
        if (!result.success) {
            alert(result.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#000a2b] p-6 text-white">
                Loading project...
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="min-h-screen bg-[#000a2b] p-6 text-white">
                Project not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000a2b] p-6 text-white">
            <button
                onClick={() => navigate("/projects")}
                className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
                <ArrowLeft size={18} />
                Back to Projects
            </button>

            <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(41,98,255,0.18),_transparent_35%),_#020b2d] p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-4xl font-bold">{currentProject.name}</h1>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                                    currentProject.status
                                )}`}
                            >
                                {currentProject.status || "active"}
                            </span>
                        </div>

                        <p className="text-lg leading-8 text-white/75">
                            {currentProject.description || "No description provided."}
                        </p>

                        {currentProject.githubRepo && (
                            <a
                                href={currentProject.githubRepo}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <GitBranch size={18} />
                                Open GitHub Repository
                            </a>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setOpenEditModal(true)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-700"
                        >
                            <Pencil size={18} />
                            Edit
                        </button>

                        <button
                            onClick={() => setOpenInviteModal(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium transition hover:bg-white/10"
                        >
                            <UserPlus size={18} />
                            Invite Members
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-medium transition hover:bg-red-700 disabled:opacity-60"
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>


            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <Users size={22} className="text-blue-400" />
                        <h2 className="text-2xl font-semibold">Members</h2>
                    </div>

                    <div className="space-y-4">
                        {members.length > 0 ? (
                            members.map((member, index) => (
                                <div
                                    key={member.user?._id || member.user || index}
                                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#07133e] p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-semibold text-white">
                                            {getInitials(member.user?.name || "User")}
                                        </div>

                                        <div>
                                            <p className="font-medium text-white">
                                                {member.user?.name || "Project Member"}
                                            </p>
                                            <p className="text-sm text-white/50">
                                                {member.user?.email || "No email available"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleRemoveMember(member.user?._id || member.user)
                                        }
                                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/60">No members yet.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <ListTodo size={22} className="text-purple-400" />
                        <h2 className="text-2xl font-semibold">Assign Tasks</h2>
                    </div>

                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#07133e] p-6">
                        <p className="text-white/70">
                            Assign tasks to specific members from here.
                        </p>
                        <p className="mt-2 text-sm text-yellow-300/80">
                            {/* TODO: I will do it later */}
                            This feature will be added later.
                        </p>

                        <button
                            className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/80 transition hover:bg-white/10"
                            type="button"
                        >
                            Assign Task
                        </button>
                    </div>
                </div>
            </div>

            <EditProjectModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                project={currentProject}
            />

            <InviteMemberModal
                open={openInviteModal}
                onClose={() => setOpenInviteModal(false)}
                projectId={currentProject._id}
            />
        </div>
    );
};

export default ProjectDetailsPage;