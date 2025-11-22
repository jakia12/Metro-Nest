"use client";

import {
  Bath,
  BedDouble,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const floorTabs = ["First Floor", "Second Floor", "Third Floor", "Top Garden"];

// Contact Form Component
function ContactForm({ propertyId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId: propertyId,
          source: "Website Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Thank you! We'll contact you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error sending message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      <div className="space-y-1">
        <label
          htmlFor="contact-name"
          className="text-[14px] font-medium text-slate-700 mb-[10px] block"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          placeholder="Enter your name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[#444] placeholder:text-[#444] outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="contact-email"
          className="text-[14px] font-medium text-slate-700 mb-[10px] block"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="Enter your email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[#444] placeholder:text-[#444] outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="contact-phone"
          className="text-[14px] font-medium text-slate-700 mb-[10px] block"
        >
          Phone
        </label>
        <input
          id="contact-phone"
          type="text"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[#444] placeholder:text-[#444] outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="contact-message"
          className="text-[14px] font-medium text-slate-700 mb-[10px] block"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="Write your message"
          required
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-[#444] placeholder:text-[#444] outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f05454] px-4 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#e14343] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Mail className="h-3.5 w-3.5" />
        {submitting ? "Sending..." : "Send Us"}
      </button>
    </form>
  );
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params?.id;

  const [property, setProperty] = useState(null);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [activeFloor, setActiveFloor] = useState(floorTabs[0]);

  // Fetch property details
  useEffect(() => {
    if (!propertyId) {
      setError("No property ID provided");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching property with ID:", propertyId);

        const response = await fetch(`/api/properties/${propertyId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Property API Response:", result);

        if (result.success && result.data) {
          setProperty(result.data);
        } else {
          setError(result.error || "Property not found");
          toast.error(result.error || "Property not found");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Failed to load property");
        toast.error("Error loading property");
      } finally {
        setLoading(false);
      }
    };

    // Fetch featured listings for sidebar
    const fetchFeaturedListings = async () => {
      try {
        const response = await fetch("/api/properties?featured=true&limit=3");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setFeaturedListings(result.data);
        }
      } catch (error) {
        console.error("Error fetching featured listings:", error);
      }
    };

    fetchProperty();
    fetchFeaturedListings();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f05454] border-t-transparent"></div>
          <p className="text-sm text-slate-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            {error || "Property not found"}
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            The property youre looking for doesnt exist or has been removed.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-full bg-[#f05454] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#d94444]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.mainImage
      ? [property.mainImage]
      : ["/images/pr.png"];

  // Build highlights from property data
  const highlights = property.highlights
    ? [
        {
          label: "ID NO.",
          value: property.highlights.idNo || property._id?.slice(-6) || "N/A",
        },
        {
          label: "Type",
          value: property.propertyType || property.type || "Residential",
        },
        {
          label: "Room",
          value: String(property.highlights.room || property.beds || 0),
        },
        {
          label: "Bedroom",
          value: String(property.highlights.bedroom || property.beds || 0),
        },
        {
          label: "Bath",
          value: String(property.highlights.bath || property.baths || 0),
        },
        {
          label: "Big Yard",
          value: property.highlights.bigYard ? "Yes" : "No",
        },
        { label: "Parking", value: property.highlights.parking || "Available" },
        { label: "Jacuzzi", value: property.highlights.jacuzzi ? "Yes" : "No" },
        { label: "Pool", value: property.highlights.pool ? "Yes" : "No" },
        { label: "Heating", value: property.highlights.heating || "Central" },
      ]
    : [
        { label: "ID NO.", value: property._id?.slice(-6) || "N/A" },
        {
          label: "Type",
          value: property.propertyType || property.type || "Residential",
        },
        { label: "Bedroom", value: String(property.beds || 0) },
        { label: "Bath", value: String(property.baths || 0) },
        { label: "Area", value: `${property.area || 0} sqft` },
      ];

  const amenities =
    property.amenities && property.amenities.length > 0
      ? property.amenities
      : property.features || [];

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = (amount) => {
    const num = Number(amount) || 0;
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="w-full bg-[#f5f7fb] py-10 md:py-16">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8 px-4 lg:flex-row lg:px-0">
        {/* MAIN COLUMN */}
        <div className="w-full lg:w-[68%]">
          {/* Image gallery */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            {/* main image */}
            <div className="relative h-[260px] w-full overflow-hidden rounded-t-3xl sm:h-[340px] md:h-[420px]">
              <Image
                src={images[activeImage]}
                alt={property.title || "Property"}
                fill
                className="object-cover"
              />

              {/* Prev / Next buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:bg-[#f05454] hover:text-white transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-700 shadow-md hover:bg-[#f05454] hover:text-white transition"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* thumbs row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
                <button
                  onClick={handlePrevImage}
                  className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-[#f05454] hover:text-white sm:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex flex-1 gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-16 min-w-[84px] flex-1 overflow-hidden rounded-xl border text-left transition ${
                        idx === activeImage
                          ? "border-[#f05454]"
                          : "border-slate-100 hover:border-[#f05454]/50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextImage}
                  className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-[#f05454] hover:text-white sm:flex"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              {property.status && (
                <span className="inline-flex items-center rounded-full bg-[#f05454]/10 px-3 py-1 text-xs font-semibold text-[#f05454]">
                  {property.status}
                </span>
              )}

              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-[#f05454]" />
                <span>{formatDate(property.createdAt || property.date)}</span>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <MessageCircle className="h-3.5 w-3.5 text-[#f05454]" />
                <span>
                  {property.commentsCount === 0 || !property.commentsCount
                    ? "No Comments"
                    : `${property.commentsCount} Comments`}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-rose-50 hover:text-rose-500 transition"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          {/* About + price */}
          <div className="mt-6 flex flex-col border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {property.title || "Property Details"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-[#f05454]" />
                <span className="font-medium">
                  {property.address || "Address not available"}
                </span>

                <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                  Bed {property.beds || 0}
                </span>
                <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5 text-slate-400" />
                  Bath {property.baths || 0}
                </span>
                <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />
                <span className="flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
                  {property.area || 0} sqft
                </span>
              </div>
            </div>

            <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900 sm:mt-0 sm:text-2xl">
              {formatPrice(property.price)}
            </p>
          </div>

          {/* Description */}
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
            <p>
              {property.description ||
                "This meticulously remodeled property is a true gem. Featuring modern amenities and thoughtful design throughout, it combines style with functionality."}
            </p>
            {property.longDescription && <p>{property.longDescription}</p>}
          </div>

          {/* Property Highlights */}
          <div className="mt-8 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Property Highlights
              </h2>
              {property.status && (
                <span className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {property.status}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 lg:grid-cols-5">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
                >
                  <span className="text-[14px] font-medium text-slate-500">
                    {item.label}
                  </span>
                  <span className="mt-1 text-sm font-semibold text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amazing Gallery */}
          {images.length > 1 && (
            <div className="mt-8">
              <h2 className="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
                From Amazing Gallery
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.slice(0, 6).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-32 overflow-hidden rounded-2xl cursor-pointer hover:opacity-90 transition sm:h-40"
                    onClick={() => setActiveImage(idx)}
                  >
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features & amenities */}
          {amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-semibold text-slate-900 sm:text-lg">
                Features & amenities
              </h2>
              <div className="grid grid-cols-2 gap-y-2 text-xs sm:grid-cols-3 lg:grid-cols-4">
                {amenities.map((a, idx) => (
                  <label
                    key={idx}
                    className="inline-flex items-center gap-2 text-slate-600"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      readOnly
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#f05454] focus:ring-[#f05454]"
                    />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Floor Plan */}
          <div className="mt-8 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
              Floor Plan
            </h2>

            <div className="mb-5 flex flex-wrap gap-2 text-xs">
              {floorTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFloor(tab)}
                  className={`rounded-full border px-4 py-1.5 font-medium transition ${
                    activeFloor === tab
                      ? "border-[#f05454] bg-[#f05454]/10 text-[#f05454]"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#f05454]/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-slate-100 sm:w-1/2">
                <Image
                  src={property.floorPlan || "/images/floor/floor.jpg"}
                  alt="Floor Plan"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="sm:w-1/2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {activeFloor}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {property.floorDescription ||
                    "Detailed floor plan showing the layout and dimensions of this level. Features modern design with optimal space utilization and natural lighting throughout."}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mt-8">
            <h2 className="mb-3 text-base font-semibold text-slate-900 sm:text-lg">
              Location
            </h2>
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <iframe
                title="Property Location"
                src={
                  property.mapUrl ||
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.9754576191327!2d-73.9851304845937!3d40.75889697932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzMyLjAiTiA3M8KwNTknMDcuMCJX!5e0!3m2!1sen!2sus!4v1615169172743!5m2!1sen!2sus"
                }
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* SIDEBAR COLUMN */}
        <aside className="w-full space-y-6 lg:w-[32%]">
          {/* Search card */}
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Search
            </h3>
            <form className="flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-3">
              <input
                type="text"
                placeholder="Enter Keyword"
                className="flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f05454] text-white shadow-sm hover:bg-[#e14343]"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* Featured listings sidebar */}
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Featured Listings
            </h3>
            <div className="space-y-4">
              {featuredListings.length === 0 ? (
                <p className="text-xs text-slate-500">No featured listings</p>
              ) : (
                featuredListings
                  .filter((item) => item._id !== property._id)
                  .slice(0, 3)
                  .map((item) => (
                    <Link
                      href={`/properties/${item._id}`}
                      key={item._id}
                      className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-2.5 text-xs hover:border-[#f05454]/60 transition"
                    >
                      <div className="relative h-16 w-20 overflow-hidden rounded-xl flex-shrink-0">
                        <Image
                          src={
                            item.mainImage ||
                            item.images?.[0] ||
                            "/images/pr.png"
                          }
                          alt={item.title || "Property"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <p className="line-clamp-2 font-semibold text-[14px] text-slate-900">
                          {item.title}
                        </p>
                        <div className="mt-1 flex items-center flex-wrap gap-2 text-[10px] text-slate-500">
                          <span>Bed {item.beds || 0}</span>
                          <span className="h-3 w-px bg-slate-200" />
                          <span>Bath {item.baths || 0}</span>
                          <span className="h-3 w-px bg-slate-200" />
                          <span>{item.area || 0} sqft</span>
                        </div>
                        <p className="mt-1 text-[14px] font-semibold text-[#f05454]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </Link>
                  ))
              )}
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Contact Us
            </h3>
            <ContactForm propertyId={property._id} />
          </div>

          {/* CTA card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md">
            <div className="relative h-90 w-full">
              <Image
                src="/images/pr4.png"
                alt="We can help you"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2845]/90 via-[#0b2845]/70 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                Real Estate Support
              </p>
              <h3 className="mt-1 text-sm font-semibold leading-snug">
                We can help you to find real estate agency
              </h3>
              <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#f05454]">
                <Phone className="h-3.5 w-3.5" />
                Contact With Agent
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
