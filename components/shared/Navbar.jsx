"use client";

import { Building2, Home, Info, LogIn, LogOut, Mail, Menu, Search, User, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/contact", label: "Contact Us", icon: Mail },
  ];

  return (
    <header className="w-full bg-white text-slate-900 border-b border-slate-200 shadow-sm">
      {/* Main navbar */}
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-5">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
            <div className="flex h-6 w-6 items-end gap-0.5">
              <span className="h-2 w-1 rounded-sm bg-white/90 transition-all duration-300 group-hover:h-3" />
              <span className="h-3 w-1 rounded-sm bg-white/90 transition-all duration-300 group-hover:h-4" />
              <span className="h-4 w-1 rounded-sm bg-white/90 transition-all duration-300 group-hover:h-5" />
            </div>
          </div>
          <div className="leading-tight">
            <p className="text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-sky-600">
              MetroNest
            </p>
            <p className="text-xs text-slate-500 transition-colors duration-300 group-hover:text-slate-600">
              Real Estate Solution
            </p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-sky-500" />
                <span className="relative">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* User Profile or Login (desktop) */}
          {session ? (
            <div className="hidden items-center gap-3 md:flex">
              {/* User Avatar */}
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-base font-medium text-slate-700 transition-all duration-300 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md"
              >
                <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="max-w-[100px] truncate">
                  {session.user?.name || session.user?.email || "Profile"}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-700 transition-all duration-300 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md"
              >
                <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="group hidden items-center gap-2 rounded-full border border-slate-200 bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-base font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg md:flex"
            >
              <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Login</span>
            </button>
          )}

          {/* Search button */}
          <button className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:scale-110 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md">
            <Search className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          </button>

          {/* Mobile menu icon */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        } overflow-hidden border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: mobileOpen ? "slideIn 0.3s ease-out forwards" : "none",
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 transition-all duration-300 group-hover:bg-sky-100 group-hover:scale-110">
                  <Icon className="h-5 w-5 transition-colors duration-300 group-hover:text-sky-500" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Mobile User Section */}
          {session ? (
            <div className="mt-2 space-y-2 border-t border-slate-200 pt-3">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 transition-all duration-300 group-hover:bg-sky-100 group-hover:scale-110">
                  <User className="h-5 w-5 transition-colors duration-300 group-hover:text-sky-500" />
                </div>
                <span className="flex-1 truncate">
                  {session.user?.name || session.user?.email || "Profile"}
                </span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 transition-all duration-300 group-hover:bg-rose-100 group-hover:scale-110">
                  <LogOut className="h-5 w-5 transition-colors duration-300 group-hover:text-rose-500" />
                </div>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                signIn();
                setMobileOpen(false);
              }}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Login</span>
            </button>
          )}
        </nav>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}