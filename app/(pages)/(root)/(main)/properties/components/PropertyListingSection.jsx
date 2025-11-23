// app/components/PropertyListingSection.jsx
"use client";

import {
  Bath,
  BedDouble,
  ChevronDown,
  Heart,
  LayoutGrid,
  List,
  MapPin,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import PriceAreaFilter from "./PriceAreaFilter";

const sortOptions = [
  { value: "default", label: "Default Sorting" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
];

export default function PropertyListingSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // ---- FILTER STATE ----
  const [filters, setFilters] = useState({
    dealType: "all",
    propertyType: "all",
    minPrice: "",
    maxPrice: "",
    minBeds: "",
    minBaths: "",
    minArea: "",
    maxArea: "",
    keyword: "",
    location: "",
    hasParking: false,
    isFurnished: false,
    petFriendly: false,
  });

  const resetFilters = () =>
    setFilters({
      dealType: "all",
      propertyType: "all",
      minPrice: "",
      maxPrice: "",
      minBeds: "",
      minBaths: "",
      minArea: "",
      maxArea: "",
      keyword: "",
      location: "",
      hasParking: false,
      isFurnished: false,
      petFriendly: false,
    });

  // ---- CHECK USER AUTHENTICATION ----
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        
        if (data.success) {
          setUser(data.data);
          // Fetch user's favorites if logged in
          fetchUserFavorites(data.data._id);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  // ---- FETCH USER'S FAVORITES ----
  const fetchUserFavorites = async (userId) => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        // Extract property IDs from favorites
        const favoriteIds = data.data.map(fav => fav.property._id || fav.property);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // ---- FETCH PROPERTIES ----
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        const queryString = params.toString();
        const url = queryString
          ? `/api/properties?${queryString}`
          : "/api/properties";

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
          setProperties(result.data);
        } else {
          toast.error("Failed to load properties");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Error loading properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  // ---- TOGGLE FAVORITE WITH AUTH CHECK ----
  const toggleFavorite = async (propertyId) => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add favorites");
      // Redirect to login page with return URL
      router.push(`/login?redirect=/properties`);
      return;
    }

    // Prevent multiple clicks
    if (loadingFavorites) return;

    setLoadingFavorites(true);
    const isFavorite = favorites.includes(propertyId);

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            propertyId: propertyId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFavorites((prev) => prev.filter((id) => id !== propertyId));
          toast.success("Removed from favorites");
        } else {
          toast.error(data.message || "Failed to remove favorite");
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            propertyId: propertyId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFavorites((prev) => [...prev, propertyId]);
          toast.success("Added to favorites");
        } else {
          toast.error(data.message || "Failed to add favorite");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong");
    } finally {
      setLoadingFavorites(false);
    }
  };

  // ---- RANGE VALUES ----
  const rangeValues = useMemo(() => {
    if (!properties.length) {
      return {
        minPrice: 0,
        maxPrice: 0,
        minArea: 0,
        maxArea: 0,
      };
    }

    const priceValues = properties.map((p) => Number(p.price) || 0);
    const areaValues = properties.map((p) => Number(p.area) || 0);

    return {
      minPrice: Math.min(...priceValues),
      maxPrice: Math.max(...priceValues),
      minArea: Math.min(...areaValues),
      maxArea: Math.max(...areaValues),
    };
  }, [properties]);

  // ---- APPLY FILTERS ----
  const filteredProperties = useMemo(() => {
    if (!properties.length) return [];

    return properties.filter((property) => {
      const status = (property.status || "").toLowerCase();
      const price = Number(property.price) || 0;
      const beds = Number(property.beds) || 0;
      const baths = Number(property.baths) || 0;
      const area = Number(property.area) || 0;
      const title = (property.title || "").toLowerCase();
      const address = (property.address || "").toLowerCase();
      const city = (property.city || "").toLowerCase();
      const type = (property.propertyType || property.type || "").toLowerCase();

      if (filters.dealType === "buy" && !status.includes("sale")) return false;
      if (filters.dealType === "rent" && !status.includes("rent")) return false;

      if (
        filters.propertyType !== "all" &&
        type &&
        !type.includes(filters.propertyType)
      )
        return false;

      if (filters.minPrice && price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && price > Number(filters.maxPrice)) return false;

      if (filters.minBeds && beds < Number(filters.minBeds)) return false;
      if (filters.minBaths && baths < Number(filters.minBaths)) return false;

      if (filters.minArea && area < Number(filters.minArea)) return false;
      if (filters.maxArea && area > Number(filters.maxArea)) return false;

      if (filters.keyword) {
        const k = filters.keyword.toLowerCase();
        if (!title.includes(k) && !address.includes(k)) return false;
      }

      if (filters.location) {
        const loc = filters.location.toLowerCase();
        if (!address.includes(loc) && !city.includes(loc)) return false;
      }

      const amenities = [
        ...(property.amenities || []),
        ...(property.features || []),
      ].map((a) => String(a).toLowerCase());

      if (filters.hasParking && !amenities.some((a) => a.includes("parking")))
        return false;
      if (filters.isFurnished && !amenities.some((a) => a.includes("furnish")))
        return false;
      if (filters.petFriendly && !amenities.some((a) => a.includes("pet")))
        return false;

      return true;
    });
  }, [properties, filters]);

  // ---- SORT ----
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    if (sortBy === "priceLowHigh") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow") list.sort((a, b) => b.price - a.price);
    return list;
  }, [sortBy, filteredProperties]);

  const formatPrice = (amount) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  return (
    <section className="w-full bg-[#f5f7fb] py-20">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-0">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
            Property Listing
          </h2>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition ${
                  viewMode === "grid"
                    ? "bg-[#f05454] text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition ${
                  viewMode === "list"
                    ? "bg-[#f05454] text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-full border border-slate-200 bg-white pl-4 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-[#f05454] focus:ring-2 focus:ring-[#f05454]/10 appearance-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex gap-5 justify-center">
          {/* LEFT: FILTER SIDEBAR */}
          <div className="lg:w-[25%] w-full">
            <aside className="h-max rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:sticky lg:top-20">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f05454]/10 text-[#f05454]">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Filters
                    </p>
                    <p className="text-xs text-slate-500">
                      Refine your property search.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-5 text-sm">
                {/* Deal Type */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Deal Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "All", value: "all" },
                      { label: "Buy", value: "buy" },
                      { label: "Rent", value: "rent" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            dealType: item.value,
                          }))
                        }
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          filters.dealType === item.value
                            ? "bg-[#f05454] text-white shadow-sm"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keyword + Location */}
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Keyword
                    </p>
                    <input
                      type="text"
                      value={filters.keyword}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          keyword: e.target.value,
                        }))
                      }
                      placeholder="Title or address"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#f05454] focus:bg-white focus:ring-1 focus:ring-[#f05454]/20 text-black"
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Location
                    </p>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#f05454] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#f05454]/20">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={filters.location}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="City, area, neighborhood"
                        className="w-full bg-transparent text-xs outline-none text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Property Type
                  </p>
                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        propertyType: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-[#f05454] focus:bg-white focus:ring-1 focus:ring-[#f05454]/20 text-black"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>

                {/* Beds & Baths */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Bedrooms
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["", "1", "2", "3", "4"].map((n) => (
                        <button
                          key={n || "any"}
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, minBeds: n }))
                          }
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                            filters.minBeds === n
                              ? "bg-slate-900 text-white"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <BedDouble className="h-3 w-3" />
                          <span>{n ? `${n}+` : "Any"}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Bathrooms
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["", "1", "2", "3"].map((n) => (
                        <button
                          key={n || "any"}
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, minBaths: n }))
                          }
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                            filters.minBaths === n
                              ? "bg-slate-900 text-white"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Bath className="h-3 w-3" />
                          <span>{n ? `${n}+` : "Any"}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Area sliders */}
                <PriceAreaFilter
                  filters={filters}
                  setFilters={setFilters}
                  minPrice={rangeValues.minPrice}
                  maxPrice={rangeValues.maxPrice}
                  minArea={rangeValues.minArea}
                  maxArea={rangeValues.maxArea}
                />

                {/* Amenities */}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Amenities
                  </p>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.hasParking}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            hasParking: e.target.checked,
                          }))
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-[#f05454] focus:ring-[#f05454]/30"
                      />
                      <span className="text-slate-600">Parking</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.isFurnished}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            isFurnished: e.target.checked,
                          }))
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-[#f05454] focus:ring-[#f05454]/30"
                      />
                      <span className="text-slate-600">Furnished</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.petFriendly}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            petFriendly: e.target.checked,
                          }))
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-[#f05454] focus:ring-[#f05454]/30"
                      />
                      <span className="text-slate-600">Pet friendly</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* RIGHT: CARDS */}
          <div className="lg:w-[75%] w-full">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-lg text-slate-600">
                  Loading properties...
                </div>
              </div>
            )}

            {!loading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-3"
                    : "flex flex-col gap-6"
                }
              >
                {sortedProperties.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-slate-600">
                    No properties found
                  </div>
                ) : (
                  sortedProperties.map((property) => {
                    const isFav = favorites.includes(property._id);

                    return (
                      <article
                        key={property._id}
                        className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] ${
                          viewMode === "list"
                            ? "flex flex-col md:flex-row"
                            : "flex flex-col"
                        }`}
                      >
                        {/* Image */}
                        <div
                          className={`relative w-full overflow-hidden ${
                            viewMode === "list" ? "md:w-[48%]" : ""
                          }`}
                        >
                          <div className="relative h-56 w-full overflow-hidden">
                            <Image
                              src={
                                property.mainImage ||
                                property.images?.[0] ||
                                "/images/pr.png"
                              }
                              alt={property.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Status badge */}
                          <div className="pointer-events-none absolute left-5 top-6">
                            <div className="relative">
                              <div className="h-9 w-24 rounded-full bg-[#f05454] text-center text-xs font-semibold leading-9 text-white shadow-md">
                                {property.status}
                              </div>
                              <div className="absolute -bottom-2 left-6 h-2 w-6 rotate-45 bg-[#f05454]" />
                            </div>
                          </div>

                          {/* Favorite button with auth check */}
                          <button
                            type="button"
                            onClick={() => toggleFavorite(property._id)}
                            disabled={loadingFavorites}
                            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white/90 text-slate-500 shadow-md backdrop-blur transition hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={user ? (isFav ? "Remove from favorites" : "Add to favorites") : "Login to add favorites"}
                          >
                            <Heart
                              className={`h-4 w-4 transition ${
                                isFav ? "fill-rose-500 text-rose-500" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Content */}
                        <div
                          className={`flex flex-1 flex-col border-t border-slate-100 bg-white px-6 pb-5 pt-4 ${
                            viewMode === "list"
                              ? "md:border-t-0 md:border-l"
                              : ""
                          }`}
                        >
                          {/* Title + address */}
                          <div className="mb-3">
                            <h3 className="mb-1 line-clamp-1 text-[18px] font-semibold text-slate-900">
                              <Link
                                href={`/properties/${property._id}`}
                                className="hover:text-[#f05454] transition-colors"
                              >
                                {property.title}
                              </Link>
                            </h3>
                            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                              <MapPin className="h-3 w-3 text-[#f05454]" />
                              <span className="line-clamp-1">
                                {property.address}
                              </span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-4 flex flex-wrap items-center gap-4 border-y border-slate-100 py-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <BedDouble className="h-4 w-4 text-slate-400" />
                              <span className="font-medium text-slate-700">
                                Bed {property.beds}
                              </span>
                            </div>
                            <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4 text-slate-400" />
                              <span className="font-medium text-slate-700">
                                Bath {property.baths}
                              </span>
                            </div>
                            <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                            <div className="flex items-center gap-1">
                              <Maximize2 className="h-4 w-4 text-slate-400" />
                              <span className="font-medium text-slate-700">
                                {property.area} sqft
                              </span>
                            </div>
                          </div>

                          {/* Price + CTA */}
                          <div className="mt-auto flex items-center justify-between gap-4 pt-1">
                            <p className="text-lg font-semibold tracking-tight text-slate-900">
                              {formatPrice(property.price)}
                            </p>
                            <Link
                              href={`/properties/${property._id}`}
                              className="inline-flex h-10 items-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                            >
                              View More
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}