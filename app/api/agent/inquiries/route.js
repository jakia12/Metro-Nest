import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET agent's inquiries (leads) with filters and pagination
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build query
    const query = { agent: user._id };
    if (status) query.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Find inquiries where the property's agent is the current user
    const inquiries = await Inquiry.find(query)
      .populate("property", "title price mainImage address category")
      .populate("client", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalInquiries = await Inquiry.countDocuments(query);

    // Get statistics
    const stats = await Inquiry.aggregate([
      { $match: { agent: user._id } },
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
    console.error("Error fetching agent inquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
