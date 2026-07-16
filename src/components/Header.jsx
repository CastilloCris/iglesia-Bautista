import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-accent shadow-sm">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img
            src="/logo_iglesia.png"
            alt="Logo"
            className="h-10 w-auto object-contain flex-shrink-0"
          />
          <span className="font-serif text-lg text-primary hidden lg:block whitespace-nowrap">
            Iglesia Bautista Beth-El
          </span>
        </Link>

        <Navbar />

        <Link
          to="/login"
          className="hidden rounded-full border-2 border-accent px-5 py-2 text-xs font-bold uppercase tracking-wide text-accent transition hover:bg-accent hover:text-white lg:inline-flex"
        >
          Admin
        </Link>

        <button
          type="button"
          aria-label="Abrir navegación"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center border-0 bg-transparent text-3xl text-primary lg:hidden"
        >
          {isOpen ? '×' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 top-full w-full px-5 py-5 shadow-xl border-b border-accent/40 lg:hidden"
          style={{
            background: 'rgba(30, 20, 10, 0.75)',
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
