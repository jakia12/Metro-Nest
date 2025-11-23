"use client";

import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Mail,
    Phone,
    Search,
    Trash2,
    TrendingUp,
    Users,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    source: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [filters, pagination.currentPage]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: "20",
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.source && { source: filters.source }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/leads?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setLeads(data.data);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLead = async (leadId, updates) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        fetchLeads();
        setShowEditModal(false);
        setSelectedLead(null);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "In Follow-up":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Hot":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "Tour Booked":
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case "Closed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Lost":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-indigo-600" />
            Leads & CRM
          </h1>
          <p className="text-gray-600">
            Manage and track all your property leads
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(stats).map(([status, count]) => (
            <div
              key={status}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                {getStatusIcon(status)}
                <span className="text-2xl font-bold text-gray-900">
                  {count}
                </span>
              </div>
              <p className="text-sm text-gray-600">{status}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Follow-up">In Follow-up</option>
              <option value="Hot">Hot</option>
              <option value="Tour Booked">Tour Booked</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Source Filter */}
            <select
              value={filters.source}
              onChange={(e) =>
                setFilters({ ...filters, source: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            >
              <option value="">All Sources</option>
              <option value="Website Form">Website Form</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Referral">Referral</option>
              <option value="Direct">Direct</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lead Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Source
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
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {lead.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {lead.email}
                            </span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {lead.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.propertyId ? (
                          <div className="flex items-center gap-3">
                            {lead.propertyId.mainImage && (
                              <img
                                src={lead.propertyId.mainImage}
                                alt={lead.propertyId.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {lead.propertyId.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${lead.propertyId.price?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            General Inquiry
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(lead.status)}
                          <span className="text-sm font-medium text-gray-700">
                            {lead.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                            lead.priority
                          )}`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
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
                {pagination.totalPages} ({pagination.totalLeads} total leads)
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
      {showEditModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Lead</h2>
            </div>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateLead(selectedLead._id, {
                    status: formData.get("status"),
                    priority: formData.get("priority"),
                    notes: formData.get("notes"),
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
                      defaultValue={selectedLead.status}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="New">New</option>
                      <option value="In Follow-up">In Follow-up</option>
                      <option value="Hot">Hot</option>
                      <option value="Tour Booked">Tour Booked</option>
                      <option value="Closed">Closed</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      defaultValue={selectedLead.priority}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      defaultValue={selectedLead.notes}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                      placeholder="Add notes about this lead..."
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
                      setSelectedLead(null);
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
