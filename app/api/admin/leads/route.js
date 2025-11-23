import connectDB from "@/database/connect.js";
import Lead from "@/database/models/Lead.js";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET all leads for admin with filters, search, and pagination
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
    const priority = searchParams.get("priority");
    const source = searchParams.get("source");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query.source = source;
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch leads with pagination
    const leads = await Lead.find(query)
      .populate("propertyId", "title address price mainImage images category")
      .populate("assignedTo", "name email")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalLeads = await Lead.countDocuments(query);

    // Get statistics
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = {
      New: 0,
      "In Follow-up": 0,
      Hot: 0,
      "Tour Booked": 0,
      Closed: 0,
      Lost: 0,
    };

    stats.forEach((stat) => {
      statusStats[stat._id] = stat.count;
    });

    return NextResponse.json(
      {
        success: true,
        data: leads,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalLeads / limit),
          totalLeads,
          limit,
        },
        stats: statusStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin leads:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
