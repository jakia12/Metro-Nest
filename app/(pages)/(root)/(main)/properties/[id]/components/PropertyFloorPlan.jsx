const { default: Image } = require("next/image");

export function PropertyFloorPlan({ property }) {
  const floor = property.floorplan || {};

  if (!floor.image && !floor.description) return null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 md:text-base">
          Floor Plan
        </h2>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        {floor.image && (
          <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 md:h-60 md:w-1/2">
            <Image
              src={floor.image}
              alt="Floor plan"
              fill
              className="object-contain p-4"
            />
          </div>
        )}
        {floor.description && (
          <div className="md:w-1/2">
            <p className="text-sm leading-relaxed text-slate-600">
              {floor.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
