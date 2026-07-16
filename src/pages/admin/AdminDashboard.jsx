import AdminLayoutNote from './AdminLayoutNote.jsx'

const cards = [
  ['Miembros', 'Gestioná altas, datos de contacto y seguimiento pastoral.'],
  ['Blog', 'Publicá entradas, reflexiones y anuncios de la iglesia.'],
  ['Biblioteca', 'Administrá libros y materiales PDF para la comunidad.'],
]

export default function AdminDashboard() {
  return (
    <AdminLayoutNote title="Dashboard">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(([title, description]) => (
          <article
            key={title}
            className="rounded-xl border border-accent/40 bg-white p-6"
            style={{ boxShadow: '0 2px 12px rgba(184,134,11,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-xl font-bold text-primary">{title}</h2>
            <p className="mt-3 text-muted text-sm leading-relaxed">{description}</p>
          </article>
        ))}
      </div>
    </AdminLayoutNote>
  )
}
