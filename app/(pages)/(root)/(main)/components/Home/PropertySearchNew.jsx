'use client'

import { Bath, Bed, Home, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function PropertySearchNew() {
  const [activeTab, setActiveTab] = useState("sale");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categories, setCategories] = useState([
    { _id: 1, name: "House" },
    { _id: 2, name: "Apartment" },
    { _id: 3, name: "Condo" },
    { _id: 4, name: "Villa" },
  ]);
  const [locations, setLocations] = useState([
    "New York",
    "Los Angeles",
    "Chicago",
    "Miami",
    "Seattle",
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    keyword: "",
    propertyType: "",
    location: "",
    propertyStatus: "",
    bedrooms: "",
    bathrooms: "",
    minArea: 900,
    maxArea: 4500,
    minPrice: 179800,
    maxPrice: 6000000,
    amenities: {
      airConditioning: false,
      swimmingPool: false,
      centralHeating: false,
      laundryRoom: false,
      gym: false,
      alarm: false,
      windowCovering: false,
      wifi: false,
      tvCable: false,
      dryer: false,
      microwave: false,
      washer: false,
      refrigerator: false,
      outdoorShower: false,
      parking: false,
      furnished: false,
    },
  });

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatArea = (value) => {
    return `${value.toLocaleString()} sq ft`;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (formData.keyword && formData.keyword.trim().length < 2) {
      newErrors.keyword = "Keyword must be at least 2 characters";
    }

    if (formData.minPrice > formData.maxPrice) {
      newErrors.price = "Minimum price cannot be greater than maximum price";
    }

    if (formData.minArea > formData.maxArea) {
      newErrors.area = "Minimum area cannot be greater than maximum area";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const params = new URLSearchParams();

    // Map tab to status
    if (activeTab === "sale") {
      params.append("status", "For Sale");
    } else if (activeTab === "rent") {
      params.append("status", "For Rent");
    }

    // Add keyword search
    if (formData.keyword && formData.keyword.trim()) {
      params.append("keyword", formData.keyword.trim());
    }

    // Add filters
    if (formData.propertyType) {
      params.append("type", formData.propertyType);
    }
    if (formData.location) {
      params.append("location", formData.location);
    }
    if (formData.propertyStatus) {
      params.append("propertyStatus", formData.propertyStatus);
    }
    if (formData.bedrooms) {
      params.append("minBeds", formData.bedrooms);
    }
    if (formData.bathrooms) {
      params.append("minBaths", formData.bathrooms);
    }

    // Area range
    if (formData.minArea > 900) {
      params.append("minArea", formData.minArea.toString());
    }
    if (formData.maxArea < 4500) {
      params.append("maxArea", formData.maxArea.toString());
    }

    // Price range
    if (formData.minPrice > 179800) {
      params.append("minPrice", formData.minPrice.toString());
    }
    if (formData.maxPrice < 6000000) {
      params.append("maxPrice", formData.maxPrice.toString());
    }

    // Add selected amenities
    Object.entries(formData.amenities).forEach(([key, value]) => {
      if (value) {
        if (key === "parking") {
          params.append("hasParking", "true");
        } else if (key === "furnished") {
          params.append("isFurnished", "true");
        } else {
          params.append(`amenity_${key}`, "true");
        }
      }
    });

    const searchQuery = params.toString();
    const url = `/properties${searchQuery ? `?${searchQuery}` : ""}`;

    // Redirect to properties page
    window.location.href = url;
    
    setTimeout(() => {
      setLoading(false);
      setShowAdvanced(false);
    }, 500);
  };

  return (
    <>
      {/* Hero Section with Background */}
       <section className="relative w-full   overflow-hidden mt-[60px]">
        {/* Background Image */}
       

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
         

          {/* Tab Buttons */}
          {/* <div className="flex gap-0 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("sale")}
              className={`relative px-8 py-3 text-base font-semibold transition-all duration-200 ${
                activeTab === "sale"
                  ? "bg-[#ff5a6a] text-white"
                  : "bg-white text-slate-800"
              } rounded-l-lg`}
            >
              For Sale
              {activeTab === "sale" && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#ff5a6a]"></div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rent")}
              className={`relative px-8 py-3 text-base font-semibold transition-all duration-200 ${
                activeTab === "rent"
                  ? "bg-[#ff5a6a] text-white"
                  : "bg-white text-slate-800"
              } rounded-r-lg`}
            >
              For Rent
              {activeTab === "rent" && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#ff5a6a]"></div>
              )}
            </button>
          </div> */}

          {/* Search Card */}
          <div className="w-full max-w-[1500px]">
            <div className="relative rounded-2xl bg-white shadow-3xl p-5 md:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                {/* Keyword Input */}
                <div className="lg:col-span-1">
                  <input
                    type="text"
                    placeholder="Enter Keyword..."
                    value={formData.keyword}
                    onChange={(e) =>
                      handleInputChange("keyword", e.target.value)
                    }
                    className={`w-full rounded-lg border ${
                      errors.keyword ? "border-red-500" : "border-gray-200"
                    } px-4 py-3 text-sm text-slate-700 placeholder:text-gray-400 focus:border-[#ff5a6a] focus:outline-none focus:ring-2 focus:ring-[#ff5a6a]/20`}
                  />
                  {errors.keyword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.keyword}
                    </p>
                  )}
                </div>

                {/* Property Type */}
                <div className="lg:col-span-1">
                  <select
                    value={formData.propertyType}
                    onChange={(e) =>
                      handleInputChange("propertyType", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-slate-700 focus:border-[#ff5a6a] focus:outline-none focus:ring-2 focus:ring-[#ff5a6a]/20 cursor-pointer bg-white"
                  >
                    <option value="">Property Type</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="lg:col-span-1">
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-slate-700 focus:border-[#ff5a6a] focus:outline-none focus:ring-2 focus:ring-[#ff5a6a]/20 cursor-pointer bg-white"
                  >
                    <option value="">Location</option>
                    {locations.map((loc, index) => (
                      <option key={index} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Advanced Search Button */}
                <div className="lg:col-span-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-gray-50 hover:border-gray-400"
                  >
                    <span>Advanced Search</span>
                    <SlidersHorizontal className="h-4 w-4 text-[#ff5a6a]" />
                  </button>
                </div>

                {/* Search Button */}
                <div className="lg:col-span-1">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff5a6a] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#f14555] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? "Searching..." : "Search Now"}</span>
                  </button>
                </div>
              </div>
              {errors.price && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  {errors.price}
                </p>
              )}
              {errors.area && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  {errors.area}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search Modal */}
      {showAdvanced && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start justify-center px-4 pt-4 pb-20 sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-sm"
              onClick={() => setShowAdvanced(false)}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all mt-8 sm:mt-16">
              {/* Header with tabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex justify-center gap-0 pt-6 pb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("sale")}
                    className={`relative px-10 py-3 text-base font-semibold transition-all ${
                      activeTab === "sale"
                        ? "bg-white text-slate-800 shadow-md"
                        : "bg-[#ff5a6a] text-white"
                    } rounded-l-xl`}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("rent")}
                    className={`relative px-10 py-3 text-base font-semibold transition-all ${
                      activeTab === "rent"
                        ? "bg-white text-slate-800 shadow-md"
                        : "bg-[#ff5a6a] text-white"
                    } rounded-r-xl`}
                  >
                    For Rent
                  </button>
                </div>

                {/* Search Bar in Modal */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                    <input
                      type="text"
                      placeholder="Enter Keyword..."
                      value={formData.keyword}
                      onChange={(e) =>
                        handleInputChange("keyword", e.target.value)
                      }
                      className={`w-full rounded-lg border ${
                        errors.keyword ? "border-red-500" : "border-gray-200"
                      } px-4 py-3 text-sm text-slate-700 placeholder:text-gray-400 focus:border-[#ff5a6a] focus:outline-none focus:ring-2 focus:ring-[#ff5a6a]/20`}
                    />
                    <select
                      value={formData.propertyType}
                      onChange={(e) =>
                        handleInputChange("propertyType", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-slate-700 focus:border-[#ff5a6a] focus:outline-none focus:ring-2 focus:ring-[#ff5a6a]/20 bg-white"
                    >
                      <option value="">Property Type</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-slate-700 focus:border-[#ff5a6a] focus:outline-none focus:ring-2 focus:ring-[#ff5a6a]/20 bg-white"
                    >
                      <option value="">Location</option>
                      {locations.map((loc, index) => (
                        <option key={index} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
                    >
                      <span>Advanced Search</span>
                      <SlidersHorizontal className="h-4 w-4 text-[#ff5a6a]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Property Status */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                      <Home className="h-5 w-5 text-[#ff5a6a]" />
                      Property Status
                    </label>
                    <select
                      value={formData.propertyStatus}
                      onChange={(e) =>
                        handleInputChange("propertyStatus", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-slate-700 focus:border-[#ff5a6a] focus:outline-none focus:ring-2 focus:ring-[#ff5a6a]/20 bg-white"
                    >
                      <option value="">Select Status</option>
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                      <Bed className="h-5 w-5 text-[#ff5a6a]" />
                      Bedrooms
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Any", "1+", "2+", "3+", "4+"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              "bedrooms",
                              option === "Any" ? "" : option.replace("+", "")
                            )
                          }
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                            (option === "Any" && !formData.bedrooms) ||
                            formData.bedrooms === option.replace("+", "")
                              ? "bg-slate-900 text-white"
                              : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                          }`}
                        >
                          <Bed className="h-3.5 w-3.5" />
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                      <Bath className="h-5 w-5 text-[#ff5a6a]" />
                      Bathrooms
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Any", "1+", "2+", "3+"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              "bathrooms",
                              option === "Any" ? "" : option.replace("+", "")
                            )
                          }
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                            (option === "Any" && !formData.bathrooms) ||
                            formData.bathrooms === option.replace("+", "")
                              ? "bg-slate-900 text-white"
                              : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                          }`}
                        >
                          <Bath className="h-3.5 w-3.5" />
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                    PRICE RANGE
                  </label>
                  <div className="relative pt-1 pb-6">
                    <input
                      type="range"
                      min={179800}
                      max={6000000}
                      step={10000}
                      value={formData.maxPrice}
                      onChange={(e) =>
                        handleInputChange("maxPrice", Number(e.target.value))
                      }
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ff5a6a 0%, #ff5a6a ${
                          ((formData.maxPrice - 179800) / (6000000 - 179800)) * 100
                        }%, #e5e7eb ${
                          ((formData.maxPrice - 179800) / (6000000 - 179800)) * 100
                        }%, #e5e7eb 100%)`,
                      }}
                    />
                    <div className="flex justify-between mt-3 text-xs font-medium text-gray-600">
                      <span>{formatPrice(179800)}</span>
                      <span>{formatPrice(formData.maxPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Area Size */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                    AREA SIZE
                  </label>
                  <div className="relative pt-1 pb-6">
                    <input
                      type="range"
                      min={900}
                      max={4500}
                      step={50}
                      value={formData.maxArea}
                      onChange={(e) =>
                        handleInputChange("maxArea", Number(e.target.value))
                      }
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ff5a6a 0%, #ff5a6a ${
                          ((formData.maxArea - 900) / (4500 - 900)) * 100
                        }%, #e5e7eb ${
                          ((formData.maxArea - 900) / (4500 - 900)) * 100
                        }%, #e5e7eb 100%)`,
                      }}
                    />
                    <div className="flex justify-between mt-3 text-xs font-medium text-gray-600">
                      <span>{formatArea(900)}</span>
                      <span>{formatArea(formData.maxArea)}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                    AMENITIES
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "parking", label: "Parking" },
                      { key: "furnished", label: "Furnished" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 transition"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities[key]}
                          onChange={() => handleAmenityChange(key)}
                          className="w-3.5 h-3.5 text-[#ff5a6a] border-gray-300 rounded focus:ring-[#ff5a6a] focus:ring-2 cursor-pointer"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
                <div className="text-center text-sm text-gray-600 mb-4">
                  Properties In Most Popular Places.
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(false)}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff5a6a] px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#f14555] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="h-5 w-5" />
                    <span>{loading ? "Searching..." : "Search Now"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}