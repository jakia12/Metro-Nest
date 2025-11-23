
import connectDB from "@/database/connect";
import User from "@/database/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Your account has been deactivated" },
        { status: 403 }
      );
    }

    // Check if agent is verified
    if (user.role === "agent" && !user.agentProfile?.isVerified) {
      return NextResponse.json(
        { success: false, message: "Your agent account is pending admin approval" },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: userResponse,
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
