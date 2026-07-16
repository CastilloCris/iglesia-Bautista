import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { BLOG_TABLE, formatPostDate, getPostDate, getVideoEmbedUrl, isStorageVideo } from '../lib/blog.js'

const statusCard = 'rounded-xl border border-accent/40 bg-white p-8 text-center text-muted shadow-sm'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      const { data, error: requestError } = await supabase
        .from(BLOG_TABLE)
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .maybeSingle()

      if (requestError) {
        setError(requestError.message)
      } else {
        setPost(data)
      }

      setLoading(false)
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <section className="container-page section-pad">
          <div className={statusCard}>Cargando entrada...</div>
        </section>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-secondary">
        <section className="container-page section-pad">
          <div className={statusCard}>
            <h1 className="font-serif text-3xl font-bold text-primary">Entrada no encontrada</h1>
            {error && <p className="mt-3 text-red-500">{error}</p>}
            <Link to="/blog" className="btn mt-6">
              Volver al blog
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const embedUrl = getVideoEmbedUrl(post.video_url)

  return (
    <>
      <section className="page-hero">
        <p className="section-kicker">{formatPostDate(getPostDate(post))}</p>
        <h1 className="page-title mt-3">{post.titulo}</h1>
        {post.resumen && <p className="mx-auto mt-5 max-w-3xl text-lg text-white/80">{post.resumen}</p>}
      </section>

      <div className="min-h-screen bg-secondary">
        <article className="container-page section-pad">
          <div className="mx-auto max-w-4xl">
            {post.imagen_url && (
              <img
                src={post.imagen_url}
                alt={post.titulo}
                className="mb-8 aspect-video w-full rounded-xl object-cover shadow-md border border-accent/20"
              />
            )}

            {post.video_url && (
              <div className="mb-8 overflow-hidden rounded-xl border border-accent/30 bg-white shadow-sm">
                {isStorageVideo(post.video_url, post.video_tipo) ? (
                  <video src={post.video_url} className="aspect-video w-full" controls>
                    <track kind="captions" />
                  </video>
                ) : embedUrl ? (
                  <iframe title={post.titulo} src={embedUrl} className="aspect-video w-full" allowFullScreen />
                ) : (
                  <a href={post.video_url} className="block p-5 text-accent font-semibold" target="_blank" rel="noreferrer">
                    Ver video
                  </a>
                )}
              </div>
            )}

            {/* Card contenido */}
            <div
              className="rounded-xl border border-accent/40 bg-white p-8"
              style={{ boxShadow: '0 2px 16px rgba(184,134,11,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div className="whitespace-pre-line text-lg leading-relaxed text-carbon">{post.contenido}</div>
              <Link to="/blog" className="btn btn-outline mt-8">
                Volver al blog
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
