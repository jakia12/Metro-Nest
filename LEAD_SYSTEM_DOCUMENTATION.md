# Lead Collection System - Documentation

## Overview
This document explains the complete lead collection system that connects your property contact forms to the dashboard's recent leads section.

## System Architecture

### 1. **Database Layer** (`/database/models/Lead.js`)
The Lead model stores all lead information with the following fields:
- **Basic Info**: name, email, phone, message
- **Property Reference**: propertyId (links to the property they inquired about)
- **Lead Tracking**: budget, propertyType, source, status, priority
- **Management**: notes, assignedTo, lastContactedAt
- **Timestamps**: createdAt, updatedAt (automatic)

**Status Options:**
- `New` - Fresh lead from form submission
- `In Follow-up` - Currently being contacted
- `Hot` - High-priority lead
- `Tour Booked` - Scheduled for property viewing
- `Closed` - Successfully converted
- `Lost` - Did not convert

**Source Options:**
- `Website Form` (default for contact form submissions)
- `Instagram`, `Facebook`, `Google Ads`, `Referral`, `Direct`, `Other`

### 2. **API Endpoints**

#### `/api/leads` (GET & POST)
**GET** - Fetch all leads
- Query params: `?status=New&limit=10&propertyId=123`
- Returns: Array of leads with populated property details

**POST** - Create new lead
- Body: `{ name, email, phone, message, propertyId, source }`
- Automatically sets status to "New" and source to "Website Form"
- Returns: Created lead with success message

#### `/api/leads/[id]` (GET, PUT, DELETE)
**GET** - Fetch single lead
**PUT** - Update lead status/details
- Automatically updates `lastContactedAt` when status changes
**DELETE** - Remove lead

### 3. **Frontend Components**

#### **Contact Form** (`/properties/[id]/page.jsx`)
Located in the property details page sidebar:
```javascript
// Submits to /api/leads
const response = await fetch("/api/leads", {
  method: "POST",
  body: JSON.stringify({
    name, email, phone, message,
    propertyId: propertyId,
    source: "Website Form"
  })
});
```

**Features:**
- Form validation before submission
- Loading states during submission
- Success/error toast notifications
- Automatic form reset on success
- Links lead to specific property

#### **Dashboard Overview** (`/dashboard/page.jsx`)
Shows recent leads in a table:
- Fetches latest 10 leads from `/api/leads?limit=10`
- Displays: Name, Email, Property, Status
- Dynamic stats calculation:
  - Active Listings count
  - New Leads (last 7 days)
  - Scheduled Tours (Tour Booked status)
  - Conversion rate

**Real-time Stats:**
```javascript
const recentLeads = leads.filter(
  (lead) => new Date(lead.createdAt) >= sevenDaysAgo
);
```

#### **Inquiries Page** (`/dashboard/inquiries/page.jsx`)
Full lead management interface:
- **Stats Cards**: Total, New, Hot, Tours Booked
- **Filter Tabs**: Filter by status
- **Lead Cards**: Detailed view with:
  - Property thumbnail and details
  - Contact information
  - Message content
  - Status dropdown (update inline)
  - Email reply button
  - Timestamp

**Status Update:**
```javascript
const updateStatus = async (id, status) => {
  await fetch(`/api/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });
};
```

## How It Works - Complete Flow

### 1. **User Submits Contact Form**
```
User fills form on /properties/[id] page
  ↓
Frontend validates input
  ↓
POST request to /api/leads
  ↓
Lead model creates new document in MongoDB
  ↓
Success message shown to user
  ↓
Form resets
```

### 2. **Lead Appears in Dashboard**
```
Dashboard loads
  ↓
Fetches leads from /api/leads?limit=10
  ↓
Displays in "Recent Leads" table
  ↓
Stats auto-calculate from lead data
```

### 3. **Admin Manages Leads**
```
Admin visits /dashboard/inquiries
  ↓
All leads displayed with filters
  ↓
Admin can:
  - View full lead details
  - See linked property
  - Update status via dropdown
  - Reply via email link
  - Filter by status
```

## Usage Examples

### Example 1: User Submits Form
```javascript
// User fills out:
Name: "John Doe"
Email: "john@example.com"
Phone: "555-1234"
Message: "I'm interested in this property"

// System creates:
{
  name: "John Doe",
  email: "john@example.com",
  phone: "555-1234",
  message: "I'm interested in this property",
  propertyId: "507f1f77bcf86cd799439011",
  source: "Website Form",
  status: "New",
  createdAt: "2025-11-22T12:00:00Z"
}
```

### Example 2: Fetch Recent Leads
```javascript
// Dashboard fetches:
GET /api/leads?limit=10

// Returns:
{
  success: true,
  data: [
    {
      _id: "...",
      name: "John Doe",
      email: "john@example.com",
      status: "New",
      propertyId: {
        _id: "...",
        title: "Modern Downtown Loft",
        address: "123 Main St",
        price: 500000
      },
      createdAt: "2025-11-22T12:00:00Z"
    }
  ],
  count: 10
}
```

### Example 3: Update Lead Status
```javascript
// Admin changes status from "New" to "Hot"
PUT /api/leads/507f1f77bcf86cd799439011
Body: { status: "Hot" }

// System updates:
{
  status: "Hot",
  lastContactedAt: "2025-11-22T13:00:00Z" // Auto-set
}
```

## Key Features

### ✅ **Dynamic Data**
- All leads come from real database
- Stats calculate automatically
- No hardcoded data

### ✅ **Property Linking**
- Each lead links to specific property
- Property details auto-populate
- Easy navigation to property page

### ✅ **Status Management**
- 6 status options for lead lifecycle
- Inline status updates
- Automatic timestamp tracking

### ✅ **Source Tracking**
- Know where leads come from
- Default: "Website Form"
- Expandable for other channels

### ✅ **Responsive Design**
- Works on all devices
- Mobile-friendly forms
- Touch-optimized interactions

## Testing the System

### 1. **Submit a Test Lead**
1. Go to any property page: `/properties/[id]`
2. Scroll to "Contact Us" form in sidebar
3. Fill in all fields
4. Click "Send Us"
5. Should see success toast

### 2. **View in Dashboard**
1. Go to `/dashboard`
2. Scroll to "Recent Leads" section
3. Your test lead should appear
4. Stats should update

### 3. **Manage in Inquiries**
1. Go to `/dashboard/inquiries`
2. See all leads with full details
3. Try changing status
4. Try filtering by status
5. Click email to reply

## Troubleshooting

### Lead not appearing?
- Check browser console for errors
- Verify MongoDB connection
- Check API response in Network tab

### Form submission fails?
- Ensure all required fields filled
- Check propertyId is valid
- Verify API endpoint is accessible

### Stats not updating?
- Refresh the page
- Check if leads are being fetched
- Verify date calculations

## Future Enhancements

### Possible Additions:
1. **Email Notifications** - Alert admin on new leads
2. **Lead Assignment** - Assign leads to specific agents
3. **Follow-up Reminders** - Automated reminder system
4. **Lead Scoring** - Priority calculation based on criteria
5. **Analytics Dashboard** - Conversion rates, response times
6. **Export Functionality** - Download leads as CSV
7. **Search & Filters** - Advanced lead search
8. **Notes System** - Add internal notes to leads
9. **Activity Timeline** - Track all interactions
10. **Integration** - Connect to CRM systems

## Files Modified/Created

### Created:
- `/database/models/Lead.js` - Lead database model
- `/app/api/leads/route.js` - Main leads API
- `/app/api/leads/[id]/route.js` - Individual lead API

### Modified:
- `/app/(pages)/(root)/(main)/properties/[id]/page.jsx` - Contact form
- `/app/(pages)/(root)/(main)/dashboard/page.jsx` - Dashboard overview
- `/app/(pages)/(root)/(main)/dashboard/inquiries/page.jsx` - Inquiries page

## API Reference

### GET /api/leads
Fetch all leads with optional filtering

**Query Parameters:**
- `status` (string): Filter by status
- `limit` (number): Limit results
- `propertyId` (string): Filter by property

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### POST /api/leads
Create a new lead

**Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "message": "string (required)",
  "propertyId": "ObjectId (optional)",
  "source": "string (optional, default: 'Website Form')"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Thank you for your interest! We'll get back to you soon."
}
```

### PUT /api/leads/[id]
Update lead details

**Body:**
```json
{
  "status": "string",
  "notes": "string",
  "priority": "string",
  // ... any Lead model field
}
```

### DELETE /api/leads/[id]
Delete a lead

**Response:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

## Summary

You now have a complete, dynamic lead collection system that:
1. ✅ Collects leads from property contact forms
2. ✅ Stores them in MongoDB with full tracking
3. ✅ Displays them in dashboard with real-time stats
4. ✅ Provides full management interface
5. ✅ Links leads to specific properties
6. ✅ Tracks source and status
7. ✅ Allows inline status updates
8. ✅ Calculates conversion metrics

The system is production-ready and fully functional!
