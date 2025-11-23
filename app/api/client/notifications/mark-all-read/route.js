import connectDB from "@/database/connect";
import Notification from "@/database/models/Notification";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// PATCH - Mark all notifications as read
export async function PATCH(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    await Notification.updateMany(
      { user: user._id, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
