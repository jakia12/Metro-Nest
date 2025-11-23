import connectDB from "@/database/connect";
import Property from "@/database/models/Property";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET agent's properties only
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    // Check if user is agent
    if (!user || user.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get only properties belonging to this agent
    const properties = await Property.find({ agent: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching agent properties:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
