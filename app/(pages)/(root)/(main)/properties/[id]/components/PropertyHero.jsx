const {
  Heart,
  Share2,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
} = require("lucide-react");
const { default: Image } = require("next/image");

export function PropertyHero({ property }) {
  const images = property.images?.length
    ? property.images
    : [property.mainImage];

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="relative h-[320px] w-full md:h-[420px]">
        <Image
          src={property.mainImage || images[0] || "/images/pr.png"}
          alt={property.title}
          fill
          className="object-cover"
        />

        {/* Status badge */}
        <div className="absolute left-6 top-6">
          <div className="relative">
            <div className="h-9 rounded-full bg-[#f05454] px-4 text-xs font-semibold leading-9 text-white shadow-md">
              {property.status}
            </div>
            <div className="absolute -bottom-2 left-6 h-2 w-6 rotate-45 bg-[#f05454]" />
          </div>
        </div>

        {/* Top-right actions */}
        <div className="absolute right-6 top-6 flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur hover:bg-rose-50 hover:text-rose-500">
            <Heart className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur hover:bg-slate-900 hover:text-white">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom overlay – title, address, quick stats */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 pb-4 pt-16">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white md:text-2xl">
                {property.title}
              </h1>
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-100/90">
                <MapPin className="h-3.5 w-3.5 text-[#f05454]" />
                <span>{property.address}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-100/90">
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span>Bed {property.beds}</span>
              </div>
              <span className="hidden h-3 w-px bg-slate-200/60 md:block" />
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>Bath {property.baths}</span>
              </div>
              <span className="hidden h-3 w-px bg-slate-200/60 md:block" />
              <div className="flex items-center gap-1">
                <Maximize2 className="h-4 w-4" />
                <span>{property.area} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto border-t border-slate-100 bg-slate-50/60 px-4 py-3">
          {images.map((src) => (
            <div
              key={src}
              className="relative h-16 w-24 flex-none overflow-hidden rounded-xl border border-slate-100"
            >
              <Image
                src={src}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
