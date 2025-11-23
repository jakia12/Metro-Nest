import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import Property from "@/database/models/Property";
import User from "@/database/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET admin analytics
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // 1. User Stats
    const totalUsers = await User.countDocuments({});
    const totalAgents = await User.countDocuments({ role: "agent" });
    const totalClients = await User.countDocuments({ role: "client" });

    // 2. Property Stats
    const totalProperties = await Property.countDocuments({});
    const activeProperties = await Property.countDocuments({ status: { $in: ["For Sale", "For Rent"] } });

    // 3. Inquiry Stats
    const totalInquiries = await Inquiry.countDocuments({});
    const pendingInquiries = await Inquiry.countDocuments({ status: "pending" });

    // 4. Recent Users
    const recentUsers = await User.find({})
      .select("name role createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 5. Recent Properties
    const recentProperties = await Property.find({})
      .select("title price status mainImage createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          agents: totalAgents,
          clients: totalClients,
        },
        properties: {
          total: totalProperties,
          active: activeProperties,
        },
        inquiries: {
          total: totalInquiries,
          pending: pendingInquiries,
        },
        recentUsers,
        recentProperties,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
