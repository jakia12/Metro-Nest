"use client";

import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "First-time Home Buyer",
    image: "/images/testimonials/person1.jpg",
    rating: 5,
    text: "MetroNest made my dream of owning a home come true! The team was incredibly supportive throughout the entire process. I couldn't have asked for a better experience.",
    location: "Brooklyn, NY",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Investor",
    image: "/images/testimonials/person2.jpg",
    rating: 5,
    text: "I've worked with many real estate platforms, but MetroNest stands out. Their market insights and property recommendations have helped me build a profitable portfolio.",
    location: "San Francisco, CA",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Renter",
    image: "/images/testimonials/person3.jpg",
    rating: 5,
    text: "Finding the perfect rental was so easy with MetroNest. The search filters are intuitive, and the customer service team was always available to answer my questions.",
    location: "Austin, TX",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Home Seller",
    image: "/images/testimonials/person4.jpg",
    rating: 5,
    text: "Selling my property through MetroNest was seamless. They handled everything professionally and got me the best price in record time. Highly recommend!",
    location: "Seattle, WA",
  },
];

const TestimonialSection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-[#FBF7F5] py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            <span className="h-[1px] w-6 bg-rose-500" />
            <span>Testimonials</span>
            <span className="h-[1px] w-6 bg-rose-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-2 max-w-2xl text-sm md:text-[15px] leading-relaxed text-slate-500">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience with MetroNest.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:ring-rose-100 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                <Quote className="h-6 w-6 text-white fill-white" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-sm leading-relaxed text-slate-600 mb-6 flex-grow">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-rose-200 ring-2 ring-rose-50">
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-rose-600">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-rose-500 font-medium truncate">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg">
            Share Your Story
          </button>
          <button className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-sm transition hover:border-rose-400 hover:text-rose-500">
            View All Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
