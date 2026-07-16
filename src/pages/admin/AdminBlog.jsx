import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import {
  BLOG_MEDIA_BUCKET,
  BLOG_TABLE,
  formatPostDate,
  generateSlug,
  getPostDate,
  getVideoEmbedUrl,
  isStorageVideo,
} from '../../lib/blog.js'
import AdminLayoutNote from './AdminLayoutNote.jsx'

const emptyForm = {
  titulo: '',
  slug: '',
  resumen: '',
  contenido: '',
  imagen_url: '',
  video_url: '',
  publicado: false,
}

function getStorageName(file, folder) {
  const extension = file.name.split('.').pop()
  const baseName = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `${folder}/${Date.now()}-${crypto.randomUUID()}-${baseName}.${extension}`
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [ministerios, setMinisterios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [ministerioId, setMinisterioId] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timeout)
  }, [toast])

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = getPostDate(a) ? new Date(getPostDate(a)).getTime() : 0
      const dateB = getPostDate(b) ? new Date(getPostDate(b)).getTime() : 0
      return dateB - dateA
    })
  }, [posts])

  async function loadPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from(BLOG_TABLE)
      .select('*, ministerios(nombre)')
      .order('created_at', { ascending: false })

    if (error) {
      showToast('error', `No se pudieron cargar las entradas: ${error.message}`)
      setPosts([])
    } else {
      setPosts(data ?? [])
    }

    setLoading(false)
  }

  async function loadMinisterios() {
    const { data, error } = await supabase
      .from('ministerios')
      .select('id, nombre')
      .eq('activo', true)
      .order('orden')

    if (!error) {
      setMinisterios(data ?? [])
    }
  }

  function showToast(type, message) {
    setToast({ type, message })
  }

  function openCreateModal() {
    setEditingPost(null)
    setForm(emptyForm)
    setMinisterioId('')
    setImageFile(null)
    setVideoFile(null)
    setFormError('')
    loadMinisterios()
    setIsModalOpen(true)
  }

  function openEditModal(post) {
    setEditingPost(post)
    setForm({
      titulo: post.titulo ?? '',
      slug: post.slug ?? '',
      resumen: post.resumen ?? '',
      contenido: post.contenido ?? '',
      imagen_url: post.imagen_url ?? '',
      video_url: post.video_url ?? '',
      publicado: post.publicado ?? false,
    })
    setMinisterioId(post.ministerio_id || '')
    setImageFile(null)
    setVideoFile(null)
    setFormError('')
    loadMinisterios()
    setIsModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setIsModalOpen(false)
    setEditingPost(null)
    setForm(emptyForm)
    setMinisterioId('')
    setImageFile(null)
    setVideoFile(null)
    setFormError('')
  }

  function updateTitle(value) {
    setForm((current) => ({
      ...current,
      titulo: value,
      slug: generateSlug(value),
    }))
  }

  function validateForm() {
    const titulo = form.titulo.trim()
    const slug = form.slug.trim()

    if (!titulo) return 'El título es obligatorio.'
    if (!slug) return 'El slug no puede quedar vacío.'
    if (form.resumen.length > 300) return 'El resumen no puede superar los 300 caracteres.'
    if (videoFile && videoFile.size > 50 * 1024 * 1024) return 'El video no puede superar los 50MB.'

    const slugExists = posts.some((post) => {
      const isSamePost = editingPost && post.id === editingPost.id
      return !isSamePost && post.slug === slug
    })

    if (slugExists) return 'Ya existe una entrada con ese slug.'
    return ''
  }

  async function uploadFile(file, folder) {
    const filename = getStorageName(file, folder)
    const { error } = await supabase.storage.from(BLOG_MEDIA_BUCKET).upload(filename, file)

    if (error) throw error

    const { data } = supabase.storage.from(BLOG_MEDIA_BUCKET).getPublicUrl(filename)
    return data.publicUrl
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
      const imagen_url = imageFile ? await uploadFile(imageFile, 'images') : form.imagen_url || null
      const video_url = videoFile ? await uploadFile(videoFile, 'videos') : form.video_url.trim() || null

      const payload = {
        titulo: form.titulo.trim(),
        slug: form.slug.trim(),
        resumen: form.resumen.trim() || null,
        contenido: form.contenido.trim() || null,
        imagen_url,
        video_url,
        publicado: Boolean(form.publicado),
        ministerio_id: ministerioId || null,
      }

      const request = editingPost
        ? supabase.from(BLOG_TABLE).update(payload).eq('id', editingPost.id)
        : supabase.from(BLOG_TABLE).insert(payload)

      const { error } = await request
      if (error) throw error

      showToast('success', editingPost ? 'Entrada actualizada correctamente.' : 'Entrada creada correctamente.')
      closeModal()
      loadPosts()
    } catch (error) {
      showToast('error', `No se pudo guardar la entrada: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function togglePublished(post) {
    const { error } = await supabase.from(BLOG_TABLE).update({ publicado: !post.publicado }).eq('id', post.id)

    if (error) {
      showToast('error', `No se pudo cambiar el estado: ${error.message}`)
      return
    }

    showToast('success', post.publicado ? 'Entrada pasada a borrador.' : 'Entrada publicada.')
    loadPosts()
  }

  async function deletePost(post) {
    const ok = window.confirm(`¿Confirmás eliminar la entrada "${post.titulo}"?`)
    if (!ok) return

    const { error } = await supabase.from(BLOG_TABLE).delete().eq('id', post.id)

    if (error) {
      showToast('error', `No se pudo eliminar la entrada: ${error.message}`)
      return
    }

    showToast('success', 'Entrada eliminada correctamente.')
    loadPosts()
  }

  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : form.imagen_url
  const embedUrl = getVideoEmbedUrl(form.video_url)

  return (
    <AdminLayoutNote title="CRUD de entradas de blog">
      <div className="surface">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Entradas</h2>
            <p className="mt-2 text-muted">Creá, editá, publicá y administrá contenidos del blog.</p>
          </div>
          <button type="button" className="btn" onClick={openCreateModal}>
            Nueva entrada
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-accent/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-accent/20">
              <thead className="bg-secondary">
                <tr>
                  {['Título', 'Destino', 'Estado', 'Fecha', 'Acciones'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-primary">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/20 bg-white">
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-muted">
                      Cargando entradas...
                    </td>
                  </tr>
                )}

                {!loading && sortedPosts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-muted">
                      Todavía no hay entradas cargadas.
                    </td>
                  </tr>
                )}

                {!loading &&
                  sortedPosts.map((post) => (
                    <tr key={post.id} className="transition hover:bg-secondary/50">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-carbon">{post.titulo}</p>
                        <p className="mt-1 text-xs text-muted">/{post.slug}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700">
                          {post.ministerio_id ? `⛪ ${post.ministerios?.nombre}` : '📰 Blog'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={[
                            'inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                            post.publicado ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700',
                          ].join(' ')}
                        >
                          {post.publicado ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted">{formatPostDate(getPostDate(post))}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn btn-outline px-4 py-2 text-xs" onClick={() => openEditModal(post)}>
                            Editar
                          </button>
                          <button type="button" className="btn btn-outline px-4 py-2 text-xs" onClick={() => togglePublished(post)}>
                            {post.publicado ? 'Despublicar' : 'Publicar'}
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50"
                            onClick={() => deletePost(post)}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-hidden bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="my-8 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-accent/30 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-primary">{editingPost ? 'Editar entrada' : 'Nueva entrada'}</h2>
                <p className="mt-2 text-sm text-muted">El slug se genera automáticamente desde el título.</p>
              </div>
              <button type="button" className="rounded-md border border-accent/20 px-3 py-1 text-2xl text-accent hover:bg-secondary" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="mt-6 grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="titulo">
                  Título
                </label>
                <input id="titulo" className="form-input mt-2" required value={form.titulo} onChange={(event) => updateTitle(event.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  className="form-input mt-2"
                  required
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: generateSlug(event.target.value) })}
                />
              </div>

              <div className="lg:col-span-2">
                <label className="flex items-center justify-between gap-4 text-sm font-bold text-primary" htmlFor="resumen">
                  <span>Resumen</span>
                  <span className={form.resumen.length > 300 ? 'text-red-600' : 'text-muted'}>{form.resumen.length}/300</span>
                </label>
                <textarea
                  id="resumen"
                  rows="3"
                  maxLength="300"
                  className="form-input mt-2"
                  value={form.resumen}
                  onChange={(event) => setForm({ ...form, resumen: event.target.value })}
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-primary" htmlFor="contenido">
                  Contenido
                </label>
                <textarea
                  id="contenido"
                  rows="10"
                  className="form-input mt-2"
                  value={form.contenido}
                  onChange={(event) => setForm({ ...form, contenido: event.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="imagen">
                  Imagen de portada
                </label>
                <input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-sm text-carbon/75 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-white"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                />
                {imagePreview && <img src={imagePreview} alt="Preview portada" className="mt-4 aspect-video w-full rounded-lg object-cover" />}
              </div>

              <div>
                <label className="block text-sm font-bold text-primary" htmlFor="video_url">
                  Video URL YouTube/Vimeo
                </label>
                <input
                  id="video_url"
                  className="form-input mt-2"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.video_url}
                  onChange={(event) => {
                    setVideoFile(null)
                    setForm({ ...form, video_url: event.target.value })
                  }}
                />

                <label className="mt-4 block text-sm font-bold text-primary" htmlFor="video_file">
                  O subir video pequeño
                </label>
                <input
                  id="video_file"
                  type="file"
                  accept="video/*"
                  className="mt-2 block w-full text-sm text-carbon/75 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-white"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null
                    setVideoFile(file)
                  }}
                />
                <p className="mt-2 text-xs text-muted">Máximo 50MB.</p>

                {embedUrl && !videoFile && (
                  <iframe title="Preview video" src={embedUrl} className="mt-4 aspect-video w-full rounded-lg" allowFullScreen />
                )}

                {videoFile && (
                  <video className="mt-4 aspect-video w-full rounded-lg bg-black" controls src={URL.createObjectURL(videoFile)}>
                    <track kind="captions" />
                  </video>
                )}

                {!videoFile && isStorageVideo(form.video_url, form.video_tipo) && (
                  <video className="mt-4 aspect-video w-full rounded-lg bg-black" controls src={form.video_url}>
                    <track kind="captions" />
                  </video>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block mb-2 font-semibold text-primary">Publicar en</label>
                <select
                  value={ministerioId}
                  onChange={(e) => setMinisterioId(e.target.value)}
                  className="w-full rounded-lg border border-accent/30 bg-white px-3 py-2 text-carbon focus:border-accent focus:outline-none"
                >
                  <option value="">📰 Blog general</option>
                  {ministerios.map((m) => (
                    <option key={m.id} value={m.id}>
                      ⛪ {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-lg border border-accent/20 bg-secondary px-4 py-3 lg:col-span-2">
                <span>
                  <span className="block text-sm font-bold text-primary">Publicado</span>
                  <span className="text-xs text-muted">{form.publicado ? 'Visible en el blog público' : 'Guardado como borrador'}</span>
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-accent"
                  checked={form.publicado}
                  onChange={(event) => setForm({ ...form, publicado: event.target.checked })}
                />
              </label>

              {formError && (
                <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 lg:col-span-2">{formError}</p>
              )}

              <div className="flex flex-wrap justify-end gap-3 lg:col-span-2">
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
