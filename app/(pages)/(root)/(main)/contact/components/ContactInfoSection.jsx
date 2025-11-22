// app/components/ContactInfoSection.jsx
import { Mail, MapPin, PhoneCall } from "lucide-react";

export default function ContactInfoSection() {
  const cards = [
    {
      id: 1,
      title: "Mosque Address",
      icon: <MapPin className="h-5 w-5 text-[#ff4b4b]" />,
      lines: ["123 Academic Way City, State, 1234,", "New York City."],
    },
    {
      id: 2,
      title: "Phone Number",
      icon: <PhoneCall className="h-5 w-5 text-[#ff4b4b]" />,
      lines: ["+011 (123) 234 567 890", "+09 (456) 876 543 210"],
    },
    {
      id: 3,
      title: "Email Address",
      icon: <Mail className="h-5 w-5 text-[#ff4b4b]" />,
      lines: ["info@examplemail.edu", "admission@examplemail.edu"],
    },
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group relative flex h-full flex-col justify-center rounded-3xl bg-[#F6F2F1] px-8 py-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
            >
              {/* subtle bottom highlight on hover */}
              <span className="pointer-events-none absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r from-[#ff6b6b] via-[#ff4b4b] to-[#ff8a6b] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-center gap-4">
                {/* Icon circle */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full ">
                    {card.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <div className="mt-2 space-y-0.5 text-sm text-slate-600">
                    {card.lines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* tiny CTA chip on hover */}
              <button
                type="button"
                className="mt-5 inline-flex w-max items-center gap-1 rounded-full bg-white/0 px-3 py-1 text-xs font-medium text-[#ff4b4b] opacity-0 shadow-none transition-all duration-300 group-hover:bg-white group-hover:opacity-100 group-hover:shadow-sm"
              >
                Get Directions
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
