"use client";

import { CheckCircle, Clock, Mail, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardInquiries() {
  const { data: session } = useSession();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | New | In Follow-up | Hot | Tour Booked

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leads");
      const result = await response.json();
      if (result.success) {
        setInquiries(result.data);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Status updated successfully!");
        fetchInquiries();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filter === "all") return true;
    return inquiry.status === filter;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "New").length,
    hot: inquiries.filter((i) => i.status === "Hot").length,
    tourBooked: inquiries.filter((i) => i.status === "Tour Booked").length,
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Leads & Inquiries
        </h2>
        <p className="text-sm text-slate-500">
          Manage property inquiries and leads from your contact forms
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Leads</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">New</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.new}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Hot Leads</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.hot}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Tours Booked</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.tourBooked}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter("New")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "New"
              ? "bg-blue-500 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          New ({stats.new})
        </button>
        <button
          onClick={() => setFilter("Hot")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "Hot"
              ? "bg-rose-500 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          Hot ({stats.hot})
        </button>
        <button
          onClick={() => setFilter("Tour Booked")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "Tour Booked"
              ? "bg-emerald-500 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          Tour Booked ({stats.tourBooked})
        </button>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Mail className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No inquiries yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              When users contact you about properties, they'll appear here.
            </p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Left: Inquiry Details */}
                <div className="flex-1 space-y-3">
                  {/* Property Info */}
                  {inquiry.propertyId && (
                    <Link
                      href={`/properties/${inquiry.propertyId._id}`}
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={
                            inquiry.propertyId.mainImage ||
                            inquiry.propertyId.images?.[0] ||
                            "/images/pr.png"
                          }
                          alt={inquiry.propertyId.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {inquiry.propertyId.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" />
                          {inquiry.propertyId.address}
                        </p>
                      </div>
                    </Link>
                  )}

                  {/* Customer Info */}
                  <div className="space-y-1 border-l-2 border-rose-200 pl-4">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{inquiry.name}</p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          inquiry.status === "New"
                            ? "bg-blue-50 text-blue-700"
                            : inquiry.status === "Hot"
                            ? "bg-rose-50 text-rose-700"
                            : inquiry.status === "Tour Booked"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                      {inquiry.source && (
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {inquiry.source}
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5 text-sm text-slate-600">
                      <p>📧 {inquiry.email}</p>
                      {inquiry.phone && <p>📞 {inquiry.phone}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">Message:</p>
                    <p className="mt-1 text-sm text-slate-700">{inquiry.message}</p>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-slate-400">
                    Received: {formatDate(inquiry.createdAt)}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-row gap-2 lg:flex-col">
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <option value="New">New</option>
                    <option value="In Follow-up">In Follow-up</option>
                    <option value="Hot">Hot</option>
                    <option value="Tour Booked">Tour Booked</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                  </select>

                  <a
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Mail className="h-4 w-4" />
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}