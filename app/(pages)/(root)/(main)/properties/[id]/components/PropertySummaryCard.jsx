export function PropertySummaryCard({ property }) {
  return (
    <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Listing Summary
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">
        {property.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {property.beds} Beds • {property.baths} Baths • {property.area} sqft
      </p>

      <div className="mt-4 space-y-2 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
            {property.status}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Property Type</span>
          <span className="font-medium text-slate-800">{property.type}</span>
        </div>
        {property.location?.city && (
          <div className="flex items-center justify-between">
            <span>City</span>
            <span className="font-medium text-slate-800">
              {property.location.city}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
