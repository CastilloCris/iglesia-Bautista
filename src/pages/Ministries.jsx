import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import PageHero from '../components/PageHero.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { useScrollAnimation, ANIM } from '../hooks/useScrollAnimation.js'

function MinisterioCard({ ministerio, index }) {
  const [ref, visible] = useScrollAnimation(0.1)
  return (
    <Link key={ministerio.id} to={`/ministerios/${ministerio.id}`}>
      <article
        ref={ref}
        className={`group relative min-h-[260px] overflow-hidden rounded-lg bg-gray-300 shadow-sm transition hover:shadow-lg ${ANIM.fadeUp(visible)}`}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        {ministerio.imagen_url && (
          <img
            src={ministerio.imagen_url}
            alt={ministerio.nombre}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/60 transition group-hover:bg-black/75" />
        <div className="relative z-10 flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
          <h3 className="font-serif text-2xl text-white">{ministerio.nombre}</h3>
          {ministerio.descripcion && <p className="mt-3 text-white/90">{ministerio.descripcion}</p>}
        </div>
      </article>
    </Link>
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {ministerios.map((ministerio, i) => (
                <MinisterioCard key={ministerio.id} ministerio={ministerio} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
