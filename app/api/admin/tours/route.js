import connectDB from "@/database/connect.js";
import Tour from "@/database/models/Tour.js";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET all tours for admin with filters and pagination
export async function GET(request) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const agentId = searchParams.get("agentId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const view = searchParams.get("view") || "list"; // list or calendar

    // Build query
    const query = {};
    if (status) query.status = status;
    if (agentId) query.agent = agentId;
    
    // Date range filter
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }

    // For calendar view, fetch all tours in the date range without pagination
    const skip = view === "calendar" ? 0 : (page - 1) * limit;
    const queryLimit = view === "calendar" ? 1000 : limit;

    // Fetch tours
    const tours = await Tour.find(query)
      .populate("property", "title address price mainImage images category")
      .populate("client", "name email phone")
      .populate("agent", "name email phone agentProfile")
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .skip(skip)
      .limit(queryLimit)
      .lean();

    // Get total count for pagination
    const totalTours = await Tour.countDocuments(query);

    // Get statistics
    const stats = await Tour.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    stats.forEach((stat) => {
      statusStats[stat._id] = stat.count;
    });

    // Get upcoming tours count (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const upcomingCount = await Tour.countDocuments({
      status: "scheduled",
      scheduledDate: {
        $gte: today,
        $lte: nextWeek,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: tours,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalTours / limit),
          totalTours,
          limit,
        },
        stats: {
          ...statusStats,
          upcomingWeek: upcomingCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin tours:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
