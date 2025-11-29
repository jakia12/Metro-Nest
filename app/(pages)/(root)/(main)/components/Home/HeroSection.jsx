import { Home } from "lucide-react";
import PropertySearchNew from "./PropertySearchNew";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/ban.jpg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>

      {/* Content */}

      {/* Content */}
      <div className="relative z-10 flex min-h-[80vh] items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 text-white">
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide sm:text-base">
                Real Estate Agency
              </span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your Dream House By Us
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base text-gray-200 sm:text-lg md:text-xl">
              Discover your perfect property with our expert guidance. We help
              you find exceptional homes that match your lifestyle and budget.
            </p>

            {/* CTA Button */}
            <button className="rounded bg-[#F14555] px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[#f14556e3] hover:shadow-lg sm:px-10 sm:py-4 sm:text-lg">
              Make An Enquiry
            </button>
          </div>
        </div>
      </div>
      <PropertySearchNew />
    </section>
  );
}
