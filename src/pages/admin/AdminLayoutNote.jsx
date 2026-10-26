import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/miembros', label: 'Miembros' },
  { to: '/admin/celulas', label: 'Células' },
  { to: '/admin/ministerios', label: 'Ministerios' },
  { to: '/admin/eventos', label: 'Eventos' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/biblioteca', label: 'Biblioteca' },
]

export default function AdminLayoutNote({ title, children }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <section className="page-hero">
        <h1 className="page-title">{title}</h1>
        <p className="section-kicker">Panel de administración</p>
      </section>

      <div className="min-h-screen bg-secondary">
        <section className="container-page section-pad">
          {/* Barra de navegación admin */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {adminLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center justify-center rounded-full border-2 border-accent px-5 py-2 text-xs font-bold uppercase tracking-wide text-accent transition hover:bg-accent hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-red-400/50 px-5 py-2 text-sm font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>

          {children}
        </section>
      </div>
    </>
  )
}
