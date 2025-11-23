import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// DELETE inquiry
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = params;

    const inquiry = await Inquiry.findOneAndDelete({
      _id: id,
      agent: user._id, // Ensure agent owns this inquiry
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
