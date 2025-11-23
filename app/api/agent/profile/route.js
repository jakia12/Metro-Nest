import connectDB from "@/database/connect";
import User from "@/database/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET agent profile
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
    const agent = await User.findById(user._id).select("-password");

    return NextResponse.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT update profile
export async function PUT(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, phone, address, agentProfile } = data;

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        phone,
        address,
        agentProfile: {
          ...user.agentProfile, // Preserve existing fields like isVerified
          ...agentProfile,
        },
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
