import connectDB from "@/database/connect";
import Tour from "@/database/models/Tour";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET agent's tours
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

    const tours = await Tour.find({ agent: user._id })
      .populate("property", "title address mainImage")
      .populate("client", "name email phone")
      .sort({ scheduledDate: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching agent tours:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
