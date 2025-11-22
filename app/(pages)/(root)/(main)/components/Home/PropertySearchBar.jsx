// app/components/PropertySearchBar.jsx
"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertySearchBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buy");
  const [minPrice, setMinPrice] = useState(125000);
  const [maxPrice, setMaxPrice] = useState(825000);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    propertyType: "",
    roomType: "",
    minArea: "",
    maxArea: "",
    maxBedrooms: "",
    maxBathrooms: "",
    location: "",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch unique locations from properties
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/properties");
        const result = await response.json();
        if (result.success) {
          // Extract unique locations from addresses
          const uniqueLocations = new Set();
          result.data.forEach((property) => {
            if (property.address) {
              const parts = property.address.split(",");
              if (parts.length >= 2) {
                uniqueLocations.add(parts[parts.length - 1].trim());
              }
            }
          });
          setLocations(Array.from(uniqueLocations).sort());
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  const formatPrice = (value) =>
    `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Build search params
    const params = new URLSearchParams();

    // Map tab to status
    if (activeTab === "buy") {
      params.append("status", "For Sale");
    } else if (activeTab === "rent") {
      params.append("status", "For Rent");
    } else if (activeTab === "sell") {
      params.append("status", "For Sale");
    }

    // Add filters
    if (
      formData.propertyType &&
      formData.propertyType !== "Select Property Type"
    ) {
      params.append("type", formData.propertyType);
    }
    if (formData.minArea && formData.minArea !== "Select Area") {
      const minAreaValue = formData.minArea.replace("+", "").replace(",", "");
      params.append("minArea", minAreaValue);
    }
    if (formData.maxArea && formData.maxArea !== "Select Max Area") {
      const maxAreaValue = formData.maxArea.replace(",", "");
      params.append("maxArea", maxAreaValue);
    }
    if (
      formData.maxBedrooms &&
      formData.maxBedrooms !== "Select Max Bedrooms"
    ) {
      const bedsValue = formData.maxBedrooms.replace("+", "");
      params.append("maxBeds", bedsValue);
    }
    if (
      formData.maxBathrooms &&
      formData.maxBathrooms !== "Select Max Bathrooms"
    ) {
      const bathsValue = formData.maxBathrooms.replace("+", "");
      params.append("maxBaths", bathsValue);
    }
    if (formData.location && formData.location !== "Select Location") {
      params.append("location", formData.location);
    }
    if (minPrice > 50000) {
      params.append("minPrice", minPrice.toString());
    }
    if (maxPrice < 1000000) {
      params.append("maxPrice", maxPrice.toString());
    }

    // Redirect to properties page with search params
    const searchQuery = params.toString();
    router.push(`/properties${searchQuery ? `?${searchQuery}` : ""}`);
  };

  return (
    <section className="w-full bg-[#F9F5F3] pt-12 md:pt-16 pb-10 mt-[-85px] md:mt-[-100px] lg:mt-[-95px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
        {/* Card */}
        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
          {/* Tabs */}
          <div className="flex gap-0 rounded-t-2xl border-b border-slate-200 bg-[#ff4b4b] sm:bg-transparent">
            <button
              type="button"
              onClick={() => setActiveTab("buy")}
              className={`px-8 py-3 text-sm font-semibold transition ${
                activeTab === "buy"
                  ? "bg-[#ff4b4b] text-white"
                  : "bg-white text-slate-800 border-b border-slate-200 sm:border sm:border-b-0"
              } rounded-t-2xl`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sell")}
              className={`px-8 py-3 text-sm font-semibold transition ${
                activeTab === "sell"
                  ? "bg-[#ff4b4b] text-white"
                  : "bg-white text-slate-800 border-b border-slate-200 sm:border sm:border-b-0"
              }`}
            >
              Sell
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rent")}
              className={`px-8 py-3 text-sm font-semibold transition ${
                activeTab === "rent"
                  ? "bg-[#ff4b4b] text-white"
                  : "bg-white text-slate-800 border-b border-slate-200 sm:border sm:border-b-0"
              } rounded-tr-2xl`}
            >
              Rent
            </button>
          </div>

          {/* Form content */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 px-4 pb-6 pt-6 sm:px-6 lg:px-10 lg:pb-8 lg:pt-7">
              {/* Row 1 */}
              <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                {/* Property Type */}
                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-medium text-slate-800">
                    Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) =>
                      handleInputChange("propertyType", e.target.value)
                    }
                    className="w-full rounded-lg bg-[#f7f7f7] px-4 py-2.5 text-sm text-slate-700 outline-none ring-0 focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/40"
                  >
                    <option>Select Property Type</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Type */}
                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-medium text-slate-800">
                    Room Type
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) =>
                      handleInputChange("roomType", e.target.value)
                    }
                    className="w-full rounded-lg bg-[#f7f7f7] px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/40"
                  >
                    <option>Select Room Type</option>
                    <option>1 Bedroom</option>
                    <option>2 Bedrooms</option>
                    <option>3 Bedrooms</option>
                    <option>4+ Bedrooms</option>
                    <option>Studio</option>
                  </select>
                </div>

                {/* Min Area */}
                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-medium text-slate-800">
                    Min Area (Sqft)
                  </label>
                  <select
                    value={formData.minArea}
                    onChange={(e) =>
                      handleInputChange("minArea", e.target.value)
                    }
                    className="w-full rounded-lg bg-[#f7f7f7] px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/40"
                  >
                    <option>Select Area</option>
                    <option>500</option>
                    <option>1000</option>
                    <option>1500</option>
                    <option>2000</option>
                    <option>2500</option>
                    <option>3000</option>
                  </select>
                </div>

                {/* Max Area */}
                <div className="flex flex-col gap-1.5 text-sm">
                  <label className="font-medium text-slate-800">
                    Max Area (Sqft)
                  </label>
                  <select
                    value={formData.maxArea}
                    onChange={(e) =>
                      handleInputChange("maxArea", e.target.value)
                    }
                    className="w-full rounded-lg bg-[#f7f7f7] px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/40"
                  >
                    <option>Select Max Area</option>
                    <option>1000</option>
                    <option>2000</option>
                    <option>3000</option>
                    <option>4000</option>
                    <option>5000</option>
                    <option>10000</option>
                  </select>
                </div>

                {/* Advanced Search */}
                <div className="flex items-end justify-start lg:justify-end">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50 lg:w-auto"
                  >
                    <span>Advanced Search</span>
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                {/* Left group */}
                <div className="grid flex-1 gap-4 md:grid-cols-3">
                  {/* Max of Bedrooms */}
                  <div className="flex flex-col gap-1.5 text-sm">
                    <label className="font-medium text-slate-800">
                      Max of Bedrooms
                    </label>
                    <select
                      value={formData.maxBedrooms}
                      onChange={(e) =>
                        handleInputChange("maxBedrooms", e.target.value)
                      }
                      className="w-full rounded-lg bg-[#f7f7f7] px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/40"
                    >
                      <option>Select Max Bedrooms</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6+</option>
                    </select>
                  </div>

                  {/* Max of Bathrooms */}
                  <div className="flex flex-col gap-1.5 text-sm">
                    <label className="font-medium text-slate-800">
                      Max of Bathrooms
                    </label>
                    <select
                      value={formData.maxBathrooms}
                      onChange={(e) =>
                        handleInputChange("maxBathrooms", e.target.value)
                      }
                      className="w-full rounded-lg bg-[#f7f7f7] px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/40"
                    >
                      <option>Select Max Bathrooms</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5+</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5 text-sm">
                    <label className="font-medium text-slate-800">
                      Location
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full rounded-lg bg-[#f7f7f7] px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b]/40"
                    >
                      <option>Select Location</option>
                      {locations.map((loc, index) => (
                        <option key={index} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Range + Search button */}
                <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-end lg:justify-end">
                  {/* Price Range */}
                  <div className="flex flex-1 flex-col gap-1.5">
                    <span className="text-sm font-medium text-slate-800">
                      Price Range
                    </span>

                    {/* Slider */}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={50000}
                        max={1000000}
                        step={5000}
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(
                            Math.min(Number(e.target.value), maxPrice - 5000)
                          )
                        }
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#ff4b4b]"
                      />
                      <input
                        type="range"
                        min={50000}
                        max={1000000}
                        step={5000}
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(
                            Math.max(Number(e.target.value), minPrice + 5000)
                          )
                        }
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#ff4b4b]"
                      />
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-800">
                      <span>{formatPrice(minPrice)}</span>
                      <span>-</span>
                      <span>{formatPrice(maxPrice)}</span>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff4b4b] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f14242] disabled:opacity-50 disabled:cursor-not-allowed lg:mt-0 lg:min-w-[190px]"
                  >
                    <Search className="h-4 w-4" />
                    <span>{loading ? "Searching..." : "Search Property"}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
