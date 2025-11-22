"use client";

import { Building2, CalendarDays, Home, LayoutDashboard, Menu, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Listings", icon: Home, href: "/dashboard/listings" },
  { label: "Leads & CRM", icon: Users, href: "/dashboard/inquiries" },
  { label: "Tours & Calendar", icon: CalendarDays, href: "/dashboard/tours" },
  { label: "Agencies & Teams", icon: Building2, href: "/dashboard/agencies" },
];

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // While checking session
  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4EEE8]">
        <p className="text-sm text-slate-600">Checking your session...</p>
      </main>
    );
  }

  // Avoid flicker when redirecting
  if (!session) return null;

  const displayName = session.user?.name || session.user?.email || "User";

  return (
    <main className="min-h-screen bg-[#F4EEE8]">
      <div className="flex min-h-screen">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-72 flex-col border-r border-slate-100 bg-white/95 px-5 py-6 shadow-sm backdrop-blur lg:flex">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-rose-500 uppercase">
                MetroNest
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Agency Dashboard
              </p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-slate-900 text-slate-50 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/70"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                        isActive ? "bg-slate-800/80" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${
                          isActive ? "text-rose-300" : "text-slate-500"
                        }`}
                      />
                    </span>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom quick stat */}
          <div className="mt-auto rounded-2xl bg-slate-900 px-4 py-4 text-slate-100">
            <p className="text-[11px] font-medium text-slate-300">
              Today&apos;s Snapshot
            </p>
            <p className="mt-1 text-lg font-semibold">3 new inquiries</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Respond quickly for higher conversion rates.
            </p>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 flex w-72 flex-col border-r border-slate-100 bg-white px-5 py-6 shadow-lg">
              <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500 text-white">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    MetroNest
                  </p>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <nav className="mt-6 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-slate-900 text-slate-50 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100/70"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                            isActive ? "bg-slate-800/80" : "bg-slate-100"
                          }`}
                        >
                          <Icon
                            className={`h-3.5 w-3.5 ${
                              isActive ? "text-rose-300" : "text-slate-500"
                            }`}
                          />
                        </span>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-slate-100 bg-[#F4EEE8]/80 backdrop-blur">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose-500">
                    Dashboard
                  </p>
                  <h1 className="text-lg font-semibold text-slate-900 sm:text-xl md:text-2xl">
                    Welcome back, {displayName}
                  </h1>
                </div>
              </div>

              
            </div>
          </header>

          {/* Page content */}
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}