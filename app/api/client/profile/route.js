import connectDB from "@/database/connect";
import User from "@/database/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// PUT - Update user profile
export async function PUT(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, phone, address } = await request.json();

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, phone, address },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

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
