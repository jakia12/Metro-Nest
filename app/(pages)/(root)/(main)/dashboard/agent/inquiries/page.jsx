"use client";

import { CheckCircle, Mail, MessageSquare, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AgentInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agent/inquiries");
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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/agent/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Inquiry marked as ${newStatus}`);
        fetchInquiries();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await fetch(`/api/agent/inquiries/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Inquiry deleted successfully");
        fetchInquiries();
      } else {
        toast.error(result.message || "Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting inquiry");
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    setSending(true);
    try {
      const response = await fetch(`/api/agent/inquiries/${selectedInquiry._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: responseMessage }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Reply sent successfully");
        setSelectedInquiry(null);
        setResponseMessage("");
        fetchInquiries();
      } else {
        toast.error(result.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending reply");
    } finally {
      setSending(false);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus = filterStatus === "all" || inquiry.status === filterStatus;
    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.property?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "replied":
        return "bg-green-50 text-green-700 border-green-100";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Inquiries</h2>
          <p className="text-sm text-slate-500">Manage leads and property inquiries</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Reply to {selectedInquiry.name}</h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900 mb-1">Inquiry for: {selectedInquiry.property?.title}</p>
              <p>"{selectedInquiry.message}"</p>
            </div>

            <form onSubmit={handleReply}>
              <textarea
                required
                rows={5}
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="mb-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MessageSquare className="h-12 w-12 text-slate-300" />
                      <p className="text-sm font-medium text-slate-900">No inquiries found</p>
                      <p className="text-xs text-slate-500">Wait for potential buyers to contact you.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-medium text-xs">
                          {inquiry.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{inquiry.name}</p>
                          <p className="text-xs text-slate-500">{inquiry.email}</p>
                          <p className="text-xs text-slate-500">{inquiry.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.property ? (
                        <Link href={`/properties/${inquiry.property._id}`} className="group flex items-center gap-3">
                          <div className="h-10 w-14 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                            <img 
                              src={inquiry.property.mainImage || "/images/placeholder.jpg"} 
                              alt="" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-[150px]">
                            <p className="truncate text-sm font-medium text-slate-900 group-hover:text-rose-500 transition-colors">
                              {inquiry.property.title}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {inquiry.property.price?.toLocaleString()} BDT
                            </p>
                          </div>
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Property deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-600 line-clamp-2" title={inquiry.message}>
                          {inquiry.message}
                        </p>
                        {inquiry.agentResponse && (
                          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Replied
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="rounded-full p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Reply"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        {inquiry.status !== "closed" && (
                          <button
                            onClick={() => handleStatusUpdate(inquiry._id, "closed")}
                            className="rounded-full p-2 text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                            title="Mark as Closed"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(inquiry._id)}
                          className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
