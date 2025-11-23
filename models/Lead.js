import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Hot",
        "Tour Scheduled",
        "Converted",
        "Lost",
        "In Follow-up",
        "Closed",
      ],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Phone", "Email", "Referral", "Walk-in", "Social Media"],
      default: "Website",
    },
    notes: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        createdBy: String,
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ email: 1 });
leadSchema.index({ assignedTo: 1 });

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
