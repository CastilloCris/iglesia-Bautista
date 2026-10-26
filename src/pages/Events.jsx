// C1 — Página de Eventos / Calendario
// Tabla Supabase: eventos
// Columnas: id, titulo, descripcion, fecha, hora_inicio, hora_fin,
//           lugar, imagen_url, categoria, destacado, activo, created_at

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PageHero from '../components/PageHero.jsx'
import { useScrollAnimation, ANIM } from '../hooks/useScrollAnimation.js'

const TABLA = 'eventos'

const CATEGORIAS = [
  { value: '',         label: 'Todos' },
  { value: 'culto',    label: 'Cultos' },
  { value: 'jovenes',  label: 'Jóvenes' },
  { value: 'celulas',  label: 'Células' },
  { value: 'especial', label: 'Especiales' },
  { value: 'retiro',   label: 'Retiros' },
]

// Formatea "2025-12-25" → "25 de diciembre de 2025"
function formatFecha(fechaStr) {
  if (!fechaStr) return ''
  const [year, month, day] = fechaStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Formatea "19:30:00" → "19:30"
function formatHora(horaStr) {
  if (!horaStr) return ''
  return horaStr.slice(0, 5)
}

// Determina si el evento ya pasó
function esPassado(fechaStr) {
  if (!fechaStr) return false
  const [year, month, day] = fechaStr.split('-').map(Number)
  const fecha = new Date(year, month - 1, day)
  const hoy   = new Date()
  hoy.setHours(0, 0, 0, 0)
  return fecha < hoy
}

// Badge de categoría
const BADGE_COLORS = {
  culto:    'bg-primary/10 text-primary border-primary/20',
  jovenes:  'bg-blue-50 text-blue-700 border-blue-200',
  celulas:  'bg-green-50 text-green-700 border-green-200',
  especial: 'bg-accent/10 text-amber-700 border-accent/30',
  retiro:   'bg-purple-50 text-purple-700 border-purple-200',
}

function EventCard({ evento, index }) {
  const [ref, visible] = useScrollAnimation(0.08)
  const pasado = esPassado(evento.fecha)

  return (
    <article
      ref={ref}
      className={[
        'rounded-xl border bg-white overflow-hidden shadow-sm transition-all duration-300',
        pasado
          ? 'border-gray-200 opacity-60 hover:opacity-80'
          : 'border-accent/30 hover:border-accent hover:shadow-md hover:-translate-y-0.5',
        ANIM.fadeUp(visible),
      ].join(' ')}
      style={{
        transitionDelay: `${(index % 4) * 80}ms`,
        boxShadow: pasado ? 'none' : '0 2px 12px rgba(184,134,11,0.08)',
      }}
    >
      {/* Imagen opcional */}
      {evento.imagen_url && (
        <div className="relative overflow-hidden h-44">
          <img
            src={evento.imagen_url}
            alt={evento.titulo}
            loading="lazy"
            className={['w-full h-full object-cover transition-transform duration-500', !pasado && 'group-hover:scale-105'].join(' ')}
          />
          {pasado && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-muted uppercase tracking-widest">
                Finalizado
              </span>
            </div>
          )}
          {evento.destacado && !pasado && (
            <span className="absolute top-3 left-3 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow">
              ★ Destacado
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Badge categoría */}
        {evento.categoria && (
          <span className={[
            'inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide mb-3',
            BADGE_COLORS[evento.categoria] || 'bg-gray-100 text-gray-600 border-gray-200',
          ].join(' ')}>
            {CATEGORIAS.find((c) => c.value === evento.categoria)?.label || evento.categoria}
          </span>
        )}

        <h3 className={['font-serif text-xl mb-2 leading-snug', pasado ? 'text-muted' : 'text-primary'].join(' ')}>
          {evento.titulo}
        </h3>

        {evento.descripcion && (
          <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">{evento.descripcion}</p>
        )}

        {/* Metadata */}
        <div className="flex flex-col gap-1.5 text-sm border-t border-gray-100 pt-4 mt-auto">
          {evento.fecha && (
            <div className="flex items-center gap-2 text-carbon">
              <span className="text-base">📅</span>
              <span>{formatFecha(evento.fecha)}</span>
            </div>
          )}
          {(evento.hora_inicio || evento.hora_fin) && (
            <div className="flex items-center gap-2 text-carbon">
              <span className="text-base">🕐</span>
              <span>
                {formatHora(evento.hora_inicio)}
                {evento.hora_fin && ` – ${formatHora(evento.hora_fin)}`}
                {' hs'}
              </span>
            </div>
          )}
          {evento.lugar && (
            <div className="flex items-center gap-2 text-carbon">
              <span className="text-base">📍</span>
              <span>{evento.lugar}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Events() {
  const [eventos, setEventos]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [categoria, setCategoria]   = useState('')
  const [mostrarPasados, setMostrarPasados] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')

      let query = supabase
        .from(TABLA)
        .select('*')
        .eq('activo', true)
        .order('fecha', { ascending: true })

      if (categoria) query = query.eq('categoria', categoria)

      const { data, error: err } = await query
      if (err) setError(err.message)
      else setEventos(data ?? [])
      setLoading(false)
    }
    load()
  }, [categoria])

  // Separa próximos de pasados
  const proximos = eventos.filter((e) => !esPassado(e.fecha))
  const pasados  = eventos.filter((e) =>  esPassado(e.fecha))

  const statusCard = 'rounded-xl border border-accent/40 bg-white p-8 text-center text-muted shadow-sm'

  return (
    <>
      <PageHero title="Eventos" subtitle="Actividades y encuentros de la iglesia" />

      <div className="min-h-screen bg-secondary">
        <section className="container-page px-5 py-16">

          {/* Filtro de categorías */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                className={[
                  'rounded-full px-5 py-2 text-sm font-semibold transition-all border',
                  categoria === cat.value
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-muted border-accent/30 hover:border-accent hover:text-primary',
                ].join(' ')}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className={statusCard.replace('text-muted', 'text-red-500')}>
              No se pudieron cargar los eventos: {error}
            </div>
          )}

          {!loading && !error && proximos.length === 0 && pasados.length === 0 && (
            <div className={statusCard}>
              {categoria
                ? 'No hay eventos en esta categoría.'
                : 'No hay eventos publicados por el momento.'}
            </div>
          )}

          {/* Próximos eventos */}
          {!loading && !error && proximos.length > 0 && (
            <>
              <h2 className="mb-6 font-serif text-2xl text-primary">Próximos eventos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                {proximos.map((evento, i) => (
                  <EventCard key={evento.id} evento={evento} index={i} />
                ))}
              </div>
            </>
          )}

          {/* Eventos pasados (colapsable) */}
          {!loading && !error && pasados.length > 0 && (
            <div>
              <button
                onClick={() => setMostrarPasados((v) => !v)}
                className="flex items-center gap-2 text-muted text-sm font-semibold hover:text-primary transition mb-5"
              >
                <span>{mostrarPasados ? '▲' : '▼'}</span>
                {mostrarPasados ? 'Ocultar' : 'Ver'} eventos anteriores ({pasados.length})
              </button>

              {mostrarPasados && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pasados.map((evento, i) => (
                    <EventCard key={evento.id} evento={evento} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}

        </section>
      </div>
    </>
  )
}
