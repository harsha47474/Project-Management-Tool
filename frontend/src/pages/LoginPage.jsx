import React, { useState } from "react";
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
 
export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
  const { login, authUser } = useAuthStore();
  console.log(authUser);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    let formattedPhone = phone.trim().replace(/[\s\-()]/g, "");
    if (loginMethod === "phone") {
      if (formattedPhone.startsWith("+91")) {
        // already correct
      } else if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
        formattedPhone = "+" + formattedPhone;
      } else if (formattedPhone.length === 10) {
        formattedPhone = "+91" + formattedPhone;
      }
    }
 
    const res = await login({
      email: loginMethod === "email" ? email : undefined,
      phone: loginMethod === "phone" ? formattedPhone : undefined,
      password,
    });
 
    setLoading(false);
 
    if (res?.success) {
      navigate("/");
    }
  };
 
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
 
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-400/20">
            <LogIn className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to your account
          </p>
        </div>
 
        <form onSubmit={handleLogin} className="space-y-4">
 
          {/* Login Method Toggle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Login with
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  loginMethod === "email"
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-white/10 bg-slate-900/70 text-slate-300"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  loginMethod === "phone"
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-white/10 bg-slate-900/70 text-slate-300"
                }`}
              >
                Phone
              </button>
            </div>
          </div>
 
          {/* Email or Phone Input */}
          {loginMethod === "email" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Phone
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
 
          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3">
              <Lock className="h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
 
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign in
              </>
            )}
          </button>
 
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-indigo-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}