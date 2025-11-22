"use client";

import { Calendar, Clock, Mail, PhoneCall, User } from "lucide-react";
import Image from "next/image";

const ContactHeroSection = () => {
  return (
    <section className="w-full bg-[#F6F2F1] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
        <div className="relative grid overflow-hidden rounded-[40px] bg-slate-900 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* LEFT: Image area */}
          <div className="relative  overflow-hidden w-full">
            <Image
              src="/images/contHero.jpg"
              alt="Modern luxury house"
              fill
              className=" transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* dark gradient for readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

            {/* Callout text */}
            <div className="absolute left-1/2 top-[54%] -translate-x-1/2 transform">
              <div className="rounded-full bg-black/60 px-6 py-2 text-center text-xs font-semibold text-white shadow-lg shadow-black/40">
                Find Fast Our Latest Properties
              </div>
            </div>

            {/* Circular mini map badge */}
            {/* <div className="absolute bottom-10 left-10 hidden h-28 w-28 items-center justify-center rounded-full bg-white/90 shadow-2xl shadow-black/40 sm:flex">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200">
                <Image
                  src="/images/contact-map.jpg"
                  alt="Property locations on map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                    <span className="text-xs">🏠</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* RIGHT: Form card */}
          <div className="relative bg-white px-6 py-8 md:px-10 md:py-10">
            {/* small offset on large screens to match “overlay” feel */}
            <div className="mx-auto max-w-md lg:max-w-none lg:pl-4">
              {/* Eyebrow */}
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
                <span className="h-[1px] w-6 bg-red-500" />
                <span>Get In Touch</span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-[32px] md:leading-tight">
                Let’s Talk Your Property Goal
              </h2>

              {/* Optional subtext */}
              <p className="mt-2 text-sm text-slate-500">
                Tell us a bit about what you’re looking for and we’ll match you
                with the right property and agent.
              </p>

              {/* FORM */}
              <form className="mt-6 space-y-5">
                {/* Name & Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                      <User className="mr-2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                      <Mail className="mr-2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Desired Date<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                      <input
                        type="date"
                        className="h-8 w-full bg-transparent text-sm outline-none [color-scheme:light]"
                      />
                      <Calendar className="ml-2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Desired Time<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                      <input
                        type="time"
                        className="h-8 w-full bg-transparent text-sm outline-none [color-scheme:light]"
                      />
                      <Clock className="ml-2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Additional Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Please write any note here..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 p-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Phone + button row */}
                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-red-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-600 hover:shadow-red-500/40"
                  >
                    Book Free Consultation
                  </button>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <PhoneCall className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-slate-800">
                        Need help now?
                      </span>
                      <span>+00 (123) 456 789 00</span>
                    </div>
                  </div>
                </div>

                <p className="pt-1 text-[11px] text-slate-400">
                  By submitting this form, you agree to be contacted about your
                  inquiry. We respect your privacy and never share your details.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;
