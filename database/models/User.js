// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "agent", "client"],
      default: "client",
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "/images/default-avatar.png",
    },
    // Agent-specific fields
    agentProfile: {
      licenseNumber: String,
      agency: String,
      experience: Number, // years
      specialization: [String], // ["residential", "commercial", "luxury"]
      bio: String,
      website: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    // Client-specific fields
    clientProfile: {
      preferredLocations: [String],
      budgetRange: {
        min: Number,
        max: Number,
      },
      lookingFor: {
        type: String,
        enum: ["buy", "rent", "both"],
        default: "both",
      },
    },
    // Common fields
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);

// ============================================
// models/Property.js - Updated with agent reference
// ============================================


