import React from "react";
import { X, Pencil, Trash2, Users, Loader } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";

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

const TaskDetailModal = ({
  open,
  onClose,
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenReassign,
}) => {
  const { actionLoading, activeTaskIds } = useTaskStore();
  if (!open || !task) return null;
  const isTaskBusy = activeTaskIds?.has(task._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{task.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getTaskStatusColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>

              <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground">
                Priority: {task.priority || "medium"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Description</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Due Date</p>
              <p className="text-sm text-muted-foreground">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Change Status</p>
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none"
              >
                <option value="todo">todo</option>
                <option value="in_progress">in progress</option>
                <option value="done">done</option>
              </select>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Assigned Members</p>
            <div className="flex flex-wrap gap-2">
              {task.assignees?.length > 0 ? (
                task.assignees.map((user) => (
                  <span
                    key={user._id}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground"
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

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onEdit(task)}
              disabled={isTaskBusy || actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Pencil size={16} />
              Edit Task
            </button>

            <button
              onClick={() => onOpenReassign(task)}
              disabled={isTaskBusy || actionLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Users size={16} />
              Reassign Members
            </button>

            <button
              onClick={() => onDelete(task._id)}
              disabled={isTaskBusy || actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isTaskBusy ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;