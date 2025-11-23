
import connectDB from "@/database/connect";
import Notification from "@/database/models/Notification";
import User from "@/database/models/User";
import mongoose from "mongoose";

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

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid agent ID format" },
        { status: 400 }
      );
    }

    // Find agent
    const agent = await User.findById(id);

    console.log("Looking for agent with ID:", id);
    console.log("Agent found:", agent ? "Yes" : "No");
    if (agent) {
      console.log("Agent role:", agent.role);
      console.log("Agent profile:", agent.agentProfile);
    }

    if (!agent) {
      return NextResponse.json(
        { success: false, message: "User not found with ID: " + id },
        { status: 404 }
      );
    }

    if (agent.role !== "agent") {
      return NextResponse.json(
        { success: false, message: `User is not an agent. Current role: ${agent.role}` },
        { status: 400 }
      );
    }

    // Initialize agentProfile if it doesn't exist
    if (!agent.agentProfile) {
      agent.agentProfile = {};
    }

    // Update agent verification status
    agent.agentProfile.isVerified = true;
    agent.agentProfile.verifiedAt = new Date();
    agent.agentProfile.verifiedBy = user._id;
    
    // Mark the nested path as modified for Mongoose
    agent.markModified('agentProfile');
    
    await agent.save();

    console.log("Agent approved successfully:", agent._id);

    // Create notification for agent
    try {
      await Notification.create({
        user: agent._id,
        type: "approval",
        title: "Account Approved!",
        message: "Your agent account has been approved. You can now start listing properties.",
        link: "/dashboard/agent/overview",
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
      // Don't fail the approval if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Agent approved successfully",
      data: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        isVerified: agent.agentProfile?.isVerified,
      },
    });
  } catch (error) {
    console.error("Error approving agent:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to approve agent", error: error.toString() },
      { status: 500 }
    );
  }
}
