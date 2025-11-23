"use client";

import {
  Award,
  Briefcase,
  Building,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // false = hidden by default

  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Agent fields
    licenseNumber: "",
    agency: "",
    experience: "",
    specialization: [],
    bio: "",
    website: "",

    // Client fields
    preferredLocations: [],
    minBudget: "",
    maxBudget: "",
    lookingFor: "both",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSpecializationToggle = (spec) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter((s) => s !== spec)
        : [...prev.specialization, spec],
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        phone: formData.phone,
      };

      if (role === "agent") {
        payload.agentProfile = {
          licenseNumber: formData.licenseNumber,
          agency: formData.agency,
          experience: parseInt(formData.experience) || 0,
          specialization: formData.specialization,
          bio: formData.bio,
          website: formData.website,
        };
      } else if (role === "client") {
        payload.clientProfile = {
          preferredLocations: formData.preferredLocations,
          budgetRange: {
            min: parseInt(formData.minBudget) || 0,
            max: parseInt(formData.maxBudget) || 0,
          },
          lookingFor: formData.lookingFor,
        };
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff5a6a] to-[#ff7a85] p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-white/90">Join our real estate platform today</p>
        </div>

        <div className="p-8">
          {/* Role Selection */}
          {step === 1 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`p-4 rounded-xl border-2 transition ${
                    role === "client"
                      ? "border-[#ff5a6a] bg-[#ff5a6a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <User
                    className={`h-8 w-8 mx-auto mb-2 ${
                      role === "client" ? "text-[#ff5a6a]" : "text-gray-400"
                    }`}
                  />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Client</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Browse & buy properties
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("agent")}
                  className={`p-4 rounded-xl border-2 transition ${
                    role === "agent"
                      ? "border-[#ff5a6a] bg-[#ff5a6a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Briefcase
                    className={`h-8 w-8 mx-auto mb-2 ${
                      role === "agent" ? "text-[#ff5a6a]" : "text-gray-400"
                    }`}
                  />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Agent</div>
                    <div className="text-xs text-gray-500 mt-1">
                      List & sell properties
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1
                    ? "bg-[#ff5a6a] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 mx-2 ${
                  step >= 2 ? "bg-[#ff5a6a]" : "bg-gray-200"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2
                    ? "bg-[#ff5a6a] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {/* 👇 closed eye by default, open eye when showing */}
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {/* 👇 same behavior here */}
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-[#ff5a6a] text-white py-3 rounded-lg font-semibold hover:bg-[#f14555] transition mt-6"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Agent Info */}
          {step === 2 && role === "agent" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Agent Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                  placeholder="ABC123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency/Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.agency}
                    onChange={(e) =>
                      handleInputChange("agency", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                    placeholder="Real Estate Co."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                    placeholder="5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Residential", "Commercial", "Luxury", "Rental"].map(
                    (spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() =>
                          handleSpecializationToggle(spec.toLowerCase())
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          formData.specialization.includes(
                            spec.toLowerCase()
                          )
                            ? "bg-[#ff5a6a] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {spec}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) =>
                    handleInputChange("bio", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#ff5a6a] text-white py-3 rounded-lg font-semibold hover:bg-[#f14555] transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Client Info */}
          {step === 2 && role === "client" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Preferences
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I'm looking to:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "buy", label: "Buy" },
                    { value: "rent", label: "Rent" },
                    { value: "both", label: "Both" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleInputChange("lookingFor", value)
                      }
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition ${
                        formData.lookingFor === value
                          ? "bg-[#ff5a6a] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.minBudget}
                      onChange={(e) =>
                        handleInputChange("minBudget", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                      placeholder="100000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.maxBudget}
                      onChange={(e) =>
                        handleInputChange("maxBudget", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#ff5a6a]/20 focus:border-[#ff5a6a] outline-none"
                      placeholder="500000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-[#ff5a6a] text-white py-3 rounded-lg font-semibold hover:bg-[#f14555] transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#ff5a6a] font-semibold hover:underline"
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
