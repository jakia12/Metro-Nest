import connectDB from "@/database/connect";
import User from "@/database/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// DELETE client
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    await connectDB();

    const client = await User.findOneAndDelete({ _id: id, role: "client" });

    if (!client) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete client" },
      { status: 500 }
    );
  }
}
