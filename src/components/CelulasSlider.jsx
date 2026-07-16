import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = Array.from({ length: 21 }, (_, i) => `/img/celulas/${i + 1}.jpeg`)

export default function CelulasSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length)
  }, [])

  // Auto-avance cada 4 segundos
  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative overflow-hidden" style={{ borderTop: '2px solid #B8860B', borderBottom: '2px solid #B8860B' }}>

      {/* ——— Fondo: slider de imágenes ——— */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
        {/* Oscurecimiento leve para mejorar contraste */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ——— Contenido encima ——— */}
      <div className="relative z-10 flex items-center justify-center px-5 py-20 text-center">
        <div
          className="max-w-xs md:max-w-xl rounded-2xl px-3 py-4 md:px-10 md:py-10"
          style={{
            border: '2px solid rgba(212,160,23,0.75)',
            boxShadow: '0 0 28px rgba(212,160,23,0.3), 0 8px 32px rgba(0,0,0,0.3)',
            background: 'rgba(255,253,247,0.15)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <h2
            className="font-serif text-[2.5rem] text-white"
            style={{ textShadow: '0 0 10px rgba(212,160,23,0.8), 0 2px 8px rgba(0,0,0,0.6)' }}
          >
            Células
          </h2>
          <span
            className="mb-6 block text-[1.15rem] font-semibold"
            style={{
              color: '#D4A017',
              textShadow: '0 0 8px rgba(212,160,23,0.6), 0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            Las iglesias en las casas
          </span>
          <p
            className="mb-2 text-white/90 text-base leading-relaxed"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
          >
            Descubre un grupo pequeño cerca de ti donde crecer en fe y comunidad.
          </p>
          <Link to="/celulas" className="btn mt-4 px-5 py-2 text-xs md:mt-6 md:px-10 md:py-4 md:text-sm">
            Ver cuál está más cerca de tu casa
          </Link>
        </div>
      </div>

      {/* ——— Indicadores de punto (abajo centrados) ——— */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-5 bg-[#D4A017]' : 'w-1.5 bg-white/50'
            }`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>

    </section>
  )
}
