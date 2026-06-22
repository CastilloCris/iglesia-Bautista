import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/miembros', label: 'Miembros' },
  { to: '/admin/celulas', label: 'Células' },
  { to: '/admin/ministerios', label: 'Ministerios' },
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
      <section className="container-page section-pad">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {adminLinks.map((link) => (
              <Link key={link.to} to={link.to} className="btn btn-outline">
                {link.label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-red-300/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-red-100 transition hover:bg-red-500/15"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
        {children}
      </section>
    </>
  )
}
