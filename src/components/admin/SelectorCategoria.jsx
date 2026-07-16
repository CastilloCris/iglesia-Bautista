// src/components/admin/SelectorCategoria.jsx
// Selector de categoría para usar en el formulario de AdminBiblioteca.
//
// Props:
//   value    → string — valor actual (viene del estado del form)
//   onChange → fn(nuevoValor: string) — actualiza el estado del form
//
// Uso en AdminLibrary.jsx:
//   import SelectorCategoria from '../../components/admin/SelectorCategoria'
//   <SelectorCategoria value={form.categoria} onChange={(val) => setForm({ ...form, categoria: val })} />

import { useState, useEffect } from 'react';
import { LIBRARY_CATEGORIES } from '../../lib/library.js';

export default function SelectorCategoria({ value, onChange }) {
  // Determinar si el valor actual es "Otro" personalizado
  const esOtroPersonalizado =
    value !== '' &&
    !LIBRARY_CATEGORIES.slice(0, -1).includes(value); // no está en las fijas (excluye "Otro")

  const [mostrarInput, setMostrarInput] = useState(esOtroPersonalizado);
  const [inputOtro, setInputOtro]       = useState(esOtroPersonalizado ? value : '');

  // Sincronizar si el padre resetea el valor (ej: nuevo libro)
  useEffect(() => {
    const esPersonalizado =
      value !== '' && !LIBRARY_CATEGORIES.slice(0, -1).includes(value);
    setMostrarInput(esPersonalizado);
    setInputOtro(esPersonalizado ? value : '');
  }, [value]);

  function handleSelect(e) {
    const val = e.target.value;
    if (val === 'Otro') {
      setMostrarInput(true);
      setInputOtro('');
      onChange(''); // vacío hasta que escriba
    } else {
      setMostrarInput(false);
      setInputOtro('');
      onChange(val);
    }
  }

  function handleInputOtro(e) {
    const val = e.target.value;
    setInputOtro(val);
    onChange(val); // propagar al form padre
  }

  // Valor del <select>: si es personalizado mostramos "Otro" seleccionado
  const selectValue = mostrarInput ? 'Otro' : (value || '');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-accent">
        Categoría
      </label>

      <select
        value={selectValue}
        onChange={handleSelect}
        className="w-full border border-gray-300 rounded-lg p-3
                   focus:border-accent focus:ring-2 focus:ring-accent/20
                   outline-none bg-white text-carbon"
      >
        <option value="">— Seleccioná una categoría —</option>
        {LIBRARY_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat === 'Otro' ? 'Otro...' : cat}
          </option>
        ))}
      </select>

      {/* Input manual cuando eligen "Otro" */}
      {mostrarInput && (
        <div className="relative">
          <input
            type="text"
            placeholder="Escribí la categoría..."
            value={inputOtro}
            onChange={handleInputOtro}
            autoFocus
            className="w-full border border-accent/60 rounded-lg p-3 pl-4
                       focus:border-accent focus:ring-2 focus:ring-accent/20
                       outline-none bg-white text-carbon"
          />
          {/* Botón para volver al select */}
          <button
            type="button"
            onClick={() => {
              setMostrarInput(false);
              setInputOtro('');
              onChange('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-muted hover:text-primary text-xs underline"
          >
            cancelar
          </button>
        </div>
      )}

      {/* Hint visual */}
      {mostrarInput && inputOtro && (
        <p className="text-xs text-muted">
          Se guardará como: <span className="font-semibold text-primary">"{inputOtro}"</span>
        </p>
      )}
    </div>
  );
}
