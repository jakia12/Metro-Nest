import { NextResponse } from "next/server";

import connectDB from "@/database/connect.js";
import Lead from "../../../database/models/Lead.js";

// GET all leads
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const propertyId = searchParams.get("propertyId");

    const query = {};
    if (status) query.status = status;
    if (propertyId) query.propertyId = propertyId;

    let leadsQuery = Lead.find(query)
      .populate("propertyId", "title address price mainImage images")
      .sort({ createdAt: -1 });

    if (limit) {
      leadsQuery = leadsQuery.limit(parseInt(limit));
    }

    const leads = await leadsQuery.lean();

    return NextResponse.json(
      {
        success: true,
        data: leads,
        count: leads.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST create new lead
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and message are required",
        },
        { status: 400 }
      );
    }

    // Create lead with default source as "Website Form"
    const leadData = {
      ...body,
      source: body.source || "Website Form",
      status: body.status || "New",
    };

    const lead = await Lead.create(leadData);

    // Populate property details if propertyId exists
    const populatedLead = await Lead.findById(lead._id)
      .populate("propertyId", "title address price mainImage images")
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: populatedLead,
        message: "Thank you for your interest! We'll get back to you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
