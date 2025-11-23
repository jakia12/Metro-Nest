# 🏗️ Role-Based Dashboard Implementation Guide

## ✅ Completed Components

### 1. Database Models
- ✅ **Tour.js** - Property viewing scheduling
- ✅ **Notification.js** - User notifications system
- ✅ **SavedSearch.js** - Client search alerts
- ✅ **Message.js** - User messaging system
- ✅ **Favorite.js** - Fixed (added mongoose import)
- ✅ **Inquiry.js** - Fixed (added mongoose import)

### 2. Access Control & Utilities
- ✅ **lib/dashboardAccess.js** - Role-based permissions
- ✅ **lib/auth.js** - Server-side authentication utilities
- ✅ **components/dashboard/DashboardSidebar.jsx** - Responsive sidebar

## 📋 Implementation Checklist

### Phase 1: Core Infrastructure (COMPLETED)
- [x] Database models created
- [x] Access control system
- [x] Authentication utilities
- [x] Dashboard sidebar component

### Phase 2: Dashboard Layouts (NEXT STEPS)
Create these layout files:

1. **app/(pages)/(root)/(main)/dashboard/admin/layout.jsx**
2. **app/(pages)/(root)/(main)/dashboard/agent/layout.jsx**
3. **app/(pages)/(root)/(main)/dashboard/client/layout.jsx**

### Phase 3: Admin Pages
Create in `app/(pages)/(root)/(main)/dashboard/admin/`:
- [ ] overview/page.jsx
- [ ] listings/page.jsx
- [ ] leads/page.jsx
- [ ] tours/page.jsx
- [ ] agents/page.jsx (with pending approvals)
- [ ] clients/page.jsx
- [ ] categories/page.jsx
- [ ] settings/page.jsx
- [ ] analytics/page.jsx

### Phase 4: Agent Pages
Create in `app/(pages)/(root)/(main)/dashboard/agent/`:
- [ ] overview/page.jsx
- [ ] listings/page.jsx (filtered to agent's properties)
- [ ] leads/page.jsx (filtered to agent's leads)
- [ ] tours/page.jsx (filtered to agent's tours)
- [ ] profile/page.jsx
- [ ] analytics/page.jsx
- [ ] messages/page.jsx

### Phase 5: Client Pages
Create in `app/(pages)/(root)/(main)/dashboard/client/`:
- [ ] home/page.jsx
- [ ] favorites/page.jsx
- [ ] inquiries/page.jsx
- [ ] tours/page.jsx
- [ ] notifications/page.jsx
- [ ] saved-searches/page.jsx
- [ ] profile/page.jsx
- [ ] budget-planner/page.jsx

### Phase 6: API Routes

#### Admin APIs
- [ ] /api/admin/agents/route.js (GET all agents)
- [ ] /api/admin/agents/pending/route.js (GET pending agents)
- [ ] /api/admin/agents/[id]/approve/route.js (POST approve agent)
- [ ] /api/admin/clients/route.js (GET all clients)
- [ ] /api/admin/analytics/route.js (GET platform analytics)

#### Agent APIs
- [ ] /api/agent/properties/route.js (GET agent's properties only)
- [ ] /api/agent/leads/route.js (GET agent's leads only)
- [ ] /api/agent/tours/route.js (GET agent's tours only)
- [ ] /api/agent/analytics/route.js (GET agent's analytics)

#### Client APIs
- [ ] /api/client/favorites/route.js (GET/POST/DELETE favorites)
- [ ] /api/client/inquiries/route.js (GET client's inquiries)
- [ ] /api/client/tours/route.js (GET/POST client's tours)
- [ ] /api/client/saved-searches/route.js (CRUD saved searches)

#### Shared APIs
- [ ] /api/notifications/route.js (GET user notifications)
- [ ] /api/notifications/[id]/read/route.js (PATCH mark as read)
- [ ] /api/messages/route.js (GET/POST messages)
- [ ] /api/tours/route.js (CRUD tours)

## 🔧 Usage Examples

### 1. Using Dashboard Sidebar

```jsx
// In your dashboard layout
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getSidebarItems } from "@/lib/dashboardAccess";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  const menuItems = getSidebarItems(user.role);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar menuItems={menuItems} user={user} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
```

### 2. Protecting API Routes

```jsx
// Example: /api/agent/properties/route.js
import { requireRole } from "@/lib/auth";
import connectDB from "@/database/connect";
import Property from "@/database/models/Property";

export async function GET(request) {
  const user = await requireRole("agent");
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();
  
  // Only get properties belonging to this agent
  const properties = await Property.find({ agent: user._id });
  
  return NextResponse.json({
    success: true,
    data: properties,
  });
}
```

### 3. Client-Side Role Check

```jsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <div>Protected Content</div>;
}
```

## 🎯 Next Steps

1. **Update existing dashboard** to redirect based on role:
   ```jsx
   // app/(pages)/(root)/(main)/dashboard/page.jsx
   import { redirect } from "next/navigation";
   import { getCurrentUser } from "@/lib/auth";
   import { getDefaultDashboard } from "@/lib/dashboardAccess";

   export default async function DashboardPage() {
     const user = await getCurrentUser();
     
     if (!user) {
       redirect("/login");
     }

     const defaultPath = getDefaultDashboard(user.role);
     redirect(defaultPath);
   }
   ```

2. **Create layout files** for each role's dashboard section

3. **Implement API routes** following the protection pattern

4. **Build dashboard pages** using the sidebar component

## 📚 File Structure

```
app/
├── (pages)/
│   └── (root)/
│       └── (main)/
│           └── dashboard/
│               ├── page.jsx (redirects based on role)
│               ├── admin/
│               │   ├── layout.jsx
│               │   ├── overview/page.jsx
│               │   ├── listings/page.jsx
│               │   └── ...
│               ├── agent/
│               │   ├── layout.jsx
│               │   ├── overview/page.jsx
│               │   └── ...
│               └── client/
│                   ├── layout.jsx
│                   ├── home/page.jsx
│                   └── ...
├── api/
│   ├── admin/
│   ├── agent/
│   ├── client/
│   ├── notifications/
│   ├── messages/
│   └── tours/
components/
├── dashboard/
│   ├── DashboardSidebar.jsx ✅
│   ├── StatsCard.jsx (create)
│   ├── RecentActivity.jsx (create)
│   └── ...
lib/
├── dashboardAccess.js ✅
└── auth.js ✅
database/
└── models/
    ├── Tour.js ✅
    ├── Notification.js ✅
    ├── SavedSearch.js ✅
    ├── Message.js ✅
    ├── Favorite.js ✅
    └── Inquiry.js ✅
```

## 🚀 Ready to Continue?

The foundation is complete! You can now:
1. Create the dashboard layouts for each role
2. Build individual dashboard pages
3. Implement the API routes
4. Add features incrementally

Would you like me to continue with creating the dashboard layouts and pages?
