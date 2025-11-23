"use client";

import { CalendarDays, CheckCircle, Clock, Mail, MapPin, Phone, User, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AgentToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/agent/tours");
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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/agent/tours/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Tour marked as ${newStatus}`);
        fetchTours();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    }
  };

  const filteredTours = tours.filter((tour) => 
    filterStatus === "all" || tour.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "completed":
        return "bg-green-50 text-green-700 border-green-100";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
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
          <h2 className="text-2xl font-semibold text-slate-900">My Tours</h2>
          <p className="text-sm text-slate-500">Manage your property viewings</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
        >
          <option value="all">All Tours</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center">
          <CalendarDays className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-900">No tours found</p>
          <p className="text-xs text-slate-500">Scheduled tours will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTours.map((tour) => (
            <div key={tour._id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              {/* Status Badge */}
              <div className="mb-4 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(tour.status)}`}>
                  {tour.status}
                </span>
                <div className="text-xs text-slate-400">
                  {new Date(tour.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Property Info */}
              <div className="mb-4 flex gap-3">
                <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={tour.property?.mainImage || "/images/placeholder.jpg"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium text-slate-900" title={tour.property?.title}>
                    {tour.property?.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{tour.property?.address}</span>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="mb-4 rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <CalendarDays className="h-4 w-4 text-rose-500" />
                  {new Date(tour.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 pl-6">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {tour.scheduledTime}
                </div>
              </div>

              {/* Client Info */}
              <div className="mb-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{tour.client?.name || "Unknown Client"}</span>
                </div>
                {tour.client?.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                    {tour.client.email}
                  </div>
                )}
                {tour.client?.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="h-3.5 w-3.5" />
                    {tour.client.phone}
                  </div>
                )}
              </div>

              {/* Actions */}
              {tour.status === "scheduled" && (
                <div className="flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => handleStatusUpdate(tour._id, "completed")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-50 py-2 text-xs font-medium text-green-700 hover:bg-green-100 transition"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(tour._id, "cancelled")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-xs font-medium text-red-700 hover:bg-red-100 transition"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
