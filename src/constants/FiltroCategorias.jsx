// src/components/FiltroCategorias.jsx
// Componente de filtro por categoría para la página pública /biblioteca
// Uso:
//   <FiltroCategorias categoriaActiva={categoria} onChange={setCategoria} />

import { CATEGORIAS, TODAS } from '../constants/categoriasBiblioteca';

export default function FiltroCategorias({ categoriaActiva, onChange }) {
  const opciones = [TODAS, ...CATEGORIAS.filter(c => c.value !== 'Otro')];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {opciones.map((cat) => {
        const activo = categoriaActiva === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold border transition-all
              ${activo
                ? 'bg-primary text-white border-primary shadow-md scale-105'
                : 'bg-white text-primary border-accent/40 hover:border-accent hover:bg-accent/5'
              }
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
