export function PropertyAmenities({ property }) {
  const amenities = property.amenities || [];

  if (!amenities.length) return null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="mb-3 text-sm font-semibold text-slate-900 md:text-base">
        Features & Amenities
      </h2>
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        {amenities.map((item) => (
          <div key={item} className="flex items-center gap-2 text-slate-600">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#f05454]/10 text-[10px] text-[#f05454]">
              ●
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
