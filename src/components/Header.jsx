import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-t-[5px] border-primary bg-black/75 py-4 shadow-sm backdrop-blur-md">
      <div className="container-page flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img src="/img/cruz.png" alt="Logo Iglesia Bautista Beth-El" className="h-[50px] w-auto drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]" />
          <span className="font-serif text-2xl font-bold text-white">Iglesia Bautista Beth-El</span>
        </Link>

        <Navbar />

        <Link to="/login" className="hidden rounded-full border-2 border-beth-gold px-5 py-2 text-xs font-bold uppercase tracking-wide text-beth-gold transition hover:bg-beth-gold hover:text-black lg:inline-flex" style={{boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'}}>
          Admin
        </Link>

        <button
          type="button"
          aria-label="Abrir navegación"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center border-0 bg-transparent text-3xl text-white lg:hidden"
        >
          {isOpen ? '×' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full w-full bg-black/90 px-5 py-5 shadow-md backdrop-blur lg:hidden">
          <Navbar mobile onNavigate={() => setIsOpen(false)} />
          <Link to="/login" className="mt-4 inline-flex w-full justify-center rounded-full border-2 border-beth-gold px-5 py-3 text-sm font-bold uppercase tracking-wide text-beth-gold transition hover:bg-beth-gold hover:text-black" onClick={() => setIsOpen(false)}>
            Admin
          </Link>
        </div>
      )}
    </header>
  )
}
