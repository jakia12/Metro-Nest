"use client";

import "swiper/css";
import "swiper/css/pagination";

import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/testimonials?featured=true");
        const result = await response.json();

        if (result.success) {
          setTestimonials(result.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        {/* Top label */}
        <div className="mb-3 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f05454]">
          <span className="h-px w-6 bg-[#f05454]" />
          <span>Testimonials</span>
          <span className="h-px w-6 bg-[#f05454]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-[32px]">
          What Clients Say About Pillar
        </h2>

        {/* Swiper */}
        {loading ? (
          <div className="mt-10 py-20 text-slate-600">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="mt-10 py-20 text-slate-600">
            No testimonials available
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop={testimonials.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="mt-10 w-full !pb-10"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item._id} className="flex justify-center">
                <div className="flex max-w-4xl flex-col items-center text-center">
                  {/* Quote icon */}
                  <Quote className="mb-6 h-10 w-10 text-rose-300" />

                  {/* Text */}
                  <p className="text-sm font-medium leading-relaxed text-slate-900 sm:text-base md:text-[15px]">
                    "{item.comment}"
                  </p>

                  {/* Stars */}
                  <div className="mt-6 flex items-center gap-1">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Avatar + name */}
                  <div className="mt-5 flex flex-col items-center">
                    <div className="relative mb-3 h-16 w-16 rounded-full border-[3px] border-[#f05454] bg-white p-1 shadow-md">
                      <Image
                        src={item.image || "/images/about/ava1.avif"}
                        alt={item.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.role || item.company || "Client"}
                    </p>
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
