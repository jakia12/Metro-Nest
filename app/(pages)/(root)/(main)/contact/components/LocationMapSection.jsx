// app/components/LocationMapSection.jsx
import { MapPin } from "lucide-react";

export default function LocationMapSection() {
  const googleMapsUrl =
    "https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE_HERE";

  const largerMapUrl = "https://www.google.com/maps/place/YOUR_PLACE_LINK_HERE";

  return (
    <section className="w-full bg-white ">
      <div className="">
        {/* Top bar */}

        {/* Map container */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
          {/* Map iframe */}
          <iframe
            src={googleMapsUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[260px] w-full md:h-[380px] lg:h-[460px]"
            style={{ border: 0 }}
            allowFullScreen
          />

          {/* Center marker overlay */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4b4b]">
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Subtle hover effect */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-[#ff4b4b]/0 transition-all duration-300 hover:ring-2" />
        </div>
      </div>
    </section>
  );
}
