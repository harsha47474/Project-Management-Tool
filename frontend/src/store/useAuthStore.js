import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                verificationMethod: formData.verificationMethod,
            });

            toast.success("Verification code sent! Please check your email or phone.");
            return { success: true, data: res.data };
        } catch (err) {
            const message = err.res?.data?.message || "Registration failed.";
            toast.error(message);
            return { success: false, message };
        } finally {
            set({ isSigningUp: false });
        }
    },

    // useAuthStore.js
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({ authUser: res.data.user });
            toast.success("Logged in successfully!");
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Login failed.";
            toast.error(message);
            return { success: false, message };
        } finally {
            set({ isLoggingIn: false });
        }
    },

    verifyOtp: async (formData) => {
        try {
            const res = await axiosInstance.post("/auth/otp-verification", formData);
            set({ authUser: res.data.user });
            toast.success("OTP verified successfully!");
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "OTP verification failed.";
            toast.error(message);
            return { success: false, message };
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed.");
        }
    },
}));