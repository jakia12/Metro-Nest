import connectDB from "@/database/connect";
import SavedSearch from "@/database/models/SavedSearch";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// PUT - Update saved search
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { name, criteria, alertFrequency } = await request.json();

    await connectDB();

    const search = await SavedSearch.findOneAndUpdate(
      { _id: id, user: user._id },
      { name, criteria, alertFrequency },
      { new: true }
    );

    if (!search) {
      return NextResponse.json(
        { success: false, message: "Search not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Search updated successfully",
      data: search,
    });
  } catch (error) {
    console.error("Error updating search:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update search" },
      { status: 500 }
    );
  }
}

// DELETE - Delete saved search
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

    const search = await SavedSearch.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!search) {
      return NextResponse.json(
        { success: false, message: "Search not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Search deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting search:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete search" },
      { status: 500 }
    );
  }
}
