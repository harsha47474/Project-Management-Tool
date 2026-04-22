import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProjectStore = create((set, get) => ({
    projects: [],
    currentProject: null,
    projectCount: 0,
    actionLoading: false,
    loading: false,

    setProjects: (projects) =>
        set({
            projects,
            projectCount: projects.length,
        }),

    setCurrentProject: (project) => set({ currentProject: project }),

    fetchProjects: async () => {
        set({ loading: true })
        try {
            const res = await axiosInstance.get("/projects/my-projects");
            set({
                projects: res.data.projects,
                projectCount: res.data.projects.length,
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch projects");
        } finally {
            set({ loading: false })
        }
    },

    fetchProjectById: async (projectId) => {
        set({ loading: true, currentProject: null });
        try {
            const res = await axiosInstance.get(`/projects/${projectId}`);
            set({ currentProject: res.data.project });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch project");
        } finally {
            set({ loading: false });
        }
    },

    createProject: async (formData) => {
        set({ actionLoading: true });
        try {
            const res = await axiosInstance.post("/projects/create", formData);

            set((state) => ({
                projects: [...state.projects, res.data.project],
                projectCount: state.projectCount + 1,
            }));

            toast.success("Project created successfully");
            return { success: true, project: res.data.project };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create project");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },

    updateProject: async (projectId, formData) => {
        set({ actionLoading: true });
        try {
            const res = await axiosInstance.put(`/projects/${projectId}`, formData);

            set((state) => ({
                projects: state.projects.map((p) =>
                    p._id === projectId ? res.data.project : p
                ),
                currentProject:
                    state.currentProject?._id === projectId
                        ? res.data.project
                        : state.currentProject,
            }));

            toast.success("Project updated successfully");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update project");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },
    
    acceptInvite: async (token) => {
        set({ actionLoading: true })
        try {
            const res = await axiosInstance.post(
                `/projects/accept-invite`,
                { token }
            )
            toast.success("Invitation accepted successfully")
            return { success: true }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept invitation")
            return { success: false }
        } finally {
            set({ actionLoading: false })
        }
    },

  deleteProject: async (projectId) => {
        set({ actionLoading: true });
        try {
            await axiosInstance.delete(`/projects/${projectId}`);

            set((state) => ({
                projects: state.projects.filter((p) => p._id !== projectId),
                projectCount: Math.max(0, state.projectCount - 1),
                currentProject:
                    state.currentProject?._id === projectId ? null : state.currentProject,
            }));

            toast.success("Project deleted successfully");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete project");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },

    inviteMember: async (projectId, email) => {
        set({ actionLoading: true });
        try {
            await axiosInstance.post(`/projects/${projectId}/invite`, { email });
            toast.success("Invitation sent successfully");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send invitation");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },

    removeMember: async (projectId, memberId) => {
        set({ actionLoading: true });
        try {
            const res = await axiosInstance.post(
                `/projects/${projectId}/remove-member/${memberId}`
            );

            set((state) => ({
                currentProject:
                    state.currentProject?._id === projectId
                        ? res.data.project
                        : state.currentProject,
                projects: state.projects.map((p) =>
                    p._id === projectId ? res.data.project : p
                ),
            }));

            toast.success("Member removed successfully");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove member");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },
}));