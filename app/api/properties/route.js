import { NextResponse } from "next/server";
import connectDB from "../../../database/connect.js";
import Property from "../../../database/models/Property.js";

// GET all properties with optional filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const maxBeds = searchParams.get("maxBeds");
    const maxBaths = searchParams.get("maxBaths");
    const location = searchParams.get("location");
    const sortBy = searchParams.get("sortBy") || "default";
    const limit = parseInt(searchParams.get("limit")) || 0;

    // Build query
    const query = {};
    if (type && type !== "View All" && type !== "Select Property Type")
      query.type = type;
    if (status) query.status = status;
    if (featured === "true") query.featured = true;

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Area filter
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = parseInt(minArea);
      if (maxArea) query.area.$lte = parseInt(maxArea);
    }

    // Beds filter
    if (maxBeds) {
      query.beds = { $lte: parseInt(maxBeds) };
    }

    // Baths filter
    if (maxBaths) {
      query.baths = { $lte: parseInt(maxBaths) };
    }

    // Location filter
    if (location && location !== "Select Location") {
      query.address = { $regex: location, $options: "i" };
    }

    // Build sort
    let sort = {};
    if (sortBy === "priceLowHigh") sort.price = 1;
    else if (sortBy === "priceHighLow") sort.price = -1;
    else if (sortBy === "newest") sort.createdAt = -1;
    else sort.createdAt = -1;

    const properties = await Property.find(query)
      .sort(sort)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: properties,
        count: properties.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Properties API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// POST create new property
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const property = await Property.create(body);

    return NextResponse.json(
      {
        success: true,
        data: property,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
