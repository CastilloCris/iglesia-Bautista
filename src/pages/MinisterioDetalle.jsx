import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import PageHero from '../components/PageHero.jsx'
import BlogCard from '../components/BlogCard.jsx'

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
        <section className="container-page section-pad">
          <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center text-gray-300 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>
            Cargando ministerio...
          </div>
        </section>
      </>
    )
  }

  if (error || !ministerio) {
    return (
      <>
        <PageHero title="Error" />
        <section className="container-page section-pad">
          <div className="rounded-lg border-2 border-red-600/30 bg-beth-night p-8 text-center text-red-400 shadow-sm" style={{boxShadow: '0 2px 12px rgba(220, 38, 38, 0.2)'}}>
            {error ? `No se pudo cargar el ministerio: ${error}` : 'Ministerio no encontrado.'}
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero title={ministerio.nombre} subtitle={ministerio.descripcion} />
      <section className="container-page section-pad">
        {ministerio.imagen_url && (
          <div className="mb-12">
            <img src={ministerio.imagen_url} alt={ministerio.nombre} className="w-full rounded-lg object-cover" style={{maxHeight: '400px'}} />
          </div>
        )}

        {ministerio.descripcion && (
          <div className="mb-12 max-w-3xl">
            <p className="text-lg text-gray-300">{ministerio.descripcion}</p>
          </div>
        )}

        <div className="border-t border-beth-gold/20 pt-12">
          <h2 className="font-serif text-3xl font-bold text-beth-gold">Últimas noticias</h2>

          {posts.length === 0 ? (
            <div className="mt-8 rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center text-gray-300 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>
              Próximamente compartiremos novedades de este ministerio.
            </div>
          ) : (
            <div className="mt-8 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
