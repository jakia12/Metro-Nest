"use client";

import { CheckCircle, Lock, Mail, Phone, User } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const passwordsMatch =
    form.password.length > 0 &&
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!form.agree) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      // Register request
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("REGISTER RESPONSE:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      // Auto-login
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });

      console.log(loginRes)

      if (loginRes?.error) {
        setError("Account created but login failed. Try logging in manually.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("REGISTER FORM ERROR:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-6">
      <div className="w-full max-w-[550px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* FORM */}
        <div className="p-10">
          <h2 className="text-xl font-semibold text-[#203A4C] mb-6">
            Create Your Account
          </h2>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4 text-rose-500" />
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="border rounded-lg px-3 py-2 w-full text-black"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4 text-rose-500" />
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border rounded-lg px-3 py-2 w-full text-black"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4 text-rose-500" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="border rounded-lg px-3 py-2 w-full text-black"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Phone className="h-4 w-4 text-rose-500" />
                Phone Number (optional)
              </label>
              <input
                type="text"
                placeholder="Phone Number (optional)"
                className="border rounded-lg px-3 py-2 w-full text-black"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock className="h-4 w-4 text-rose-500" />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded-lg px-3 py-2 w-full text-black"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle className="h-4 w-4 text-rose-500" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`text-black border rounded-lg px-3 py-2 w-full ${
                    submitted && !passwordsMatch && "border-red-500"
                  }`}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />

                {submitted && !passwordsMatch && (
                  <p className="text-xs text-red-500 absolute -bottom-5">
                    Passwords do not match.
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-center gap-2 text-sm mt-2 text-black">
              <input
                type="checkbox"
                checked={form.agree}
                className="text-black"
                onChange={(e) =>
                  setForm({ ...form, agree: e.target.checked })
                }
              />
              I agree to the{" "}
              <Link href="#" className="text-[#f05454] underline">
                Terms & Conditions
              </Link>
            </label>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="bg-[#f05454] w-full py-2 text-white font-semibold rounded-lg mt-4 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            {/* Login Link */}
            <p className="text-sm text-center mt-3 text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#f05454] font-medium underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
