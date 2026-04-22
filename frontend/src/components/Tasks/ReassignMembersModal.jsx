import React, { useEffect, useState } from "react";
import { X, CheckCircle2, Loader } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";

const ReassignMembersModal = ({ open, onClose, projectId, task, members = [] }) => {
  const { assignTaskMembers } = useTaskStore();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task?.assignees) {
      setSelectedMembers(task.assignees.map((user) => user._id));
    }
  }, [task]);

  if (!open || !task) return null;

  const toggleAssignee = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await assignTaskMembers(projectId, task._id, selectedMembers);
    if (result.success) {
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Reassign Members</h2>
            <p className="mt-1 text-sm text-muted-foreground">{task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} disabled={loading}>
          <div className="max-h-72 space-y-3 overflow-y-auto rounded-xl border border-border bg-muted/30 p-3">
            {members.map((member) => {
              const memberId = member.user?._id || member.user;
              const checked = selectedMembers.includes(memberId);

              return (
                <button
                  type="button"
                  key={memberId}
                  onClick={() => toggleAssignee(memberId)}
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
            })}
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-3 text-foreground transition hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-primary-foreground transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size={14} className="animate-spin" /> : null}
              Save Assignees
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReassignMembersModal;