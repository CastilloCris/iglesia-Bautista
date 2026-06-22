import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PageHero from '../components/PageHero.jsx'
import SectionTitle from '../components/SectionTitle.jsx'

export default function Cells() {
  const [celulas, setCelulas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCelulas() {
      const { data } = await supabase
        .from('celulas')
        .select('*')
        .eq('activo', true)
        .order('familia')
      setCelulas(data ?? [])
      setLoading(false)
    }
    loadCelulas()
  }, [])

  return (
    <>
      <PageHero title="Células" subtitle="Iglesias en las casas" />
      <section className="container-page px-5 py-16">
        <div className="text-center">
          <SectionTitle>Encuentra tu Célula</SectionTitle>
          <p className="-mt-8 text-gray-300">Busca la que esté más cerca de tu hogar.</p>
        </div>

        {loading && (
          <p className="mt-12 text-center text-gray-300">Cargando células...</p>
        )}

        {!loading && celulas.length === 0 && (
          <p className="mt-12 text-center text-gray-300">No hay células disponibles por el momento.</p>
        )}

        {!loading && celulas.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {celulas.map((celula) => (
              <article key={celula.id} className="card-professional p-8">
                {celula.foto_url ? (
                  <img
                    src={celula.foto_url}
                    alt={celula.familia}
                    className="mx-auto mb-5 h-[120px] w-[120px] rounded-full border-4 border-primary object-cover shadow-md"
                  />
                ) : (
                  <div className="mx-auto mb-5 flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 border-primary bg-beth-gold/20">
                    <span className="font-serif text-3xl font-bold text-beth-gold">
                      {celula.familia?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <h3 className="mb-3 font-serif text-2xl text-primary">{celula.familia}</h3>
                <p className="mb-2 text-gray-300">
                  <strong className="text-beth-gold">Barrio:</strong> {celula.barrio}
                </p>
                <p className="mb-4 text-gray-300">
                  <strong className="text-beth-gold">Reunión:</strong> {celula.dia_reunion}
                  {celula.hora_reunion && ` – ${celula.hora_reunion}`}
                </p>
                {celula.maps_url && (
                  <a
                    href={celula.maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn px-6 py-3 text-sm"
                  >
                    Ver Ubicación
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}