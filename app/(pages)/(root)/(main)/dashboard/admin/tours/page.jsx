"use client";

import {
    AlertCircle,
    Calendar as CalendarIcon,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    Grid,
    Home,
    List,
    Mail,
    Phone,
    Trash2,
    User,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTour, setSelectedTour] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchTours();
  }, [filters, viewMode, currentMonth]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      
      // For calendar view, fetch tours for the current month
      let startDate = filters.startDate;
      let endDate = filters.endDate;
      
      if (viewMode === "calendar") {
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        startDate = firstDay.toISOString().split("T")[0];
        endDate = lastDay.toISOString().split("T")[0];
      }

      const queryParams = new URLSearchParams({
        view: viewMode,
        ...(filters.status && { status: filters.status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/admin/tours?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setTours(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTour = async (tourId, updates) => {
    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        fetchTours();
        setShowEditModal(false);
        setSelectedTour(null);
      }
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;

    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        fetchTours();
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getToursForDate = (date) => {
    return tours.filter((tour) => {
      const tourDate = new Date(tour.scheduledDate);
      return (
        tourDate.getDate() === date.getDate() &&
        tourDate.getMonth() === date.getMonth() &&
        tourDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1)
    );
  };

  const renderCalendarView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTours = getToursForDate(date);
      const isToday =
        date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isToday ? "bg-blue-50 border-blue-300" : "bg-white"
          }`}
        >
          <div
            className={`text-sm font-semibold mb-2 ${
              isToday ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayTours.slice(0, 3).map((tour) => (
              <div
                key={tour._id}
                onClick={() => {
                  setSelectedTour(tour);
                  setShowEditModal(true);
                }}
                className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                  tour.status
                )}`}
              >
                <div className="font-medium truncate">
                  {tour.scheduledTime}
                </div>
                <div className="truncate">{tour.property?.title}</div>
              </div>
            ))}
            {dayTours.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayTours.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">{days}</div>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tours scheduled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tours.map((tour) => (
                  <tr
                    key={tour._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                          <CalendarIcon className="w-4 h-4 text-indigo-600" />
                          {new Date(tour.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Clock className="w-3 h-3" />
                          {tour.scheduledTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tour.property && (
                        <div className="flex items-center gap-3">
                          {tour.property.mainImage && (
                            <img
                              src={tour.property.mainImage}
                              alt={tour.property.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {tour.property.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${tour.property.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {tour.client?.name}
                        </span>
                        {tour.clientEmail && (
                          <div className="flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {tour.clientEmail}
                            </span>
                          </div>
                        )}
                        {tour.clientPhone && (
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {tour.clientPhone}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {tour.agent?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tour.status)}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            tour.status
                          )}`}
                        >
                          {tour.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTour(tour);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour._id)}
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <CalendarIcon className="w-10 h-10 text-indigo-600" />
            Tours & Calendar
          </h1>
          <p className="text-gray-600">
            Manage and schedule property tours
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.scheduled || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Scheduled Tours</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.completed || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Completed Tours</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.cancelled || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">Cancelled Tours</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-gray-900">
                {stats.upcomingWeek || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {viewMode === "list" && (
                <>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  />
                </>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === "calendar"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid className="w-4 h-4" />
                Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Tours Display */}
        {viewMode === "calendar" ? renderCalendarView() : renderListView()}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Tour</h2>
            </div>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateTour(selectedTour._id, {
                    status: formData.get("status"),
                    notes: formData.get("notes"),
                  });
                }}
              >
                <div className="space-y-4">
                  {/* Tour Details (Read-only) */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {new Date(selectedTour.scheduledDate).toLocaleDateString()}
                      </span>
                      <Clock className="w-4 h-4 text-gray-500 ml-2" />
                      <span>{selectedTour.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span>{selectedTour.property?.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Client: {selectedTour.client?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Agent: {selectedTour.agent?.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedTour.status}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      defaultValue={selectedTour.notes}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Add notes about this tour..."
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
                      setSelectedTour(null);
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
