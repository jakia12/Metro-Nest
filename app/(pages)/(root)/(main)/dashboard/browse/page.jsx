"use client";

import { Bath, Bed, Heart, MapPin, Maximize, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BrowsePropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
  });

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties");
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/client/favorites");
      const data = await response.json();
      
      if (data.success) {
        setFavorites(data.data.map(fav => fav.property._id || fav.property));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const isFavorite = favorites.includes(propertyId);
      
      const response = await fetch("/api/client/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      const data = await response.json();

      if (data.success) {
        if (isFavorite) {
          setFavorites(favorites.filter(id => id !== propertyId));
          toast.success("Removed from favorites");
        } else {
          setFavorites([...favorites, propertyId]);
          toast.success("Added to favorites");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update favorites");
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || property.status === filters.status;
    const matchesMinPrice = !filters.minPrice || property.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || property.price <= parseInt(filters.maxPrice);
    const matchesBeds = !filters.beds || property.beds >= parseInt(filters.beds);

    return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice && matchesBeds;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Browse Properties</h2>
        <p className="text-sm text-slate-500">Find your dream home</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-black focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-black focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-black focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
          />

          <select
            value={filters.beds}
            onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-black focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
          >
            <option value="">Any Beds</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProperties.length} of {properties.length} properties
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No properties found</p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={property.mainImage || property.images?.[0] || "/images/pr.png"}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/pr.png";
                  }}
                />
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(property._id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(property._id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === "For Sale" ? "bg-green-500 text-white" :
                    property.status === "For Rent" ? "bg-blue-500 text-white" :
                    "bg-gray-500 text-white"
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {property.title}
                </h3>

                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm line-clamp-1">{property.address}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{property.area} sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-bold text-rose-600">
                      ${property.price?.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/properties/${property._id}`}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
