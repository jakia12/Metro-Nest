"use client";

import { Building2 } from "lucide-react";
import Image from "next/image";
import CountUp from "react-countup";

const stats = [
  {
    id: 1,
    value: 1950,
    suffix: "+",
    label: "Project Handover",
  },
  {
    id: 2,
    value: 2,
    suffix: "m",
    label: "Monthly Visitors",
  },
  {
    id: 3,
    value: 850,
    suffix: "+",
    label: "Property Ready",
  },
  {
    id: 4,
    value: 98,
    suffix: "%",
    label: "Happy Customers",
  },
];

export default function StatsCounterBanner() {
  return (
    <section className="relative w-full">
      {/* Background image */}
      <div className="relative h-[220px] w-full overflow-hidden md:h-[260px]">
        <Image
          src="/images/cntBg.jpg" // 👉 put your banner image here
          alt="Luxury property background"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-[#020617]/70" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-8 text-center text-white md:flex-row md:text-left">
            {stats.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-1 md:flex-row md:gap-3"
              >
                {/* Icon */}
                <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-md bg-transparent md:mb-0">
                  <Building2 className="h-8 w-8 text-[#f05454]" />
                </div>

                {/* Number + label */}
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-2xl font-semibold md:text-3xl">
                    <CountUp
                      end={item.value}
                      suffix={item.suffix}
                      duration={2}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-200 md:text-sm">
                    {item.label}
                  </p>
                </div>

                {/* Vertical dashed divider (desktop only, not after last item) */}
                {index !== stats.length - 1 && (
                  <div className="hidden h-12 w-px md:block">
                    <div className="h-full border-l border-dashed border-white/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
