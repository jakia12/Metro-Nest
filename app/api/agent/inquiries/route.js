import connectDB from "@/database/connect";
import Inquiry from "@/database/models/Inquiry";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET agent's inquiries (leads)
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find inquiries where the property's agent is the current user
    // OR where the inquiry.agent field matches current user (if explicitly set)
    const inquiries = await Inquiry.find({ agent: user._id })
      .populate("property", "title price mainImage address")
      .populate("client", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching agent inquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
