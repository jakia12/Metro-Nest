"use client";

import { ArrowUpRight, Building2, DollarSign, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
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
      label: "Total Revenue",
      value: "2.4M BDT", // Placeholder
      subValue: "+12% this month",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Users",
      value: data.users.total,
      subValue: `${data.users.agents} Agents, ${data.users.clients} Clients`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Properties",
      value: data.properties.total,
      subValue: `${data.properties.active} Active Listings`,
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Inquiries",
      value: data.inquiries.total,
      subValue: `${data.inquiries.pending} Pending Response`,
      icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Platform Analytics</h2>
        <p className="text-sm text-slate-500">Overview of platform performance</p>
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
                +8.2%
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
        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent User Activity</h3>
          <div className="space-y-6">
            {data.recentUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">Joined as {user.role}</p>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Newest Listings</h3>
          <div className="space-y-6">
            {data.recentProperties.map((prop, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-12 w-16 rounded bg-slate-100 overflow-hidden">
                  <img 
                    src={prop.mainImage || "/images/placeholder.jpg"} 
                    alt="" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{prop.title}</p>
                  <p className="text-xs text-slate-500">{prop.price?.toLocaleString()} BDT</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    {prop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
