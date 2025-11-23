
import connectDB from "@/database/connect";
import Notification from "@/database/models/Notification";
import User from "@/database/models/User";

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

    // Find agent
    const agent = await User.findById(id);

    if (!agent) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (agent.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "User is not an agent" },
        { status: 400 }
      );
    }

    // Initialize agentProfile if it doesn't exist
    if (!agent.agentProfile) {
      agent.agentProfile = {};
    }

    // Deactivate agent account
    agent.isActive = false;
    agent.agentProfile.isVerified = false;
    
    // Mark the nested path as modified for Mongoose
    agent.markModified('agentProfile');
    
    await agent.save();

    // Create notification for agent
    try {
      await Notification.create({
        user: agent._id,
        type: "rejection",
        title: "Account Not Approved",
        message: "Your agent application was not approved. Please contact support for more information.",
        link: "/contact",
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
      // Don't fail the rejection if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Agent rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting agent:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to reject agent" },
      { status: 500 }
    );
  }
}
