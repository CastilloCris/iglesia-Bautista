import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import AdminLayoutNote from './AdminLayoutNote.jsx'

const PAGE_SIZE = 20
const emptyForm = {
  apellido: '',
  nombre: '',
  dni: '',
  telefono: '',
  fecha_nacimiento: '',
  activo: true,
}

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC' }).format(new Date(value))
}

export default function AdminMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadMembers()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timeout)
  }, [toast])

  async function loadMembers() {
    setLoading(true)
    const { data, error } = await supabase.from('miembros').select('*').order('apellido')

    if (error) {
      showToast('error', `No se pudieron cargar los miembros: ${error.message}`)
      setMembers([])
    } else {
      setMembers(data ?? [])
    }

    setLoading(false)
  }

  function showToast(type, message) {
    setToast({ type, message })
  }

  function openCreateModal() {
    setEditingMember(null)
    setForm(emptyForm)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(member) {
    setEditingMember(member)
    setForm({
      apellido: member.apellido ?? '',
      nombre: member.nombre ?? '',
      dni: member.dni ?? '',
      telefono: member.telefono ?? '',
      fecha_nacimiento: member.fecha_nacimiento ?? '',
      activo: member.activo ?? true,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setIsModalOpen(false)
    setEditingMember(null)
    setForm(emptyForm)
    setFormError('')
  }

  function validateForm() {
    const apellido = form.apellido.trim()
    const nombre = form.nombre.trim()
    const dni = form.dni.trim()

    if (!apellido || !nombre || !dni) {
      return 'Apellido, nombre y DNI son obligatorios.'
    }

    if (!/^\d+$/.test(dni)) {
      return 'El DNI debe contener solo números.'
    }

    const dniExists = members.some((member) => {
      const isSameMember = editingMember && member.id === editingMember.id
      return !isSameMember && String(member.dni ?? '').trim() === dni
    })

    if (dniExists) {
      return 'Ya existe un miembro con ese DNI.'
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationError = validateForm()

    if (validationError) {
      setFormError(validationError)
      return
    }

    setSaving(true)
    setFormError('')

    const payload = {
      apellido: form.apellido.trim(),
      nombre: form.nombre.trim(),
      dni: form.dni.trim(),
      telefono: form.telefono.trim() || null,
      fecha_nacimiento: form.fecha_nacimiento || null,
      activo: Boolean(form.activo),
    }

    const request = editingMember
      ? supabase.from('miembros').update(payload).eq('id', editingMember.id)
      : supabase.from('miembros').insert(payload)

    const { error } = await request
    setSaving(false)

    if (error) {
      showToast('error', `No se pudo guardar el miembro: ${error.message}`)
      return
    }

    showToast('success', editingMember ? 'Miembro actualizado correctamente.' : 'Miembro creado correctamente.')
    closeModal()
    loadMembers()
  }

  async function handleLogicalDelete(member) {
    const ok = window.confirm(`¿Confirmás dar de baja a ${member.apellido}, ${member.nombre}?`)
    if (!ok) return

    const { error } = await supabase.from('miembros').update({ activo: false }).eq('id', member.id)

    if (error) {
      showToast('error', `No se pudo dar de baja el miembro: ${error.message}`)
      return
    }

    showToast('success', 'Miembro dado de baja correctamente.')
    loadMembers()
  }

  function downloadExcel() {
    const data = filteredMembers.map((member) => ({
      'Apellido': member.apellido || '',
      'Nombre': member.nombre || '',
      'DNI': member.dni || '',
      'Teléfono': member.telefono || '',
      'Fecha de Nacimiento': formatDate(member.fecha_nacimiento),
      'Estado': member.activo ? 'Activo' : 'Inactivo',
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 18 },
      { wch: 10 },
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Miembros')
    XLSX.writeFile(workbook, `miembros_${new Date().toISOString().split('T')[0]}.xlsx`)
    showToast('success', 'Archivo Excel descargado exitosamente.')
  }

  function downloadPdf() {
    const pdf = new jsPDF()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 10
    let yPosition = margin + 10

    // Título
    pdf.setFontSize(16)
    pdf.setTextColor(158, 54, 54)
    pdf.text('LISTADO DE MIEMBROS', pageWidth / 2, yPosition, { align: 'center' })

    // Fecha
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    yPosition += 8
    pdf.text(`Descargado: ${new Date().toLocaleDateString('es-AR')}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 10

    // Tabla
    const columns = ['Apellido y Nombre', 'DNI', 'Teléfono', 'Fecha Nac.', 'Estado']
    const rows = filteredMembers.map((member) => [
      `${member.apellido}, ${member.nombre}`,
      member.dni || '',
      member.telefono || '',
      formatDate(member.fecha_nacimiento),
      member.activo ? 'Activo' : 'Inactivo',
    ])

    pdf.setFontSize(9)
    pdf.setTextColor(0, 0, 0)

    const startY = yPosition
    const cellHeight = 6
    const cellWidth = (pageWidth - 2 * margin) / columns.length

    // Encabezados
    pdf.setFillColor(158, 54, 54)
    pdf.setTextColor(255, 255, 255)
    columns.forEach((col, i) => {
      pdf.rect(margin + i * cellWidth, yPosition, cellWidth, cellHeight, 'F')
      pdf.text(col, margin + i * cellWidth + 1, yPosition + 4)
    })

    yPosition += cellHeight

    // Filas
    pdf.setTextColor(0, 0, 0)
    rows.forEach((row) => {
      if (yPosition + cellHeight > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin

        // Repetir encabezados en nueva página
        pdf.setFillColor(158, 54, 54)
        pdf.setTextColor(255, 255, 255)
        columns.forEach((col, i) => {
          pdf.rect(margin + i * cellWidth, yPosition, cellWidth, cellHeight, 'F')
          pdf.text(col, margin + i * cellWidth + 1, yPosition + 4)
        })
        yPosition += cellHeight
        pdf.setTextColor(0, 0, 0)
      }

      row.forEach((cell, i) => {
        pdf.text(String(cell), margin + i * cellWidth + 1, yPosition + 4)
      })
      yPosition += cellHeight
    })

    pdf.save(`miembros_${new Date().toISOString().split('T')[0]}.pdf`)
    showToast('success', 'Archivo PDF descargado exitosamente.')
  }

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return members

    return members.filter((member) => {
      const fullName = `${member.apellido ?? ''} ${member.nombre ?? ''}`.toLowerCase()
      const reverseName = `${member.nombre ?? ''} ${member.apellido ?? ''}`.toLowerCase()
      const dni = String(member.dni ?? '').toLowerCase()
      return fullName.includes(term) || reverseName.includes(term) || dni.includes(term)
    })
  }, [members, search])

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <AdminLayoutNote title="CRUD de miembros">
      <div className="surface">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-beth-gold">Miembros</h2>
            <p className="mt-2 text-beth-ivory/70">Alta, modificación, búsqueda y baja lógica de miembros.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-outline" onClick={downloadExcel}>
              📥 Descargar Excel
            </button>
            <button type="button" className="btn btn-outline" onClick={downloadPdf}>
              📥 Descargar PDF
            </button>
            <button type="button" className="btn" onClick={openCreateModal}>
              Nuevo Miembro
            </button>
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-bold text-beth-gold" htmlFor="member-search">
            Buscar por nombre, apellido o DNI
          </label>
          <input
            id="member-search"
            className="form-input mt-2 max-w-xl"
            placeholder="Ej: González, María o 30111222"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-beth-night">
                <tr>
                  {['Apellido y Nombre', 'DNI', 'Teléfono', 'Fecha de Nacimiento', 'Estado', 'Acciones'].map((header) => (
                    <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-beth-gold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/[0.03]">
                {loading && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-beth-ivory/70">
                      Cargando miembros...
                    </td>
                  </tr>
                )}

                {!loading && paginatedMembers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-beth-ivory/70">
                      No se encontraron miembros.
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginatedMembers.map((member) => (
                    <tr key={member.id} className="transition hover:bg-white/[0.06]">
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-beth-ivory">
                        {member.apellido}, {member.nombre}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-beth-ivory/75">{member.dni}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-beth-ivory/75">{member.telefono || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-beth-ivory/75">{formatDate(member.fecha_nacimiento)}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={[
                            'inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                            member.activo ? 'bg-emerald-400/15 text-emerald-200' : 'bg-red-400/15 text-red-200',
                          ].join(' ')}
                        >
                          {member.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn btn-outline px-4 py-2 text-xs" onClick={() => openEditModal(member)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-red-300/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-100 transition hover:bg-red-500/15"
                            onClick={() => handleLogicalDelete(member)}
                          >
                            Baja
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-beth-ivory/70">
          <span>
            Mostrando {paginatedMembers.length} de {filteredMembers.length} registros
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-outline px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Anterior
            </button>
            <span className="rounded-md border border-white/10 bg-beth-night px-3 py-2 text-beth-ivory">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-hidden bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-beth-gold/25 bg-beth-ink p-6 shadow-glow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-beth-gold">{editingMember ? 'Editar miembro' : 'Nuevo miembro'}</h2>
                <p className="mt-2 text-sm text-beth-ivory/65">Completá los datos del miembro.</p>
              </div>
              <button type="button" className="rounded-md border border-white/15 px-3 py-1 text-2xl text-beth-gold" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="apellido">
                  Apellido
                </label>
                <input
                  id="apellido"
                  className="form-input mt-2"
                  required
                  value={form.apellido}
                  onChange={(event) => setForm({ ...form, apellido: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  id="nombre"
                  className="form-input mt-2"
                  required
                  value={form.nombre}
                  onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="dni">
                  DNI
                </label>
                <input
                  id="dni"
                  className="form-input mt-2"
                  inputMode="numeric"
                  required
                  value={form.dni}
                  onChange={(event) => setForm({ ...form, dni: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="telefono">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  className="form-input mt-2"
                  value={form.telefono}
                  onChange={(event) => setForm({ ...form, telefono: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="fecha_nacimiento">
                  Fecha de Nacimiento
                </label>
                <input
                  id="fecha_nacimiento"
                  type="date"
                  className="form-input mt-2"
                  value={form.fecha_nacimiento}
                  onChange={(event) => setForm({ ...form, fecha_nacimiento: event.target.value })}
                />
              </div>

              <div className="flex items-end">
                <label className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-beth-night px-4 py-3">
                  <span>
                    <span className="block text-sm font-bold text-beth-gold">Estado activo</span>
                    <span className="text-xs text-beth-ivory/55">{form.activo ? 'Activo' : 'Inactivo'}</span>
                  </span>
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-beth-gold"
                    checked={form.activo}
                    onChange={(event) => setForm({ ...form, activo: event.target.checked })}
                  />
                </label>
              </div>

              {formError && (
                <p className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100 sm:col-span-2">
                  {formError}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3 sm:col-span-2">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={[
            'fixed right-5 top-24 z-[90] max-w-sm rounded-lg border p-4 shadow-glow',
            toast.type === 'success'
              ? 'border-emerald-300/40 bg-emerald-500/15 text-emerald-50'
              : 'border-red-300/40 bg-red-500/15 text-red-50',
          ].join(' ')}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </AdminLayoutNote>
  )
}
