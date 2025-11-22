// app/components/PriceAreaFilter.jsx
"use client";

export default function PriceAreaFilter({
  filters,
  setFilters,
  minPrice,
  maxPrice,
  minArea,
  maxArea,
}) {
  const maxPriceValue =
    filters.maxPrice === "" ? maxPrice : Number(filters.maxPrice);
  const maxAreaValue =
    filters.maxArea === "" ? maxArea : Number(filters.maxArea);

  const pricePercent =
    maxPrice === minPrice
      ? 0
      : ((maxPriceValue - minPrice) / (maxPrice - minPrice)) * 100;

  const areaPercent =
    maxArea === minArea
      ? 0
      : ((maxAreaValue - minArea) / (maxArea - minArea)) * 100;

  const formatCurrency = (v) => `$${v.toLocaleString()}`;

  return (
    <div className="space-y-5">
      {/* Price Range */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Price Range
        </p>

        <div className="range-slider">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={maxPriceValue}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFilters((prev) => ({
                ...prev,
                maxPrice: val,
              }));
            }}
            style={{ "--range-progress": `${pricePercent}%` }}
          />
        </div>

        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{formatCurrency(minPrice)}</span>
          <span>{formatCurrency(maxPriceValue)}</span>
        </div>
      </div>

      {/* Area Size */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Area Size
        </p>

        <div className="range-slider">
          <input
            type="range"
            min={minArea}
            max={maxArea}
            value={maxAreaValue}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFilters((prev) => ({
                ...prev,
                maxArea: val,
              }));
            }}
            style={{ "--range-progress": `${areaPercent}%` }}
          />
        </div>

        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{minArea} sq ft</span>
          <span>{maxAreaValue.toLocaleString()} sq ft</span>
        </div>
      </div>
    </div>
  );
}
