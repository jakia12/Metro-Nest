const { default: Image } = require("next/image");

export function PropertyGallery({ property }) {
  const images = property.images || [];

  if (!images.length) return null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="mb-4 text-sm font-semibold text-slate-900 md:text-base">
        From Amazing Gallery
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-32 w-full overflow-hidden rounded-2xl md:h-40"
          >
            <Image
              src={src}
              alt={`${property.title} image ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
