import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "MetroNest",
    },
    supportEmail: {
      type: String,
      default: "support@metronest.com",
    },
    phone: {
      type: String,
      default: "+880 123 456 7890",
    },
    address: {
      type: String,
      default: "Dhaka, Bangladesh",
    },
    currency: {
      type: String,
      default: "BDT",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
