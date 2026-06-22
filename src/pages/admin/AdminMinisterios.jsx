import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import AdminLayoutNote from './AdminLayoutNote.jsx'

const PAGE_SIZE = 20
const emptyForm = {
  nombre: '',
  descripcion: '',
  orden: '1',
  imagen_url: '',
  activo: true,
}

export default function AdminMinisterios() {
  const [ministerios, setMinisterios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMinisterio, setEditingMinisterio] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    loadMinisterios()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timeout)
  }, [toast])

  async function loadMinisterios() {
    setLoading(true)
    const { data, error } = await supabase.from('ministerios').select('*').order('orden')

    if (error) {
      showToast('error', `No se pudieron cargar los ministerios: ${error.message}`)
      setMinisterios([])
    } else {
      setMinisterios(data ?? [])
    }

    setLoading(false)
  }

  function showToast(type, message) {
    setToast({ type, message })
  }

  function openCreateModal() {
    setEditingMinisterio(null)
    setForm(emptyForm)
    setImagePreview(null)
    setSelectedFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(ministerio) {
    setEditingMinisterio(ministerio)
    setForm({
      nombre: ministerio.nombre ?? '',
      descripcion: ministerio.descripcion ?? '',
      orden: String(ministerio.orden ?? 1),
      imagen_url: ministerio.imagen_url ?? '',
      activo: ministerio.activo ?? true,
    })
    setImagePreview(ministerio.imagen_url || null)
    setSelectedFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    if (saving || uploading) return
    setIsModalOpen(false)
    setEditingMinisterio(null)
    setForm(emptyForm)
    setImagePreview(null)
    setSelectedFile(null)
    setFormError('')
  }

  function validateForm() {
    const nombre = form.nombre.trim()
    const orden = parseInt(form.orden, 10)

    if (!nombre) {
      return 'El nombre es obligatorio.'
    }

    if (isNaN(orden) || orden < 1) {
      return 'El orden debe ser un número válido mayor a 0.'
    }

    return ''
  }

  function handleImageChange(event) {
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
      setImagePreview(e.target?.result)
    }
    reader.readAsDataURL(file)
    setFormError('')
  }

  async function uploadImage() {
    if (!selectedFile) return form.imagen_url

    setUploading(true)
    const timestamp = Date.now()
    const fileName = `${timestamp}_${selectedFile.name}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('ministerios-img')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('ministerios-img').getPublicUrl(fileName)
      setUploading(false)
      return urlData?.publicUrl || ''
    } catch (error) {
      setUploading(false)
      showToast('error', `Error al subir la imagen: ${error.message}`)
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

    let imagenUrl = form.imagen_url
    if (selectedFile) {
      imagenUrl = await uploadImage()
      if (!imagenUrl) {
        setSaving(false)
        return
      }
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      orden: parseInt(form.orden, 10),
      imagen_url: imagenUrl || null,
      activo: Boolean(form.activo),
    }

    if (editingMinisterio) {
      payload.updated_at = new Date()
    }

    const request = editingMinisterio
      ? supabase.from('ministerios').update(payload).eq('id', editingMinisterio.id)
      : supabase.from('ministerios').insert(payload)

    const { error } = await request
    setSaving(false)

    if (error) {
      showToast('error', `No se pudo guardar el ministerio: ${error.message}`)
      return
    }

    showToast('success', editingMinisterio ? 'Ministerio actualizado correctamente.' : 'Ministerio creado correctamente.')
    closeModal()
    loadMinisterios()
  }

  async function handleDelete(ministerio) {
    const ok = window.confirm(`¿Confirmás eliminar el ministerio "${ministerio.nombre}"?`)
    if (!ok) return

    const { error } = await supabase.from('ministerios').delete().eq('id', ministerio.id)

    if (error) {
      showToast('error', `No se pudo eliminar el ministerio: ${error.message}`)
      return
    }

    showToast('success', 'Ministerio eliminado correctamente.')
    loadMinisterios()
  }

  const filteredMinisterios = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return ministerios

    return ministerios.filter((ministerio) => {
      const nombre = (ministerio.nombre ?? '').toLowerCase()
      const descripcion = (ministerio.descripcion ?? '').toLowerCase()
      return nombre.includes(term) || descripcion.includes(term)
    })
  }, [ministerios, search])

  const totalPages = Math.max(1, Math.ceil(filteredMinisterios.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedMinisterios = filteredMinisterios.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <AdminLayoutNote title="CRUD de Ministerios">
      <div className="surface">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-beth-gold">Ministerios</h2>
            <p className="mt-2 text-beth-ivory/70">Alta, modificación, búsqueda y eliminación de ministerios.</p>
          </div>
          <button type="button" className="btn" onClick={openCreateModal}>
            Nuevo Ministerio
          </button>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-bold text-beth-gold" htmlFor="ministerio-search">
            Buscar por nombre o descripción
          </label>
          <input
            id="ministerio-search"
            className="form-input mt-2 max-w-xl"
            placeholder="Ej: Música, Jóvenes, Intercesor"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-beth-night">
                <tr>
                  {['Imagen', 'Nombre', 'Descripción', 'Orden', 'Estado', 'Acciones'].map((header) => (
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
                      Cargando ministerios...
                    </td>
                  </tr>
                )}

                {!loading && paginatedMinisterios.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-beth-ivory/70">
                      No se encontraron ministerios.
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginatedMinisterios.map((ministerio) => (
                    <tr key={ministerio.id} className="transition hover:bg-white/[0.06]">
                      <td className="whitespace-nowrap px-4 py-4">
                        {ministerio.imagen_url ? (
                          <img
                            src={ministerio.imagen_url}
                            alt={ministerio.nombre}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-beth-gold/20">
                            <span className="text-xs font-bold text-beth-gold">{ministerio.nombre?.[0]?.toUpperCase() || '?'}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 font-semibold text-beth-ivory">{ministerio.nombre}</td>
                      <td className="px-4 py-4 text-sm text-beth-ivory/75 max-w-xs truncate">{ministerio.descripcion || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-beth-ivory/75">{ministerio.orden}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={[
                            'inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                            ministerio.activo ? 'bg-emerald-400/15 text-emerald-200' : 'bg-red-400/15 text-red-200',
                          ].join(' ')}
                        >
                          {ministerio.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn btn-outline px-4 py-2 text-xs" onClick={() => openEditModal(ministerio)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-red-300/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-100 transition hover:bg-red-500/15"
                            onClick={() => handleDelete(ministerio)}
                          >
                            Eliminar
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
            Mostrando {paginatedMinisterios.length} de {filteredMinisterios.length} registros
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
                <h2 className="text-3xl font-bold text-beth-gold">{editingMinisterio ? 'Editar ministerio' : 'Nuevo ministerio'}</h2>
                <p className="mt-2 text-sm text-beth-ivory/65">Completá los datos del ministerio.</p>
              </div>
              <button type="button" className="rounded-md border border-white/15 px-3 py-1 text-2xl text-beth-gold" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
              {/* Imagen */}
              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="imagen">
                  Imagen
                </label>
                <div className="mt-3 flex flex-col items-center gap-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg object-cover border-2 border-beth-gold/30"
                      />
                    </div>
                  )}
                  <input
                    id="imagen"
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-beth-ivory/65 file:mr-3 file:rounded-md file:border file:border-beth-gold/30 file:bg-beth-night file:px-4 file:py-2 file:text-sm file:font-semibold file:text-beth-gold hover:file:bg-beth-night/80"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </div>
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
                <label className="block text-sm font-bold text-beth-gold" htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  className="form-input mt-2 min-h-[100px] resize-none"
                  value={form.descripcion}
                  onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
                  placeholder="Describí el ministerio..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="orden">
                  Orden (posición en la grilla)
                </label>
                <input
                  id="orden"
                  type="number"
                  className="form-input mt-2"
                  min="1"
                  required
                  value={form.orden}
                  onChange={(event) => setForm({ ...form, orden: event.target.value })}
                />
              </div>

              <div className="flex items-center">
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
                <p className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">
                  {formError}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn" disabled={saving || uploading}>
                  {saving ? 'Guardando...' : uploading ? 'Subiendo imagen...' : 'Guardar'}
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
