# Database Setup Guide

## Prerequisites

1. **MongoDB Installation**
   - Install MongoDB locally, OR
   - Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/metronest

# OR for MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/metronest

# Optional: Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Seed the Database

Run the seed script to populate your database with initial data:

```bash
npm run seed
```

This will create:

- 6 property categories
- 8 sample properties
- 4 testimonials

### 4. Start the Development Server

```bash
npm run dev
```

## Database Structure

### Models

1. **Property** - Real estate properties

   - Fields: title, address, price, beds, baths, area, status, type, images, etc.

2. **Category** - Property categories

   - Fields: name, slug, description, propertyCount

3. **Testimonial** - Client testimonials

   - Fields: name, role, company, image, rating, comment

4. **Contact** - Contact form submissions
   - Fields: name, email, phone, message, propertyId, status

## API Endpoints

### Properties

- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/[id]` - Get single property
- `POST /api/properties` - Create new property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### Testimonials

- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials?featured=true` - Get featured testimonials
- `POST /api/testimonials` - Create new testimonial

### Contact

- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Submit contact form

## Query Parameters

### Properties API

- `type` - Filter by property type (Apartment, Commercial, etc.)
- `status` - Filter by status (For Sale, For Rent, etc.)
- `featured` - Filter featured properties (true/false)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort by (default, priceLowHigh, priceHighLow, newest)
- `limit` - Limit number of results

## Frontend Integration

All frontend components have been updated to fetch data from the API:

- ✅ Property Listing Page
- ✅ Property Detail Page
- ✅ Featured Properties Section
- ✅ Testimonials Section
- ✅ Contact Forms

## Troubleshooting

### Connection Issues

- Make sure MongoDB is running (if using local)
- Check your MONGODB_URI in `.env.local`
- Verify network access (for Atlas)

### Seed Script Issues

- Ensure MongoDB is connected before running seed
- Check that the database name is correct
- Verify all required fields in models

## Next Steps

1. Set up your MongoDB connection
2. Run the seed script
3. Test the API endpoints
4. Customize the data as needed
