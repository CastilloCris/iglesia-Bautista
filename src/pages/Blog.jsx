import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { BLOG_TABLE } from '../lib/blog.js'
import BlogCard from '../components/BlogCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { useScrollAnimation, ANIM } from '../hooks/useScrollAnimation.js'

const statusCard = 'rounded-xl border border-accent/40 bg-white p-8 text-center text-muted shadow-sm'
const errorCard  = 'rounded-xl border border-red-300/50 bg-white p-8 text-center text-red-500 shadow-sm'

function BlogPostCard({ post, index }) {
  const [ref, visible] = useScrollAnimation(0.1)
  return (
    <div
      ref={ref}
      className={ANIM.fadeUp(visible)}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <BlogCard post={post} />
    </div>
  )
}

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

      <div className="min-h-screen bg-secondary">
        <section className="container-page section-pad">
          {loading && <SkeletonCard variant="row" count={3} />}

          {!loading && error && (
            <div className={errorCard}>No se pudieron cargar las entradas: {error}</div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className={statusCard}>Todavía no hay entradas publicadas.</div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogPostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}