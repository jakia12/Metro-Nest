import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET all inquiries with filters, search, and pagination
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query = {};
    if (status) query.status = status;

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

    // Fetch inquiries with pagination
    const inquiries = await Inquiry.find(query)
      .populate("property", "title mainImage price address category")
      .populate("agent", "name email phone")
      .populate("client", "name email phone")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalInquiries = await Inquiry.countDocuments(query);

    // Get statistics
    const stats = await Inquiry.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = {
      pending: 0,
      replied: 0,
      closed: 0,
    };

    stats.forEach((stat) => {
      statusStats[stat._id] = stat.count;
    });

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalInquiries / limit),
        totalInquiries,
        limit,
      },
      stats: statusStats,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
