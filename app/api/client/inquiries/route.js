import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/database/connect";
import { Property } from "@/database/models";
import Inquiry from "@/database/models/Inquiry";
import User from "@/database/models/User";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET - Fetch client's inquiries
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find inquiries where the logged-in user is the client
    const inquiries = await Inquiry.find({ client: session.user.id })
      .populate("property", "title address price images mainImage")
      .populate("agent", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching client inquiries:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new inquiry (client side)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login to send an inquiry" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { property, message } = body;

    // Validation
    if (!property || !message) {
      return NextResponse.json(
        { success: false, message: "Property and message are required" },
        { status: 400 }
      );
    }

    // Verify property exists and get agent info
    const propertyDoc = await Property.findById(property).populate("agent");
    
    if (!propertyDoc) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // Get current user details
    const currentUser = await User.findById(session.user.id);
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Determine agent: use property agent, or owner, or find first agent, or use current user
    let agentId = propertyDoc.agent?._id || propertyDoc.agent;
    
    if (!agentId) {
      // Try to use the property owner as agent
      agentId = propertyDoc.owner || propertyDoc.user;
      
      // If still no agent, find the first user with role 'agent'
      if (!agentId) {
        const firstAgent = await User.findOne({ role: "agent" });
        if (firstAgent) {
          agentId = firstAgent._id;
        } else {
          // Last resort: use the current user as both client and agent
          agentId = currentUser._id;
        }
      }
    }

    // Create inquiry with all required fields
    const inquiry = await Inquiry.create({
      property: propertyDoc._id,
      client: currentUser._id,
      agent: agentId,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || "",
      message,
      status: "pending",
    });

    // Populate before returning
    await inquiry.populate([
      { path: "property", select: "title address price images mainImage" },
      { path: "agent", select: "name email phone" },
    ]);

    return NextResponse.json(
      { 
        success: true, 
        message: "Inquiry sent successfully!",
        data: inquiry 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}