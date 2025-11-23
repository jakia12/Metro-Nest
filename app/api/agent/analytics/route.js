import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import Property from "@/database/models/Property";
import Tour from "@/database/models/Tour";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET agent analytics
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

    // 1. Total Listings
    const totalListings = await Property.countDocuments({ agent: user._id });
    
    // 2. Active Listings
    const activeListings = await Property.countDocuments({ 
      agent: user._id, 
      status: { $in: ["For Sale", "For Rent"] } 
    });

    // 3. Total Inquiries
    const totalInquiries = await Inquiry.countDocuments({ agent: user._id });
    
    // 4. Pending Inquiries
    const pendingInquiries = await Inquiry.countDocuments({ 
      agent: user._id, 
      status: "pending" 
    });

    // 5. Total Tours
    const totalTours = await Tour.countDocuments({ agent: user._id });
    
    // 6. Scheduled Tours
    const scheduledTours = await Tour.countDocuments({ 
      agent: user._id, 
      status: "scheduled" 
    });

    // 7. Recent Activity (Last 5 inquiries/tours combined)
    const recentInquiries = await Inquiry.find({ agent: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property", "title")
      .lean();

    // 8. Property Performance (Top 5 most viewed/inquired)
    // Since we don't track views explicitly yet, we'll use inquiry count per property
    const propertyPerformance = await Inquiry.aggregate([
      { $match: { agent: user._id } },
      { $group: { _id: "$property", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" },
      {
        $project: {
          title: "$property.title",
          price: "$property.price",
          inquiries: "$count",
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          listings: { total: totalListings, active: activeListings },
          inquiries: { total: totalInquiries, pending: pendingInquiries },
          tours: { total: totalTours, scheduled: scheduledTours },
        },
        recentActivity: recentInquiries,
        topProperties: propertyPerformance,
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
