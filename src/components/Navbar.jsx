import { NavLink } from 'react-router-dom'

const publicLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/quienes-somos', label: 'Quiénes Somos' },
  { to: '/reuniones', label: 'Reuniones' },
  { to: '/ministerios', label: 'Ministerios' },
  { to: '/celulas', label: 'Células' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/blog', label: 'Blog' },
  { to: '/biblioteca', label: 'Biblioteca' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar({ mobile = false, onNavigate, scrolled = false }) {
  return (
    <nav className={mobile ? 'grid gap-1' : 'hidden items-center gap-5 lg:flex'}>
      {publicLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          end={link.to === '/'}
          className={({ isActive }) =>
            mobile
              ? [
                  'block rounded-lg px-3 py-2.5 text-center font-semibold transition-colors',
                  isActive
                    ? 'bg-accent/20 text-white border border-accent/50'
                    : 'text-white/80 hover:text-white hover:bg-white/10',
                ].join(' ')
              : [
                  'relative font-semibold transition-all duration-200',
                  'py-1 text-primary hover:text-accent',
                  'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-accent after:transition-all after:duration-200',
                  scrolled ? 'text-sm' : 'text-[0.9rem]',
                  isActive
                    ? 'text-accent after:w-full'
                    : 'after:w-0 hover:after:w-full',
                ].join(' ')
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
