import connectDB from "@/database/connect";
import Property from "@/database/models/Property";
import Tour from "@/database/models/Tour";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET client's tours
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

    const tours = await Tour.find({ client: user._id })
      .populate("property")
      .populate("agent", "name email phone")
      .sort({ scheduledDate: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

// POST - Schedule a tour
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { property, scheduledDate, scheduledTime, notes } = await request.json();

    if (!property || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { success: false, message: "Property, date, and time are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get property and agent info
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // Create tour
    const tour = await Tour.create({
      property,
      client: user._id,
      agent: propertyDoc.agent,
      scheduledDate,
      scheduledTime,
      notes,
      status: "scheduled",
    });

    return NextResponse.json({
      success: true,
      message: "Tour scheduled successfully",
      data: tour,
    });
  } catch (error) {
    console.error("Error scheduling tour:", error);
    return NextResponse.json(
      { success: false, message: "Failed to schedule tour" },
      { status: 500 }
    );
  }
}
