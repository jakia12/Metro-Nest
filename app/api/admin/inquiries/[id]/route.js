import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// PATCH - Update inquiry
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    await connectDB();

    // Update the inquiry
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.agentResponse && { respondedAt: new Date() }),
      },
      { new: true, runValidators: true }
    )
      .populate("property", "title mainImage price address category")
      .populate("agent", "name email phone")
      .populate("client", "name email phone")
      .lean();

    if (!updatedInquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedInquiry,
      message: "Inquiry updated successfully",
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// DELETE inquiry
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    await connectDB();

    const inquiry = await Inquiry.findByIdAndDelete(id);

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
