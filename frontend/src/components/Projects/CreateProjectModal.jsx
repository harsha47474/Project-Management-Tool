import React, { useState } from "react";
import { useProjectStore } from "../../store/useProjectStore.js"
import { X } from "lucide-react";

const CreateProjectModal = ({ open, onClose }) => {
  const { createProject, actionLoading } = useProjectStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    githubRepo: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await createProject(formData);
    if (result.success) {
      setFormData({
        name: "",
        description: "",
        status: "active",
        githubRepo: "",
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl rounded-xl border bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create Project</h2>
            <p className="mt-1 text-sm text-foreground/60">
              Enter project details to create a new workspace.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-foreground transition hover:text-foreground/60 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-foreground/70">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-border/10 bg-background px-4 py-3 text-foreground outline-none focus:border-background-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-foreground/70">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Write something about this project"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-border/10 bg-background px-4 py-3 text-foreground outline-none focus:border-background-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-foreground/70">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-border/10 bg-background px-4 py-3 text-foreground outline-none focus:border-background-500"
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="completed">completed</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-foreground/70">
                GitHub Repo
              </label>
              <input
                type="text"
                name="githubRepo"
                placeholder="https://github.com/..."
                value={formData.githubRepo}
                onChange={handleChange}
                className="w-full rounded-xl border border-border/10 bg-background px-4 py-3 text-foreground outline-none focus:border-background-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-3 text-foreground/80 transition hover:bg-border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-background-700 disabled:opacity-60"
            >
              {actionLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;