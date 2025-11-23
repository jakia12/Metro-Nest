import mongoose from "mongoose";

const savedSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    filters: {
      propertyType: String,
      location: String,
      minPrice: Number,
      maxPrice: Number,
      minBeds: Number,
      minBaths: Number,
      minArea: Number,
      maxArea: Number,
      status: String,
    },
    alertEnabled: {
      type: Boolean,
      default: true,
    },
    alertFrequency: {
      type: String,
      enum: ["daily", "weekly", "instant"],
      default: "instant",
    },
    lastChecked: Date,
  },
  { timestamps: true }
);

// Indexes
savedSearchSchema.index({ user: 1 });
savedSearchSchema.index({ alertEnabled: 1, lastChecked: 1 });

export default mongoose.models.SavedSearch || mongoose.model("SavedSearch", savedSearchSchema);
