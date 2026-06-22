export default function BibliotecaCard({ libro }) {
  return (
    <a
      href={libro.pdf_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 rounded-lg bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md border border-gray-100 p-3"
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
          <div className="flex h-20 w-full items-center justify-center rounded bg-blue-100 text-2xl">
            📖
          </div>
        )}
      </div>
      {/* Info */}
      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <h3 className="font-serif text-sm leading-snug line-clamp-2 text-gray-900 transition-colors group-hover:text-blue-600">
            {libro.titulo}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{libro.autor}</p>
        </div>
        {libro.categoria && (
          <span className="mt-1 w-fit rounded-full bg-gray-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">
            {libro.categoria}
          </span>
        )}
      </div>
    </a>
  )
}
