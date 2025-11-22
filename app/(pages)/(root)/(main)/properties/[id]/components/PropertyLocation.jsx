import { MapPin } from "lucide-react";

export function PropertyLocation({ property }) {
  const loc = property.location || {};

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="mb-3 text-sm font-semibold text-slate-900 md:text-base">
        Location
      </h2>
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-600">
        <MapPin className="h-4 w-4 text-[#f05454]" />
        <span>
          {property.address}
          {loc.city && `, ${loc.city}`}
          {loc.state && `, ${loc.state}`}
        </span>
      </div>
      {/* Replace with real map embed later if you want */}
      <div className="h-60 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
        <div className="flex h-full items-center justify-center text-xs text-slate-500">
          Map preview placeholder
        </div>
      </div>
    </section>
  );
}
