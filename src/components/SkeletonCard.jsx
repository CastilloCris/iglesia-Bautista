/**
 * SkeletonCard — placeholder animado para reemplazar "Cargando..." mientras se
 * obtienen datos de Supabase.
 *
 * Props:
 *   variant  — 'card' (vertical, para células/ministerios) | 'row' (horizontal, para blog/biblioteca)
 *   count    — cuántos skeletons mostrar (default 3)
 *
 * Uso:
 *   import SkeletonCard from '../components/SkeletonCard.jsx'
 *   {loading && <SkeletonCard variant="card" count={6} />}
 */
export default function SkeletonCard({ variant = 'card', count = 3 }) {
  const items = Array.from({ length: count })

  if (variant === 'row') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex gap-3 bg-white rounded-lg border border-gray-100 p-3 animate-pulse"
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0" />
            {/* Texto */}
            <div className="flex flex-col gap-2 flex-1 justify-center">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // variant === 'card' (vertical — para células, ministerios)
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center gap-4 animate-pulse"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          {/* Avatar circular */}
          <div className="w-[120px] h-[120px] rounded-full bg-gray-200" />
          {/* Título */}
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          {/* Líneas de texto */}
          <div className="w-full flex flex-col gap-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-4/5 mx-auto" />
          </div>
          {/* Botón placeholder */}
          <div className="h-10 bg-gray-200 rounded-full w-1/2 mt-2" />
        </div>
      ))}
    </div>
  )
}
