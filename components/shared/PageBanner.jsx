export default function PageBanner({ title }) {
  return (
    <section className="relative w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1920&auto=format')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Title */}
      <h2 className="relative text-white text-3xl md:text-4xl font-semibold tracking-wide">
        {title}
      </h2>
    </section>
  );
}
