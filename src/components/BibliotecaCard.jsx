export default function BibliotecaCard({ libro }) {
  return (
    <a
      href={libro.pdf_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 rounded-xl bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md border border-accent/40 hover:border-accent p-3"
    >
      {/* Portada pequeña — estilo libro */}
      <div className="w-14 flex-shrink-0">
        {libro.portada_url ? (
          <img
            src={libro.portada_url}
            alt={libro.titulo}
            className="h-20 w-full rounded object-cover shadow"
          />
        ) : (
          // Placeholder si no hay portada
          <div className="flex h-20 w-full items-center justify-center rounded bg-accent/10 text-2xl">
            📖
          </div>
        )}
      </div>
      {/* Info */}
      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <h3 className="font-serif text-sm leading-snug line-clamp-2 text-primary transition-colors group-hover:text-primary-light">
            {libro.titulo}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{libro.autor}</p>
        </div>
        {libro.categoria && (
          <span className="mt-1 w-fit rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
            {libro.categoria}
          </span>
        )}
      </div>
    </a>
  )
}
