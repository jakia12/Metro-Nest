
import connectDB from "@/database/connect";
import { Property } from "@/database/models";
import Inquiry from "@/database/models/Inquiry";
import User from "@/database/models/User";

import { NextResponse } from "next/server";

// GET - Fetch inquiries (with filtering)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");
    const clientId = searchParams.get("clientId");
    const propertyId = searchParams.get("propertyId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Build query
    const query = {};
    if (agentId) query.agent = agentId;
    if (clientId) query.client = clientId;
    if (propertyId) query.property = propertyId;
    if (status) query.status = status;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const inquiries = await Inquiry.find(query)
      .populate("property", "title address price images")
      .populate("client", "name email phone")
      .populate("agent", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Inquiry.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new inquiry
export async function POST(req) {
  try {
   await connectDB();

    const body = await req.json();
    const { property, client, agent, name, email, phone, message } = body;

    // Validation
    if (!property || !client || !agent || !name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // Verify users exist
    const [clientExists, agentExists] = await Promise.all([
      User.findById(client),
      User.findById(agent),
    ]);

    if (!clientExists) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    if (!agentExists) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      );
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property,
      client,
      agent,
      name,
      email,
      phone,
      message,
      status: "pending",
    });

    // Populate before returning
    await inquiry.populate([
      { path: "property", select: "title address price images" },
      { path: "client", select: "name email phone" },
      { path: "agent", select: "name email phone" },
    ]);

    return NextResponse.json(
      { success: true, data: inquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}