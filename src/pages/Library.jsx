import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { LIBRARY_TABLE, sanitizeSupabaseOrQuery } from '../lib/library.js'
import BibliotecaCard from '../components/BibliotecaCard.jsx'

export default function Library() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadBooks(query)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  async function loadBooks(searchQuery) {
    setLoading(true)
    setError('')

    const cleanQuery = sanitizeSupabaseOrQuery(searchQuery)
    let request = supabase.from(LIBRARY_TABLE).select('*').eq('activo', true).order('titulo')

    if (cleanQuery) {
      request = request.or(`titulo.ilike.%${cleanQuery}%,autor.ilike.%${cleanQuery}%`)
    }

    const { data, error: requestError } = await request

    if (requestError) {
      setError(requestError.message)
      setBooks([])
    } else {
      setBooks(data ?? [])
    }

    setLoading(false)
  }

  return (
    <>
      <section className="page-hero">
        <h1 className="page-title">Biblioteca Digital</h1>
        <p className="mx-auto mt-5 max-w-2xl text-beth-ivory/75">
          Recursos de lectura, formación y acompañamiento para la comunidad.
        </p>
      </section>

      <section className="container-page section-pad">
        <div className="mb-10">
          <label className="block text-sm font-bold text-beth-gold" htmlFor="library-search">
            Buscar por título o autor
          </label>
          <input
            id="library-search"
            className="form-input mt-2 max-w-xl"
            placeholder="Ej: Teología, Spurgeon, devocional..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {loading && <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center text-gray-300 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>Cargando biblioteca...</div>}

        {!loading && error && (
          <div className="rounded-lg border-2 border-red-600/30 bg-beth-night p-8 text-center text-red-400 shadow-sm" style={{boxShadow: '0 2px 12px rgba(220, 38, 38, 0.2)'}}>No se pudo cargar la biblioteca: {error}</div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="rounded-lg border-2 border-beth-gold/30 bg-beth-night p-8 text-center text-gray-300 shadow-sm" style={{boxShadow: '0 2px 12px rgba(212, 175, 55, 0.2)'}}>No se encontraron libros.</div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BibliotecaCard key={book.id} libro={book} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}