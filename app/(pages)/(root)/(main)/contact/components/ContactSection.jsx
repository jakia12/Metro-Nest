// app/components/ContactSection.jsx
"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.subject
            ? `Subject: ${formData.subject}\n\n${formData.message}`
            : formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Message sent successfully!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error sending message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full bg-[#f7f2f0] py-10 md:py-14">
      <div className="mx-auto max-w-6xl rounded-3xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT SIDE — EXACT FORM WITH LABELS */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Do you have questions? Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-sm">
              {/* Name + Phone */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-slate-700 font-medium">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-slate-700 font-medium">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/30"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-slate-700 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/30"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-slate-700 font-medium">
                  Select Subject
                </label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/30"
                  >
                    <option value="">Select Subject</option>
                    <option value="buy">Buying a Property</option>
                    <option value="sell">Selling a Property</option>
                    <option value="rent">Renting / Leasing</option>
                    <option value="invest">Investment Advice</option>
                    <option value="other">Other</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-slate-700 font-medium">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="h-40 resize-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/30"
                />
              </div>

              {/* Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-[#ff4b4b] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f33f3f] disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT – IMAGE */}
          <div className="relative  overflow-hidden rounded-3xl bg-black  h-full">
            <Image
              src="/images/contact.jpg" // put your image here
              alt="Agent standing in front of modern building"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
