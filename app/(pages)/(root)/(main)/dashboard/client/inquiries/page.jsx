"use client";

import { Clock, Eye, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ClientInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSendForm, setShowSendForm] = useState(false);
  const [properties, setProperties] = useState([]);

  const [formData, setFormData] = useState({
    property: "",
    message: "",
  });

  useEffect(() => {
    fetchInquiries();
    fetchProperties();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/inquiries");
      const result = await response.json();
      if (result.success) {
        setInquiries(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      const result = await response.json();
      if (result.success) {
        setProperties(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/client/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Inquiry sent successfully!");
        setShowSendForm(false);
        resetForm();
        fetchInquiries();
      } else {
        toast.error(result.message || "Failed to send inquiry");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending inquiry");
    }
  };

  const resetForm = () => {
    setFormData({
      property: "",
      message: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "replied":
        return "bg-green-50 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Inquiries</h2>
          <p className="text-sm text-slate-500">Track your property inquiries</p>
        </div>
        <button
          onClick={() => setShowSendForm(true)}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
        >
          <Send className="h-4 w-4" />
          Send Inquiry
        </button>
      </div>

      {/* Send Inquiry Modal */}
      {showSendForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Send Property Inquiry</h3>
              <button
                onClick={() => {
                  setShowSendForm(false);
                  resetForm();
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Select Property *
                </label>
                <select
                  required
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">Choose a property</option>
                  {properties.map((prop) => (
                    <option key={prop._id} value={prop._id}>
                      {prop.title} - {prop.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="I'm interested in this property. Could you provide more information about..."
                />
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSendForm(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MessageSquare className="h-12 w-12 text-slate-300" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">No inquiries yet</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Send an inquiry to connect with property agents!
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSendForm(true)}
                        className="mt-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition"
                      >
                        Send Your First Inquiry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => {
                  const property = inquiry.property;
                  if (!property) return null;

                  return (
                    <tr key={inquiry._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            <img
                              src={property.mainImage || property.images?.[0] || "/images/pr.png"}
                              alt={property.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/pr.png";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">{property.title}</p>
                            <p className="truncate text-xs text-slate-500">{property.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                          {inquiry.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${property._id}`}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                            title="View Property"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
