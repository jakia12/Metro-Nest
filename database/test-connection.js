import connectDB from "./connect.js";
import { Category, Contact, Property, Testimonial } from "./models/index.js";

const testDatabase = async () => {
  try {
    console.log("🔍 Testing database connection...\n");

    // Test connection
    await connectDB();
    console.log("✅ Database connection successful!\n");

    // Test Property model
    console.log("📊 Testing Property model...");
    const propertyCount = await Property.countDocuments();
    console.log(`   Found ${propertyCount} properties in database`);

    // Test Category model
    console.log("📊 Testing Category model...");
    const categoryCount = await Category.countDocuments();
    console.log(`   Found ${categoryCount} categories in database`);

    // Test Testimonial model
    console.log("📊 Testing Testimonial model...");
    const testimonialCount = await Testimonial.countDocuments();
    console.log(`   Found ${testimonialCount} testimonials in database`);

    // Test Contact model
    console.log("📊 Testing Contact model...");
    const contactCount = await Contact.countDocuments();
    console.log(`   Found ${contactCount} contact messages in database\n`);

    // Get sample data
    console.log("📋 Sample Data:");
    const sampleProperty = await Property.findOne().lean();
    if (sampleProperty) {
      console.log(
        `   Property: ${sampleProperty.title} - $${sampleProperty.price}`
      );
    } else {
      console.log(
        "   No properties found. Run 'npm run seed' to add sample data."
      );
    }

    const sampleCategory = await Category.findOne().lean();
    if (sampleCategory) {
      console.log(`   Category: ${sampleCategory.name}`);
    }

    const sampleTestimonial = await Testimonial.findOne().lean();
    if (sampleTestimonial) {
      console.log(
        `   Testimonial: ${sampleTestimonial.name} - ${sampleTestimonial.rating} stars`
      );
    }

    console.log("\n✅ All database tests passed!");
    console.log("💡 Your database is working correctly!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database test failed!");
    console.error("Error:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Make sure MongoDB is running");
    console.error("   2. Check your MONGODB_URI in .env.local");
    console.error("   3. Verify MongoDB connection string is correct\n");
    process.exit(1);
  }
};

testDatabase();
