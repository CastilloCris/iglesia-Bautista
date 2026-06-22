import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { getStorageFileName, LIBRARY_BUCKET, LIBRARY_CATEGORIES, LIBRARY_TABLE } from '../../lib/library.js'
import AdminLayoutNote from './AdminLayoutNote.jsx'

const emptyForm = {
  titulo: '',
  autor: '',
  descripcion: '',
  categoria: 'Teología',
  pdf_url: '',
  portada_url: '',
  activo: true,
}

export default function AdminLibrary() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [pdfFile, setPdfFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timeout)
  }, [toast])

  async function loadBooks() {
    setLoading(true)
    const { data, error } = await supabase.from(LIBRARY_TABLE).select('*').order('titulo')

    if (error) {
      showToast('error', `No se pudieron cargar los libros: ${error.message}`)
      setBooks([])
    } else {
      setBooks(data ?? [])
    }

    setLoading(false)
  }

  function showToast(type, message) {
    setToast({ type, message })
  }

  function openCreateModal() {
    setEditingBook(null)
    setForm(emptyForm)
    setPdfFile(null)
    setCoverFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  function openEditModal(book) {
    setEditingBook(book)
    setForm({
      titulo: book.titulo ?? '',
      autor: book.autor ?? '',
      descripcion: book.descripcion ?? '',
      categoria: book.categoria ?? 'Otro',
      pdf_url: book.pdf_url ?? '',
      portada_url: book.portada_url ?? '',
      activo: book.activo ?? true,
    })
    setPdfFile(null)
    setCoverFile(null)
    setFormError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setIsModalOpen(false)
    setEditingBook(null)
    setForm(emptyForm)
    setPdfFile(null)
    setCoverFile(null)
    setFormError('')
  }

  function validateForm() {
    if (!form.titulo.trim()) return 'El título es obligatorio.'
    if (!form.autor.trim()) return 'El autor es obligatorio.'
    if (!editingBook && !pdfFile) return 'El PDF es obligatorio al crear un libro.'
    if (pdfFile && pdfFile.type !== 'application/pdf') return 'El archivo principal debe ser un PDF.'
    if (coverFile && !coverFile.type.startsWith('image/')) return 'La portada debe ser una imagen.'
    return ''
  }

  async function uploadPdf(file) {
    const filename = getStorageFileName(file, 'libros')
    const { data, error } = await supabase.storage.from(LIBRARY_BUCKET).upload(filename, file, {
      contentType: 'application/pdf',
    })

    if (error) throw error

    const { data: urlData } = supabase.storage.from(LIBRARY_BUCKET).getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function uploadCover(file) {
    const filename = getStorageFileName(file, 'portadas')
    const { data, error } = await supabase.storage.from(LIBRARY_BUCKET).upload(filename, file, {
      contentType: file.type,
    })

    if (error) throw error

    const { data: urlData } = supabase.storage.from(LIBRARY_BUCKET).getPublicUrl(data.path)
    return urlData.publicUrl
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

    try {
      const pdf_url = pdfFile ? await uploadPdf(pdfFile) : form.pdf_url
      const portada_url = coverFile ? await uploadCover(coverFile) : form.portada_url || null

      const payload = {
        titulo: form.titulo.trim(),
        autor: form.autor.trim(),
        descripcion: form.descripcion.trim() || null,
        categoria: form.categoria,
        pdf_url,
        portada_url,
        activo: Boolean(form.activo),
      }

      const request = editingBook
        ? supabase.from(LIBRARY_TABLE).update(payload).eq('id', editingBook.id)
        : supabase.from(LIBRARY_TABLE).insert(payload)

      const { error } = await request
      if (error) throw error

      showToast('success', editingBook ? 'Libro actualizado correctamente.' : 'Libro agregado correctamente.')
      closeModal()
      loadBooks()
    } catch (error) {
      showToast('error', `No se pudo guardar el libro: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function logicalDelete(book) {
    const ok = window.confirm(`¿Confirmás dar de baja "${book.titulo}"?`)
    if (!ok) return

    const { error } = await supabase.from(LIBRARY_TABLE).update({ activo: false }).eq('id', book.id)

    if (error) {
      showToast('error', `No se pudo dar de baja el libro: ${error.message}`)
      return
    }

    showToast('success', 'Libro dado de baja correctamente.')
    loadBooks()
  }

  const coverPreview = coverFile ? URL.createObjectURL(coverFile) : form.portada_url

  return (
    <AdminLayoutNote title="CRUD de libros PDF">
      <div className="surface">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-beth-gold">Biblioteca</h2>
            <p className="mt-2 text-beth-ivory/70">Administrá archivos PDF, portadas, autores y categorías.</p>
          </div>
          <button type="button" className="btn" onClick={openCreateModal}>
            Nuevo PDF
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-beth-night">
                <tr>
                  {['Título', 'Autor', 'Categoría', 'Estado', 'Acciones'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-beth-gold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/[0.03]">
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-beth-ivory/70">
                      Cargando libros...
                    </td>
                  </tr>
                )}

                {!loading && books.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-beth-ivory/70">
                      Todavía no hay libros cargados.
                    </td>
                  </tr>
                )}

                {!loading &&
                  books.map((book) => (
                    <tr key={book.id} className="transition hover:bg-white/[0.06]">
                      <td className="px-4 py-4 font-semibold text-beth-ivory">{book.titulo}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-beth-ivory/75">{book.autor}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-beth-ivory/75">{book.categoria}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={[
                            'inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                            book.activo ? 'bg-emerald-400/15 text-emerald-200' : 'bg-red-400/15 text-red-200',
                          ].join(' ')}
                        >
                          {book.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn btn-outline px-4 py-2 text-xs" onClick={() => openEditModal(book)}>
                            Editar
                          </button>
                          {book.pdf_url && (
                            <a href={book.pdf_url} target="_blank" rel="noreferrer" className="btn btn-outline px-4 py-2 text-xs">
                              Abrir
                            </a>
                          )}
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-red-300/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-100 transition hover:bg-red-500/15"
                            onClick={() => logicalDelete(book)}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-hidden bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-beth-gold/25 bg-beth-ink p-6 shadow-glow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-beth-gold">{editingBook ? 'Editar libro' : 'Nuevo libro'}</h2>
                <p className="mt-2 text-sm text-beth-ivory/65">Subí el PDF y, opcionalmente, una imagen de portada.</p>
              </div>
              <button type="button" className="rounded-md border border-white/15 px-3 py-1 text-2xl text-beth-gold" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="titulo">
                  Título
                </label>
                <input
                  id="titulo"
                  className="form-input mt-2"
                  required
                  value={form.titulo}
                  onChange={(event) => setForm({ ...form, titulo: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="autor">
                  Autor
                </label>
                <input
                  id="autor"
                  className="form-input mt-2"
                  required
                  value={form.autor}
                  onChange={(event) => setForm({ ...form, autor: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="categoria">
                  Categoría
                </label>
                <select
                  id="categoria"
                  className="form-input mt-2"
                  value={form.categoria}
                  onChange={(event) => setForm({ ...form, categoria: event.target.value })}
                >
                  {LIBRARY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-beth-night px-4 py-3">
                <span>
                  <span className="block text-sm font-bold text-beth-gold">Activo</span>
                  <span className="text-xs text-beth-ivory/55">{form.activo ? 'Visible en la biblioteca' : 'Oculto al público'}</span>
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-beth-gold"
                  checked={form.activo}
                  onChange={(event) => setForm({ ...form, activo: event.target.checked })}
                />
              </label>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-beth-gold" htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows="4"
                  className="form-input mt-2"
                  value={form.descripcion}
                  onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="pdf">
                  PDF
                </label>
                <input
                  id="pdf"
                  type="file"
                  accept="application/pdf"
                  className="mt-2 block w-full text-sm text-beth-ivory/75 file:mr-4 file:rounded-full file:border-0 file:bg-beth-gold file:px-4 file:py-2 file:font-bold file:text-beth-night"
                  onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                />
                {form.pdf_url && !pdfFile && (
                  <a href={form.pdf_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-bold text-beth-gold hover:text-beth-goldSoft">
                    PDF actual
                  </a>
                )}
                {pdfFile && <p className="mt-3 text-sm text-beth-ivory/65">{pdfFile.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-beth-gold" htmlFor="portada">
                  Imagen de portada
                </label>
                <input
                  id="portada"
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-sm text-beth-ivory/75 file:mr-4 file:rounded-full file:border-0 file:bg-beth-gold file:px-4 file:py-2 file:font-bold file:text-beth-night"
                  onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
                />
                {coverPreview && <img src={coverPreview} alt="Preview portada" className="mt-4 h-40 w-28 rounded-md object-cover shadow-glow" />}
              </div>

              {formError && (
                <p className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100 sm:col-span-2">{formError}</p>
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
