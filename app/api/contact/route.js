import { NextResponse } from "next/server";
import connectDB from "../../../database/connect.js";
import Contact from "../../../database/models/Contact.js";

// GET all contact messages
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .populate("propertyId", "title address")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: contacts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST create new contact message
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const contact = await Contact.create(body);

    return NextResponse.json(
      {
        success: true,
        data: contact,
        message: "Thank you for contacting us! We'll get back to you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
