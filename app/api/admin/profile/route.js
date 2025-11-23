import connectDB from "@/database/connect";
import User from "@/database/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET admin profile
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const admin = await User.findById(user._id).select("-password");

    return NextResponse.json({
      success: true,
      data: admin,
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

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, phone, address } = data;

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, phone, address },
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
