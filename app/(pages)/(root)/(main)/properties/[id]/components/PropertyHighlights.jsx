export function PropertyHighlights({ property }) {
  const highlights = property.highlights || {};

  const items = [
    { label: "Year Built", value: highlights.yearBuilt || "N/A" },
    { label: "Parking", value: highlights.parking || "N/A" },
    { label: "Heating", value: highlights.heating || "N/A" },
    { label: "Cooling", value: highlights.cooling || "N/A" },
  ];

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 md:text-base">
          Property Highlights
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-xs"
          >
            <p className="text-[11px] font-medium text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
