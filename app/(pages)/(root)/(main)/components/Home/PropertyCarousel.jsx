"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/autoplay";

import { Bath, Bed, Heart, MapPin, Ruler } from "lucide-react";

export default function PropertyCarousel() {
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
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (amount) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1600px] px-4">
        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-red-500 font-semibold uppercase tracking-[0.2em]">
            — Popular Properties —
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-black">
            Best Properties Sale
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-lg text-gray-600">Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-lg text-gray-600">No properties found</div>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            spaceBetween={25}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {properties.map((property) => (
              <SwiperSlide key={property._id}>
                <div className="rounded-xl bg-white shadow-md overflow-hidden  hover:shadow-xl transition">
                  {/* Image Wrapper */}
                  <div className="relative h-64 w-full">
                    <Image
                      src={
                        property.mainImage ||
                        property.images?.[0] ||
                        "/images/pr.png"
                      }
                      alt={property.title}
                      fill
                      className="object-cover"
                    />

                    {/* For Sale tag */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/70 text-white px-3 py-1 text-xs rounded-md font-semibold">
                        {property.status || "For Sale"}
                      </span>
                    </div>

                    {/* Heart Icon */}
                    <button className="absolute top-3 right-3 bg-white/70 hover:bg-white text-gray-500 p-2 rounded-full shadow-md">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-black">
                      <Link
                        href={`/properties/${property._id}`}
                        className="hover:text-red-500 transition-colors"
                      >
                        {property.title}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span>{property.address}</span>
                    </div>

                    {/* Icons Row */}
                    <div className="flex justify-between py-4 border-y mt-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>Bed {property.beds}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>Bath {property.baths}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        <span>{property.area} sqft</span>
                      </div>
                    </div>

                    {/* Price + Button */}
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xl font-semibold text-black">
                        {formatPrice(property.price)}
                      </p>

                      <Link
                        href={`/properties/${property._id}`}
                        className="border px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition text-black"
                      >
                        View More
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
