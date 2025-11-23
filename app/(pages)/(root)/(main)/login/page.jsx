"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#f5f5f5] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
      >
        {/* Heading */}
        <h1 className="text-xl font-semibold text-slate-900">
          Log in to your account
        </h1>

        {/* Error message */}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Email */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail className="h-4 w-4 text-rose-500" />
            Email Address
          </label>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#f05454] focus:ring-2 focus:ring-[#f05454]/20 text-black"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password (with eye toggle) */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Lock className="h-4 w-4 text-rose-500" />
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-[#f05454] focus:ring-2 focus:ring-[#f05454]/20 text-black"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {/* closed eye by default */}
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember / forgot row */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-slate-300 text-[#f05454] focus:ring-[#f05454]"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="text-xs font-medium text-[#f05454] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-[#f05454] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e34747] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {/* Bottom text */}
        <p className="pt-1 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#f05454]">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
