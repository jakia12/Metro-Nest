"use client";

import Image from "next/image";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    titleTop: "Discover Real Estate",
    titleMiddle: "MetroNest",
    titleBottom: "Dream Home",
    image: "/images/slider/sl1.png",
  },
  {
    id: 2,
    titleTop: "Find Your Perfect",
    titleMiddle: "Luxury",
    titleBottom: "City Apartment",
    image: "/images/slider/sl2.avif",
  },
  {
    id: 3,
    titleTop: "Explore Prime",
    titleMiddle: "Family",
    titleBottom: "Neighborhoods",
    image: "/images/slider/sl3.avif",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-black text-white">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="hero-swiper h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background image */}
              <Image
                src={slide.image}
                alt={slide.titleTop}
                fill
                priority
                className="object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

              {/* Content */}
              <div className="relative z-10 flex h-full items-center">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
                  <div className="max-w-2xl space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                      Real Estate
                    </p>
                    <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                      <span className="block">{slide.titleTop}</span>
                      <span className="block">
                        <span className="font-bold text-white">
                          {slide.titleMiddle}{" "}
                        </span>
                        <span className="text-red-500">
                          {slide.titleBottom}
                        </span>
                      </span>
                    </h1>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-wrap items-center gap-6">
                    <button className="rounded-full bg-red-500 px-7 py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition hover:bg-red-600">
                      Explore Property
                    </button>

                    {/* <div className="flex flex-col gap-1 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-base">★</span>
                        <span className="font-semibold">Trustpilot</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-200">
                        <div className="flex -space-x-2">
                          <div className="h-8 w-8 rounded-full border-2 border-black/60 bg-slate-500" />
                          <div className="h-8 w-8 rounded-full border-2 border-black/60 bg-slate-500" />
                          <div className="h-8 w-8 rounded-full border-2 border-black/60 bg-slate-500" />
                        </div>
                        <span className="rounded-full bg-red-500 px-3 py-1 text-[11px] font-semibold">
                          +59k
                        </span>
                        <span className="text-[11px] sm:text-xs">
                          19k+ clients
                        </span>
                      </div>
                    </div> */}
                  </div>

                  {/* <div className="mt-auto flex items-center gap-4 text-xs sm:text-sm">
                    <span className="uppercase tracking-[0.2em] text-slate-300">
                      prev
                    </span>
                    <span className="h-px w-10 bg-white/30" />
                    <span className="font-semibold text-red-500">
                      0{slide.id}
                    </span>
                    <span className="ml-6 h-px w-16 bg-red-500" />
                    <button className="text-red-500 hover:text-red-400">
                      Next
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
