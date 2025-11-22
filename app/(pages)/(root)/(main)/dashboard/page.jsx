"use client";

import {
  CalendarDays,
  Home,
  Search,
  TrendingUp,
  Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const upcomingTours = [
  {
    property: "Modern Loft in Downtown",
    time: "Today • 3:30 PM",
    client: "Sarah Miller",
    location: "New York, Manhattan",
  },
  {
    property: "Family Home with Garden",
    time: "Tomorrow • 10:00 AM",
    client: "James Carter",
    location: "Brooklyn, NYC",
  },
  {
    property: "Skyline View Apartment",
    time: "Thu • 1:15 PM",
    client: "Priya Singh",
    location: "Queens, NYC",
  },
];

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [topProperties, setTopProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);

  useEffect(() => {
    fetchTopProperties();
    fetchLeads();
  }, []);

  const fetchTopProperties = async () => {
    try {
      const response = await fetch("/api/properties?limit=4");
      const result = await response.json();
      if (result.success) {
        setTopProperties(result.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLeadsLoading(true);
      const response = await fetch("/api/leads?limit=10");
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLeadsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate dynamic stats from real data
  const calculateStats = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentLeads = leads.filter(
      (lead) => new Date(lead.createdAt) >= sevenDaysAgo
    );

    return [
      {
        label: "Active Listings",
        value: topProperties.length.toString(),
        change: "+12",
        sublabel: "in the last 30 days",
        icon: Home,
      },
      {
        label: "New Leads",
        value: recentLeads.length.toString(),
        change: `+${recentLeads.length}`,
        sublabel: "this week",
        icon: Users,
      },
      {
        label: "Scheduled Tours",
        value: leads.filter((lead) => lead.status === "Tour Booked").length.toString(),
        change: "+4",
        sublabel: "upcoming 7 days",
        icon: CalendarDays,
      },
      {
        label: "Avg. Days on Market",
        value: "24",
        change: "-3",
        sublabel: "vs last month",
        icon: TrendingUp,
      },
    ];
  };

  const stats = calculateStats();
  const recentLeadsDisplay = leads.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Search + quick stats header row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings, leads, tours..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-9 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-slate-100">
            NYC Market •{" "}
            <span className="font-semibold text-slate-800">Active</span>
          </span>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-emerald-700">
            {leads.filter(l => l.status === "Tour Booked" || l.status === "Hot").length} hot leads
          </span>
        </div>
      </div>

      {/* Stats */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.change} • {item.sublabel}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-rose-500 to-rose-400" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Main content layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Top Properties */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Top Performing Listings
              </h2>
              <Link
                href="/dashboard/listings"
                className="text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {topProperties.map((property) => (
                  <Link
                    key={property._id}
                    href={`/properties/${property._id}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition hover:border-rose-200 hover:shadow-md"
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={
                          property.mainImage ||
                          property.images?.[0] ||
                          "/images/pr.png"
                        }
                        alt={property.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                        {property.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                        📍 {property.address}
                      </p>
                      <p className="mt-2 text-lg font-bold text-rose-500">
                        {formatPrice(property.price)}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {property.beds} bd • {property.baths} ba • {property.area} sqft
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Leads */}
          <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Leads
              </h2>
              <Link
                href="/dashboard/inquiries"
                className="text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                View all →
              </Link>
            </div>

            {leadsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
              </div>
            ) : recentLeadsDisplay.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No leads yet. Start collecting leads from your property forms!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-100 text-xs text-slate-500">
                    <tr>
                      <th className="pb-3 text-left font-medium">Name</th>
                      <th className="pb-3 text-left font-medium">Email</th>
                      <th className="pb-3 text-left font-medium">Property</th>
                      <th className="pb-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentLeadsDisplay.map((lead) => (
                      <tr key={lead._id} className="text-sm">
                        <td className="py-3 font-medium text-slate-900">
                          {lead.name}
                        </td>
                        <td className="py-3 text-slate-600 text-xs">{lead.email}</td>
                        <td className="py-3 text-slate-600 text-xs">
                          {lead.propertyId?.title || "General Inquiry"}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              lead.status === "New"
                                ? "bg-blue-50 text-blue-700"
                                : lead.status === "Hot"
                                ? "bg-rose-50 text-rose-700"
                                : lead.status === "Tour Booked"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Lead Agent Card */}
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-rose-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Lead Agent</p>
                <p className="font-semibold">MetroNest Team</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Online • {leads.length} leads
              </span>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <span>📧</span>
                <span>support@metronest.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span>📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
              <div>
                <p className="text-xs text-slate-400">Total Leads</p>
                <p className="mt-1 text-xl font-bold">{leads.length}</p>
                <p className="text-xs text-emerald-400">
                  {leads.filter(l => new Date(l.createdAt) >= new Date(Date.now() - 7*24*60*60*1000)).length} this week
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Conversion Rate</p>
                <p className="mt-1 text-xl font-bold">
                  {leads.length > 0 ? Math.round((leads.filter(l => l.status === "Tour Booked" || l.status === "Closed").length / leads.length) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400">from all leads</p>
              </div>
            </div>
          </div>

          {/* Upcoming Tours */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Upcoming Tours</h3>
              <Link
                href="/dashboard/tours"
                className="text-xs font-medium text-rose-500 hover:text-rose-600"
              >
                Manage calendar
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingTours.map((tour, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {tour.property}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{tour.time}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {tour.client} • {tour.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}