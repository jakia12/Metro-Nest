import {
    ChevronRight,
    FileText,
    Headphones,
    HelpCircle,
    Home,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Shield
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b2845] text-slate-100 pt-12 pb-6">
      <div className="mx-auto max-w-[1600px] px-4">
        {/* Top grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About MetroNest */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About MetroNest</h3>
            <p className="text-[14px] text-slate-300 leading-relaxed mb-5">
              MetroNest is your modern real estate platform – connecting buyers,
              renters, and agents with premium properties in top locations.
            </p>

            <div className="space-y-3 text-[14px]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/50">
                  <Phone className="h-4 w-4 text-rose-500" />
                </span>
                <span>+00 (123) 456 789 012</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/50">
                  <Mail className="h-4 w-4 text-rose-500" />
                </span>
                <span>info@metronest.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800/50">
                  <MapPin className="h-4 w-4 text-rose-500" />
                </span>
                <span>West 2nd Lane, Inner Circular Road, New York City</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-rose-500" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Home className="h-4 w-4 text-rose-500" />
                  <span>Properties</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Shield className="h-4 w-4 text-rose-500" />
                  <span>Privacy & Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <FileText className="h-4 w-4 text-rose-500" />
                  <span>Sitemap</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <FileText className="h-4 w-4 text-rose-500" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link
                  href="/help"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <HelpCircle className="h-4 w-4 text-rose-500" />
                  <span>Help Center</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-rose-500" />
                  <span>FAQs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-rose-500" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Headphones className="h-4 w-4 text-rose-500" />
                  <span>Ticket Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-[14px] text-slate-300 leading-relaxed mb-4">
              Subscribe to our newsletter to get the latest updates on new properties and exclusive offers.
            </p>
            
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-full bg-slate-800/50 border border-slate-700 px-4 py-2.5 text-[14px] text-white placeholder:text-slate-400 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-2.5 text-[14px] font-medium text-white shadow-sm transition hover:bg-rose-600"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>

            <p className="mt-4 text-xs text-slate-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-slate-700/50 pt-4 text-xs text-slate-400 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MetroNest. All rights reserved.</p>
          <p className="text-slate-500">Built with Next.js & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
