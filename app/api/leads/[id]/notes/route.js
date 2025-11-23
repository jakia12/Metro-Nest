
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/database/connect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


// POST /api/leads/[id]/notes - Add a note to a lead
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = params;
    const { note } = await request.json();

    if (!note || !note.trim()) {
      return NextResponse.json(
        { success: false, error: "Note text is required" },
        { status: 400 }
      );
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    // Add note to the lead
    if (!lead.notes) {
      Lead.notes = [];
    }

    lead.notes.push({
      text: note,
      createdAt: new Date(),
      createdBy: session.user.email,
    });

    await lead.save();

    return NextResponse.json({
      success: true,
      message: "Note added successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add note" },
      { status: 500 }
    );
  }
}
