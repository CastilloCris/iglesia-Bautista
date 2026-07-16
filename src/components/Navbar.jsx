import { NavLink } from 'react-router-dom'

const publicLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/quienes-somos', label: 'Quiénes Somos' },
  { to: '/reuniones', label: 'Reuniones' },
  { to: '/ministerios', label: 'Ministerios' },
  { to: '/celulas', label: 'Células' },
  { to: '/blog', label: 'Blog' },
  { to: '/biblioteca', label: 'Biblioteca' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar({ mobile = false, onNavigate }) {
  return (
    <nav className={mobile ? 'grid gap-2' : 'hidden items-center gap-7 lg:flex'}>
      {publicLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          end={link.to === '/'}
          className={({ isActive }) =>
            [
              'relative font-semibold transition',
              mobile
                ? 'border-b border-white/10 px-3 py-3 text-center text-white/90 hover:text-white'
                : 'py-2 text-primary hover:text-primary-light after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:transition-all hover:after:w-full',
              isActive && mobile  ? 'text-white border-b border-accent'  : '',
              isActive && !mobile ? 'text-primary after:w-full' : 'after:w-0',
            ].join(' ')
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
