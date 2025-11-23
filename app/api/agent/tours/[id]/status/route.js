import connectDB from "@/database/connect";
import Tour from "@/database/models/Tour";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// PATCH update tour status
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    await connectDB();

    const tour = await Tour.findOneAndUpdate(
      { _id: id, agent: user._id },
      { status },
      { new: true }
    );

    if (!tour) {
      return NextResponse.json(
        { success: false, message: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tour status updated successfully",
      data: tour,
    });
  } catch (error) {
    console.error("Error updating tour status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}
