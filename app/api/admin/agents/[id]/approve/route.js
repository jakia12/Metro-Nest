import connectDB from "@/database/connect";
import Notification from "@/database/models/Notification";
import User from "@/database/models/user";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// POST - Approve agent
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

    // Update agent verification status
    agent.agentProfile.isVerified = true;
    agent.agentProfile.verifiedAt = new Date();
    agent.agentProfile.verifiedBy = user._id;
    await agent.save();

    // Create notification for agent
    await Notification.create({
      user: agent._id,
      type: "approval",
      title: "Account Approved!",
      message: "Your agent account has been approved. You can now start listing properties.",
      link: "/dashboard/agent/overview",
    });

    return NextResponse.json({
      success: true,
      message: "Agent approved successfully",
      data: agent,
    });
  } catch (error) {
    console.error("Error approving agent:", error);
    return NextResponse.json(
      { success: false, message: "Failed to approve agent" },
      { status: 500 }
    );
  }
}
