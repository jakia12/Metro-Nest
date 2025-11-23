import connectDB from "@/database/connect";
import User from "@/database/models/user";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET all agents
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    // Check if user is admin
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all users with agent role
    const agents = await User.find({ role: "agent" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
