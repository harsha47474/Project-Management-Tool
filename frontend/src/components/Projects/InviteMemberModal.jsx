import React, { useState } from "react";
import { X, Mail } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore.js";

const InviteMemberModal = ({ open, onClose, projectId }) => {
  const { inviteMember, actionLoading } = useProjectStore();
  const [email, setEmail] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await inviteMember(projectId, email);
    if (result.success) {
      setEmail("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 px-4">
      <div className="w-full max-w-lg rounded-xl border border-border/10 bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Invite Member</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Send a project invitation by email.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-foreground/70 transition hover:bg-background/10 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border/10 bg-background px-4 py-3 text-foreground outline-none focus:border-background-500/30 focus:border-background-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border/10 bg-background px-4 py-3 text-foreground outline-none focus:border-background-500/30 focus:border-background-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-background-700 disabled:opacity-60"
            >
              {actionLoading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;