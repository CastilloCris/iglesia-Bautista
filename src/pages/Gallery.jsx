// C2 — Galería de fotos
// Tabla Supabase: galeria_fotos
// Columnas: id, titulo, descripcion, url, categoria, orden, activo, created_at

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PageHero from '../components/PageHero.jsx'
import { useScrollAnimation, ANIM } from '../hooks/useScrollAnimation.js'

const TABLA = 'galeria_fotos'

// Categorías disponibles — sincronizá con los valores que cargues en Supabase
const CATEGORIAS = [
  { value: '',           label: 'Todas' },
  { value: 'culto',      label: 'Cultos' },
  { value: 'jovenes',    label: 'Jóvenes' },
  { value: 'celulas',    label: 'Células' },
  { value: 'actividades',label: 'Actividades' },
  { value: 'historia',   label: 'Historia' },
]

// Lightbox minimalista — navega con teclado ← →, cierra con Esc o clic fuera
function Lightbox({ fotos, index, onClose, onPrev, onNext }) {
  const foto = fotos[index]

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')    onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight')onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none transition"
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 text-white/70 hover:text-white text-4xl leading-none transition select-none"
          aria-label="Anterior"
        >
          ‹
        </button>
      )}

      {/* Imagen */}
      <div
        className="relative max-h-[85vh] max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={foto.url}
          alt={foto.titulo}
          className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
        />
        {(foto.titulo || foto.descripcion) && (
          <div className="mt-3 text-center text-white/80">
            {foto.titulo && <p className="font-serif text-lg text-white">{foto.titulo}</p>}
            {foto.descripcion && <p className="text-sm text-white/60">{foto.descripcion}</p>}
          </div>
        )}
      </div>

      {/* Next */}
      {index < fotos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 text-white/70 hover:text-white text-4xl leading-none transition select-none"
          aria-label="Siguiente"
        >
          ›
        </button>
      )}

      {/* Contador */}
      <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/40">
        {index + 1} / {fotos.length}
      </p>
    </div>
  )
}

function FotoCard({ foto, index, onClick }) {
  const [ref, visible] = useScrollAnimation(0.1)
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={[
        'group relative overflow-hidden rounded-xl bg-gray-200 shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg',
        ANIM.fadeUp(visible),
      ].join(' ')}
      style={{
        transitionDelay: `${(index % 6) * 60}ms`,
        aspectRatio: '4/3',
      }}
      aria-label={foto.titulo || `Foto ${index + 1}`}
    >
      <img
        src={foto.url}
        alt={foto.titulo || ''}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Overlay con título */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {foto.titulo && (
          <p className="font-serif text-sm text-white leading-snug">{foto.titulo}</p>
        )}
        {foto.descripcion && (
          <p className="text-xs text-white/70 mt-0.5 line-clamp-2">{foto.descripcion}</p>
        )}
      </div>
    </button>
  )
}

export default function Gallery() {
  const [fotos, setFotos]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [categoria, setCategoria]   = useState('')
  const [lightboxIdx, setLightboxIdx] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')

      let query = supabase.from(TABLA).select('*').eq('activo', true).order('orden').order('created_at', { ascending: false })
      if (categoria) query = query.eq('categoria', categoria)

      const { data, error: err } = await query
      if (err) setError(err.message)
      else setFotos(data ?? [])
      setLoading(false)
    }
    load()
  }, [categoria])

  return (
    <>
      <PageHero title="Galería" subtitle="Momentos de nuestra comunidad" />

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

          {/* Estados */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }} />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-red-500">No se pudo cargar la galería: {error}</p>
          )}

          {!loading && !error && fotos.length === 0 && (
            <p className="text-center text-muted py-16">
              {categoria ? 'No hay fotos en esta categoría aún.' : 'La galería está vacía por el momento.'}
            </p>
          )}

          {!loading && !error && fotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {fotos.map((foto, i) => (
                <FotoCard
                  key={foto.id}
                  foto={foto}
                  index={i}
                  onClick={() => setLightboxIdx(i)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          fotos={fotos}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => Math.max(0, i - 1))}
          onNext={() => setLightboxIdx((i) => Math.min(fotos.length - 1, i + 1))}
        />
      )}
    </>
  )
}
