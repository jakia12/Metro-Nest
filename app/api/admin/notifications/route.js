import connectDB from "@/database/connect";
import Notification from "@/database/models/Notification";
import User from "@/database/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET admin notifications (history of sent alerts)
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

    // For now, we'll just return notifications that were created by admin (if we tracked sender)
    // Or just all notifications since admin can see everything
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST send notification
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message, role } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find target users
    const query = role === "all" ? {} : { role };
    const users = await User.find(query).select("_id");

    // Create notifications for all target users
    const notifications = users.map((u) => ({
      user: u._id,
      message,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${notifications.length} users`,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send notification" },
      { status: 500 }
    );
  }
}
