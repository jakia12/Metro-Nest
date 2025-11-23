import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    beds: {
      type: Number,
      required: true,
      default: 0,
    },

    baths: {
      type: Number,
      required: true,
      default: 0,
    },

    area: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["For Sale", "For Rent", "Sold", "Rented"],
      default: "For Sale",
    },

    type: {
      type: String,
      enum: [
        "Apartment",
        "Commercial",
        "Land Or Plot",
        "Farm",
        "Villa",
        "House",
        "Cottage",
        "Loft",
        "Penthouse",
        "Mansion",
      ],
      default: "Apartment",
    },

    description: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    mainImage: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // Updated highlights to match UI & JSON
    highlights: {
      yearBuilt: Number,
      parking: String,
      heating: String,
      cooling: String,
    },

    amenities: {
      type: [String],
      default: [],
    },

    // Extended for map & filters
    location: {
      lat: Number,
      lng: Number,
      city: String,
      state: String,
      zipcode: String,
    },

    floorplan: {
      image: String,
      description: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },
     // Add agent reference
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentName: String, // Denormalized for faster queries
    agentEmail: String,
    agentPhone: String,
    
    // ... rest of your existing fields
  },
 
  {
    timestamps: true,
  }
);

const Property =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);

export default Property;
