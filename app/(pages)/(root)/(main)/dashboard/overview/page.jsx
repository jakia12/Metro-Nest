"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { Building2, Calendar, Heart, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OverviewPage() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user role
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        
        if (userData.success) {
          setUserRole(userData.data.role);
          
          // Fetch role-specific stats
          const statsRes = await fetch(`/api/dashboard/stats?role=${userData.data.role}`);
          const statsData = await statsRes.json();
          
          if (statsData.success) {
            setStats(statsData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  if (loading || !userRole) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  // Admin Overview
  if (userRole === "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Admin Overview</h2>
          <p className="text-sm text-slate-500">Platform-wide statistics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Building2}
            label="Total Properties"
            value={stats?.totalProperties || 0}
            color="rose"
          />
          <StatsCard
            icon={Building2}
            label="Active Listings"
            value={stats?.activeProperties || 0}
            color="green"
          />
          <StatsCard
            icon={Users}
            label="Active Agents"
            value={stats?.totalAgents || 0}
            color="blue"
          />
          <StatsCard
            icon={Users}
            label="Total Clients"
            value={stats?.totalClients || 0}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            icon={TrendingUp}
            label="Pending Inquiries"
            value={stats?.pendingInquiries || 0}
            color="yellow"
          />
          <StatsCard
            icon={Calendar}
            label="Upcoming Tours"
            value={stats?.upcomingTours || 0}
            color="indigo"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/agents"
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
            >
              <Users className="h-5 w-5 text-rose-600" />
              <span className="text-sm font-medium text-rose-900">Manage Agents</span>
            </Link>
            <Link
              href="/dashboard/listings"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">View All Listings</span>
            </Link>
            <Link
              href="/dashboard/inquiries"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Manage Leads</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
            >
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Agent Overview
  if (userRole === "agent") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Dashboard</h2>
          <p className="text-sm text-slate-500">Your properties and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Building2}
            label="My Properties"
            value={stats?.totalProperties || 0}
            color="rose"
          />
          <StatsCard
            icon={Building2}
            label="Active Listings"
            value={stats?.activeProperties || 0}
            color="green"
          />
          <StatsCard
            icon={Users}
            label="Total Inquiries"
            value={stats?.totalInquiries || 0}
            color="blue"
          />
          <StatsCard
            icon={TrendingUp}
            label="Pending Leads"
            value={stats?.pendingInquiries || 0}
            color="yellow"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tours</h3>
            <Link
              href="/dashboard/tours"
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.upcomingTours || 0}</p>
              <p className="text-sm text-gray-600">Scheduled tours</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/listings"
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
            >
              <Building2 className="h-5 w-5 text-rose-600" />
              <span className="text-sm font-medium text-rose-900">Add New Property</span>
            </Link>
            <Link
              href="/dashboard/inquiries"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">View Leads</span>
            </Link>
            <Link
              href="/dashboard/tours"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Manage Tours</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Client Overview
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Welcome to MetroNest</h2>
        <p className="text-sm text-slate-500">Find your dream property</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Heart}
          label="Saved Favorites"
          value={stats?.totalFavorites || 0}
          color="rose"
        />
        <StatsCard
          icon={Users}
          label="My Inquiries"
          value={stats?.totalInquiries || 0}
          color="blue"
        />
        <StatsCard
          icon={Calendar}
          label="Scheduled Tours"
          value={stats?.upcomingTours || 0}
          color="green"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/browse"
            className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
          >
            <Building2 className="h-5 w-5 text-rose-600" />
            <span className="text-sm font-medium text-rose-900">Browse Properties</span>
          </Link>
          <Link
            href="/dashboard/favorites"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
          >
            <Heart className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">My Favorites</span>
          </Link>
          <Link
            href="/dashboard/tours"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
          >
            <Calendar className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">My Tours</span>
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Start Your Property Search</h3>
        <p className="text-sm text-rose-100 mb-4">
          Browse thousands of properties and find your perfect home today.
        </p>
        <Link
          href="/dashboard/browse"
          className="inline-block bg-white text-rose-600 px-6 py-2.5 rounded-lg font-medium hover:bg-rose-50 transition"
        >
          Browse Properties
        </Link>
      </div>
    </div>
  );
}
