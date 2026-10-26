import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Header() {
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b-2 border-accent bg-white/95 backdrop-blur-md transition-all duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
      ].join(' ')}
    >
      <div
        className={[
          'mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 transition-all duration-300',
          scrolled ? 'py-1.5' : 'py-3',
        ].join(' ')}
      >
        {/* Logo + nombre */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img
            src="/logo_iglesia.png"
            alt="Logo Iglesia Bautista Beth-El"
            className={[
              'w-auto object-contain flex-shrink-0 transition-all duration-300',
              scrolled ? 'h-8' : 'h-10',
            ].join(' ')}
          />
          <span
            className={[
              'font-serif text-primary hidden lg:block whitespace-nowrap transition-all duration-300',
              scrolled ? 'text-base' : 'text-lg',
            ].join(' ')}
          >
            Iglesia Bautista Beth-El
          </span>
        </Link>

        {/* Navbar desktop */}
        <Navbar scrolled={scrolled} />

        {/* Botón Admin desktop */}
        <Link
          to="/login"
          className="hidden rounded-full border-2 border-accent px-5 py-2 text-xs font-bold uppercase tracking-wide text-accent transition hover:bg-accent hover:text-white lg:inline-flex"
        >
          Admin
        </Link>

        {/* Hamburguesa mobile */}
        <button
          type="button"
          aria-label={isOpen ? 'Cerrar navegación' : 'Abrir navegación'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center border-0 bg-transparent text-3xl text-primary lg:hidden"
        >
          {isOpen ? '×' : '☰'}
        </button>
      </div>

      {/* Menú mobile */}
      {isOpen && (
        <div
          className="absolute left-0 top-full w-full border-b border-accent/40 px-5 py-5 shadow-xl lg:hidden"
          style={{
            background: 'rgba(30, 20, 10, 0.80)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <Navbar mobile onNavigate={() => setIsOpen(false)} />
          <Link
            to="/login"
            className="mt-4 inline-flex w-full justify-center rounded-full border-2 border-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-accent transition hover:bg-accent hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  )
}
