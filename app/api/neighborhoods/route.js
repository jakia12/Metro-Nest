import { NextResponse } from "next/server";
import connectDB from "../../../database/connect.js";
import Property from "../../../database/models/Property.js";

// GET neighborhoods aggregated from properties
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 4;

    // Get all properties
    const properties = await Property.find({}).lean();

    // Group properties by location (extract city from address)
    const neighborhoodMap = new Map();

    properties.forEach((property) => {
      // Extract city/neighborhood from address
      // Format: "39581 Rohan Estates, New York" -> "New York"
      // Or "New Jersey, New York" -> "New Jersey, New York"
      const address = property.address || "";
      let city = "";

      // Try to extract city from common address formats
      const parts = address.split(",");
      if (parts.length >= 2) {
        // Take the last part (usually city, state)
        city = parts[parts.length - 1].trim();
      } else if (parts.length === 1) {
        // If no comma, try to extract from common patterns
        city = address.trim();
      }

      // If we couldn't extract, use a default or skip
      if (!city) {
        city = "Unknown Location";
      }

      // Normalize city name (remove extra spaces, standardize)
      city = city.replace(/\s+/g, " ").trim();

      if (!neighborhoodMap.has(city)) {
        neighborhoodMap.set(city, {
          name: city,
          properties: [],
          count: 0,
        });
      }

      const neighborhood = neighborhoodMap.get(city);
      neighborhood.properties.push(property);
      neighborhood.count = neighborhood.properties.length;
    });

    // Convert map to array and format response
    const neighborhoods = Array.from(neighborhoodMap.values())
      .map((neighborhood) => {
        // Get first property image as neighborhood image
        const firstProperty = neighborhood.properties[0];
        const image =
          firstProperty?.mainImage ||
          firstProperty?.images?.[0] ||
          "/images/pr.png";

        return {
          name: neighborhood.name,
          properties: neighborhood.count,
          image: image,
          // Include full address for reference
          address: firstProperty?.address || "",
        };
      })
      // Sort by property count (descending)
      .sort((a, b) => b.properties - a.properties)
      // Limit results
      .slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        data: neighborhoods,
        count: neighborhoods.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
