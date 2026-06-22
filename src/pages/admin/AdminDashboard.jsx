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
          <article key={title} className="surface">
            <h2 className="text-2xl font-bold text-beth-gold">{title}</h2>
            <p className="mt-3 text-beth-ivory/75">{description}</p>
          </article>
        ))}
      </div>
    </AdminLayoutNote>
  )
}
