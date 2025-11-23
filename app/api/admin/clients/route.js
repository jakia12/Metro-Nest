import connectDB from "@/database/connect";
import User from "@/database/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET all clients
export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const clients = await User.find({ role: "client" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
