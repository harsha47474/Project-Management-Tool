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
    Loader,
    Plus,
} from "lucide-react";
import TaskDetailModal from "../components/Tasks/TaskDetailModal";
import EditTaskModal from "../components/Tasks/EditTaskModal";
import ReassignMembersModal from "../components/Tasks/ReassignMembersModal";
import AssignTaskModal from "../components/Tasks/AssignTaskModal";
import { useTaskStore } from "../store/useTaskStore";
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

const getTaskStatusColor = (status = "todo") => {
    switch (status) {
        case "done":
            return "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20";
        case "in_progress":
            return "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20";
        default:
            return "bg-slate-500/15 text-slate-500 border border-slate-500/20";
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

    const {
        tasks,
        loading: tasksLoading,
        fetchProjectTasks,
        deleteTask,
        updateTaskStatus,
    } = useTaskStore();

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openInviteModal, setOpenInviteModal] = useState(false);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openTaskDrawer, setOpenTaskDrawer] = useState(false);
    const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
    const [openReassignModal, setOpenReassignModal] = useState(false);
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredTasks =
        statusFilter === "all"
            ? tasks
            : tasks.filter((task) => task.status === statusFilter);

    const visibleTasks = showAllTasks ? filteredTasks : filteredTasks.slice(0, 2);
    const hasMoreTasks = filteredTasks.length > 2;

    useEffect(() => {
        fetchProjectById(id);
        fetchProjectTasks(id);
    }, [id, fetchProjectById, fetchProjectTasks]);


    const members = useMemo(() => currentProject?.members || [], [currentProject]);
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
    };

    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        await deleteTask(id, taskId);
    };

    const handleTaskStatusChange = async (taskId, status) => {
        await updateTaskStatus(id, taskId, status);
    };

    const handleOpenTaskDrawer = (task) => {
        setSelectedTask(task);
        setOpenTaskDrawer(true);
    };

    const handleOpenEditTask = (task) => {
        setSelectedTask(task);
        setOpenEditTaskModal(true);
    };

    const handleOpenReassign = (task) => {
        setSelectedTask(task);
        setOpenReassignModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6 text-foreground">
                <div className="flex items-center justify-center h-screen">
                    <Loader className="size-10 animate-spin" />
                </div>
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="min-h-screen bg-background p-6 text-foreground">
                <div className="flex items-center justify-center h-screen">
                    <Loader className="size-10 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 text-foreground transition-colors duration-300">
            {openEditModal && (
                <div className="fixed inset-0 bg-background-900/40 backdrop-blur-sm z-40"></div>
            )}
            {openInviteModal && (
                <div className="fixed inset-0 bg-background-900/40 backdrop-blur-sm z-40"></div>
            )}
            {openTaskModal && (
                <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"></div>
            )}
            <button
                onClick={() => navigate("/projects")}
                className="mb-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
                <ArrowLeft size={18} />
                Back to Projects
            </button>

            <div className="rounded-xl border border-border bg-card shadow-lg p-6 sm:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold">{currentProject.name}</h1>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                                    currentProject.status
                                )}`}
                            >
                                {currentProject.status || "active"}
                            </span>
                        </div>

                        <p className="text-base leading-7 text-muted-foreground">
                            {currentProject.description || "No description provided."}
                        </p>

                        {currentProject.githubRepo && (
                            <a
                                href={currentProject.githubRepo}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground transition hover:bg-muted"
                            >
                                <GitBranch size={18} />
                                Open GitHub Repository
                            </a>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setOpenEditModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium transition hover:bg-blue-700"
                        >
                            <Pencil size={18} />
                            Edit
                        </button>

                        <button
                            onClick={() => setOpenInviteModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-5 py-3 text-foreground font-medium transition hover:bg-muted"
                        >
                            <UserPlus size={18} />
                            Invite Members
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white font-medium transition hover:bg-red-700 disabled:opacity-60"
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>


            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <Users size={22} className="text-blue-400" />
                        <h2 className="text-xl font-semibold">Members</h2>
                    </div>

                    <div className="space-y-4">
                        {members.length > 0 ? (
                            members.map((member, index) => (
                                <div
                                    key={member.user?._id || member.user || index}
                                    className="flex items-center justify-between rounded-xl border border-border bg-muted/50 p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-semibold text-white">
                                            {getInitials(member.user?.name || "User")}
                                        </div>

                                        <div>
                                            <p className="font-medium text-foreground">
                                                {member.user?.name || "Project Member"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {member.user?.email || "No email available"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleRemoveMember(member.user?._id || member.user)
                                        }
                                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-500 transition hover:bg-red-500/20"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground">No members yet.</p>
                        )}
                    </div>
                </div>


                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">

                        <div className="mb-4 flex items-center w-full justify-between gap-3">
                            <div className='flex item-center gap-3'>
                                <div className="flex items-center gap-3">
                                    <ListTodo size={22} className="text-purple-400" />
                                    <h2 className="text-xl font-semibold">Tasks</h2>
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        e.stopPropagation()
                                        setStatusFilter(e.target.value);
                                        setShowAllTasks(false);
                                    }}
                                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
                                >
                                    <option value="all">All</option>
                                    <option value="todo">Todo</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setOpenTaskModal(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            >
                                <Plus size={16} />
                                Assign Task
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {tasksLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader className="size-8 animate-spin" />
                            </div>
                        ) : tasks.length > 0 ? (
                            visibleTasks.map((task) => (
                                <div
                                    key={task._id}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setOpenTaskDrawer(true);
                                    }}
                                    className="cursor-pointer rounded-xl border border-border bg-muted/40 p-4 transition hover:bg-muted/70"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${getTaskStatusColor(
                                                        task.status
                                                    )}`}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-6 text-muted-foreground">
                                                {task.description || "No description provided."}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">
                                                    Priority: {task.priority || "medium"}
                                                </span>

                                                {task.dueDate ? (
                                                    <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="mt-4">
                                                <p className="mb-2 text-sm font-medium text-foreground">Assigned to</p>

                                                <div className="flex flex-wrap gap-2">
                                                    {task.assignees?.length > 0 ? (
                                                        task.assignees.map((user) => (
                                                            <span
                                                                key={user._id}
                                                                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground"
                                                            >
                                                                {user.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            No members assigned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <select
                                                value={task.status}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                                                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
                                            >
                                                <option value="todo">todo</option>
                                                <option value="in_progress">in progress</option>
                                                <option value="done">done</option>
                                            </select>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTask(task._id);
                                                }}
                                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-500 transition hover:bg-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-border bg-muted/50 p-6">
                                <p className="text-muted-foreground">
                                    No tasks yet. Create your first task and assign it to members.
                                </p>
                            </div>
                        )}
                        {hasMoreTasks && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setShowAllTasks((prev) => !prev)}
                                    className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                                >
                                    {showAllTasks ? "Show Less" : `More (${filteredTasks.length - 2} more)`}
                                </button>
                            </div>
                        )}
                    </div>


                    <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/50 p-4">
                        <p className="text-sm text-yellow-600 dark:text-yellow-500">
                            {/* TODO: Task editing and detailed assignment controls will be improved later */}
                            Task reassignment UI and advanced task management can be added later.
                        </p>
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

            <AssignTaskModal
                open={openTaskModal}
                onClose={() => setOpenTaskModal(false)}
                projectId={currentProject._id}
                members={members}
            />

            <TaskDetailModal
                open={openTaskDrawer}
                onClose={() => setOpenTaskDrawer(false)}
                task={selectedTask}
                onEdit={handleOpenEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleTaskStatusChange}
                onOpenReassign={handleOpenReassign}
            />

            <EditTaskModal
                open={openEditTaskModal}
                onClose={() => setOpenEditTaskModal(false)}
                projectId={currentProject._id}
                task={selectedTask}
            />

            <ReassignMembersModal
                open={openReassignModal}
                onClose={() => setOpenReassignModal(false)}
                projectId={currentProject._id}
                task={selectedTask}
                members={members}
            />
        </div>
    );
};

export default ProjectDetailsPage;