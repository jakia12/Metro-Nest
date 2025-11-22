# Lead Collection System - Quick Reference

## 🚀 Quick Start

### How to Test the System

1. **Submit a Test Lead:**
   - Visit: `http://localhost:3000/properties/[any-property-id]`
   - Fill out the "Contact Us" form in the sidebar
   - Click "Send Us"
   - You should see a success message

2. **View Leads in Dashboard:**
   - Visit: `http://localhost:3000/dashboard`
   - Scroll to "Recent Leads" section
   - Your test lead should appear

3. **Manage Leads:**
   - Visit: `http://localhost:3000/dashboard/inquiries`
   - See all leads with full details
   - Change status using dropdown
   - Filter by status using tabs

## 📋 API Endpoints

### Fetch All Leads
```bash
GET /api/leads
GET /api/leads?status=New
GET /api/leads?limit=10
GET /api/leads?propertyId=123
```

### Create New Lead
```bash
POST /api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "message": "I'm interested",
  "propertyId": "507f1f77bcf86cd799439011"
}
```

### Update Lead Status
```bash
PUT /api/leads/[id]
Content-Type: application/json

{
  "status": "Hot"
}
```

### Delete Lead
```bash
DELETE /api/leads/[id]
```

## 🎨 Frontend Components

### Contact Form (Property Page)
**Location:** `/app/(pages)/(root)/(main)/properties/[id]/page.jsx`
**Lines:** 26-152

**Usage:**
```jsx
<ContactForm propertyId={property._id} />
```

### Dashboard Overview
**Location:** `/app/(pages)/(root)/(main)/dashboard/page.jsx`

**Features:**
- Dynamic stats from real data
- Recent leads table (last 10)
- Auto-calculated conversion rates

### Inquiries Page
**Location:** `/app/(pages)/(root)/(main)/dashboard/inquiries/page.jsx`

**Features:**
- Full lead management
- Status filtering
- Inline status updates
- Email reply links

## 🗄️ Database Model

### Lead Schema
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  message: String (required),
  propertyId: ObjectId (ref: Property),
  budget: String,
  propertyType: String,
  source: String (default: "Website Form"),
  status: String (default: "New"),
  priority: String (default: "medium"),
  notes: String,
  assignedTo: ObjectId (ref: User),
  lastContactedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Status Options
- `New` - Fresh lead
- `In Follow-up` - Being contacted
- `Hot` - High priority
- `Tour Booked` - Scheduled viewing
- `Closed` - Converted
- `Lost` - Did not convert

### Source Options
- `Website Form` (default)
- `Instagram`
- `Facebook`
- `Google Ads`
- `Referral`
- `Direct`
- `Other`

## 🔧 Common Tasks

### Add a New Lead Manually (via API)
```javascript
const response = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-5678',
    message: 'Looking for a 2BR apartment',
    propertyId: '507f1f77bcf86cd799439011',
    source: 'Instagram'
  })
});
```

### Fetch Leads for a Specific Property
```javascript
const response = await fetch('/api/leads?propertyId=507f1f77bcf86cd799439011');
const result = await response.json();
console.log(result.data); // Array of leads
```

### Update Lead Status
```javascript
const response = await fetch('/api/leads/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'Tour Booked' })
});
```

### Get Lead Statistics
```javascript
const response = await fetch('/api/leads');
const result = await response.json();
const leads = result.data;

const stats = {
  total: leads.length,
  new: leads.filter(l => l.status === 'New').length,
  hot: leads.filter(l => l.status === 'Hot').length,
  tourBooked: leads.filter(l => l.status === 'Tour Booked').length,
  conversionRate: (leads.filter(l => l.status === 'Closed').length / leads.length * 100).toFixed(1)
};
```

## 🐛 Debugging

### Check if Lead was Created
```javascript
// In browser console after form submission
fetch('/api/leads')
  .then(r => r.json())
  .then(d => console.log(d.data));
```

### Check MongoDB Connection
```javascript
// In your API route
console.log('MongoDB connection:', mongoose.connection.readyState);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
```

### Verify Property ID
```javascript
// Make sure propertyId is valid ObjectId
const mongoose = require('mongoose');
console.log(mongoose.Types.ObjectId.isValid(propertyId));
```

## 📊 Example Data Flow

```
User Action → Frontend → API → Database → Response → UI Update

1. User fills contact form
   ↓
2. Form validates input
   ↓
3. POST /api/leads
   ↓
4. Lead.create() in MongoDB
   ↓
5. Success response
   ↓
6. Toast notification
   ↓
7. Form resets
   ↓
8. Dashboard auto-updates on next visit
```

## 🎯 Key Files

```
metro-nest/
├── database/
│   └── models/
│       └── Lead.js                    # Lead model
├── app/
│   ├── api/
│   │   └── leads/
│   │       ├── route.js               # GET & POST /api/leads
│   │       └── [id]/
│   │           └── route.js           # GET, PUT, DELETE /api/leads/[id]
│   └── (pages)/
│       └── (root)/
│           └── (main)/
│               ├── properties/
│               │   └── [id]/
│               │       └── page.jsx   # Contact form
│               └── dashboard/
│                   ├── page.jsx       # Dashboard overview
│                   └── inquiries/
│                       └── page.jsx   # Lead management
└── LEAD_SYSTEM_DOCUMENTATION.md       # Full documentation
```

## 💡 Tips

1. **Always validate input** before submitting forms
2. **Use toast notifications** for user feedback
3. **Populate property details** when fetching leads
4. **Update lastContactedAt** when changing status
5. **Filter leads by status** for better organization
6. **Track source** to know where leads come from
7. **Calculate stats dynamically** from real data
8. **Link leads to properties** for context

## 🔐 Security Notes

- Validate all input on backend
- Sanitize email addresses
- Prevent duplicate submissions
- Rate limit API endpoints
- Require authentication for admin routes
- Don't expose sensitive data in API responses

## 📈 Metrics to Track

- **Total Leads**: All-time count
- **New Leads**: Last 7/30 days
- **Conversion Rate**: Closed / Total
- **Response Time**: Time to first contact
- **Source Performance**: Which sources convert best
- **Property Performance**: Which properties get most leads

---

## Need Help?

See `LEAD_SYSTEM_DOCUMENTATION.md` for detailed information.

## Summary

✅ Contact form collects leads
✅ Leads stored in MongoDB
✅ Dashboard displays recent leads
✅ Inquiries page manages all leads
✅ Status tracking and updates
✅ Property linking
✅ Source tracking
✅ Dynamic statistics

**You're all set! 🎉**
