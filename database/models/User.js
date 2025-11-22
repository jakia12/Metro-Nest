import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in dev
export default mongoose.models.User || mongoose.model("User", UserSchema);
