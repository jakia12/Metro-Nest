import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// POST reply to inquiry
export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const inquiry = await Inquiry.findOneAndUpdate(
      { _id: id, agent: user._id },
      { 
        agentResponse: message,
        respondedAt: new Date(),
        status: "replied"
      },
      { new: true }
    );

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Error replying to inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reply" },
      { status: 500 }
    );
  }
}
