import { NextResponse } from "next/server";
import connectDB from "../../../database/connect.js";
import Category from "../../../database/models/Category.js";

// GET all categories
export async function GET(request) {
  try {
    await connectDB();

    const categories = await Category.find({ active: true })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Categories API Error:", error);
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

// POST create new category
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const category = await Category.create(body);

    return NextResponse.json(
      {
        success: true,
        data: category,
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
