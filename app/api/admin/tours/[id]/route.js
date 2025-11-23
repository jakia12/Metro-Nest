import connectDB from "@/database/connect.js";
import Tour from "@/database/models/Tour.js";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

// PATCH - Update a specific tour
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

    // Update the tour
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate("property", "title address price mainImage images category")
      .populate("client", "name email phone")
      .populate("agent", "name email phone agentProfile")
      .lean();

    if (!updatedTour) {
      return NextResponse.json(
        { success: false, message: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedTour,
        message: "Tour updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific tour
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

    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
      return NextResponse.json(
        { success: false, message: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tour deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
