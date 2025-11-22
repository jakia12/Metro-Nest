// app/components/BenefitsSection.tsx
"use client";

import Image from "next/image";

const benefits = [
  {
    id: "01",
    title: "Find your perfect\nnew home",
    description:
      "Velox surgo clarus tantillus confido carus video lumen cedo virtus spes decerno.",
    cta: "Find A Home",
    Icon: "/images/icons/bn1.png",
  },
  {
    id: "02",
    title: "You build wealth\n effortlessly",
    description:
      "Altus cedo tantillus video patrocinor valeo carus subesco vestrum credo virtus.",
    cta: "Sell A Home",
    Icon: "/images/icons/bn2.png",
  },
  {
    id: "03",
    title: "You rent and love it\nlike your own",
    description:
      "Tantillus certe patrocinor video adipisci valeo carus. Subesco vestrum taedium.",
    cta: "Rent A Home",
    Icon: "/images/icons/bn3.png",
  },
];

const BenefitsSection = () => {
  return (
    <section className="w-full bg-[#FBF7F5] py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Top label */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            <span className="h-[1px] w-6 bg-rose-500" />
            <span>What We Do</span>
            <span className="h-[1px] w-6 bg-rose-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
            The Benefits For You
          </h2>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {benefits.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col justify-between rounded-3xl bg-white px-6 py-8 shadow-sm ring-1 ring-slate-100 md:px-10 md:py-10"
            >
              {/* Number */}
              <span className="pointer-events-none absolute right-6 top-6 text-4xl font-semibold text-slate-200 md:text-5xl">
                {item.id}
              </span>

              <div className="">
                {/* Icon circle */}
                <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-rose-50">
                  <div className="mb-[30px]">
                    <Image
                      src={item.Icon}
                      alt={item.title}
                      fill
                      className="object-contain w-[50px]"
                    />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="whitespace-pre-line text-xl font-semibold leading-snug text-slate-900 md:text-2xl mt-[30px]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 md:text-[15px]">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* CTA button */}
              <button className="mt-6 w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:border-rose-400 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 md:mt-8">
                {item.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
