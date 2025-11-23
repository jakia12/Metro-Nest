import StatsCard from "@/components/dashboard/StatsCard";
import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import Property from "@/database/models/Property";
import Tour from "@/database/models/Tour";
import { getCurrentUser } from "@/lib/auth";
import { Building2, Calendar, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getAgentStats(agentId) {
  await connectDB();

  const [
    totalProperties,
    activeProperties,
    totalInquiries,
    pendingInquiries,
    upcomingTours,
  ] = await Promise.all([
    Property.countDocuments({ agent: agentId }),
    Property.countDocuments({ 
      agent: agentId,
      status: { $in: ["For Sale", "For Rent"] }
    }),
    Inquiry.countDocuments({ agent: agentId }),
    Inquiry.countDocuments({ agent: agentId, status: "pending" }),
    Tour.countDocuments({ 
      agent: agentId,
      status: "scheduled",
      scheduledDate: { $gte: new Date() }
    }),
  ]);

  return {
    totalProperties,
    activeProperties,
    totalInquiries,
    pendingInquiries,
    upcomingTours,
  };
}

async function getRecentActivity(agentId) {
  await connectDB();

  const recentProperties = await Property.find({ agent: agentId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status price createdAt")
    .lean();

  const recentInquiries = await Inquiry.find({ agent: agentId })
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

export default async function AgentOverviewPage() {
  const user = await getCurrentUser();
  const stats = await getAgentStats(user._id);
  const { recentProperties, recentInquiries } = await getRecentActivity(user._id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Building2}
          label="My Properties"
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
          label="Total Inquiries"
          value={stats.totalInquiries}
          color="blue"
        />
        <StatsCard
          icon={TrendingUp}
          label="Pending Leads"
          value={stats.pendingInquiries}
          color="yellow"
        />
      </div>

      {/* Upcoming Tours */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Tours</h2>
          <Link
            href="/dashboard/agent/tours"
            className="text-sm text-rose-600 hover:text-rose-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
          <Calendar className="h-8 w-8 text-indigo-600" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.upcomingTours}</p>
            <p className="text-sm text-gray-600">Scheduled tours</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Recent Listings</h2>
            <Link
              href="/dashboard/agent/listings"
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">No properties yet</p>
                <Link
                  href="/dashboard/agent/listings"
                  className="inline-block bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition"
                >
                  Add Your First Property
                </Link>
              </div>
            ) : (
              recentProperties.map((property) => (
                <div key={property._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
                    <p className="text-xs text-gray-500">
                      ${property.price?.toLocaleString()} • {new Date(property.createdAt).toLocaleDateString()}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
            <Link
              href="/dashboard/agent/leads"
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No inquiries yet</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/agent/listings"
            className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
          >
            <Building2 className="h-5 w-5 text-rose-600" />
            <span className="text-sm font-medium text-rose-900">Add New Property</span>
          </Link>
          <Link
            href="/dashboard/agent/leads"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
          >
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">View Leads</span>
          </Link>
          <Link
            href="/dashboard/agent/tours"
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
