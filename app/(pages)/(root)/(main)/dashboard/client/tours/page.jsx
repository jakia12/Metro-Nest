"use client";

import { AlertTriangle, Calendar, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ClientToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [properties, setProperties] = useState([]);
  
  const [formData, setFormData] = useState({
    property: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  useEffect(() => {
    fetchTours();
    fetchProperties();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/tours");
      const result = await response.json();
      if (result.success) {
        setTours(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load tours");
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
      const response = await fetch("/api/client/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Tour scheduled successfully!");
        setShowAddForm(false);
        resetForm();
        fetchTours();
      } else {
        toast.error(result.message || "Failed to schedule tour");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error scheduling tour");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    try {
      const response = await fetch(`/api/client/tours/${deleteModal._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Tour cancelled successfully!");
        fetchTours();
      } else {
        toast.error(result.message || "Failed to cancel tour");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error cancelling tour");
    } finally {
      setDeleteModal(null);
    }
  };

  const resetForm = () => {
    setFormData({
      property: "",
      scheduledDate: "",
      scheduledTime: "",
      notes: "",
    });
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
          <h2 className="text-2xl font-semibold text-slate-900">My Tours</h2>
          <p className="text-sm text-slate-500">Schedule and manage property viewings</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
        >
          <Plus className="h-4 w-4" />
          Schedule Tour
        </button>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-rose-100 p-3">
                <AlertTriangle className="h-8 w-8 text-rose-600" />
              </div>
            </div>
            
            <h3 className="mb-2 text-center text-xl font-semibold text-slate-900">
              Cancel Tour?
            </h3>
            
            <p className="mb-6 text-center text-sm text-slate-600">
              Are you sure you want to cancel this tour?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Keep Tour
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
              >
                Cancel Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tour Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Schedule Property Tour</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="Any specific requirements or questions..."
                />
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
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
                  Schedule Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tours Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Agent</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="h-12 w-12 text-slate-300" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">No tours scheduled</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Schedule a tour to view properties in person!
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition"
                      >
                        Schedule Your First Tour
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                tours.map((tour) => {
                  const property = tour.property;
                  if (!property) return null;

                  return (
                    <tr key={tour._id} className="hover:bg-slate-50">
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
                        <div className="text-sm text-slate-900">
                          {new Date(tour.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">{tour.scheduledTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          tour.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                          tour.status === "completed" ? "bg-green-50 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {tour.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{property.agentName || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${property._id}`}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {tour.status === "scheduled" && (
                            <button
                              onClick={() => setDeleteModal(tour)}
                              className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
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
