import connectDB from "@/database/connect";
import Testimonial from "@/database/models/Testimonial";
import { NextResponse } from "next/server";

// GET all reviews
export async function GET(request) {
  try {
    await connectDB();
    const reviews = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
