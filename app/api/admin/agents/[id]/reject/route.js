import connectDB from "@/database/connect";
import Notification from "@/database/models/Notification";
import User from "@/database/models/user";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// POST - Reject agent
export async function POST(request, { params }) {
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

    const { id } = params;

    // Find and update agent
    const agent = await User.findById(id);

    if (!agent || agent.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    // Deactivate agent account
    agent.isActive = false;
    agent.agentProfile.isVerified = false;
    await agent.save();

    // Create notification for agent
    await Notification.create({
      user: agent._id,
      type: "approval",
      title: "Account Not Approved",
      message: "Your agent application was not approved. Please contact support for more information.",
      link: "/contact",
    });

    return NextResponse.json({
      success: true,
      message: "Agent rejected",
    });
  } catch (error) {
    console.error("Error rejecting agent:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reject agent" },
      { status: 500 }
    );
  }
}
