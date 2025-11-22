"use client";

import {
    ArrowRight,
    CalendarDays,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

// keep your existing recentLeads & upcomingTours arrays above this component

export const TopProperties = ({ recentLeads = [], upcomingTours = [] }) => {
  const [activeFilter, setActiveFilter] = useState("View All");
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- fetch properties from backend ---
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/properties?limit=8");
        const result = await res.json();

        if (result.success) {
          setProperties(result.data);
        } else {
          toast.error("Failed to load properties");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Error loading properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // take first 4 as “top”
  const topProperties = useMemo(() => properties.slice(0, 4), [properties]);

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    });

  return (
    <section className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
      {/* Left column */}
      <div className="flex flex-col gap-7">
        {/* Top properties */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 md:text-base">
              Top Performing Listings
            </h2>
            <button className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* loading state */}
            {loading && (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/60 animate-pulse"
                  >
                    <div className="h-40 w-full bg-slate-200" />
                    <div className="space-y-2 p-4">
                      <div className="h-3 w-2/3 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                      <div className="h-3 w-1/3 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* no data */}
            {!loading && topProperties.length === 0 && (
              <p className="col-span-full text-xs text-slate-500">
                No properties available yet.
              </p>
            )}

            {/* real data */}
            {!loading &&
              topProperties.map((property) => (
                <div
                  key={property._id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/60"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={
                        property.mainImage ||
                        (property.images && property.images[0]) ||
                        "/images/pr.png"
                      }
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-rose-500 shadow-sm">
                      {property.status || "For Sale"}
                    </div>
                  </div>
                  <div className="space-y-1.5 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {property.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{property.address}</span>
                    </div>
                    <p className="text-sm font-semibold text-rose-500">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {property.beds} bd • {property.baths} ba • {property.area}{" "}
                      sqft
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent leads (unchanged) */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 md:text-base">
              Recent Leads
            </h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
              Response time: 12 min avg
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="py-2.5 pr-4">Lead</th>
                  <th className="py-2.5 pr-4">Budget</th>
                  <th className="py-2.5 pr-4">Looking for</th>
                  <th className="py-2.5 pr-4">Status</th>
                  <th className="py-2.5 pr-4">Source</th>
                  <th className="py-2.5" />
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.name}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-3.5 pr-4 text-[13px] font-medium text-slate-900">
                      {lead.name}
                    </td>
                    <td className="py-3.5 pr-4 text-[13px] text-slate-700">
                      {lead.budget}
                    </td>
                    <td className="py-3.5 pr-4 text-[13px] text-slate-700">
                      {lead.type}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          lead.status === "Hot"
                            ? "bg-rose-50 text-rose-600"
                            : lead.status === "Tour Booked"
                            ? "bg-sky-50 text-sky-600"
                            : lead.status === "In Follow-up"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-[12px] text-slate-500">
                      {lead.source}
                    </td>
                    <td className="py-3.5">
                      <button className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right column (unchanged) */}
      <div className="flex flex-col gap-7">
        {/* Agent card */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 text-slate-50 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-slate-700">
                <Image
                  src="/images/agent-avatar.jpg"
                  alt="Agent"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">Lead Agent</p>
                <p className="text-sm font-semibold text-white">
                  MetroNest Team
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
              Online • 5 active chats
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-rose-300" />
              <span>support@metronest.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-rose-300" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 p-3.5">
              <p className="text-[11px] text-slate-300">Monthly Volume</p>
              <p className="mt-1 text-lg font-semibold text-white">$4.2M</p>
              <p className="text-[11px] text-emerald-300">+23% vs last month</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3.5">
              <p className="text-[11px] text-slate-300">Conversion Rate</p>
              <p className="mt-1 text-lg font-semibold text-white">18.4%</p>
              <p className="text-[11px] text-slate-300">from qualified leads</p>
            </div>
          </div>
        </div>

        {/* Upcoming tours */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 md:text-base">
              Upcoming Tours
            </h2>
            <button className="text-xs font-medium text-rose-500 hover:text-rose-600">
              Manage calendar
            </button>
          </div>

          <div className="space-y-3.5">
            {upcomingTours.map((tour) => (
              <div
                key={tour.property + tour.time}
                className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5"
              >
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-900">
                    {tour.property}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {tour.time} • {tour.client}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span>{tour.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales funnel snapshot */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 md:text-base">
            Sales Funnel Snapshot
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Track how leads move across your MetroNest pipeline.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {[
              {
                label: "New Leads",
                value: 52,
                width: "82%",
                color: "bg-rose-400",
              },
              {
                label: "Qualified",
                value: 31,
                width: "64%",
                color: "bg-amber-400",
              },
              {
                label: "Tours Booked",
                value: 19,
                width: "48%",
                color: "bg-sky-400",
              },
              {
                label: "Closed Deals",
                value: 9,
                width: "32%",
                color: "bg-emerald-400",
              },
            ].map((stage) => (
              <div key={stage.label} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{stage.label}</span>
                  <span className="font-medium text-slate-800">
                    {stage.value}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${stage.color}`}
                    style={{ width: stage.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
