import { Building2, HelpCircle, Home, LayoutDashboard, Map, MessageSquare, Phone, Shield, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sitemap | MetroNest",
  description: "Navigate through all pages and sections of MetroNest real estate platform.",
};

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: "Main Pages",
      icon: Home,
      color: "rose",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Properties", href: "/properties" },
      ]
    },
    {
      title: "User Account",
      icon: Users,
      color: "blue",
      links: [
        { name: "Login", href: "/login" },
        { name: "Register", href: "/register" },
        { name: "Dashboard", href: "/dashboard" },
      ]
    },
    {
      title: "Properties",
      icon: Building2,
      color: "green",
      links: [
        { name: "All Properties", href: "/properties" },
        { name: "Mortgage Calculator", href: "/mortgage-calculator" },
      ]
    },
    {
      title: "Support & Help",
      icon: HelpCircle,
      color: "purple",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "FAQs", href: "/faq" },
        { name: "Ticket Support", href: "/support" },
        { name: "Contact Us", href: "/contact" },
      ]
    },
    {
      title: "Legal & Policies",
      icon: Shield,
      color: "amber",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Sitemap", href: "/sitemap" },
      ]
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      color: "indigo",
      links: [
        { name: "Overview", href: "/dashboard/overview" },
        { name: "My Listings", href: "/dashboard/listings" },
        { name: "Messages", href: "/dashboard/messages" },
        { name: "Settings", href: "/dashboard/settings" },
      ]
    },
  ];

  const colorClasses = {
    rose: {
      bg: "bg-rose-100",
      text: "text-rose-600",
      hover: "hover:bg-rose-50",
      border: "border-rose-200"
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      hover: "hover:bg-blue-50",
      border: "border-blue-200"
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      hover: "hover:bg-green-50",
      border: "border-green-200"
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      hover: "hover:bg-purple-50",
      border: "border-purple-200"
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      hover: "hover:bg-amber-50",
      border: "border-amber-200"
    },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-50",
      border: "border-indigo-200"
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0b2845] to-[#1a4d7a] text-white py-16">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="flex items-center gap-3 mb-4">
            <Map className="h-10 w-10 text-rose-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Sitemap</h1>
          </div>
          <p className="text-lg text-slate-200 max-w-3xl">
            Navigate through all pages and sections of MetroNest. Find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section, index) => {
            const Icon = section.icon;
            const colors = colorClasses[section.color];
            
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                </div>
                
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className={`block px-4 py-2.5 rounded-lg text-slate-700 ${colors.hover} transition-colors border ${colors.border} border-opacity-0 hover:border-opacity-100`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${colors.bg}`}></span>
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
                <MessageSquare className="h-8 w-8 text-rose-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Can't Find What You're Looking For?</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you can't find the page you're looking for, please contact our support team. 
                We're here to help you navigate our platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-full font-medium hover:bg-rose-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Contact Support
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-full font-medium border border-slate-300 hover:border-slate-400 transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
