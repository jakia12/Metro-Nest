
import connectDB from "@/database/connect";
import User from "@/database/models/User";

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password, role, phone, agentProfile, clientProfile } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Validate role
    const allowedRoles = ["client", "agent"];
    const userRole = role || "client";
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data
    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      phone,
    };

    // Add role-specific data
    if (userRole === "agent" && agentProfile) {
      userData.agentProfile = {
        licenseNumber: agentProfile.licenseNumber,
        agency: agentProfile.agency,
        experience: agentProfile.experience,
        specialization: agentProfile.specialization || [],
        bio: agentProfile.bio,
        website: agentProfile.website,
        isVerified: false, // Requires admin approval
      };
    }

    if (userRole === "client" && clientProfile) {
      userData.clientProfile = {
        preferredLocations: clientProfile.preferredLocations || [],
        budgetRange: clientProfile.budgetRange,
        lookingFor: clientProfile.lookingFor || "both",
      };
    }

    // Create user
    const user = await User.create(userData);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        message: userRole === "agent" 
          ? "Registration successful! Your account is pending admin approval." 
          : "Registration successful!",
        data: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}