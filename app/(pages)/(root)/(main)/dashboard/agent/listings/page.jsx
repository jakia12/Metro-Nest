"use client";

import { AlertTriangle, Edit, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AgentListingsPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    beds: "",
    baths: "",
    area: "",
    status: "For Sale",
    type: "Apartment",
    description: "",
    mainImage: "",
    featured: false,
    // Add agent fields - these will be auto-populated from session
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Fetch only agent's properties
      const response = await fetch("/api/agent/properties");
      const result = await response.json();
      if (result.success) {
        setProperties(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate session
    if (!session?.user?.id) {
      toast.error("You must be logged in to add properties");
      return;
    }

    try {
      // Add agent information from session
      const propertyData = {
        ...formData,
        agent: session.user.id, // Required agent reference
        agentName: session.user.name || session.user.email,
        agentEmail: session.user.email,
        agentPhone: session.user.phone || "", // If you have phone in session
      };

      const url = editingProperty
        ? `/api/properties/${editingProperty._id}`
        : "/api/properties";
      
      const method = editingProperty ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingProperty ? "Updated!" : "Property added!");
        setShowAddForm(false);
        setEditingProperty(null);
        resetForm();
        fetchProperties();
      } else {
        toast.error(result.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving property");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;

    try {
      const response = await fetch(`/api/properties/${deleteModal._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Property deleted successfully!");
        fetchProperties();
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting property");
    } finally {
      setDeleteModal(null);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || "",
      address: property.address || "",
      price: property.price || "",
      beds: property.beds || "",
      baths: property.baths || "",
      area: property.area || "",
      status: property.status || "For Sale",
      type: property.type || "Apartment",
      description: property.description || "",
      mainImage: property.mainImage || "",
      featured: property.featured || false,
      // Agent fields are maintained from the original property
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      address: "",
      price: "",
      beds: "",
      baths: "",
      area: "",
      status: "For Sale",
      type: "Apartment",
      description: "",
      mainImage: "",
      featured: false,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Show message if user is not logged in
  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-slate-600">Please log in to manage your listings</p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-semibold text-slate-900">My Listings</h2>
          <p className="text-sm text-slate-500">Manage your property listings</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProperty(null);
            resetForm();
          }}
          className="flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600"
        >
          <Plus className="h-4 w-4" />
          Add Listing
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-rose-100 p-3">
                <AlertTriangle className="h-8 w-8 text-rose-600" />
              </div>
            </div>
            
            <h3 className="mb-2 text-center text-xl font-semibold text-slate-900">
              Delete Property?
            </h3>
            
            <p className="mb-1 text-center text-sm text-slate-600">
              Are you sure you want to delete
            </p>
            <p className="mb-6 text-center text-base font-semibold text-slate-900">
              &quot;{deleteModal.title}&quot;?
            </p>
            
            <p className="mb-6 text-center text-xs text-slate-500">
              This action cannot be undone.
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
                {editingProperty ? "Edit Property" : "Add New Property"}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProperty(null);
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
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="Luxury Apartment"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    placeholder="500000"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Property Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land Or Plot">Land Or Plot</option>
                  <option value="Farm">Farm</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Cottage">Cottage</option>
                  <option value="Loft">Loft</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Mansion">Mansion</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Beds *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Baths *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.baths}
                    onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Area (sqft) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="Describe the property..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Image URL (ImgBB, Imgur, or direct link)
                </label>
                <input
                  type="url"
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-black outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  placeholder="https://i.ibb.co/xxxxx/image.jpg"
                />

                {formData.mainImage && (
                  <div className="mt-2">
                    <p className="mb-1 text-xs text-slate-500">Preview:</p>
                    <img
                      src={formData.mainImage}
                      alt="Preview"
                      className="h-20 w-32 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/pr.png";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-2 focus:ring-rose-100"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                  Mark as Featured Property
                </label>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProperty(null);
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
                  {editingProperty ? "Update" : "Add Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                    No properties found. Add your first listing!
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property._id} className="hover:bg-slate-50">
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
                      <div className="text-xs text-slate-600">
                        {property.beds} Bed • {property.baths} Bath • {property.area} sqft
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{formatPrice(property.price)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        property.status === "For Sale" ? "bg-emerald-50 text-emerald-700" :
                        property.status === "For Rent" ? "bg-blue-50 text-blue-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(property)}
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