import connectDB from "@/database/connect.js";
import Lead from "@/database/models/Lead.js";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

// PATCH - Update a specific lead
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Update the lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { ...body, lastContactedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate("propertyId", "title address price mainImage images category")
      .populate("assignedTo", "name email")
      .lean();

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedLead,
        message: "Lead updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific lead
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
