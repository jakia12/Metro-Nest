"use client";

import { CheckCircle, Clock, Mail, MapPin, Phone, TrendingUp, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | New | Contacted | Qualified | Hot | Tour Scheduled | Converted | Lost

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leads");
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Lead status updated!");
        fetchLeads();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const addNote = async (leadId, note) => {
    if (!note.trim()) return;

    try {
      const response = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Note added!");
        fetchLeads();
      } else {
        toast.error(result.error || "Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Error adding note");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (filter === "all") return true;
    return lead.status === filter;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "New").length,
    hot: leads.filter((l) => l.status === "Hot").length,
    qualified: leads.filter((l) => l.status === "Qualified").length,
    converted: leads.filter((l) => l.status === "Converted").length,
  };

  const getStatusColor = (status) => {
    const colors = {
      New: "bg-blue-50 text-blue-700 border-blue-200",
      Contacted: "bg-purple-50 text-purple-700 border-purple-200",
      Qualified: "bg-green-50 text-green-700 border-green-200",
      Hot: "bg-rose-50 text-rose-700 border-rose-200",
      "Tour Scheduled": "bg-amber-50 text-amber-700 border-amber-200",
      Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Lost: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
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
          My Leads
        </h2>
        <p className="text-sm text-slate-500">
          Manage and track your property leads
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Leads</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">New</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.new}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
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
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Qualified</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.qualified}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Converted</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.converted}</p>
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
        {["New", "Contacted", "Qualified", "Hot", "Tour Scheduled", "Converted", "Lost"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === status
                ? "bg-rose-500 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {status} ({leads.filter((l) => l.status === status).length})
          </button>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No leads yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              When users inquire about your properties, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Left: Lead Details */}
                <div className="flex-1 space-y-3">
                  {/* Property Info */}
                  {lead.propertyId && (
                    <Link
                      href={`/properties/${lead.propertyId._id}`}
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={
                            lead.propertyId.mainImage ||
                            lead.propertyId.images?.[0] ||
                            "/images/pr.png"
                          }
                          alt={lead.propertyId.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {lead.propertyId.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" />
                          {lead.propertyId.address}
                        </p>
                      </div>
                    </Link>
                  )}

                  {/* Customer Info */}
                  <div className="space-y-1 border-l-2 border-rose-200 pl-4">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      {lead.source && (
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {lead.source}
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5 text-sm text-slate-600">
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </p>
                      {lead.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">Message:</p>
                    <p className="mt-1 text-sm text-slate-700">{lead.message}</p>
                  </div>

                  {/* Notes */}
                  {lead.notes && lead.notes.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-medium text-amber-700">Notes:</p>
                      <div className="mt-2 space-y-2">
                        {lead.notes.map((note, index) => (
                          <div key={index} className="text-sm text-slate-700">
                            <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                            <p>{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-xs text-slate-400">
                    Received: {formatDate(lead.createdAt)}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Hot">Hot</option>
                    <option value="Tour Scheduled">Tour Scheduled</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>

                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>

                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                  )}

                  <button
                    onClick={() => {
                      const note = prompt("Add a note:");
                      if (note) addNote(lead._id, note);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
