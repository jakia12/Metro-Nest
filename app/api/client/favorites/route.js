import connectDB from "@/database/connect";
import Favorite from "@/database/models/Favorite";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET user's favorites
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

    const favorites = await Favorite.find({ user: user._id })
      .populate("property")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST - Add to favorites
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already favorited
    const existing = await Favorite.findOne({
      user: user._id,
      property: propertyId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Already in favorites" },
        { status: 400 }
      );
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: user._id,
      property: propertyId,
    });

    return NextResponse.json({
      success: true,
      message: "Added to favorites",
      data: favorite,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

// DELETE - Remove from favorites
export async function DELETE(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    await Favorite.deleteOne({
      user: user._id,
      property: propertyId,
    });

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
