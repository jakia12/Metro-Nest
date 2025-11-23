"use client";

import { CheckCircle, Star, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/reviews");
      const result = await response.json();
      if (result.success) {
        setReviews(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review status updated");
        fetchReviews();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review deleted");
        fetchReviews();
      } else {
        toast.error(result.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting review");
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
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Reviews & Ratings</h2>
        <p className="text-sm text-slate-500">Manage user testimonials and reviews</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review._id} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                  <img
                    src={review.image || "/images/placeholder.jpg"}
                    alt={review.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{review.name}</h3>
                  <p className="text-xs text-slate-500">{review.role || "Client"}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="mb-6 text-sm text-slate-600 line-clamp-3">"{review.comment}"</p>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                onClick={() => toggleStatus(review._id, review.active)}
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  review.active ? "text-green-600" : "text-slate-400"
                }`}
              >
                {review.active ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" /> Active
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5" /> Inactive
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(review._id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
