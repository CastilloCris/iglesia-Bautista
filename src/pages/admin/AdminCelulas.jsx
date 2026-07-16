import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import AdminLayoutNote from './AdminLayoutNote.jsx'

const PAGE_SIZE = 20
const emptyForm = {
  familia: '',
  barrio: '',
  dia_reunion: '',
  hora_reunion: '',
  maps_url: '',
  foto_url: '',
  activo: true,
}

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC' }).format(new Date(value))
}

export default function AdminCelulas() {
  const [celulas, setCelulas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCelula, setEditingCelula] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    loadCelulas()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timeout)
  }, [toast])

  async function loadCelulas() {
    setLoading(true)
    const { data, error } = await supabase.from('celulas').select('*').order('familia')

    if (error) {
      showToast('error', `No se pudieron cargar las células: ${error.message}`)
      setCelulas([])
    } else {
      setCelulas(data ?? [])
    }

    setLoading(false)
  }

  function showToast(type, message) {
    setToast({ type, message })
  }

  function openCreateModal() {
    setEditingCelula(null)
    setForm(emptyForm)
    setPhotoPreview(null)
    setSelectedFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(celula) {
    setEditingCelula(celula)
    setForm({
      familia: celula.familia ?? '',
      barrio: celula.barrio ?? '',
      dia_reunion: celula.dia_reunion ?? '',
      hora_reunion: celula.hora_reunion ?? '',
      maps_url: celula.maps_url ?? '',
      foto_url: celula.foto_url ?? '',
      activo: celula.activo ?? true,
    })
    setPhotoPreview(celula.foto_url || null)
    setSelectedFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    if (saving || uploading) return
    setIsModalOpen(false)
    setEditingCelula(null)
    setForm(emptyForm)
    setPhotoPreview(null)
    setSelectedFile(null)
    setFormError('')
  }

  function validateForm() {
    const familia = form.familia.trim()
    const barrio = form.barrio.trim()
    const dia_reunion = form.dia_reunion.trim()
    const hora_reunion = form.hora_reunion.trim()

    if (!familia || !barrio || !dia_reunion || !hora_reunion) {
      return 'Familia, barrio, día y hora de reunión son obligatorios.'
    }

    return ''
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Por favor selecciona un archivo de imagen.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen no debe superar 5 MB.')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result)
    }
    reader.readAsDataURL(file)
    setFormError('')
  }

  async function uploadPhoto() {
    if (!selectedFile) return form.foto_url

    setUploading(true)
    const timestamp = Date.now()
    const fileName = `${timestamp}_${selectedFile.name}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('celulas-fotos')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('celulas-fotos').getPublicUrl(fileName)
      setUploading(false)
      return urlData?.publicUrl || ''
    } catch (error) {
      setUploading(false)
      showToast('error', `Error al subir la foto: ${error.message}`)
      return ''
    }
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

    let fotoUrl = form.foto_url
    if (selectedFile) {
      fotoUrl = await uploadPhoto()
      if (!fotoUrl) {
        setSaving(false)
        return
      }
    }

    const payload = {
      familia: form.familia.trim(),
      barrio: form.barrio.trim(),
      dia_reunion: form.dia_reunion.trim(),
      hora_reunion: form.hora_reunion.trim(),
      maps_url: form.maps_url.trim() || null,
      foto_url: fotoUrl || null,
      activo: Boolean(form.activo),
    }

    if (editingCelula) {
      payload.updated_at = new Date()
    }

    const request = editingCelula
      ? supabase.from('celulas').update(payload).eq('id', editingCelula.id)
      : supabase.from('celulas').insert(payload)

    const { error } = await request
    setSaving(false)

    if (error) {
      showToast('error', `No se pudo guardar la célula: ${error.message}`)
      return
    }

    showToast('success', editingCelula ? 'Célula actualizada correctamente.' : 'Célula creada correctamente.')
    closeModal()
    loadCelulas()
  }

  async function handleLogicalDelete(celula) {
    const ok = window.confirm(`¿Confirmás dar de baja a la célula de la familia ${celula.familia}?`)
    if (!ok) return

    const { error } = await supabase.from('celulas').update({ activo: false }).eq('id', celula.id)

    if (error) {
      showToast('error', `No se pudo dar de baja la célula: ${error.message}`)
      return
    }

    showToast('success', 'Célula dada de baja correctamente.')
    loadCelulas()
  }

  const filteredCelulas = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return celulas

    return celulas.filter((celula) => {
      const familia = (celula.familia ?? '').toLowerCase()
      const barrio = (celula.barrio ?? '').toLowerCase()
      return familia.includes(term) || barrio.includes(term)
    })
  }, [celulas, search])

  const totalPages = Math.max(1, Math.ceil(filteredCelulas.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedCelulas = filteredCelulas.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <AdminLayoutNote title="CRUD de Células">
      <div className="surface">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Células</h2>
            <p className="mt-2 text-muted">Alta, modificación, búsqueda y baja lógica de células.</p>
          </div>
          <button type="button" className="btn" onClick={openCreateModal}>
            Nueva Célula
          </button>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-bold text-primary" htmlFor="celula-search">
            Buscar por familia o barrio
          </label>
          <input
            id="celula-search"
            className="form-input mt-2 max-w-xl"
            placeholder="Ej: García o Flores"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-accent/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-accent/20">
              <thead className="bg-secondary">
                <tr>
                  {['Foto', 'Familia', 'Barrio', 'Reunión', 'Estado', 'Acciones'].map((header) => (
                    <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-primary">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/20 bg-white">
                {loading && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-muted">
                      Cargando células...
                    </td>
                  </tr>
                )}

                {!loading && paginatedCelulas.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-muted">
                      No se encontraron células.
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginatedCelulas.map((celula) => (
                    <tr key={celula.id} className="transition hover:bg-secondary/50">
                      <td className="whitespace-nowrap px-4 py-4">
                        {celula.foto_url ? (
                          <img
                            src={celula.foto_url}
                            alt={celula.familia}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                            <span className="text-sm font-bold text-accent">{celula.familia?.[0]?.toUpperCase() || '?'}</span>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-carbon">{celula.familia}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted">{celula.barrio}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted">
                        {celula.dia_reunion} {celula.hora_reunion && `(${celula.hora_reunion})`}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={[
                            'inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                            celula.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
                          ].join(' ')}
                        >
                          {celula.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn btn-outline px-4 py-2 text-xs" onClick={() => openEditModal(celula)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50"
                            onClick={() => handleLogicalDelete(celula)}
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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <span>
            Mostrando {paginatedCelulas.length} de {filteredCelulas.length} registros
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
            <span className="rounded-md border border-accent/20 bg-secondary px-3 py-2 text-carbon">
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
          <div className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-accent/30 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-primary">{editingCelula ? 'Editar célula' : 'Nueva célula'}</h2>
                <p className="mt-2 text-sm text-muted">Completá los datos de la célula.</p>
              </div>
              <button type="button" className="rounded-md border border-accent/20 px-3 py-1 text-2xl text-accent hover:bg-secondary" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
              {/* Foto */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-primary" htmlFor="foto">
                  Foto
                </label>
                <div className="mt-3 flex flex-col items-center gap-4">
                  {photoPreview && (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-24 w-24 rounded-full object-cover border-2 border-accent/30"
                      />
                    </div>
                  )}
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-carbon/65 file:mr-3 file:rounded-md file:border file:border-accent/30 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-secondary/80"
                    onChange={handlePhotoChange}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="familia">
                  Nombre de la familia
                </label>
                <input
                  id="familia"
                  className="form-input mt-2"
                  required
                  value={form.familia}
                  onChange={(event) => setForm({ ...form, familia: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="barrio">
                  Barrio
                </label>
                <input
                  id="barrio"
                  className="form-input mt-2"
                  required
                  value={form.barrio}
                  onChange={(event) => setForm({ ...form, barrio: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="dia_reunion">
                  Día de reunión
                </label>
                <input
                  id="dia_reunion"
                  className="form-input mt-2"
                  placeholder="Ej: Jueves"
                  required
                  value={form.dia_reunion}
                  onChange={(event) => setForm({ ...form, dia_reunion: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="hora_reunion">
                  Hora de reunión
                </label>
                <input
                  id="hora_reunion"
                  className="form-input mt-2"
                  placeholder="Ej: 20:00 hs"
                  required
                  value={form.hora_reunion}
                  onChange={(event) => setForm({ ...form, hora_reunion: event.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-primary" htmlFor="maps_url">
                  URL de Google Maps
                </label>
                <input
                  id="maps_url"
                  type="url"
                  className="form-input mt-2"
                  placeholder="https://maps.google.com/..."
                  value={form.maps_url}
                  onChange={(event) => setForm({ ...form, maps_url: event.target.value })}
                />
              </div>

              <div className="flex items-end">
                <label className="flex w-full items-center justify-between gap-4 rounded-lg border border-accent/20 bg-secondary px-4 py-3">
                  <span>
                    <span className="block text-sm font-bold text-primary">Estado activo</span>
                    <span className="text-xs text-muted">{form.activo ? 'Activo' : 'Inactivo'}</span>
                  </span>
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-accent"
                    checked={form.activo}
                    onChange={(event) => setForm({ ...form, activo: event.target.checked })}
                  />
                </label>
              </div>

              {formError && (
                <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">
                  {formError}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3 sm:col-span-2">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn" disabled={saving || uploading}>
                  {saving ? 'Guardando...' : uploading ? 'Subiendo foto...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={[
            'fixed right-5 top-24 z-[90] max-w-sm rounded-lg border p-4 shadow-xl',
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800',
          ].join(' ')}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </AdminLayoutNote>
  )
}
