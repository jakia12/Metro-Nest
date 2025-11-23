// lib/dashboardAccess.js - Role-based access control

export const DASHBOARD_ACCESS = {
  admin: [
    "/dashboard/admin",
    "/dashboard/admin/overview",
    "/dashboard/admin/listings",
    "/dashboard/admin/leads",
    "/dashboard/admin/tours",
    "/dashboard/admin/agents",
    "/dashboard/admin/clients",
    "/dashboard/admin/categories",
    "/dashboard/admin/settings",
    "/dashboard/admin/analytics",
  ],
  
  agent: [
    "/dashboard/agent",
    "/dashboard/agent/overview",
    "/dashboard/agent/listings",
    "/dashboard/agent/leads",
    "/dashboard/agent/tours",
    "/dashboard/agent/profile",
    "/dashboard/agent/analytics",
    "/dashboard/agent/messages",
  ],
  
  client: [
    "/dashboard/client",
    "/dashboard/client/home",
    "/dashboard/client/favorites",
    "/dashboard/client/inquiries",
    "/dashboard/client/tours",
    "/dashboard/client/notifications",
    "/dashboard/client/saved-searches",
    "/dashboard/client/profile",
    "/dashboard/client/budget-planner",
  ],
};

/**
 * Check if a user role can access a specific path
 * @param {string} userRole - User's role (admin, agent, client)
 * @param {string} path - Path to check
 * @returns {boolean} - Whether the user can access the path
 */
export function canAccess(userRole, path) {
  // Admin can access everything
  if (userRole === "admin") return true;
  
  const allowedPaths = DASHBOARD_ACCESS[userRole] || [];
  return allowedPaths.some(allowed => path.startsWith(allowed));
}

/**
 * Get the default dashboard path for a role
 * @param {string} role - User's role
 * @returns {string} - Default dashboard path
 */
export function getDefaultDashboard(role) {
  switch (role) {
    case "admin":
      return "/dashboard/admin/overview";
    case "agent":
      return "/dashboard/agent/overview";
    case "client":
      return "/dashboard/client/home";
    default:
      return "/";
  }
}

/**
 * Get sidebar menu items for a specific role
 * @param {string} role - User's role
 * @returns {Array} - Array of menu items
 */
export function getSidebarItems(role) {
  const menuItems = {
    admin: [
      { icon: "Home", label: "Overview", href: "/dashboard/admin/overview" },
      { icon: "Building2", label: "All Listings", href: "/dashboard/admin/listings" },
      { icon: "Users", label: "Leads & CRM", href: "/dashboard/admin/leads" },
      { icon: "Calendar", label: "Tours & Calendar", href: "/dashboard/admin/tours" },
      { icon: "Briefcase", label: "Agents & Teams", href: "/dashboard/admin/agents" },
      { icon: "UserCheck", label: "Clients", href: "/dashboard/admin/clients" },
      { icon: "FolderOpen", label: "Categories", href: "/dashboard/admin/categories" },
      { icon: "Settings", label: "Settings", href: "/dashboard/admin/settings" },
      { icon: "BarChart3", label: "Analytics", href: "/dashboard/admin/analytics" },
    ],
    
    agent: [
      { icon: "Home", label: "Overview", href: "/dashboard/agent/overview" },
      { icon: "Building2", label: "My Listings", href: "/dashboard/agent/listings" },
      { icon: "Users", label: "My Leads", href: "/dashboard/agent/leads" },
      { icon: "Calendar", label: "My Tours", href: "/dashboard/agent/tours" },
      { icon: "User", label: "My Profile", href: "/dashboard/agent/profile" },
      { icon: "BarChart3", label: "My Analytics", href: "/dashboard/agent/analytics" },
      { icon: "MessageSquare", label: "Messages", href: "/dashboard/agent/messages" },
    ],
    
    client: [
      { icon: "Home", label: "Browse Properties", href: "/dashboard/client/home" },
      { icon: "Heart", label: "My Favorites", href: "/dashboard/client/favorites" },
      { icon: "Mail", label: "My Inquiries", href: "/dashboard/client/inquiries" },
      { icon: "Calendar", label: "My Tours", href: "/dashboard/client/tours" },
      { icon: "Bell", label: "Notifications", href: "/dashboard/client/notifications" },
      { icon: "Search", label: "Saved Searches", href: "/dashboard/client/saved-searches" },
      { icon: "User", label: "My Profile", href: "/dashboard/client/profile" },
      { icon: "DollarSign", label: "Budget Planner", href: "/dashboard/client/budget-planner" },
    ],
  };

  return menuItems[role] || [];
}
