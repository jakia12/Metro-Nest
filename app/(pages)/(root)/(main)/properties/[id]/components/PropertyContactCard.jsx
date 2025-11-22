export function PropertyContactCard({ property }) {
  return (
    <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h3 className="text-sm font-semibold text-slate-900 md:text-base">
        Contact Us About This Property
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Leave your details and our team will get back to you shortly.
      </p>

      <form className="mt-4 space-y-3 text-xs">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
        <input
          type="tel"
          placeholder="Your Phone"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
        <textarea
          rows={4}
          placeholder={`Hi, I'm interested in ${property.title}`}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-[#f05454] focus:ring-1 focus:ring-[#f05454]/20"
        />
        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-[#f05454] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e04343]"
        >
          Send Message
        </button>
      </form>
    </aside>
  );
}
