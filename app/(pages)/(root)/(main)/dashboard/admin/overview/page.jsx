import StatsCard from "@/components/dashboard/StatsCard";
import connectDB from "@/database/connect";

import Inquiry from "@/database/models/Inquiry";
import Property from "@/database/models/Property";
import Tour from "@/database/models/Tour";
import User from "@/database/models/User";

import { getCurrentUser } from "@/lib/auth";
import { Building2, Calendar, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAdminStats() {
  await connectDB();

  const [
    totalProperties,
    activeProperties,
    totalAgents,
    totalClients,
    pendingInquiries,
    upcomingTours,
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ status: { $in: ["For Sale", "For Rent"] } }),
    User.countDocuments({ role: "agent", "agentProfile.isVerified": true }),
    User.countDocuments({ role: "client" }),
    Inquiry.countDocuments({ status: "pending" }),
    Tour.countDocuments({ 
      status: "scheduled",
      scheduledDate: { $gte: new Date() }
    }),
  ]);

  return {
    totalProperties,
    activeProperties,
    totalAgents,
    totalClients,
    pendingInquiries,
    upcomingTours,
  };
}

async function getRecentActivity() {
  await connectDB();

  const recentProperties = await Property.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status createdAt")
    .lean();

  const recentInquiries = await Inquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("property", "title")
    .populate("client", "name")
    .lean();

  return {
    recentProperties,
    recentInquiries,
  };
}

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();
  const stats = await getAdminStats();
  const { recentProperties, recentInquiries } = await getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Building2}
          label="Total Properties"
          value={stats.totalProperties}
          color="rose"
        />
        <StatsCard
          icon={Building2}
          label="Active Listings"
          value={stats.activeProperties}
          color="green"
        />
        <StatsCard
          icon={Users}
          label="Active Agents"
          value={stats.totalAgents}
          color="blue"
        />
        <StatsCard
          icon={Users}
          label="Total Clients"
          value={stats.totalClients}
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          icon={TrendingUp}
          label="Pending Inquiries"
          value={stats.pendingInquiries}
          color="yellow"
        />
        <StatsCard
          icon={Calendar}
          label="Upcoming Tours"
          value={stats.upcomingTours}
          color="indigo"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h2>
          <div className="space-y-3">
            {recentProperties.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No properties yet</p>
            ) : (
              recentProperties.map((property) => (
                <div key={property._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    property.status === "For Sale" ? "bg-green-100 text-green-700" :
                    property.status === "For Rent" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {property.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h2>
          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No inquiries yet</p>
            ) : (
              recentInquiries.map((inquiry) => (
                <div key={inquiry._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {inquiry.client?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {inquiry.property?.title || "Property"}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    inquiry.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    inquiry.status === "replied" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard/admin/agents"
            className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
          >
            <Users className="h-5 w-5 text-rose-600" />
            <span className="text-sm font-medium text-rose-900">Manage Agents</span>
          </a>
          <a
            href="/dashboard/admin/listings"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
          >
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">View All Listings</span>
          </a>
          <a
            href="/dashboard/admin/leads"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
          >
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Manage Leads</span>
          </a>
          <a
            href="/dashboard/admin/analytics"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
          >
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">View Analytics</span>
          </a>
        </div>
      </div>
    </div>
  );
}
