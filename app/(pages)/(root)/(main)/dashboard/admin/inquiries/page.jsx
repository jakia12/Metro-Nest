"use client";

import { MessageSquare, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/inquiries");
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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
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

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus = filterStatus === "all" || inquiry.status === filterStatus;
    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.agent?.name?.toLowerCase().includes(searchQuery.toLowerCase());
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Inquiries Management</h2>
          <p className="text-sm text-slate-500">Monitor all property inquiries</p>
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
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
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {inquiry.property ? (
                        <Link href={`/properties/${inquiry.property._id}`} className="flex items-center gap-3 group">
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
                          </div>
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Property deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{inquiry.name}</p>
                        <p className="text-xs text-slate-500">{inquiry.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.agent ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                            {inquiry.agent.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm text-slate-700">{inquiry.agent.name}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-slate-600 line-clamp-2" title={inquiry.message}>
                          {inquiry.message}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
