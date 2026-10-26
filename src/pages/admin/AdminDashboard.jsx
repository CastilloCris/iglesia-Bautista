// Admin — Dashboard con contadores reales desde Supabase
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import AdminLayoutNote from './AdminLayoutNote.jsx'

// Definición de cada sección del panel
const SECCIONES = [
  {
    label: 'Miembros',
    tabla: 'miembros',
    link: '/admin/miembros',
    icon: '👥',
    color: 'border-primary/30 hover:border-primary',
    accent: 'text-primary',
    desc: 'Padrón activo de miembros',
    filtro: { col: 'activo', val: true },
  },
  {
    label: 'Células',
    tabla: 'celulas',
    link: '/admin/celulas',
    icon: '🏠',
    color: 'border-green-200 hover:border-green-400',
    accent: 'text-green-700',
    desc: 'Grupos domiciliarios activos',
    filtro: { col: 'activo', val: true },
  },
  {
    label: 'Ministerios',
    tabla: 'ministerios',
    link: '/admin/ministerios',
    icon: '✝️',
    color: 'border-purple-200 hover:border-purple-400',
    accent: 'text-purple-700',
    desc: 'Ministerios activos',
    filtro: { col: 'activo', val: true },
  },
  {
    label: 'Eventos',
    tabla: 'eventos',
    link: '/admin/eventos',
    icon: '📅',
    color: 'border-amber-200 hover:border-amber-400',
    accent: 'text-amber-700',
    desc: 'Próximos eventos publicados',
    filtro: { col: 'activo', val: true },
  },
  {
    label: 'Blog',
    tabla: 'blog_posts',
    link: '/admin/blog',
    icon: '📝',
    color: 'border-blue-200 hover:border-blue-400',
    accent: 'text-blue-700',
    desc: 'Entradas publicadas',
    filtro: { col: 'publicado', val: true },
  },
  {
    label: 'Biblioteca',
    tabla: 'biblioteca',
    link: '/admin/biblioteca',
    icon: '📚',
    color: 'border-rose-200 hover:border-rose-400',
    accent: 'text-rose-700',
    desc: 'Recursos disponibles',
    filtro: { col: 'activo', val: true },
  },
]

export default function AdminDashboard() {
  const [counts, setCounts]   = useState({})   // { tabla: número | null }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const results = await Promise.all(
        SECCIONES.map(async (s) => {
          try {
            let q = supabase.from(s.tabla).select('id', { count: 'exact', head: true })
            if (s.filtro) q = q.eq(s.filtro.col, s.filtro.val)
            const { count, error } = await q
            return [s.tabla, error ? null : count]
          } catch {
            return [s.tabla, null]
          }
        })
      )
      setCounts(Object.fromEntries(results))
      setLoading(false)
    }
    fetchAll()
  }, [])

  return (
    <AdminLayoutNote title="Dashboard">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Panel de administración</h2>
        <p className="mt-1 text-sm text-muted">
          Resumen del contenido del sitio · Iglesia Bautista Beth-El
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SECCIONES.map((s) => {
          const count = counts[s.tabla]
          return (
            <Link
              key={s.tabla}
              to={s.link}
              className={[
                'group rounded-xl border-2 bg-white p-6 shadow-sm transition-all duration-200',
                'hover:-translate-y-0.5 hover:shadow-md',
                s.color,
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{s.icon}</span>
                <span className={['text-3xl font-bold tabular-nums', s.accent].join(' ')}>
                  {loading
                    ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-200" />
                    : count !== null
                    ? count
                    : '—'
                  }
                </span>
              </div>
              <h3 className={['mt-4 text-lg font-bold', s.accent].join(' ')}>{s.label}</h3>
              <p className="mt-1 text-xs text-muted">{s.desc}</p>
              <span className={['mt-3 inline-block text-xs font-semibold uppercase tracking-wide transition group-hover:underline', s.accent].join(' ')}>
                Ir al panel →
              </span>
            </Link>
          )
        })}
      </div>

      {/* Accesos rápidos */}
      <div className="mt-10 rounded-xl border border-accent/30 bg-secondary p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Accesos rápidos</h3>
        <div className="flex flex-wrap gap-3">
          {SECCIONES.map(s => (
            <Link
              key={s.tabla}
              to={s.link}
              className="rounded-full border border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-muted hover:border-accent hover:text-primary transition"
            >
              {s.icon} {s.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayoutNote>
  )
}
