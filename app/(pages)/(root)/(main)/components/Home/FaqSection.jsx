"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What is Pillar real estate?",
    answer:
      "Most Islamic centers offer charity programs, counseling, and financial assistance for those in need. Non-Muslims are welcome to visit mosques. They should dress modestly and remove their shoes upon entering. You can attend community events, volunteer at the mosque, join study circles, or participate in outreach programs.",
  },
  {
    id: 2,
    question: "How to work Pillar all services?",
    answer:
      "You can explore our services online, schedule a consultation, and our team will guide you step by step through buying, selling, or managing your property portfolio.",
  },
  {
    id: 3,
    question: "What resources are available for interfaith dialogue?",
    answer:
      "We provide workshops, neighborhood meetups, and curated content designed to build understanding and cooperation between different communities.",
  },
  {
    id: 4,
    question: "What programs are available for developer?",
    answer:
      "Developers can join our partnership program, access exclusive listings, co-investment opportunities, and technical resources for building real estate products.",
  },
  {
    id: 5,
    question: "How can I contribute to the local real estate?",
    answer:
      "You can invest in community projects, support affordable housing initiatives, or list your own properties through our platform to increase local inventory.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-[#FBF7F5] py-16 md:py-24">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:px-8">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              <span className="h-[1px] w-6 bg-rose-500" />
              <span>FAQ</span>
              <span className="h-[1px] w-6 bg-rose-500" />
            </div>

            <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-[40px] md:leading-[1.15]">
              What would you like to
              <br className="hidden sm:block" />
              know about pillar?
            </h2>

            <p className="mt-4 max-w-md text-sm md:text-[15px] leading-relaxed text-slate-500">
              Ancilla cogo cognomen absorbeo coerceo apto. Ago vulgaris absens
              decor. Valetudo urbs sollers. Ter tricesimus currus aro vilis
              suadeo ulterior aveho.
            </p>

            <button className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-slate-800">
              Free Consultation
            </button>
          </div>

          {/* Decorative block (optional cityline placeholder) */}
          <div className="mt-10 hidden h-40 w-full rounded-3xl border border-dashed border-slate-200 bg-gradient-to-t from-slate-100/80 to-transparent lg:block" />
        </div>

        {/* RIGHT SIDE – Accordion */}
        <div className="w-full lg:w-7/12">
          <div className="flex flex-col gap-3">
            {faqs.map((item, index) => {
              const isOpen = item.id === openId;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-300 sm:text-base">
                        {index + 1}.
                      </span>
                      <span className="text-sm font-medium text-slate-900 sm:text-base">
                        {item.question}
                      </span>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                      {isOpen ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-2 text-sm leading-relaxed text-slate-600 sm:px-7">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
