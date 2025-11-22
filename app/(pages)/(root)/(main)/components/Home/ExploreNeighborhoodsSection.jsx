// app/components/ExploreNeighborhoodsSection.tsx
"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const ExploreNeighborhoodsSection = () => {
  const swiperRef = useRef(null);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/neighborhoods?limit=8");
        const result = await response.json();

        if (result.success) {
          setNeighborhoods(result.data);
        } else {
          setNeighborhoods([]);
        }
      } catch (error) {
        console.error("Error fetching neighborhoods:", error);
        setNeighborhoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  return (
    <section className="w-full bg-[#FBF7F5] py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            <span className="h-[1px] w-6 bg-rose-500" />
            <span>Explore Cities</span>
            <span className="h-[1px] w-6 bg-rose-500" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
            Explore The Neighborhoods
          </h2>

          <p className="max-w-xl text-sm text-slate-500 md:text-base">
            Find your dream apartment with our listing of top neighborhoods
            around the world.
          </p>
        </div>

        {/* Slider */}
        <div className="relative mt-10">
          {/* Prev arrow */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-1 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Next arrow */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-1 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
             
            speed={700}
            loop={neighborhoods.length > 4} // only loop when we have enough slides
            spaceBetween={24}
            slidesPerView={1.2} // mobile: show a bit of next card
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              900: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4, // ⬅️ 4 columns on large screens
                spaceBetween: 24,
              },
            }}
          >
            {loading && neighborhoods.length === 0 ? (
              <SwiperSlide>
                <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-600">
                  Loading neighborhoods...
                </div>
              </SwiperSlide>
            ) : neighborhoods.length === 0 ? (
              <SwiperSlide>
                <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-600">
                  No neighborhoods found
                </div>
              </SwiperSlide>
            ) : (
              neighborhoods.map((city, index) => (
                <SwiperSlide key={city.name}>
                  {/* your card stays the same */}
                  <div className="relative min-h-[380px] overflow-hidden rounded-[32px] sm:min-h-[400px] lg:min-h-[420px] flex items-end">
                    <div className="absolute inset-0">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        priority={index === 0}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                    </div>

                    <div className="relative z-10 flex h-full items-end">
                      <div className="p-6 sm:p-7">
                        <p className="text-xs font-medium text-slate-100/90 sm:text-sm">
                          {city.properties}{" "}
                          {city.properties === 1 ? "Property" : "Properties"}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold leading-snug text-white sm:text-xl">
                          {city.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ExploreNeighborhoodsSection;
