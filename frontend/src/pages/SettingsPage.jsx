import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  Pencil,
  Check,
  X,
  Camera,
  Loader2,
  FolderKanban,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20";

const cardClass =
  "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3">
      <div className="mt-0.5 text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-white">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { authUser, checkAuth } = useAuthStore();
  const { fetchProjects, projects, projectCount } = useProjectStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      });
    }
  }, [authUser]);

  useEffect(() => {
    fetchProjects()
  }, []);

  const initials = useMemo(() => {
    if (!authUser?.name) return "U";
    return authUser.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [authUser]);

  const joinedDate = useMemo(() => {
    if (!authUser?.createdAt) return "Not available";
    return new Date(authUser.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: authUser?.phone || "",
    });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await axiosInstance.put("/auth/update-profile", formData);
      await checkAuth();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("avatar", file);

    setIsUploading(true);
    try {
      await axiosInstance.put("/auth/update-avatar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await checkAuth();
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className={`${cardClass} flex min-h-[300px] items-center justify-center p-8`}>
            <div className="flex items-center gap-3 text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className={`${cardClass} overflow-hidden`}>
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />
          <div className="px-6 pb-6">
            <div className="-mt-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  {authUser.avatar?.url ? (
                    <img
                      src={authUser.avatar.url}
                      alt={authUser.name}
                      className="h-28 w-28 rounded-3xl border-4 border-slate-950 object-cover shadow-2xl"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-slate-950 bg-slate-800 text-3xl font-bold shadow-2xl">
                      {initials}
                    </div>
                  )}

                  <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{authUser.name}</h1>
                  <p className="mt-1 text-slate-300">{authUser.email}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-400">
                      {authUser.isVerified ? "Verified Account" : "Not Verified"}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                      {projectCount} Project{projectCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      form="profile-edit-form"
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className={`${cardClass} p-6`}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="mt-1 text-sm text-slate-400">Manage your personal account details.</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow icon={User} label="Full Name" value={authUser.name} />
                <InfoRow icon={Mail} label="Email Address" value={authUser.email} />
                <InfoRow icon={Phone} label="Phone Number" value={authUser.phone} />
                <InfoRow icon={CalendarDays} label="Joined On" value={joinedDate} />
              </div>
            ) : (
              <form id="profile-edit-form" onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className={`${cardClass} p-6`}>
              <h2 className="text-xl font-semibold">Account Overview</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm text-slate-300">Verification Status</span>
                  </div>
                  <span className={`text-sm font-medium ${authUser.isVerified ? "text-emerald-400" : "text-yellow-400"}`}>
                    {authUser.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <FolderKanban className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm text-slate-300">Projects Joined</span>
                  </div>
                  <span className="text-sm font-medium text-white">{projectCount}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/40 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm text-slate-300">Member Since</span>
                  </div>
                  <span className="text-sm font-medium text-white">{joinedDate}</span>
                </div>
              </div>
            </div>

            <div className={`${cardClass} p-6`}>
              <h2 className="text-xl font-semibold">Quick Notes</h2>
              <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm text-indigo-200">
                This page expects backend routes like <code>/auth/update-profile</code> and <code>/auth/update-avatar</code>. If you have different routes, just replace those two API endpoints in this file.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
