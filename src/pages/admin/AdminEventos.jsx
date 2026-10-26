// Admin — Gestión de Eventos
// Tabla Supabase: eventos
// Columnas: id, titulo, descripcion, fecha, hora_inicio, hora_fin,
//           lugar, imagen_url, categoria, destacado, activo, created_at

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import AdminLayoutNote from './AdminLayoutNote.jsx'

const TABLA = 'eventos'

const CATEGORIAS = [
  { value: 'culto',    label: 'Culto' },
  { value: 'jovenes',  label: 'Jóvenes' },
  { value: 'celulas',  label: 'Células' },
  { value: 'especial', label: 'Especial' },
  { value: 'retiro',   label: 'Retiro' },
]

const BADGE = {
  culto:    'bg-primary/10 text-primary',
  jovenes:  'bg-blue-50 text-blue-700',
  celulas:  'bg-green-50 text-green-700',
  especial: 'bg-amber-50 text-amber-700',
  retiro:   'bg-purple-50 text-purple-700',
}

const emptyForm = {
  titulo: '',
  descripcion: '',
  fecha: '',
  hora_inicio: '',
  hora_fin: '',
  lugar: '',
  imagen_url: '',
  categoria: 'culto',
  destacado: false,
  activo: true,
}

function formatFecha(fechaStr) {
  if (!fechaStr) return '—'
  const [y, m, d] = fechaStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatHora(h) {
  return h ? h.slice(0, 5) : ''
}

function esPassado(fechaStr) {
  if (!fechaStr) return false
  const [y, m, d] = fechaStr.split('-').map(Number)
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  return new Date(y, m - 1, d) < hoy
}

export default function AdminEventos() {
  const [eventos, setEventos]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [filtro, setFiltro]       = useState('')      // búsqueda texto
  const [filtroCat, setFiltroCat] = useState('')      // categoría
  const [isOpen, setIsOpen]       = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [toast, setToast]         = useState(null)

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from(TABLA)
      .select('*')
      .order('fecha', { ascending: true })
    if (error) showToast('error', `Error al cargar eventos: ${error.message}`)
    else setEventos(data ?? [])
    setLoading(false)
  }

  function showToast(type, message) { setToast({ type, message }) }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setIsOpen(true)
  }

  function openEdit(ev) {
    setEditing(ev)
    setForm({
      titulo:      ev.titulo ?? '',
      descripcion: ev.descripcion ?? '',
      fecha:       ev.fecha ?? '',
      hora_inicio: ev.hora_inicio ? ev.hora_inicio.slice(0,5) : '',
      hora_fin:    ev.hora_fin    ? ev.hora_fin.slice(0,5)    : '',
      lugar:       ev.lugar ?? '',
      imagen_url:  ev.imagen_url ?? '',
      categoria:   ev.categoria ?? 'culto',
      destacado:   ev.destacado ?? false,
      activo:      ev.activo ?? true,
    })
    setFormError('')
    setIsOpen(true)
  }

  function closeModal() {
    if (saving) return
    setIsOpen(false); setEditing(null); setForm(emptyForm); setFormError('')
  }

  function validate() {
    if (!form.titulo.trim()) return 'El título es obligatorio.'
    if (!form.fecha)         return 'La fecha es obligatoria.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setFormError(err); return }

    setSaving(true); setFormError('')
    const payload = {
      titulo:      form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      fecha:       form.fecha,
      hora_inicio: form.hora_inicio || null,
      hora_fin:    form.hora_fin    || null,
      lugar:       form.lugar.trim()      || null,
      imagen_url:  form.imagen_url.trim() || null,
      categoria:   form.categoria,
      destacado:   Boolean(form.destacado),
      activo:      Boolean(form.activo),
    }

    const req = editing
      ? supabase.from(TABLA).update(payload).eq('id', editing.id)
      : supabase.from(TABLA).insert(payload)

    const { error } = await req
    setSaving(false)
    if (error) { showToast('error', `No se pudo guardar: ${error.message}`); return }

    showToast('success', editing ? 'Evento actualizado.' : 'Evento creado.')
    closeModal(); load()
  }

  async function toggleActivo(ev) {
    const { error } = await supabase.from(TABLA).update({ activo: !ev.activo }).eq('id', ev.id)
    if (error) showToast('error', `Error: ${error.message}`)
    else { showToast('success', ev.activo ? 'Evento desactivado.' : 'Evento activado.'); load() }
  }

  async function handleDelete(ev) {
    if (!window.confirm(`¿Eliminar "${ev.titulo}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from(TABLA).delete().eq('id', ev.id)
    if (error) showToast('error', `Error al eliminar: ${error.message}`)
    else { showToast('success', 'Evento eliminado.'); load() }
  }

  // Filtrado cliente
  const filtered = eventos.filter(ev => {
    const q = filtro.toLowerCase()
    const matchText = !q ||
      ev.titulo?.toLowerCase().includes(q) ||
      ev.lugar?.toLowerCase().includes(q)
    const matchCat = !filtroCat || ev.categoria === filtroCat
    return matchText && matchCat
  })

  const proximos = filtered.filter(ev => !esPassado(ev.fecha))
  const pasados  = filtered.filter(ev =>  esPassado(ev.fecha))

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
  const fCheck = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.checked }))

  return (
    <AdminLayoutNote title="Gestión de Eventos">
      <div className="surface">
        {/* Cabecera */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Eventos</h2>
            <p className="mt-1 text-sm text-muted">Alta, edición y baja de eventos y actividades.</p>
          </div>
          <button className="btn" onClick={openCreate}>+ Nuevo evento</button>
        </div>

        {/* Filtros */}
        <div className="mt-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar por título o lugar..."
            className="flex-1 min-w-[200px] border border-accent/40 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-white"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
          <select
            className="border border-accent/40 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent bg-white"
            value={filtroCat}
            onChange={e => setFiltroCat(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {(filtro || filtroCat) && (
            <button className="text-xs text-muted hover:text-primary underline" onClick={() => { setFiltro(''); setFiltroCat('') }}>
              Limpiar
            </button>
          )}
        </div>

        {loading && <p className="mt-8 text-center text-muted">Cargando eventos...</p>}

        {!loading && filtered.length === 0 && (
          <p className="mt-8 text-center text-muted">No hay eventos que coincidan con la búsqueda.</p>
        )}

        {/* Próximos */}
        {!loading && proximos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Próximos ({proximos.length})</h3>
            <EventTable rows={proximos} onEdit={openEdit} onToggle={toggleActivo} onDelete={handleDelete} />
          </div>
        )}

        {/* Pasados */}
        {!loading && pasados.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Anteriores ({pasados.length})</h3>
            <EventTable rows={pasados} onEdit={openEdit} onToggle={toggleActivo} onDelete={handleDelete} dimmed />
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-accent/30 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">{editing ? 'Editar evento' : 'Nuevo evento'}</h2>
                <p className="text-sm text-muted mt-1">Los campos con * son obligatorios.</p>
              </div>
              <button onClick={closeModal} className="text-2xl text-accent hover:text-primary leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              {/* Título */}
              <div className="sm:col-span-2">
                <label className="label">Título *</label>
                <input className="form-input mt-1" required value={form.titulo} onChange={f('titulo')} />
              </div>

              {/* Descripción */}
              <div className="sm:col-span-2">
                <label className="label">Descripción</label>
                <textarea
                  className="form-input mt-1 min-h-[80px] resize-y"
                  value={form.descripcion}
                  onChange={f('descripcion')}
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="label">Fecha *</label>
                <input type="date" className="form-input mt-1" required value={form.fecha} onChange={f('fecha')} />
              </div>

              {/* Lugar */}
              <div>
                <label className="label">Lugar</label>
                <input className="form-input mt-1" placeholder="Ej: Templo central" value={form.lugar} onChange={f('lugar')} />
              </div>

              {/* Hora inicio */}
              <div>
                <label className="label">Hora de inicio</label>
                <input type="time" className="form-input mt-1" value={form.hora_inicio} onChange={f('hora_inicio')} />
              </div>

              {/* Hora fin */}
              <div>
                <label className="label">Hora de fin</label>
                <input type="time" className="form-input mt-1" value={form.hora_fin} onChange={f('hora_fin')} />
              </div>

              {/* Categoría */}
              <div>
                <label className="label">Categoría</label>
                <select className="form-input mt-1" value={form.categoria} onChange={f('categoria')}>
                  {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Imagen URL */}
              <div>
                <label className="label">URL de imagen (opcional)</label>
                <input className="form-input mt-1" placeholder="https://..." value={form.imagen_url} onChange={f('imagen_url')} />
              </div>

              {/* Checkboxes */}
              <div className="sm:col-span-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 accent-accent" checked={form.destacado} onChange={fCheck('destacado')} />
                  <span className="text-sm text-carbon font-medium">★ Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 accent-accent" checked={form.activo} onChange={fCheck('activo')} />
                  <span className="text-sm text-carbon font-medium">Activo (visible en el sitio)</span>
                </label>
              </div>

              {formError && (
                <p className="sm:col-span-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </p>
              )}

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={[
          'fixed right-5 top-24 z-[90] max-w-sm rounded-lg border p-4 shadow-xl text-sm',
          toast.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-800',
        ].join(' ')} role="status">
          {toast.message}
        </div>
      )}
    </AdminLayoutNote>
  )
}

function EventTable({ rows, onEdit, onToggle, onDelete, dimmed = false }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-accent/20">
      <table className="min-w-full divide-y divide-accent/20 text-sm">
        <thead className="bg-secondary">
          <tr>
            {['Título', 'Fecha', 'Horario', 'Lugar', 'Categoría', 'Estado', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-primary whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={['divide-y divide-accent/10 bg-white', dimmed && 'opacity-60'].filter(Boolean).join(' ')}>
          {rows.map(ev => (
            <tr key={ev.id} className="hover:bg-secondary/40 transition">
              <td className="px-4 py-3 font-medium text-carbon">
                {ev.titulo}
                {ev.destacado && <span className="ml-1 text-accent text-xs">★</span>}
              </td>
              <td className="px-4 py-3 text-muted whitespace-nowrap">{formatFecha(ev.fecha)}</td>
              <td className="px-4 py-3 text-muted whitespace-nowrap">
                {ev.hora_inicio ? `${formatHora(ev.hora_inicio)}${ev.hora_fin ? ` – ${formatHora(ev.hora_fin)}` : ''} hs` : '—'}
              </td>
              <td className="px-4 py-3 text-muted">{ev.lugar || '—'}</td>
              <td className="px-4 py-3">
                <span className={['rounded-full px-2.5 py-0.5 text-xs font-semibold', BADGE[ev.categoria] || 'bg-gray-100 text-gray-600'].join(' ')}>
                  {CATEGORIAS.find(c => c.value === ev.categoria)?.label || ev.categoria}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={['rounded-full px-2.5 py-0.5 text-xs font-bold uppercase', ev.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'].join(' ')}>
                  {ev.activo ? 'Activo' : 'Oculto'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(ev)}
                    className="btn btn-outline px-3 py-1 text-xs"
                  >Editar</button>
                  <button
                    onClick={() => onToggle(ev)}
                    className="rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold text-muted hover:border-accent hover:text-primary transition"
                    title={ev.activo ? 'Ocultar' : 'Activar'}
                  >{ev.activo ? 'Ocultar' : 'Activar'}</button>
                  <button
                    onClick={() => onDelete(ev)}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                  >Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
