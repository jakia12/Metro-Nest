"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const FILTERS = ["View All", "Apartment", "Commercial", "Land Or Plot", "Farm"];

const GALLERY_ITEMS = [
  {
    id: 1,
    category: "Apartment",
    src: "/images/pr.png",
    alt: "Modern luxury apartment exterior",
    span: "normal",
  },
  {
    id: 2,
    category: "Apartment",
    src: "/images/pr2.png",
    alt: "Luxury living room",
    span: "wide",
  },
  {
    id: 3,
    category: "Commercial",
    src: "/images/pr3.png",
    alt: "Mountain view villa",
    span: "normal",
  },
  {
    id: 4,
    category: "Land Or Plot",
    src: "/images/pr4.png",
    alt: "Large house with pool",
    span: "wide",
  },
  {
    id: 5,
    category: "Apartment",
    src: "/images/pr5.png",
    alt: "Three-story modern home",
    span: "normal",
  },
  {
    id: 6,
    category: "Farm",
    src: "/images/pr6.jpg",
    alt: "Villa with pool at dusk",
    span: "normal",
  },
  {
    id: 7,
    category: "Apartment",
    src: "/images/gallery/gl5.jpg",
    alt: "Concrete and glass villa",
    span: "normal",
  },
  {
    id: 8,
    category: "Commercial",
    src: "/images/sl1.png",
    alt: "Interior with tall windows",
    span: "wide",
  },
  {
    id: 9,
    category: "Land Or Plot",
    src: "/images/sl2.avif",
    alt: "Wide modern home",
    span: "normal",
  },
];

export default function StunningGallerySection() {
  const [activeFilter, setActiveFilter] = useState("View All");

  // lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // index inside filteredItems

  const filteredItems =
    activeFilter === "View All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const showPrev = () => {
    if (!filteredItems.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    if (!filteredItems.length) return;
    setCurrentIndex((prev) =>
      prev === filteredItems.length - 1 ? 0 : prev + 1
    );
  };

  // keyboard controls when lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, filteredItems.length]);

  const activeItem = filteredItems[currentIndex];

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Top label + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
            <span className="h-[1px] w-6 bg-red-500" />
            <span>Gallery</span>
            <span className="h-[1px] w-6 bg-red-500" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
            MetroNest Gallery
          </h2>

          {/* (optional) filters – uncomment if you want them visible */}
          {/* <div className="mt-4 flex flex-wrap justify-center gap-3">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-800 hover:border-black"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div> */}
        </div>

        {/* Grid Layout with Different Aspect Ratios */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                item.span === "wide" ? "sm:col-span-2" : "sm:col-span-1"
              }`}
            >
              {/* Different aspect ratios for normal vs wide */}
              <div
                className={`relative w-full ${
                  item.span === "wide"
                    ? "aspect-[16/10.5]" // Wide images - horizontal ratio
                    : "aspect-[3/4]" // Normal images - portrait ratio
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Subtle dark overlay on hover */}
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

              {/* Category badge on hover */}
              <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.category}
              </div>
            </button>
          ))}
        </div>

        {/* No results message */}
        {filteredItems.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-slate-500">
              No properties found in this category.
            </p>
          </div>
        )}
      </div>

      {/* LIGHTBOX OVERLAY */}
      {isLightboxOpen && activeItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-3 sm:px-6"
          onClick={closeLightbox}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl rounded-2xl bg-black/80 p-3 sm:p-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close button */}
            <button
              className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-slate-100 hover:bg-black"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative mx-auto flex max-h-[70vh] w-full items-center justify-center">
              <div className="relative h-full w-full">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  width={1600}
                  height={900}
                  className="mx-auto max-h-[70vh] w-full rounded-xl object-contain"
                />
              </div>
            </div>

            {/* Caption */}
            <div className="mt-3 flex flex-col items-center gap-1 text-center text-xs sm:text-sm text-slate-100">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-200">
                {activeItem.category}
              </span>
              <p className="max-w-3xl text-slate-200">{activeItem.alt}</p>
            </div>

            {/* Controls */}
            {filteredItems.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-slate-50 hover:bg-black"
                  onClick={showPrev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-slate-50 hover:bg-black"
                  onClick={showNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}