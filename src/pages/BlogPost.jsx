import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { BLOG_TABLE, formatPostDate, getPostDate, getVideoEmbedUrl, isStorageVideo } from '../lib/blog.js'

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
      <section className="container-page section-pad">
        <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center text-gray-300 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>Cargando entrada...</div>
      </section>
    )
  }

  if (error || !post) {
    return (
      <section className="container-page section-pad">
        <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>
          <h1 className="font-serif text-3xl font-bold text-beth-gold">Entrada no encontrada</h1>
          {error && <p className="mt-3 text-red-400">{error}</p>}
          <Link to="/blog" className="btn mt-6">
            Volver al blog
          </Link>
        </div>
      </section>
    )
  }

  const embedUrl = getVideoEmbedUrl(post.video_url)

  return (
    <>
      <section className="page-hero">
        <p className="section-kicker">{formatPostDate(getPostDate(post))}</p>
        <h1 className="page-title mt-3">{post.titulo}</h1>
        {post.resumen && <p className="mx-auto mt-5 max-w-3xl text-lg text-beth-ivory/75">{post.resumen}</p>}
      </section>

      <article className="container-page section-pad">
        <div className="mx-auto max-w-4xl">
          {post.imagen_url && <img src={post.imagen_url} alt={post.titulo} className="mb-8 aspect-video w-full rounded-lg object-cover shadow-glow" />}

          {post.video_url && (
            <div className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-black shadow-glow">
              {isStorageVideo(post.video_url, post.video_tipo) ? (
                <video src={post.video_url} className="aspect-video w-full" controls>
                  <track kind="captions" />
                </video>
              ) : embedUrl ? (
                <iframe title={post.titulo} src={embedUrl} className="aspect-video w-full" allowFullScreen />
              ) : (
                <a href={post.video_url} className="block p-5 text-beth-gold" target="_blank" rel="noreferrer">
                  Ver video
                </a>
              )}
            </div>
          )}

          <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.15)'}}>
            <div className="whitespace-pre-line text-lg leading-relaxed text-gray-300">{post.contenido}</div>
            <Link to="/blog" className="btn btn-outline mt-8">
              Volver al blog
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
