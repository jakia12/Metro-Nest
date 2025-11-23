"use client";

import { AlertTriangle, Edit, Plus, Search as SearchIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSearch, setEditingSearch] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    criteria: {
      status: "",
      minPrice: "",
      maxPrice: "",
      beds: "",
      location: "",
    },
    alertFrequency: "instant",
  });

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/saved-searches");
      const result = await response.json();
      if (result.success) {
        setSearches(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load saved searches");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingSearch
        ? `/api/client/saved-searches/${editingSearch._id}`
        : "/api/client/saved-searches";
      
      const method = editingSearch ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingSearch ? "Search updated!" : "Search saved!");
        setShowAddForm(false);
        setEditingSearch(null);
        resetForm();
        fetchSearches();
      } else {
        toast.error(result.message || "Failed to save search");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving search");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    try {
      const response = await fetch(`/api/client/saved-searches/${deleteModal._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Search deleted!");
        fetchSearches();
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting search");
    } finally {
      setDeleteModal(null);
    }
  };

  const handleEdit = (search) => {
    setEditingSearch(search);
    setFormData({
      name: search.name || "",
      criteria: search.criteria || {
        status: "",
        minPrice: "",
        maxPrice: "",
        beds: "",
        location: "",
      },
      alertFrequency: search.alertFrequency || "instant",
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      criteria: {
        status: "",
        minPrice: "",
        maxPrice: "",
        beds: "",
        location: "",
      },
      alertFrequency: "instant",
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
          <h2 className="text-2xl font-semibold text-slate-900">Saved Searches</h2>
          <p className="text-sm text-slate-500">Save your search criteria and get alerts</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingSearch(null);
            resetForm();
          }}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
        >
          <Plus className="h-4 w-4" />
          Save New Search
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
              Delete Search?
            </h3>
            
            <p className="mb-1 text-center text-sm text-slate-600">
              Are you sure you want to delete
            </p>
            <p className="mb-6 text-center text-base font-semibold text-slate-900">
              "{deleteModal.name}"?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">
                {editingSearch ? "Edit Search" : "Save New Search"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingSearch(null);
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
                  Search Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="e.g., 3BR Apartments in Downtown"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    value={formData.criteria.status}
                    onChange={(e) => setFormData({ ...formData, criteria: { ...formData.criteria, status: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    <option value="">Any</option>
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.beds}
                    onChange={(e) => setFormData({ ...formData, criteria: { ...formData.criteria, beds: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    placeholder="Min beds"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.minPrice}
                    onChange={(e) => setFormData({ ...formData, criteria: { ...formData.criteria, minPrice: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={formData.criteria.maxPrice}
                    onChange={(e) => setFormData({ ...formData, criteria: { ...formData.criteria, maxPrice: e.target.value } })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    placeholder="Any"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.criteria.location}
                  onChange={(e) => setFormData({ ...formData, criteria: { ...formData.criteria, location: e.target.value } })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="City or area"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Alert Frequency
                </label>
                <select
                  value={formData.alertFrequency}
                  onChange={(e) => setFormData({ ...formData, alertFrequency: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSearch(null);
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
                  {editingSearch ? "Update Search" : "Save Search"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Searches Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Search Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Criteria</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Alert Frequency</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {searches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <SearchIcon className="h-12 w-12 text-slate-300" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">No saved searches</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Save your search criteria to get instant alerts!
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition"
                      >
                        Save Your First Search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                searches.map((search) => (
                  <tr key={search._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{search.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600">
                        {search.criteria.status && `${search.criteria.status} • `}
                        {search.criteria.beds && `${search.criteria.beds}+ beds • `}
                        {search.criteria.minPrice && `$${parseInt(search.criteria.minPrice).toLocaleString()}+`}
                        {search.criteria.location && ` • ${search.criteria.location}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {search.alertFrequency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(search)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(search)}
                          className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
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
