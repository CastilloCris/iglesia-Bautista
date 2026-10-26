import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import PageHero from '../components/PageHero.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { useScrollAnimation, ANIM } from '../hooks/useScrollAnimation.js'

/**
 * MinisterioCard
 * – Desktop (md+): flip 3D al hover. Frente = imagen, Dorso = texto.
 * – Mobile: tap alterna la clase `flipped` que hace el mismo flip.
 *   Un segundo tap (o click fuera) cierra la card.
 */
function MinisterioCard({ ministerio, index }) {
  const [ref, visible] = useScrollAnimation(0.1)
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      ref={ref}
      className={`group h-[300px] cursor-pointer ${ANIM.fadeUp(visible)}`}
      style={{ transitionDelay: `${index * 80}ms`, perspective: '1000px' }}
      /* Mobile: tap para voltear / Desktop: hover vía CSS */
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${ministerio.nombre}`}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
    >
      {/* Contenedor que rota */}
      <div
        className={[
          'relative h-full w-full transition-transform duration-700',
          /* Desktop: hover rota vía group-hover */
          'md:group-hover:[transform:rotateY(180deg)]',
          /* Mobile: clase flipped rota al tap */
          flipped ? '[transform:rotateY(180deg)]' : '',
        ].join(' ')}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── FRENTE ── imagen */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {ministerio.imagen_url ? (
            <img
              src={ministerio.imagen_url}
              alt={ministerio.nombre}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-accent/20">
              <span className="font-serif text-5xl font-bold text-accent">
                {ministerio.nombre?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          {/* Nombre siempre visible en el frente */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-4 pt-10">
            <h3 className="font-serif text-xl font-semibold text-white drop-shadow">
              {ministerio.nombre}
            </h3>
          </div>
          {/* Indicador sutil de que se puede voltear */}
          <div className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 backdrop-blur-sm md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>

        {/* ── DORSO ── texto + botón */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl px-6 py-8 text-center shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #7C3D12 0%, #5a2d0c 100%)',
          }}
        >
          <h3 className="mb-3 font-serif text-2xl font-bold text-white">
            {ministerio.nombre}
          </h3>
          {ministerio.descripcion && (
            <p className="text-sm leading-relaxed text-white/85">
              {ministerio.descripcion}
            </p>
          )}
          <Link
            to={`/ministerios/${ministerio.id}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-5 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            Ver más
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Ministries() {
  const [ministerios, setMinisterios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMinisterios() {
      const { data, error: requestError } = await supabase
        .from('ministerios')
        .select('*')
        .eq('activo', true)
        .order('orden')

      if (requestError) {
        setError(requestError.message)
      } else {
        setMinisterios(data ?? [])
      }

      setLoading(false)
    }

    loadMinisterios()
  }, [])

  return (
    <>
      <PageHero title="Ministerios" />
      <div className="min-h-screen bg-secondary">
        <section className="container-page px-5 py-16">
          {loading && <SkeletonCard variant="card" count={3} />}

          {!loading && error && (
            <div className="rounded-xl border border-red-300/50 bg-surface p-8 text-center text-red-600 shadow-sm">
              No se pudieron cargar los ministerios: {error}
            </div>
          )}

          {!loading && !error && ministerios.length === 0 && (
            <div className="rounded-xl border border-accent/40 bg-surface p-8 text-center text-muted shadow-sm">
              Todavía no hay ministerios disponibles.
            </div>
          )}

          {!loading && !error && ministerios.length > 0 && (
            <>
              {/* Hint sutil solo en mobile */}
              <p className="mb-6 text-center text-xs text-muted/70 md:hidden">
                Tocá una card para ver más información
              </p>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {ministerios.map((ministerio, i) => (
                  <MinisterioCard key={ministerio.id} ministerio={ministerio} index={i} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}
