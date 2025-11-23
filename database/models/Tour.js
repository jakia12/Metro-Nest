import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: String,
    clientPhone: String,
    clientEmail: String,
  },
  { timestamps: true }
);

// Indexes for faster queries
tourSchema.index({ agent: 1, status: 1 });
tourSchema.index({ client: 1 });
tourSchema.index({ scheduledDate: 1 });

export default mongoose.models.Tour || mongoose.model("Tour", tourSchema);
