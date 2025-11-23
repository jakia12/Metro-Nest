// lib/auth.js - Authentication utilities

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/database/connect";
import User from "@/database/models/User";
import jwt from "jsonwebtoken";

import { getServerSession } from "next-auth";

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token or null
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-this");
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Get current user from session (server-side)
 * @returns {Promise<Object|null>} User object or null
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("-password");
    
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if user has required role
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Promise<Object|null>} User if authorized, null otherwise
 */
export async function requireRole(allowedRoles) {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!roles.includes(user.role)) {
    return null;
  }

  return user;
}

/**
 * Check if user is admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if user is agent
 * @returns {Promise<boolean>}
 */
export async function isAgent() {
  const user = await getCurrentUser();
  return user?.role === "agent";
}

/**
 * Check if user is client
 * @returns {Promise<boolean>}
 */
export async function isClient() {
  const user = await getCurrentUser();
  return user?.role === "client";
}
