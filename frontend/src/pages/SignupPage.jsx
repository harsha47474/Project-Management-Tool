import React, { useState } from "react";
import {
  Mail,
  Lock,
  Phone,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const { signup, checkAuth, verifyOtp } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Strip everything except digits and leading +
    let formattedPhone = phone.trim().replace(/[\s\-()]/g, "");

    // Remove any existing country code variations before adding +91
    if (formattedPhone.startsWith("+91")) {
      // already correct, leave it
    } else if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
      formattedPhone = "+" + formattedPhone;
    } else if (formattedPhone.length === 10) {
      formattedPhone = "+91" + formattedPhone;
    }
    // else: leave as-is and let backend reject it with a clear error
    console.log("Sending phone:", formattedPhone);
    console.log("Regex test:", /^\+91[6-9]\d{9}$/.test(formattedPhone));
    const res = await signup({
      name,
      email,
      phone: formattedPhone,
      password,
      verificationMethod,
    });

    setLoading(false);
    if (res?.success) {
      setStep(2);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await verifyOtp({
      email,
      phone,
      otp
    })
    setLoading(false);
    if (res?.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg p-6 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-400/20">
            {step === 1 ? (
              <User className="h-6 w-6 text-indigo-400" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            )}
          </div>

          <h1 className="text-xl font-bold">
            {step === 1 ? "Create your account" : "Verify OTP"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {step === 1
              ? "Sign up to continue to your account"
              : `Enter the OTP sent to your ${verificationMethod === "email" ? "email" : "phone"
              }`}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-3">
          <div
            className={`h-2 w-20 rounded-full ${step >= 1 ? "bg-indigo-500" : "bg-muted"
              }`}
          />
          <div
            className={`h-2 w-20 rounded-full ${step >= 2 ? "bg-indigo-500" : "bg-muted"
              }`}
          />
        </div>

        {step === 1 ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Phone
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="Enter your phone"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Verification Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVerificationMethod("email")}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${verificationMethod === "email"
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-border bg-muted/50 text-foreground"
                    }`}
                >
                  Verify by Email
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationMethod("phone")}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${verificationMethod === "phone"
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                    : "border-border bg-muted/50 text-foreground"
                    }`}
                >
                  Verify by Phone
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm text-indigo-200">
              OTP has been sent to your{" "}
              <span className="font-semibold">
                {verificationMethod === "email" ? email : phone}
              </span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Enter OTP
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <input
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter OTP"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showOtp ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-400 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}