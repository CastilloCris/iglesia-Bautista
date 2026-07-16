// src/pages/Library.jsx  (o Biblioteca.jsx según tu proyecto)
// Reemplazá tu página de biblioteca pública actual con este archivo.

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import BibliotecaCard from '../components/BibliotecaCard';
import FiltroCategorias from '../components/FiltroCategorias';
import PageHero from '../components/PageHero';

export default function Biblioteca() {
  const [libros, setLibros]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [busqueda, setBusqueda]   = useState('');
  const [categoria, setCategoria] = useState(''); // '' = todas

  // Cargar todos los libros activos una sola vez
  useEffect(() => {
    async function cargar() {
      setLoading(true);
      const { data, error } = await supabase
        .from('biblioteca')
        .select('*')
        .eq('activo', true)
        .order('titulo');

      if (!error) setLibros(data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  // Filtrar en cliente (rápido, sin roundtrip a Supabase)
  const librosFiltrados = useMemo(() => {
    return libros.filter((l) => {
      const coincideCategoria = categoria === '' || l.categoria === categoria;
      const q = busqueda.toLowerCase();
      const coincideBusqueda =
        q === '' ||
        l.titulo.toLowerCase().includes(q) ||
        l.autor.toLowerCase().includes(q);
      return coincideCategoria && coincideBusqueda;
    });
  }, [libros, categoria, busqueda]);

  return (
    <>
      <PageHero title="Biblioteca Digital" />

      <section className="bg-secondary min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Buscador */}
          <div className="relative max-w-md mx-auto mb-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-accent/40
                         focus:border-accent focus:ring-2 focus:ring-accent/20
                         outline-none bg-white text-carbon text-sm shadow-sm"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Filtro por categoría */}
          <FiltroCategorias categoriaActiva={categoria} onChange={setCategoria} />

          {/* Contador de resultados */}
          {!loading && (
            <p className="text-center text-muted text-xs mb-6">
              {librosFiltrados.length === 0
                ? 'Sin resultados'
                : `${librosFiltrados.length} libro${librosFiltrados.length !== 1 ? 's' : ''}`}
              {categoria && ` en "${categoria}"`}
              {busqueda && ` para "${busqueda}"`}
            </p>
          )}

          {/* Grid de libros */}
          {loading ? (
            <div className="text-center text-muted py-20">Cargando biblioteca...</div>
          ) : librosFiltrados.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📚</p>
              <p className="text-muted">No se encontraron libros con ese criterio.</p>
              <button
                onClick={() => { setBusqueda(''); setCategoria(''); }}
                className="mt-4 text-primary text-sm underline hover:no-underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {librosFiltrados.map((libro) => (
                <BibliotecaCard key={libro.id} libro={libro} />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
