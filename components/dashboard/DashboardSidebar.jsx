"use client";

import {
    BarChart3,
    Bell,
    Briefcase,
    Building2,
    Calendar,
    DollarSign,
    FolderOpen,
    Heart,
    Home,
    LogOut,
    Mail,
    Menu,
    MessageSquare,
    Search,
    Settings,
    User,
    UserCheck,
    Users,
    X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const iconMap = {
  Home,
  Building2,
  Users,
  Calendar,
  Briefcase,
  UserCheck,
  FolderOpen,
  Settings,
  BarChart3,
  User,
  MessageSquare,
  Heart,
  Mail,
  Bell,
  Search,
  DollarSign,
};

export default function DashboardSidebar({ menuItems, user }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const SidebarContent = () => (
    <>
      {/* User Info */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-semibold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon] || Home;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-rose-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0b2845] text-white shadow-lg"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#0b2845] text-white h-screen sticky top-0">
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500">
              <div className="flex h-6 w-6 items-end gap-0.5">
                <span className="h-2 w-1 rounded-sm bg-white/90" />
                <span className="h-3 w-1 rounded-sm bg-white/90" />
                <span className="h-4 w-1 rounded-sm bg-white/90" />
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-xl font-semibold tracking-wide">MetroNest</p>
              <p className="text-[11px] text-slate-300">Dashboard</p>
            </div>
          </Link>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-64 bg-[#0b2845] text-white z-40 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500">
              <div className="flex h-6 w-6 items-end gap-0.5">
                <span className="h-2 w-1 rounded-sm bg-white/90" />
                <span className="h-3 w-1 rounded-sm bg-white/90" />
                <span className="h-4 w-1 rounded-sm bg-white/90" />
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-xl font-semibold tracking-wide">MetroNest</p>
              <p className="text-[11px] text-slate-300">Dashboard</p>
            </div>
          </Link>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}
