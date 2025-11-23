"use client";

import {
    AlertCircle,
    CheckCircle,
    Clock,
    Edit,
    Home,
    Mail,
    MessageSquare,
    Phone,
    Search,
    Trash2,
    User,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInquiries: 0,
  });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [filters, pagination.currentPage]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: "20",
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/inquiries?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setInquiries(data.data);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInquiry = async (inquiryId, updates) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Inquiry updated successfully");
        fetchInquiries();
        setShowEditModal(false);
        setSelectedInquiry(null);
      } else {
        toast.error(data.message || "Failed to update inquiry");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast.error("Error updating inquiry");
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Inquiry deleted successfully");
        fetchInquiries();
      } else {
        toast.error(data.message || "Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Error deleting inquiry");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "replied":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "replied":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-indigo-600" />
            Inquiries Management
          </h1>
          <p className="text-gray-600">
            Monitor and respond to all property inquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.pending || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Pending Inquiries</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.replied || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Replied</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-gray-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.closed || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Closed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {inquiry.property ? (
                          <div className="flex items-center gap-3">
                            {inquiry.property.mainImage && (
                              <img
                                src={inquiry.property.mainImage}
                                alt={inquiry.property.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {inquiry.property.title}
                              </p>
                              {inquiry.property.price && (
                                <p className="text-xs text-gray-500">
                                  ${inquiry.property.price.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            Property deleted
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {inquiry.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {inquiry.email}
                            </span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {inquiry.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {inquiry.agent ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {inquiry.agent.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                          {inquiry.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(inquiry.status)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              inquiry.status
                            )}`}
                          >
                            {inquiry.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(inquiry._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing page {pagination.currentPage} of{" "}
                {pagination.totalPages} ({pagination.totalInquiries} total
                inquiries)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage - 1,
                    })
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage + 1,
                    })
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Manage Inquiry
              </h2>
            </div>
            <div className="p-6">
              {/* Inquiry Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-black">{selectedInquiry.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-black">{selectedInquiry.email}</span>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-black">{selectedInquiry.phone}</span>
                  </div>
                )}
                {selectedInquiry.property && (
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span className="text-black">{selectedInquiry.property.title}</span>
                  </div>
                )}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Message:</p>
                  <p className="text-sm text-black">{selectedInquiry.message}</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateInquiry(selectedInquiry._id, {
                    status: formData.get("status"),
                    agentResponse: formData.get("agentResponse"),
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedInquiry.status}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Response
                    </label>
                    <textarea
                      name="agentResponse"
                      defaultValue={selectedInquiry.agentResponse || ""}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                      placeholder="Add your response to this inquiry..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedInquiry(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
