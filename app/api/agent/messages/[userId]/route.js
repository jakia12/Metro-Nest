import connectDB from "@/database/connect";
import Message from "@/database/models/Message";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET messages with a specific user
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = params; // The other person's ID

    await connectDB();

    const messages = await Message.find({
      $or: [
        { sender: user._id, receiver: userId },
        { sender: userId, receiver: user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: user._id, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST send a message
export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = params; // Receiver ID
    const { message, propertyId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newMessage = await Message.create({
      sender: user._id,
      receiver: userId,
      message,
      property: propertyId || null,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
