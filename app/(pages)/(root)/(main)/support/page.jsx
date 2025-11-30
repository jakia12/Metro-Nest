"use client";

import { AlertCircle, CheckCircle, Clock, Headphones, Send, Upload } from "lucide-react";
import { useState } from "react";

export default function TicketSupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "medium",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "medium",
        description: "",
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0b2845] to-[#1a4d7a] text-white py-16">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex items-center gap-3 mb-4">
            <Headphones className="h-10 w-10 text-rose-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Ticket Support</h1>
          </div>
          <p className="text-lg text-slate-200 max-w-3xl">
            Submit a support ticket and our team will get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Support Ticket</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Ticket Submitted!</h3>
                  <p className="text-slate-600 mb-4">
                    We've received your support ticket and will respond within 24 hours.
                  </p>
                  <p className="text-sm text-slate-500">
                    A confirmation email has been sent to your email address.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition bg-white"
                      >
                        <option value="">Select a category</option>
                        <option value="account">Account Issues</option>
                        <option value="listing">Property Listings</option>
                        <option value="payment">Payment & Billing</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition bg-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition resize-none"
                      placeholder="Please provide detailed information about your issue..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-rose-500 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    <Send className="h-5 w-5" />
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Response Time */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">Response Time</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Low Priority:</span>
                    <span className="font-semibold text-slate-900">48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Medium Priority:</span>
                    <span className="font-semibold text-slate-900">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">High Priority:</span>
                    <span className="font-semibold text-slate-900">12 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Urgent:</span>
                    <span className="font-semibold text-slate-900">4 hours</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">Tips for Faster Resolution</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Provide detailed information about your issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Include screenshots if applicable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Mention any error messages you received</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Select the correct category and priority</span>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-[#0b2845] to-[#1a4d7a] rounded-2xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-4">Other Ways to Reach Us</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-300 mb-1">Email:</p>
                    <p className="font-medium">support@metronest.com</p>
                  </div>
                  <div>
                    <p className="text-slate-300 mb-1">Phone:</p>
                    <p className="font-medium">+00 (123) 456 789 012</p>
                  </div>
                  <div>
                    <p className="text-slate-300 mb-1">Hours:</p>
                    <p className="font-medium">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
