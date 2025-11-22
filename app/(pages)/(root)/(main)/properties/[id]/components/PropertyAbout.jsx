export function PropertyAbout({ property }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f05454]">
            About This Property
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {property.description}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Price
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {property.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Plus taxes and closing fees
          </p>
        </div>
      </div>
    </section>
  );
}
