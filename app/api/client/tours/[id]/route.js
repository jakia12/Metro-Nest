import connectDB from "@/database/connect";
import Tour from "@/database/models/Tour";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// DELETE - Cancel a tour
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = params;

    // Find tour and verify ownership
    const tour = await Tour.findOne({ _id: id, client: user._id });

    if (!tour) {
      return NextResponse.json(
        { success: false, message: "Tour not found" },
        { status: 404 }
      );
    }

    // Delete tour
    await Tour.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Tour cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling tour:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel tour" },
      { status: 500 }
    );
  }
}
