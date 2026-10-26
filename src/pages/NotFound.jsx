// Página 404 personalizada
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta.js'

export default function NotFound() {
  usePageMeta('Página no encontrada')

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center py-20">
        {/* Número grande */}
        <p
          className="font-serif font-bold leading-none select-none"
          style={{
            fontSize: 'clamp(6rem, 20vw, 10rem)',
            color: 'transparent',
            WebkitTextStroke: '2px #B8860B',
            opacity: 0.35,
          }}
        >
          404
        </p>

        <h1 className="font-serif text-3xl text-primary mt-2">
          Página no encontrada
        </h1>

        <p className="mt-4 text-muted leading-relaxed">
          El enlace que seguiste no existe o fue movido.<br />
          <span className="font-serif italic text-accent">
            "Yo soy el camino, la verdad y la vida." — Juan 14:6
          </span>
        </p>

        {/* Separador */}
        <div className="mx-auto mt-6 h-[2px] w-16 rounded-full bg-accent opacity-50" />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="btn"
          >
            Volver al inicio
          </Link>
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center rounded-full border-2 border-accent px-8 py-3 font-bold uppercase tracking-wide text-accent transition hover:bg-accent hover:text-white"
          >
            Contacto
          </Link>
        </div>
      </div>
    </div>
  )
}
