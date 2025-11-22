"use client";

import {
  BriefcaseBusiness,
  Building2,
  MessageCircle,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PropertyValuesSection() {
  const [propertyCount, setPropertyCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch property count
        const propertiesResponse = await fetch("/api/properties");
        const propertiesResult = await propertiesResponse.json();
        if (propertiesResult.success) {
          setPropertyCount(propertiesResult.data.length);
        }

        // Fetch testimonial count
        const testimonialsResponse = await fetch("/api/testimonials");
        const testimonialsResult = await testimonialsResponse.json();
        if (testimonialsResult.success) {
          setTestimonialCount(testimonialsResult.data.length);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      id: 1,
      icon: BriefcaseBusiness,
      value: "28+",
      label: "Years of Business",
    },
    {
      id: 2,
      icon: Building2,
      value: propertyCount > 0 ? `${propertyCount}+` : "58+",
      label: "Properties Sold",
    },
    {
      id: 3,
      icon: Star,
      value: testimonialCount > 0 ? `${testimonialCount * 5}k` : "25k",
      label: "5 Stars Reviews",
    },
    {
      id: 4,
      icon: MessageCircle,
      value: "98%",
      label: "Happy Customers",
    },
  ];
  return (
    <section className="bg-[#f9f5f3] py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center">
        {/* LEFT: Circular image with play button */}
        <div className="flex w-full justify-center lg:w-1/2">
          <div className="relative aspect-square w-full max-w-[460px] overflow-hidden rounded-full shadow-xl">
            <Image
              src="/images/property-circle.jpg" // <--- replace with your image
              alt="Luxury property"
              fill
              className="object-cover"
              priority
            />

            {/* subtle dark overlay */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Play button */}
            <button className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition hover:bg-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/80">
                <div className="ml-1 border-l-[14px] border-t-[9px] border-b-[9px] border-l-white border-t-transparent border-b-transparent" />
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT: Text + stats + agent */}
        <div className="relative w-full lg:w-1/2">
          {/* content + cards */}
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
              — Property Values —
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Market Your Property
              <br />
              with <span className="text-red-500">MetroNest</span>
            </h2>
            <p className="mt-4 text-sm text-slate-600 md:text-base">
              Showcase your listings with high-impact visuals, verified agents,
              and trusted reviews. MetroNest helps you reach more buyers and
              close deals faster.
            </p>

            {/* Stats cards */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white p-5 text-center shadow-sm"
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <Icon className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-500 md:text-sm">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent image on the right (desktop) */}
          <div className="pointer-events-none absolute -right-6 bottom-0 hidden h-[260px] w-[180px] lg:block xl:h-[300px] xl:w-[210px]">
            <Image
              src="/images/agent.png" // <--- transparent agent image
              alt="Real estate agent"
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
