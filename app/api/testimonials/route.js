import { NextResponse } from "next/server";
import connectDB from "../../../database/connect.js";
import Testimonial from "../../../database/models/Testimonial.js";

// GET all testimonials
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const query = { active: true };
    if (featured === "true") query.featured = true;

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: testimonials,
      },
      { status: 200 }
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

// POST create new testimonial
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const testimonial = await Testimonial.create(body);

    return NextResponse.json(
      {
        success: true,
        data: testimonial,
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
