# Vercel Deployment Guide - Fixing Database Connection Issues

## Common Issues on Vercel

### 1. **Environment Variables Not Set** ⚠️ (Most Common)

Vercel doesn't automatically use your `.env.local` file. You need to add environment variables in Vercel dashboard.

#### Steps to Fix:

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following variable:

   - **Name:** `MONGODB_URI`
   - **Value:** Your MongoDB connection string
   - **Environment:** Production, Preview, Development (select all)

4. **Important:** After adding, you MUST redeploy:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on latest deployment
   - Click **Redeploy**

### 2. **Using Local MongoDB** ❌

If you're using `mongodb://localhost:27017`, this **WON'T WORK** on Vercel because:

- Vercel runs on cloud servers
- They can't access your local machine
- You need MongoDB Atlas (cloud MongoDB)

#### Solution: Use MongoDB Atlas

1. **Create MongoDB Atlas Account:**

   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create a Cluster:**

   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a region close to you
   - Click "Create"

3. **Set Up Database Access:**

   - Go to **Database Access** → **Add New Database User**
   - Create username and password (save these!)
   - Set privileges to "Atlas admin"

4. **Set Up Network Access:**

   - Go to **Network Access** → **Add IP Address**
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel's IP ranges

5. **Get Connection String:**

   - Go to **Database** → Click **Connect**
   - Choose **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `metronest` (or your database name)

   Example:

   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/metronest?retryWrites=true&w=majority
   ```

6. **Add to Vercel:**
   - Add this connection string as `MONGODB_URI` in Vercel environment variables
   - Redeploy your application

### 3. **Check API Routes in Vercel**

1. Go to your Vercel deployment
2. Click on **Functions** tab
3. Check if API routes are showing errors
4. Click on any API route to see logs

### 4. **Test Your API Endpoints**

After deployment, test these URLs:

```
https://your-app.vercel.app/api/properties
https://your-app.vercel.app/api/categories
```

If you see errors, check:

- Browser console for error messages
- Vercel function logs
- Network tab in DevTools

### 5. **Verify Database is Seeded**

After setting up MongoDB Atlas:

1. **Option A: Seed from Local Machine**

   ```bash
   # Make sure .env.local has MongoDB Atlas connection string
   npm run seed
   ```

2. **Option B: Use MongoDB Compass**

   - Download MongoDB Compass
   - Connect using your Atlas connection string
   - Import data manually

3. **Option C: Create Seed API Endpoint** (Temporary)
   - Create `/api/seed` endpoint
   - Call it once to populate database
   - Remove after seeding

### 6. **Check Vercel Logs**

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** → Select latest deployment
3. Click **Functions** tab
4. Check logs for errors

Common errors you might see:

- `MongooseError: connect ECONNREFUSED` → MongoDB not accessible
- `MongoServerError: Authentication failed` → Wrong credentials
- `MongoNetworkError` → Network access not configured

## Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] `MONGODB_URI` added to Vercel environment variables
- [ ] All environments selected (Production, Preview, Development)
- [ ] Application redeployed after adding environment variables
- [ ] Database seeded with data
- [ ] API endpoints tested

## Testing After Fix

1. Visit: `https://your-app.vercel.app/api/properties`

   - Should return JSON with properties array

2. Visit: `https://your-app.vercel.app/api/categories`

   - Should return JSON with categories array

3. Visit your homepage
   - Properties should load
   - Categories should display
   - No console errors

## Still Not Working?

1. **Check Vercel Function Logs:**

   - Go to Functions tab
   - Click on failing API route
   - Check error messages

2. **Test Connection Locally:**

   ```bash
   # Make sure .env.local has Atlas connection string
   npm run test-db
   ```

3. **Verify Environment Variables:**

   - In Vercel, go to Settings → Environment Variables
   - Make sure `MONGODB_URI` is there
   - Check it's not empty
   - Verify it's for all environments

4. **Check MongoDB Atlas:**
   - Verify cluster is running (not paused)
   - Check database user is active
   - Verify network access allows all IPs

## Need Help?

Common issues:

- **"Cannot connect to MongoDB"** → Check network access in Atlas
- **"Authentication failed"** → Check username/password in connection string
- **"Empty arrays returned"** → Database not seeded, run seed script
- **"API timeout"** → Check MongoDB Atlas cluster is not paused
