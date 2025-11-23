import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET client's inquiries
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

    const inquiries = await Inquiry.find({ client: user._id })
      .populate("property")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

// POST - Send new inquiry
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { property, message } = await request.json();

    if (!property || !message) {
      return NextResponse.json(
        { success: false, message: "Property and message are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const inquiry = await Inquiry.create({
      property,
      client: user._id,
      message,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry sent successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
