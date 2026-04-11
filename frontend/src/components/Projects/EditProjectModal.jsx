import React, { useEffect, useState } from "react";
import { useProjectStore } from "../../store/useProjectStore.js";
import { X } from "lucide-react";

const EditProjectModal = ({ open, onClose, project }) => {
  const { updateProject, actionLoading } = useProjectStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    githubRepo: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "active",
        githubRepo: project.githubRepo || "",
      });
    }
  }, [project]);

  if (!open || !project) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProject(project._id, formData);
    if (result.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111936] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Project</h2>
            <p className="mt-1 text-sm text-white/60">
              Update project details here.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-[#0b122b] px-4 py-3 text-white outline-none focus:border-blue-500"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-[#0b122b] px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#0b122b] px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="active">active</option>
              <option value="paused">paused</option>
              <option value="completed">completed</option>
            </select>

            <input
              type="text"
              name="githubRepo"
              value={formData.githubRepo}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[#0b122b] px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="GitHub Repo"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-3 text-white/80 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;