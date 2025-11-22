import { Geist, Geist_Mono } from "next/font/google";
import "../../../globals.css";

import { Toaster } from "react-hot-toast";
import { Providers } from "../../../.././app/providers/providers";
import Footer from "../../../../components/shared/Footer";
import Navbar from "../../../../components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),

  title: "MetroNest – Modern Real Estate Listings",
  description:
    "Find your dream home with MetroNest. Browse modern property listings, explore neighborhoods, and connect with trusted agents.",

  icons: {
    icon: "/images/fav.png", // default favicon
    shortcut: "/images/fav.png",
    apple: "/images/fav.png",
  },

  openGraph: {
    title: "MetroNest – Modern Real Estate Listings",
    description:
      "Explore premium residential and commercial properties for rent and sale. MetroNest is your trusted real-estate platform.",
    url: "/",
    siteName: "MetroNest",
    images: [
      {
        url: "/images/opengraph.jpg", // <-- add your own OG image
        width: 1200,
        height: 630,
        alt: "MetroNest Real Estate Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <Navbar />
        <main>   {children}</main>

        <Footer />
        </Providers>
        {/* jQuery */}

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              maxWidth: "min(92vw, 300px)", // ⬅️ wider toasts, but not past viewport
              width: "100%",
              whiteSpace: "pre-wrap", // nicer wrapping for long messages
              wordBreak: "break-word",
              fontSize: "17px",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
