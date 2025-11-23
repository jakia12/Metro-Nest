"use client";

import { Bath, Bed, Heart, MapPin, Maximize, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ClientHomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

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
  // Check if user is logged in
  if (!user) {
    toast.error("Please login to add favorites");
    router.push(`/login?redirect=${window.location.pathname}`);
    return;
  }

  // Prevent multiple rapid clicks
  if (loadingFavorites) return;

  setLoadingFavorites(true);
  const isFavorite = favorites.includes(propertyId);

  // Optimistic update
  if (isFavorite) {
    setFavorites(favorites.filter(id => id !== propertyId));
  } else {
    setFavorites([...favorites, propertyId]);
  }

  try {
    const response = await fetch("/api/client/favorites", {
      method: isFavorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update favorites");
    }

    if (data.success) {
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } else {
      throw new Error(data.message || "Operation failed");
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    
    // Revert optimistic update on error
    if (isFavorite) {
      setFavorites([...favorites, propertyId]);
    } else {
      setFavorites(favorites.filter(id => id !== propertyId));
    }
    
    // Handle specific errors
    if (error.message.includes("Unauthorized") || error.message.includes("login")) {
      toast.error("Please login again");
      router.push("/login");
    } else if (error.message.includes("already in favorites")) {
      toast.error("Already in your favorites");
    } else {
      toast.error(error.message || "Something went wrong");
    }
  } finally {
    setLoadingFavorites(false);
  }
};

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
        <p className="text-gray-600 mt-1">Find your dream home</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
          />
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
