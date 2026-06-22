export default function PageHero({ title, subtitle }) {
  return (
    <div className="flex justify-center py-10">
      <div className="bg-primary text-white text-center px-12 py-8 rounded-xl relative overflow-hidden inline-block min-w-[320px] max-w-[90vw] shadow-lg">
        {/* Patrón SVG de fondo */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239e3636' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        <h2 className="font-serif text-3xl md:text-4xl relative z-10 m-0 whitespace-nowrap">
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/80 mt-2 relative z-10 text-base">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
