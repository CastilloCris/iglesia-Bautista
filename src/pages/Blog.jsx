import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { BLOG_TABLE } from '../lib/blog.js'
import BlogCard from '../components/BlogCard.jsx'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPosts() {
      const { data, error: requestError } = await supabase
        .from(BLOG_TABLE)
        .select('*')
        .eq('publicado', true)
        .order('created_at', { ascending: false })

      if (requestError) {
        setError(requestError.message)
      } else {
        setPosts(data ?? [])
      }

      setLoading(false)
    }

    loadPosts()
  }, [])

  return (
    <>
      <section className="page-hero">
        <h1 className="page-title">Blog</h1>
      </section>
      <section className="container-page section-pad">
        {loading && <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center text-gray-300 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>Cargando entradas...</div>}

        {!loading && error && (
          <div className="rounded-lg border-2 border-red-600/30 bg-beth-night p-8 text-center text-red-400 shadow-sm" style={{boxShadow: '0 2px 12px rgba(220, 38, 38, 0.2)'}}>No se pudieron cargar las entradas: {error}</div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center text-gray-300 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>Todíaa no hay entradas publicadas.</div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}