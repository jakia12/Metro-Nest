import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/database/connect";

import { Property } from "@/database/models";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Import Favorite model
let Favorite;
try {
  Favorite = require("@/database/models/Favorite").default;
} catch (e) {
  console.error("Failed to import Favorite model:", e.message);
}

// GET - Fetch user's favorites
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    if (!Favorite) {
      return NextResponse.json(
        { success: false, message: "Favorite model not found" },
        { status: 500 }
      );
    }

    const userId = session.user.id || session.user._id;

    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: "property",
        select: "title address price images mainImage beds baths area status description",
      })
      .sort({ createdAt: -1 });

    const validFavorites = favorites.filter(fav => fav.property != null);

    return NextResponse.json({
      success: true,
      data: validFavorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Add to favorites
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login to add favorites" },
        { status: 401 }
      );
    }

    await connectDB();

    if (!Favorite) {
      return NextResponse.json(
        { success: false, message: "Favorite model not found" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id || session.user._id;

    const existingFavorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
    });

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, message: "Property already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await Favorite.create({
      user: userId,
      property: propertyId,
    });

    await favorite.populate({
      path: "property",
      select: "title address price images mainImage beds baths area status",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Added to favorites!",
        data: favorite,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove from favorites
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    if (!Favorite) {
      return NextResponse.json(
        { success: false, message: "Favorite model not found" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id || session.user._id;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      property: propertyId,
    });

    if (!favorite) {
      return NextResponse.json(
        { success: false, message: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Removed from favorites!",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}