"use client";

import { Bath, BedDouble, Heart, MapPin, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PROPERTY_FILTERS = [
  "View All",
  "Apartment",
  "Commercial",
  "Land Or Plot",
  "Farm",
];

export default function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState("View All");
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/properties?limit=8");
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
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredProperties =
    activeFilter === "View All"
      ? properties
      : properties.filter((p) => p.type === activeFilter);

  const formatPrice = (amount) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 lg:px-0">
        {/* Top heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm font-semibold text-red-500">
              <span className="h-px w-6 bg-red-500" />
              <span className="uppercase tracking-[0.3em]">
                Latest Properties
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl lg:text-[34px]">
              Featured Properties
            </h2>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3">
            {PROPERTY_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-800 hover:border-gray-900"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="mt-8 flex items-center justify-center py-20">
            <div className="text-lg text-gray-600">Loading properties...</div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-600">
                No properties found
              </div>
            ) : (
              filteredProperties.map((property) => {
                const isFav = favorites.includes(property._id);
                return (
                  <article
                    key={property._id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image + top badges */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={
                          property.mainImage ||
                          property.images?.[0] ||
                          "/images/pr.png"
                        }
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />

                      {/* For Sale badge */}
                      <div className="absolute left-4 top-4 rounded-md bg-black/80 px-3 py-1 text-xs font-semibold text-white">
                        {property.status}
                      </div>

                      {/* Heart icon */}
                      <button
                        onClick={() => toggleFavorite(property._id)}
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFav
                              ? "fill-red-500 text-red-500"
                              : "text-gray-500"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-1 flex-col">
                      <div className="border-b border-gray-100 px-5 pb-4 pt-5">
                        <h3 className="line-clamp-1 text-[17px] font-semibold text-gray-900">
                          <Link
                            href={`/properties/${property._id}`}
                            className="hover:text-red-500 transition-colors"
                          >
                            {property.title}
                          </Link>
                        </h3>
                        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="line-clamp-1">
                            {property.address}
                          </span>
                        </div>

                        {/* amenities */}
                        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <BedDouble className="h-4 w-4" />
                            <span>Bed {property.beds}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>Bath {property.baths}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span>{property.area} sqft</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer: price + button */}
                      <div className="flex items-center justify-between px-5 py-4">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(property.price)}
                        </p>
                        <Link
                          href={`/properties/${property._id}`}
                          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
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
    </section>
  );
}
