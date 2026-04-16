import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useTaskStore = create((set, get) => ({
    tasks: [],
    currentTask: null,
    loading: false,
    actionLoading: false,

    fetchProjectTasks: async (projectId) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get(`/projects/${projectId}/tasks`);
            set({ tasks: res.data.tasks || [] });
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch tasks");
            return { success: false };
        } finally {
            set({ loading: false });
        }
    },

    createTask: async (projectId, formData) => {
        set({ actionLoading: true });
        try {
            const res = await axiosInstance.post(`/projects/${projectId}/tasks/create`, formData);

            set((state) => ({
                tasks: [res.data.task, ...state.tasks],
            }));

            toast.success(res.data.message || "Task created successfully");
            return { success: true, task: res.data.task };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create task");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },

    updateTask: async (projectId, taskId, formData) => {
        set({ actionLoading: true });
        try {
            const res = await axiosInstance.put(
                `/projects/${projectId}/tasks/${taskId}`,
                formData
            );

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? res.data.task : task
                ),
                currentTask:
                    state.currentTask?._id === taskId ? res.data.task : state.currentTask,
            }));

            toast.success(res.data.message || "Task updated successfully");
            return { success: true, task: res.data.task };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update task");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },

    deleteTask: async (projectId, taskId) => {
        set({ actionLoading: true });
        try {
            const res = await axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`);

            set((state) => ({
                tasks: state.tasks.filter((task) => task._id !== taskId),
                currentTask: state.currentTask?._id === taskId ? null : state.currentTask,
            }));

            toast.success(res.data.message || "Task deleted successfully");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete task");
            return { success: false };
        } finally {
            set({ actionLoading: false });
        }
    },

    updateTaskStatus: async (projectId, taskId, status) => {
        try {
            const res = await axiosInstance.patch(
                `/projects/${projectId}/tasks/${taskId}/status`,
                { status }
            );

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? res.data.task : task
                ),
            }));

            toast.success(res.data.message || "Task status updated");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
            return { success: false };
        }
    },

    assignTaskMembers: async (projectId, taskId, assignees) => {
        try {
            const res = await axiosInstance.patch(
                `/projects/${projectId}/tasks/${taskId}/assign`,
                { assignees }
            );

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? res.data.task : task
                ),
            }));

            toast.success(res.data.message || "Task members assigned");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign members");
            return { success: false };
        }
    },

    unassignTaskMember: async (projectId, taskId, memberId) => {
        try {
            const res = await axiosInstance.patch(
                `/projects/${projectId}/tasks/${taskId}/unassign/${memberId}`
            );

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? res.data.task : task
                ),
            }));

            toast.success(res.data.message || "Member unassigned");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unassign member");
            return { success: false };
        }
    },
}));