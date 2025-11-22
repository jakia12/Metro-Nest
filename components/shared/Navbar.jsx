"use client";

import { Search } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
const handleLogout = async () => {
  await signOut({
    callbackUrl: "/login",  // redirect to login after logout
  });
};


  return (
    <header className="w-full bg-[#0b2845] text-slate-100">
      {/* Main navbar */}
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-[30px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500">
            <div className="flex h-6 w-6 items-end gap-0.5">
              <span className="h-2 w-1 rounded-sm bg-white/90" />
              <span className="h-3 w-1 rounded-sm bg-white/90" />
              <span className="h-4 w-1 rounded-sm bg-white/90" />
            </div>
          </div>
          <div className="leading-tight">
            <p className="text-3xl font-semibold tracking-wide">MetroNest</p>
            <p className="text-[14px] text-slate-300">Real Estate Solution</p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 text-lg font-medium md:flex">
          <Link href="/" className="hover:text-slate-200">Home</Link>
          <Link href="/about" className="hover:text-slate-200">About Us</Link>
          <Link href="/properties" className="hover:text-slate-200">Properties</Link>
          <Link href="/contact" className="hover:text-slate-200">Contact Us</Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          
          {/* Login / Logout (desktop) */}
          {!session ? (
            <button
              onClick={() => signIn()}
              className="hidden items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-lg font-medium hover:bg-white hover:text-[#0b2845] md:flex"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-lg font-medium hover:bg-white hover:text-[#0b2845] md:flex"
            >
              Logout
            </button>
          )}

          {/* Search circle */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white hover:text-[#0b2845] transition">
            <Search className="h-4 w-4" />
          </button>

          {/* Mobile menu icon */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-xl md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile nav menu */}
      <div
        className={`md:hidden transition-[max-height,opacity] duration-200 ease-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden border-t border-white/10 bg-[#0b2845]`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-lg">
          <Link href="/" className="hover:text-slate-200">Home</Link>
          <Link href="/about" className="hover:text-slate-200">About Us</Link>
          <Link href="/properties" className="hover:text-slate-200">Properties</Link>
          <Link href="/contact" className="hover:text-slate-200">Contact Us</Link>

          {/* Mobile Login / Logout */}
          {!session ? (
            <button
              onClick={() => signIn()}
              className="rounded-full border border-white/40 px-4 py-2 text-lg font-medium hover:bg-white hover:text-[#0b2845]"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/40 px-4 py-2 text-lg font-medium hover:bg-white hover:text-[#0b2845]"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
