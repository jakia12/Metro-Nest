const { Phone, Mail } = require("lucide-react");

export function PropertyAgentCard() {
  return (
    <aside className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] p-6 text-slate-50 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
        MetroNest Realty
      </p>
      <p className="mt-2 text-sm font-semibold">
        Your trusted real estate agency
      </p>
      <p className="mt-2 text-xs text-slate-300">
        Get expert guidance on tours, negotiation and closing.
      </p>

      <div className="mt-5 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-rose-300" />
          <span>+1 (555) 123-4567</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-rose-300" />
          <span>support@metronest.com</span>
        </div>
      </div>

      <button className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600">
        Contact Our Agent
      </button>
    </aside>
  );
}
