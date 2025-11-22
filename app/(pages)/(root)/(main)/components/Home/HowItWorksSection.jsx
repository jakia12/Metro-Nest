"use client";

import { CalendarCheck2, Handshake, KeyRound, Search } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Browse curated listings",
    description:
      "Filter by location, price, and lifestyle to see homes that actually match your goals—no endless scrolling.",
    Icon: Search,
  },
  {
    id: "02",
    title: "Book a visit in minutes",
    description:
      "Pick a time that works for you. We coordinate directly with the seller or landlord so you don’t have to.",
    Icon: CalendarCheck2,
  },
  {
    id: "03",
    title: "Get expert guidance",
    description:
      "Our team helps you compare options, negotiate, and understand every document before you sign anything.",
    Icon: Handshake,
  },
  {
    id: "04",
    title: "Close & get the keys",
    description:
      "We streamline the final steps—paperwork, payments, and handover—so moving into your new place feels effortless.",
    Icon: KeyRound,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            <span className="h-[1px] w-6 bg-rose-500" />
            <span>How It Works</span>
            <span className="h-[1px] w-6 bg-rose-500" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
            A Simple Journey From Search to Keys
          </h2>

          <p className="max-w-2xl text-sm md:text-base text-slate-500">
            We designed the flow so you always know what&apos;s next. No jargon,
            no pressure—just a clear path to your next home or investment.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12">
          {/* connector line (desktop) */}
          <div className="pointer-events-none hidden lg:block absolute inset-x-12 top-16 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative flex flex-col rounded-3xl border border-slate-100 bg-white/80 p-6 pt-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-300/80 hover:shadow-xl"
              >
                {/* Number bubble */}
                <div className="absolute -top-5 left-6 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-sm font-semibold text-white shadow-md">
                    {step.id}
                  </div>
                </div>

                {/* Icon */}
                <div className="mt-4 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                  <step.Icon className="h-6 w-6" />
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>

                {/* Small label at bottom */}
                <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Step {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">
            Ready to see it in action? Start by exploring properties in your
            favorite neighborhood.
          </p>
          <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
