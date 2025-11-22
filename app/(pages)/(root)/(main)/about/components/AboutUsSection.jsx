"use client";

import { Handshake, Home, MapPin, Users } from "lucide-react";
import Image from "next/image";

const AboutUsSection = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-0">
        {/* LEFT: Text content */}
        <div className="flex-1 space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
            <span className="h-[1px] w-4 bg-red-400" />
            <span>About Us</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
            A modern real estate experience built for people, not just
            properties.
          </h2>

          {/* Main paragraph */}
          <p className="text-sm leading-relaxed text-slate-600 md:text-base">
            We help buyers, sellers, and investors make confident decisions with
            data-driven insights, honest guidance, and a seamless digital
            experience. From downtown condos to family homes in the suburbs, our
            team handles every detail so you can focus on what’s next.
          </p>

          {/* Highlights list */}
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-[50px] w-[115px] items-center justify-center rounded-xl bg-slate-900 text-white">
                <Home className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Full-service agency
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  From first showing to closing, we coordinate viewings,
                  negotiations, inspections, and paperwork for you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-[50px] w-[115px] items-center justify-center rounded-xl bg-slate-900 text-white">
                <Users className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Local experts, global reach
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Neighborhood-level knowledge backed by modern marketing that
                  reaches qualified buyers everywhere.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-[50px] w-[115px] items-center justify-center rounded-xl bg-slate-900 text-white">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Data-driven insights
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Real-time market data, pricing models, and neighborhood
                  analytics to guide every decision.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-[50px] w-[115px] items-center justify-center rounded-xl bg-slate-900 text-white">
                <Handshake className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Relationship first
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Transparent communication, zero pressure, and long-term
                  support even after the keys are handed over.
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-semibold text-slate-900">500+</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                Properties sold
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">12+</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                Years in the market
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">4.9/5</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                Client satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Imagery / collage */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md">
            {/* Main image card */}
            <div className="overflow-hidden rounded-[32px] bg-slate-900 shadow-xl shadow-slate-900/10">
              <div className="relative h-[450px] w-full">
                <Image
                  src="/images/abt.jpg"
                  alt="Modern home exterior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
            </div>

            {/* Floating secondary image */}
            <div className="absolute -bottom-8 -left-6 hidden w-40 overflow-hidden rounded-3xl  shadow-lg shadow-slate-900/10 sm:block">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/house.png"
                  alt="Cozy living room interior"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            </div>

            {/* Badge */}
            <div className="absolute -top-5 right-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg shadow-slate-900/10 sm:flex sm:flex-col sm:items-start">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Trusted by clients
              </span>
              <span>Top-rated local agency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
