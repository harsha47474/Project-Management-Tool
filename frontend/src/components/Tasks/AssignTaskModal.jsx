import React, { useMemo, useState } from "react";
import { X, Loader, CheckCircle2 } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";

const AssignTaskModal = ({ open, onClose, projectId, members = [] }) => {
  const { createTask, actionLoading } = useTaskStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignees: [],
  });

  const availableMembers = useMemo(() => {
    return members.filter((member) => member.user);
  }, [members]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAssignee = (memberId) => {
    setFormData((prev) => {
      const exists = prev.assignees.includes(memberId);
      return {
        ...prev,
        assignees: exists
          ? prev.assignees.filter((id) => id !== memberId)
          : [...prev.assignees, memberId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      assignees: formData.assignees,
    };
    const result = await createTask(projectId, payload);
    if (result.success) {
      setFormData({ title: "", description: "", priority: "medium", dueDate: "", assignees: [] });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Create Task</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and assign a task to project members
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-foreground">
              Assign Members
            </label>

            <div className="max-h-56 space-y-3 overflow-y-auto rounded-xl border border-border bg-muted/30 p-3">
              {availableMembers.length > 0 ? (
                availableMembers.map((member) => {
                  const memberId = member.user?._id || member.user;
                  const checked = formData.assignees.includes(memberId);

                  return (
                    <button
                      type="button"
                      key={memberId}
                      onClick={() => toggleAssignee(memberId)} disabled={actionLoading}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                        checked
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {member.user?.name || "Project Member"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.user?.email || "No email available"}
                        </p>
                      </div>

                      {checked && <CheckCircle2 size={18} className="text-primary" />}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No members found.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-3 text-foreground transition hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {actionLoading ? <Loader className="size-4 animate-spin" /> : null}
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;