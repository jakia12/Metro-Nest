"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const tabs = ["Buy", "Sell", "Rent"];

export default function PropertySearchSection() {
  const [activeTab, setActiveTab] = useState("Buy");
  const [minPrice, setMinPrice] = useState(125000);
  const [maxPrice, setMaxPrice] = useState(825000);

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxPrice) setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice) setMaxPrice(value);
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-orange-50/40 py-8 md:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-white shadow-[0_18px_45px_rgba(0,0,0,0.07)] overflow-hidden">
          {/* Tabs */}
          <div className="flex justify-start gap-0 bg-gradient-to-r from-[#ff4b2b] to-[#ff416c]">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 text-sm font-semibold uppercase tracking-wide transition-all
                  ${
                    activeTab === tab
                      ? "bg-white text-[#ff4b2b]"
                      : "text-white/90 hover:bg-white/10"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6 px-4 pb-6 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
            {/* Row 1 */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FieldSelect
                  label="Property Type"
                  placeholder="Select Property Type"
                />
                <FieldSelect label="Room Type" placeholder="Select Room Type" />
                <FieldSelect
                  label="Min Area (Sqft)"
                  placeholder="Select Area"
                />
                <FieldSelect
                  label="Max Area (Sqft)"
                  placeholder="Select Max Area"
                />
              </div>

              {/* Advanced Search button */}
              <div className="flex justify-start lg:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Advanced Search</span>
                </button>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FieldSelect
                  label="Max of Bedrooms"
                  placeholder="Select Max Bedrooms"
                />
                <FieldSelect
                  label="Max of Bathrooms"
                  placeholder="Select Max Bathrooms"
                />
                <FieldSelect label="Location" placeholder="Select Location" />
              </div>

              {/* Price Range + Search button */}
              <div className="flex flex-col gap-4 lg:w-[40%] lg:flex-row lg:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-gray-800">
                    Price Range
                  </label>

                  <div className="space-y-2">
                    {/* Slider */}
                    <div className="relative flex items-center gap-2">
                      <div className="relative w-full">
                        {/* Two range inputs over same line */}
                        <input
                          type="range"
                          min="50000"
                          max="1000000"
                          step="5000"
                          value={minPrice}
                          onChange={handleMinPriceChange}
                          className="range-thumb pointer-events-auto absolute inset-0 w-full appearance-none bg-transparent"
                        />
                        <input
                          type="range"
                          min="50000"
                          max="1000000"
                          step="5000"
                          value={maxPrice}
                          onChange={handleMaxPriceChange}
                          className="range-thumb pointer-events-auto absolute inset-0 w-full appearance-none bg-transparent"
                        />
                        {/* Base line */}
                        <div className="mt-4 h-1 rounded-full bg-gray-200"></div>
                      </div>
                    </div>

                    {/* Price labels */}
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700 sm:text-sm">
                      <span>${minPrice.toLocaleString()}</span>
                      <span>-</span>
                      <span>${maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Search button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff4b2b] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff4b2b]/40 transition hover:bg-[#e63f23] lg:w-auto lg:min-w-[190px]"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Property</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Small reusable select-like field ---------- */

function FieldSelect({ label, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-sm text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-white"
      >
        <span className="truncate">{placeholder}</span>
        <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}
