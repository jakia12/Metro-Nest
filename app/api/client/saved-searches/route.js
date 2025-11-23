import connectDB from "@/database/connect";
import SavedSearch from "@/database/models/SavedSearch";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET user's saved searches
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const searches = await SavedSearch.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: searches,
    });
  } catch (error) {
    console.error("Error fetching saved searches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch saved searches" },
      { status: 500 }
    );
  }
}

// POST - Create new saved search
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, criteria, alertFrequency } = await request.json();

    if (!name || !criteria) {
      return NextResponse.json(
        { success: false, message: "Name and criteria are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const search = await SavedSearch.create({
      user: user._id,
      name,
      criteria,
      alertFrequency: alertFrequency || "instant",
    });

    return NextResponse.json({
      success: true,
      message: "Search saved successfully",
      data: search,
    });
  } catch (error) {
    console.error("Error saving search:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save search" },
      { status: 500 }
    );
  }
}
