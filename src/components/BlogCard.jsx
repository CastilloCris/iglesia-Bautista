import { Link } from 'react-router-dom'
import { formatPostDate, getPostDate } from '../lib/blog.js'

export default function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="flex gap-4 rounded-xl bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md border border-accent/40 hover:border-accent"
    >
      {/* Imagen thumbnail pequeña */}
      {post.imagen_url && (
        <img
          src={post.imagen_url}
          alt={post.titulo}
          className="h-20 w-20 flex-shrink-0 rounded-l-xl object-cover"
        />
      )}
      {/* Texto */}
      <div className="flex min-w-0 flex-col justify-between py-3 pr-3">
        <h3 className="font-serif text-base leading-snug line-clamp-2 text-primary">
          {post.titulo}
        </h3>
        {post.resumen && (
          <p className="mt-1 line-clamp-2 text-xs text-muted">{post.resumen}</p>
        )}
        <span className="mt-1 text-xs text-muted/70">
          {formatPostDate(getPostDate(post))}
        </span>
      </div>
    </Link>
  )
}
