// src/components/Footer.jsx
// CONFIGURACIÓN: editá las URLs de redes sociales.
// Si no tienen cuenta en alguna red, poné null y el ícono no aparece.

import { Link } from 'react-router-dom'

const REDES = [
  {
    nombre: 'Facebook',
    url: 'https://facebook.com/iglesiabautistabethel', // ← cambiar URL real
    hover: 'hover:bg-[#1877F2]',
    icono: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    nombre: 'Instagram',
    url: 'https://instagram.com/iglesiabautistabethel', // ← cambiar URL real
    hover: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737]',
    icono: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    nombre: 'TikTok',
    url: 'https://tiktok.com/@iglesiabautistabethel', // ← cambiar URL real
    hover: 'hover:bg-[#010101]',
    icono: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.79 1.53V6.75a4.85 4.85 0 0 1-1.02-.06z"/>
      </svg>
    ),
  },
  {
    nombre: 'YouTube',
    url: 'https://youtube.com/@iglesiabautistabethel', // ← cambiar URL real
    hover: 'hover:bg-[#FF0000]',
    icono: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

const NAV_LINKS = [
  { to: '/',             label: 'Inicio' },
  { to: '/quienes-somos', label: 'Quiénes Somos' },
  { to: '/reuniones',    label: 'Reuniones' },
  { to: '/ministerios',  label: 'Ministerios' },
  { to: '/celulas',      label: 'Células' },
  { to: '/blog',         label: 'Blog' },
  { to: '/biblioteca',   label: 'Biblioteca' },
  { to: '/contacto',     label: 'Contacto' },
]

export default function Footer() {
  const redesActivas = REDES.filter((r) => r.url !== null)

  return (
    <footer className="bg-primary text-white/80">

      {/* ——— Cuerpo principal: 3 columnas ——— */}
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

        {/* Columna 1 — Iglesia */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo_iglesia.png"
              alt="Iglesia Bautista Beth-El"
              className="h-12 w-auto object-contain brightness-0 invert opacity-90"
            />
            <span className="font-serif text-lg text-white leading-tight">
              Iglesia Bautista<br />Beth-El
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/65 max-w-xs">
            Buscamos una relación con Dios basada en la oración, la Biblia y la comunidad.
            Te esperamos en Wanda, Misiones.
          </p>
          <span className="font-serif italic text-accent text-sm">
            "A la casa de Jehová iremos." — Sal 122:1
          </span>
        </div>

        {/* Columna 2 — Links */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Páginas
          </h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-white/70 transition hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3 — Contacto */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Contacto
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2 text-white/70">
              <span className="mt-0.5 flex-shrink-0">📍</span>
              <span>Wanda, Misiones, Argentina</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">📱</span>
              <a
                href="https://wa.me/5493757505746"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition hover:text-accent"
              >
                +54 9 3757 505746
              </a>
            </li>
            <li className="flex items-start gap-2 text-white/70">
              <span className="mt-0.5 flex-shrink-0">🕐</span>
              <div>
                <p>Dom – 20:00 hs · Culto Principal</p>
                <p>Sáb – 19:30 hs · Jóvenes</p>
              </div>
            </li>
          </ul>

          {/* Redes sociales */}
          {redesActivas.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                Redes sociales
              </p>
              <div className="flex items-center gap-2">
                {redesActivas.map((red) => (
                  <a
                    key={red.nombre}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={red.nombre}
                    title={red.nombre}
                    className={[
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      'bg-white/10 text-white/80 border border-white/15',
                      red.hover,
                      'hover:text-white hover:border-transparent',
                      'shadow-sm hover:shadow-md hover:scale-110 transition-all duration-200',
                    ].join(' ')}
                  >
                    {red.icono}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ——— Banda inferior ——— */}
      <div className="border-t border-white/10 py-5 text-center px-5">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Iglesia Bautista Beth-El — Wanda, Misiones, Argentina
        </p>
      </div>
    </footer>
  )
}
