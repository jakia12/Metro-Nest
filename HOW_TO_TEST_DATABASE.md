# How to Test Your Database

## Quick Test Steps

### 1. Test Database Connection

Run the test script to verify your database connection:

```bash
npm run test-db
```

This will:

- ✅ Test MongoDB connection
- ✅ Count documents in each collection
- ✅ Display sample data
- ❌ Show errors if connection fails

### 2. Seed the Database (if not done already)

If you haven't seeded your database yet:

```bash
npm run seed
```

This will populate your database with:

- 6 categories
- 8 sample properties
- 4 testimonials

### 3. Test API Endpoints

Start your development server:

```bash
npm run dev
```

Then test these endpoints in your browser or using a tool like Postman/Thunder Client:

#### Test Properties API

```
http://localhost:3000/api/properties
```

**Expected Response:**

```json
{
  "success": true,
  "data": [...],
  "count": 8
}
```

#### Test Single Property

```
http://localhost:3000/api/properties/[PROPERTY_ID]
```

Replace `[PROPERTY_ID]` with an actual ID from the properties list.

#### Test Categories API

```
http://localhost:3000/api/categories
```

#### Test Testimonials API

```
http://localhost:3000/api/testimonials
```

#### Test Featured Testimonials

```
http://localhost:3000/api/testimonials?featured=true
```

### 4. Test Frontend Integration

1. **Visit the Properties Page:**

   ```
   http://localhost:3000/properties
   ```

   - Should display all properties from database
   - Should show loading state, then properties

2. **Visit a Property Detail Page:**

   ```
   http://localhost:3000/properties/[PROPERTY_ID]
   ```

   - Should show property details
   - Should display images, highlights, amenities

3. **Visit Home Page:**

   ```
   http://localhost:3000
   ```

   - Featured properties section should show data
   - Testimonials should display

4. **Test Contact Form:**
   - Go to `/contact` or any property detail page
   - Fill out and submit the contact form
   - Check browser console for success message
   - Verify data was saved (check `/api/contact`)

### 5. Check Browser Console

Open browser DevTools (F12) and check:

- ✅ No connection errors
- ✅ API calls returning data
- ✅ No 404 or 500 errors

### 6. Verify Data in MongoDB

#### Using MongoDB Compass (GUI):

1. Connect to your MongoDB instance
2. Navigate to `metronest` database
3. Check collections:
   - `properties`
   - `categories`
   - `testimonials`
   - `contacts`

#### Using MongoDB Shell:

```bash
mongosh
use metronest
db.properties.find().pretty()
db.categories.find().pretty()
db.testimonials.find().pretty()
```

## Common Issues & Solutions

### ❌ "Connection failed" or "MongooseError"

**Solution:**

- Check if MongoDB is running: `mongod` or check MongoDB service
- Verify `MONGODB_URI` in `.env.local`
- For Atlas: Check network access and connection string

### ❌ "No properties found" on frontend

**Solution:**

- Run `npm run seed` to populate database
- Check API endpoint: `http://localhost:3000/api/properties`
- Verify data exists in MongoDB

### ❌ "Cannot read property of undefined"

**Solution:**

- Check if data structure matches model schema
- Verify all required fields are present
- Check browser console for specific error

### ❌ API returns empty array `[]`

**Solution:**

- Database might be empty - run `npm run seed`
- Check MongoDB connection
- Verify collection names match

## Quick Verification Checklist

- [ ] MongoDB is running/connected
- [ ] `.env.local` file exists with `MONGODB_URI`
- [ ] `npm run test-db` passes
- [ ] `npm run seed` completes successfully
- [ ] API endpoints return data (not errors)
- [ ] Frontend displays properties
- [ ] Contact form submits successfully

## Test API with cURL

```bash
# Get all properties
curl http://localhost:3000/api/properties

# Get categories
curl http://localhost:3000/api/categories

# Get testimonials
curl http://localhost:3000/api/testimonials

# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123-456-7890",
    "message": "This is a test message"
  }'
```

## Success Indicators

✅ **Database is working if:**

- `npm run test-db` shows all checks passing
- API endpoints return JSON with `success: true`
- Frontend displays data (not "Loading..." forever)
- No errors in browser console
- Data persists after page refresh

If all these work, your database is properly connected and functioning! 🎉
