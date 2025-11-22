// models/seed.js
import connectDB from "./connect.js";
import { Category, Property, Testimonial } from "./models/index.js";

const seedData = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Property.deleteMany({});
    await Category.deleteMany({});
    await Testimonial.deleteMany({});
    console.log("🧹 Cleared existing data");

    // ---------- CATEGORIES ----------
    const categories = [
      {
        name: "Apartment",
        slug: "apartment",
        description: "Modern apartments in prime locations",
        propertyCount: 0,
      },
      {
        name: "Commercial",
        slug: "commercial",
        description: "Commercial properties for business",
        propertyCount: 0,
      },
      {
        name: "Land Or Plot",
        slug: "land-or-plot",
        description: "Land and plot properties",
        propertyCount: 0,
      },
      {
        name: "Farm",
        slug: "farm",
        description: "Farm properties and estates",
        propertyCount: 0,
      },
      {
        name: "Villa",
        slug: "villa",
        description: "Luxury villas",
        propertyCount: 0,
      },
      {
        name: "House",
        slug: "house",
        description: "Family houses",
        propertyCount: 0,
      },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // ---------- PROPERTIES ----------
    const properties = [
      {
        title: "Charming Beach House",
        address: "39581 Rohan Estates, New York",
        price: 179800,
        beds: 4,
        baths: 2,
        area: 1500,
        status: "For Sale",
        type: "House",
        description:
          "A charming beach house with modern finishes, surrounded by scenic greenery and premium neighborhood views.",
        images: ["/images/pr.png", "/images/pr2.png", "/images/pr3.png"],
        mainImage: "/images/pr.png",
        featured: true,
        highlights: {
          yearBuilt: 2021,
          parking: "2 Cars",
          heating: "Central Heating",
          cooling: "Air Cooling",
        },
        amenities: [
          "Balcony",
          "Swimming Pool",
          "Central Heating",
          "Laundry Room",
          "Gym",
          "Alarm",
          "Window Covering",
          "Refrigerator",
        ],
        location: {
          lat: 40.7128,
          lng: -74.006,
          city: "New York",
          state: "NY",
          zipcode: "39581",
        },
        floorplan: {
          image: "/images/pr5.png",
          description:
            "Spacious floor design with a warm layout, well-lit interior, open concept kitchen and dining.",
        },
      },

      {
        title: "Contemporary Loft",
        address: "39581 Rohan Estates, New York",
        price: 335800,
        beds: 4,
        baths: 2,
        area: 1500,
        status: "For Sale",
        type: "Loft",
        description:
          "Beautiful contemporary loft located in a peaceful neighborhood with modern exterior and smart interior layout.",
        images: ["/images/pr2.png", "/images/pr3.png", "/images/pr5.png"],
        mainImage: "/images/pr2.png",
        featured: true,
        highlights: {
          yearBuilt: 2020,
          parking: "1 Car",
          heating: "Electric Heating",
          cooling: "Central AC",
        },
        amenities: [
          "Balcony",
          "Air Conditioning",
          "Microwave",
          "Washer",
          "WiFi",
          "Dryer",
          "Refrigerator",
        ],
        location: {
          lat: 40.714,
          lng: -74.01,
          city: "New York",
          state: "NY",
          zipcode: "39581",
        },
        floorplan: {
          image: "/images/pr4.png",
          description:
            "Functional loft layout designed to maximize space, natural light, and comfort.",
        },
      },

      {
        title: "Cozy Cottage",
        address: "39581 Rohan Estates, New York",
        price: 250800,
        beds: 4,
        baths: 2,
        area: 1500,
        status: "For Sale",
        type: "Cottage",
        description:
          "Beautiful cozy cottage in a peaceful neighborhood with garden and modern design elements.",
        images: ["/images/pr3.png", "/images/pr4.png", "/images/pr5.png"],
        mainImage: "/images/pr3.png",
        featured: false,
        highlights: {
          yearBuilt: 2019,
          parking: "1 Car",
          heating: "Gas Heating",
          cooling: "Air Cooling",
        },
        amenities: [
          "Garden",
          "Laundry Room",
          "Window Covering",
          "Alarm",
          "Microwave",
          "Refrigerator",
          "WiFi",
        ],
        location: {
          lat: 40.716,
          lng: -74.003,
          city: "New York",
          state: "NY",
          zipcode: "39581",
        },
        floorplan: {
          image: "/images/pr6.jpg",
          description:
            "Warm and cozy floorplan ideal for families or couples seeking privacy.",
        },
      },

      {
        title: "Modern Beach House",
        address: "39581 Rohan Estates, New York",
        price: 295400,
        beds: 4,
        baths: 2,
        area: 1500,
        status: "For Sale",
        type: "House",
        description:
          "Modern beach house featuring stylish design, bright interiors, and stunning curb appeal.",
        images: ["/images/pr4.png", "/images/pr5.png", "/images/pr6.jpg"],
        mainImage: "/images/pr4.png",
        featured: true,
        highlights: {
          yearBuilt: 2022,
          parking: "2 Cars",
          heating: "Central Heating",
          cooling: "Central AC",
        },
        amenities: [
          "Balcony",
          "Swimming Pool",
          "Gym",
          "TV Cable",
          "WiFi",
          "Microwave",
          "Refrigerator",
        ],
        location: {
          lat: 40.713,
          lng: -74.014,
          city: "New York",
          state: "NY",
          zipcode: "39581",
        },
        floorplan: {
          image: "/images/pr5.png",
          description:
            "Open floorplan with bright, airy rooms designed for seaside living.",
        },
      },

      {
        title: "Family Villa Retreat",
        address: "42 Palm Heights, New Jersey",
        price: 420000,
        beds: 5,
        baths: 3,
        area: 2200,
        status: "For Sale",
        type: "Villa",
        description:
          "A luxurious family villa with premium materials, spacious garden, and relaxing outdoor lounge.",
        images: ["/images/pr7.webp", "/images/pr6.jpg", "/images/pr5.png"],
        mainImage: "/images/pr7.webp",
        featured: true,
        highlights: {
          yearBuilt: 2018,
          parking: "3 Cars",
          heating: "Hybrid Heating",
          cooling: "Ducted AC",
        },
        amenities: [
          "Garden",
          "Swimming Pool",
          "Gym",
          "Laundry Room",
          "Alarm",
          "Microwave",
          "Refrigerator",
          "WiFi",
        ],
        location: {
          lat: 40.745,
          lng: -73.99,
          city: "New Jersey",
          state: "NJ",
          zipcode: "07030",
        },
        floorplan: {
          image: "/images/pr8.png",
          description:
            "Grand open concept floorplan with premium finishes and high ceilings.",
        },
      },

      {
        title: "Luxury Mansion Estate",
        address: "18 Crestview Park, Los Angeles",
        price: 975000,
        beds: 6,
        baths: 5,
        area: 4500,
        status: "For Sale",
        type: "Mansion",
        description:
          "A stunning luxury estate with breathtaking architectural design, private pool, and exclusive landscape.",
        images: ["/images/option2.jpg", "/images/pr2.png", "/images/pr4.png"],
        mainImage: "/images/option2.jpg",
        featured: true,
        highlights: {
          yearBuilt: 2023,
          parking: "4 Cars",
          heating: "Smart Heating",
          cooling: "Advanced Central AC",
        },
        amenities: [
          "Swimming Pool",
          "Home Theater",
          "Gym",
          "Private Garden",
          "Alarm",
          "Refrigerator",
          "Microwave",
          "WiFi",
        ],
        location: {
          lat: 34.0522,
          lng: -118.2437,
          city: "Los Angeles",
          state: "CA",
          zipcode: "90001",
        },
        floorplan: {
          image: "/images/pr3.png",
          description:
            "Expansive estate layout with multiple living areas and luxury suite arrangements.",
        },
      },

      {
        title: "Urban Smart Apartment",
        address: "120 Maple Street, Chicago",
        price: 189000,
        beds: 2,
        baths: 1,
        area: 900,
        status: "For Sale",
        type: "Apartment",
        description:
          "A compact smart apartment ideal for young professionals, featuring automation and clean design.",
        images: ["/images/pr3.png", "/images/pr6.jpg", "/images/pr5.png"],
        mainImage: "/images/pr3.png",
        featured: false,
        highlights: {
          yearBuilt: 2021,
          parking: "1 Car",
          heating: "Electric",
          cooling: "AC",
        },
        amenities: ["WiFi", "Gym", "TV Cable", "Washer", "Dryer"],
        location: {
          lat: 41.8781,
          lng: -87.6298,
          city: "Chicago",
          state: "IL",
          zipcode: "60007",
        },
        floorplan: {
          image: "/images/pr5.png",
          description:
            "Smartly engineered floor design maximizing utility and storage.",
        },
      },

      {
        title: "Suburban Dream Home",
        address: "75 Lakeview Drive, Ohio",
        price: 310000,
        beds: 4,
        baths: 3,
        area: 1800,
        status: "For Sale",
        type: "House",
        description:
          "A peaceful suburban home with a warm exterior, large backyard and elegant interiors.",
        images: ["/images/pr5.png", "/images/pr2.png", "/images/pr3.png"],
        mainImage: "/images/pr5.png",
        featured: true,
        highlights: {
          yearBuilt: 2020,
          parking: "2 Cars",
          heating: "Gas",
          cooling: "Central AC",
        },
        amenities: [
          "Garden",
          "Laundry Room",
          "Central Heating",
          "Window Covering",
        ],
        location: {
          lat: 40.4173,
          lng: -82.9071,
          city: "Ohio",
          state: "OH",
          zipcode: "43054",
        },
        floorplan: {
          image: "/images/pr4.png",
          description:
            "Family-friendly floor distribution offering privacy and generous spaces.",
        },
      },

      {
        title: "Cityscape Penthouse",
        address: "51 Skyline Road, New York",
        price: 660000,
        beds: 3,
        baths: 3,
        area: 2000,
        status: "For Sale",
        type: "Penthouse",
        description:
          "Premium penthouse with skyline views, luxurious interior finishings and modern lifestyle conveniences.",
        images: ["/images/pr4.png", "/images/pr5.png", "/images/pr6.jpg"],
        mainImage: "/images/pr4.png",
        featured: true,
        highlights: {
          yearBuilt: 2022,
          parking: "2 Cars",
          heating: "Smart Heating",
          cooling: "Premium AC",
        },
        amenities: ["Balcony", "Gym", "Swimming Pool", "Alarm", "WiFi"],
        location: {
          lat: 40.758,
          lng: -73.9855,
          city: "New York",
          state: "NY",
          zipcode: "10036",
        },
        floorplan: {
          image: "/images/pr8.png",
          description:
            "A luxury penthouse layout designed for elegance, comfort, and scenic views.",
        },
      },

      {
        title: "Oceanfront Modern Villa",
        address: "88 Coastline Blvd, Miami",
        price: 820000,
        beds: 5,
        baths: 4,
        area: 3200,
        status: "For Sale",
        type: "Villa",
        description:
          "An oceanfront modern villa offering beautiful sea views, premium amenities and top-tier comfort.",
        images: ["/images/pr6.jpg", "/images/pr7.webp", "/images/pr8.png"],
        mainImage: "/images/pr6.jpg",
        featured: true,
        highlights: {
          yearBuilt: 2021,
          parking: "3 Cars",
          heating: "Hybrid",
          cooling: "Advanced AC",
        },
        amenities: ["Swimming Pool", "Gym", "WiFi", "TV Cable", "Refrigerator"],
        location: {
          lat: 25.7617,
          lng: -80.1918,
          city: "Miami",
          state: "FL",
          zipcode: "33101",
        },
        floorplan: {
          image: "/images/pr3.png",
          description:
            "Bright, open and modern floorplan perfect for ocean-side living.",
        },
      },

      {
        title: "Luxury Garden Residence",
        address: "19 Kingscourt Lane, Texas",
        price: 540000,
        beds: 4,
        baths: 3,
        area: 2100,
        status: "For Sale",
        type: "House",
        description:
          "A high-end garden residence surrounded by nature, modern interiors and curated amenities.",
        images: ["/images/pr8.png", "/images/pr6.jpg", "/images/pr5.png"],
        mainImage: "/images/pr8.png",
        featured: false,
        highlights: {
          yearBuilt: 2020,
          parking: "2 Cars",
          heating: "Gas Heating",
          cooling: "Central AC",
        },
        amenities: [
          "Garden",
          "Air Conditioning",
          "Microwave",
          "Washer",
          "Dryer",
        ],
        location: {
          lat: 31.9686,
          lng: -99.9018,
          city: "Texas",
          state: "TX",
          zipcode: "75001",
        },
        floorplan: {
          image: "/images/pr4.png",
          description:
            "Beautifully balanced floor design with garden-facing rooms.",
        },
      },
    ];

    const createdProperties = await Property.insertMany(properties);
    console.log(`✅ Created ${createdProperties.length} properties`);

    // ---------- UPDATE CATEGORY COUNTS ----------
    for (const category of createdCategories) {
      const count = await Property.countDocuments({ type: category.name });
      await Category.updateOne({ _id: category._id }, { propertyCount: count });
    }

    // ---------- TESTIMONIALS ----------
    const testimonials = [
      {
        name: "John Smith",
        role: "Home Buyer",
        company: "",
        image: "/images/about/ava1.avif",
        rating: 5,
        comment:
          "MetroNest made finding our dream home so easy! The platform is user-friendly and the properties are exactly as described. Highly recommend!",
        featured: true,
      },
      {
        name: "Sarah Johnson",
        role: "Real Estate Investor",
        company: "",
        image: "/images/about/ava2.avif",
        rating: 5,
        comment:
          "As a real estate investor, I've used many platforms, but MetroNest stands out. Great selection of properties and excellent service.",
        featured: true,
      },
      {
        name: "Michael Chen",
        role: "First-time Buyer",
        company: "",
        image: "/images/about/ava1.avif",
        rating: 5,
        comment:
          "The team at MetroNest guided us through every step. We couldn't be happier with our new home. Thank you!",
        featured: true,
      },
      {
        name: "Emily Davis",
        role: "Property Owner",
        company: "",
        image: "/images/about/ava2.avif",
        rating: 5,
        comment:
          "Listing our property on MetroNest was seamless. We got multiple offers within days. Great platform!",
        featured: false,
      },
    ];

    const createdTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`✅ Created ${createdTestimonials.length} testimonials`);

    console.log("🌱 All data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
