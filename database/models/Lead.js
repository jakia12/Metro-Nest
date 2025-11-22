import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    // Additional lead tracking fields
    budget: {
      type: String,
      default: "",
    },
    propertyType: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      enum: ["Website Form", "Instagram", "Facebook", "Google Ads", "Referral", "Direct", "Other"],
      default: "Website Form",
    },
    status: {
      type: String,
      enum: ["New", "In Follow-up", "Hot", "Tour Booked", "Closed", "Lost"],
      default: "New",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastContactedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ propertyId: 1 });

const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

export default Lead;
