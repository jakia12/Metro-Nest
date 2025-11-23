"use client";

import { AlertTriangle, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties");
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
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
          <h2 className="text-2xl font-semibold text-slate-900">All Listings</h2>
          <p className="text-sm text-slate-500">Manage all property listings on the platform</p>
        </div>
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

      {/* Properties Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Agent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                    No properties found.
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
                      <p className="text-sm text-slate-600">{property.agentName || "N/A"}</p>
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
                        <Link
                          href={`/properties/${property._id}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
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
