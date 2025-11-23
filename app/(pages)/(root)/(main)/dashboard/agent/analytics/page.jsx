"use client";

import { ArrowUpRight, Building2, CalendarDays, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function AgentAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/agent/analytics");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Total Listings",
      value: data.stats.listings.total,
      subValue: `${data.stats.listings.active} Active`,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Inquiries",
      value: data.stats.inquiries.total,
      subValue: `${data.stats.inquiries.pending} Pending`,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Scheduled Tours",
      value: data.stats.tours.total,
      subValue: `${data.stats.tours.scheduled} Upcoming`,
      icon: CalendarDays,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Conversion Rate",
      value: "2.4%", // Placeholder logic
      subValue: "+0.4% this month",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Analytics Overview</h2>
        <p className="text-sm text-slate-500">Track your performance and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                +12%
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.subValue}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Properties */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Top Performing Properties</h3>
          <div className="space-y-6">
            {data.topProperties.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No data available yet</p>
            ) : (
              data.topProperties.map((prop, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{prop.title}</p>
                    <p className="text-xs text-slate-500">{prop.price?.toLocaleString()} BDT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{prop.inquiries}</p>
                    <p className="text-xs text-slate-500">Inquiries</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Inquiries</h3>
          <div className="space-y-6">
            {data.recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No recent activity</p>
            ) : (
              data.recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative mt-1">
                    <div className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-50"></div>
                    {index !== data.recentActivity.length - 1 && (
                      <div className="absolute left-1 top-3 h-full w-px bg-slate-200"></div>
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-slate-900">
                      New inquiry from <span className="text-rose-500">{activity.name}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Property: {activity.property?.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()} • {new Date(activity.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
