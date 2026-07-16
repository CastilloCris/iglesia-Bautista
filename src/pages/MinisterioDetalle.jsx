import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import PageHero from '../components/PageHero.jsx'
import BlogCard from '../components/BlogCard.jsx'

const statusCard = 'rounded-xl border border-accent/40 bg-white p-8 text-center text-muted shadow-sm'
const errorCard  = 'rounded-xl border border-red-300/50 bg-white p-8 text-center text-red-500 shadow-sm'

export default function MinisterioDetalle() {
  const { id } = useParams()
  const [ministerio, setMinisterio] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [ministerioRes, postsRes] = await Promise.all([
          supabase.from('ministerios').select('*').eq('id', id).single(),
          supabase
            .from('blog_posts')
            .select('*')
            .eq('ministerio_id', id)
            .eq('publicado', true)
            .order('created_at', { ascending: false }),
        ])

        if (ministerioRes.error) throw ministerioRes.error
        setMinisterio(ministerioRes.data)

        if (postsRes.error) throw postsRes.error
        setPosts(postsRes.data ?? [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <>
        <PageHero title="Ministerio" />
        <div className="min-h-screen bg-secondary">
          <section className="container-page section-pad">
            <div className={statusCard}>Cargando ministerio...</div>
          </section>
        </div>
      </>
    )
  }

  if (error || !ministerio) {
    return (
      <>
        <PageHero title="Error" />
        <div className="min-h-screen bg-secondary">
          <section className="container-page section-pad">
            <div className={errorCard}>
              {error ? `No se pudo cargar el ministerio: ${error}` : 'Ministerio no encontrado.'}
            </div>
          </section>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHero title={ministerio.nombre} subtitle={ministerio.descripcion} />

      <div className="min-h-screen bg-secondary">
        <section className="container-page section-pad">
          {ministerio.imagen_url && (
            <div className="mb-12">
              <img
                src={ministerio.imagen_url}
                alt={ministerio.nombre}
                className="w-full rounded-xl object-cover shadow-md border border-accent/20"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}

          {ministerio.descripcion && (
            <div className="mb-12 max-w-3xl">
              <p className="text-lg text-carbon leading-relaxed">{ministerio.descripcion}</p>
            </div>
          )}

          <div className="border-t border-accent/20 pt-12">
            <h2 className="font-serif text-3xl font-bold text-primary">Últimas noticias</h2>

            {posts.length === 0 ? (
              <div className={`mt-8 ${statusCard}`}>
                Próximamente compartiremos novedades de este ministerio.
              </div>
            ) : (
              <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
