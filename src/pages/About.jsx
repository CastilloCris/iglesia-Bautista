import PageHero from '../components/PageHero.jsx'

const distintivos = [
  {
    titulo: 'Autoridad bíblica',
    texto: 'La Biblia es la guía única y final para la fe y la práctica cristiana.',
  },
  {
    titulo: 'Autonomía local',
    texto: 'Cada iglesia es independiente y se autogobierna, sin depender de jerarquías externas.',
  },
  {
    titulo: 'Sacerdocio universal',
    texto: 'Todo creyente tiene acceso directo a Dios, sin necesidad de intermediarios humanos.',
  },
  {
    titulo: 'Bautismo del creyente',
    texto: 'Se practica solo por inmersión y únicamente en personas que ya han tomado una decisión consciente de fe, no en bebés.',
  },
  {
    titulo: 'Membresía regenerada',
    texto: 'La iglesia está compuesta exclusivamente por personas salvas y bautizadas.',
  },
  {
    titulo: 'Dos ordenanzas',
    texto: 'Solo reconocen el bautismo y la Cena del Señor (ambos de carácter simbólico).',
  },
  {
    titulo: 'Libertad religiosa',
    texto: 'Defienden el derecho de cada individuo a tener libertad de conciencia en asuntos de fe.',
  },
]

export default function About() {
  return (
    <>
      <PageHero title="Quiénes Somos" />
      {/* Fondo claro para toda la página */}
      <div className="min-h-screen bg-secondary">
      <section className="container-page max-w-3xl px-5 py-16">

        <h3 className="mb-3 font-serif text-[1.8rem] text-accent">Nuestra Historia</h3>
        <p className="leading-relaxed text-carbon">
          La naturaleza, como en toda la provincia, hace notar su presencia también aquí, 
          sobre todo a través de la selva. La historia de los inmigrantes europeos y países 
          vecinos, se puede encontrar en algún museo de la zona y casas típicas en el recorrido 
          por la Ruta 12, hacia el norte, región de la selva y de las Aguas Grandes. Iguazú.</p>
          <p className="leading-relaxed text-carbon">En un lugar espléndido, donde se percibe la fuerza de la naturaleza, rodeada de una
           vegetación agreste se encuentra <b>Wanda</b>, una localidad famosa por su mina de piedras 
           semipreciosas que afloran al ras del suelo, dejando ver sus geodas incrustadas en 
           las rocas de inconmensurable belleza.</p>
          <p className="leading-relaxed text-carbon">La buena semilla, la Santa Palabra de Dios también llegó hasta aquí y fue sembrada, 
          cayendo una buena parte en buen terreno produciendo su fruto para gloria y honra de Dios.</p>
        
        <p className="leading-relaxed text-carbon">Desde hace mucho tiempo se venía orando 
          por un obrero para esa zona, donde en los comienzos, muchos años atrás, el primero 
          que llega a ese lugar a lomo de caballo, para sembrar la Palabra de Dios, fue el 
          hermano colportor José Bolbin.
          Luego la Asociación de Iglesias realizaba visitas periódicas; hasta que, en el año
          1975, compra dos terrenos en el pueblo de Wanda y al año siguiente construye
          una casa para el misionero. Una vez concretada esta etapa, la Misión invita al
          hermano Juan Carlos Redczuk y su esposa Lía Kowalyszczyn para trabajar en
          esta localidad, ambos egresados del Instituto Bíblico de Temperley.
        </p>
        <br />
        <figure>
          <img src="public/img/nuestraHistoria/imagen 1.png" alt="A la izquierda los misioneros Juan Carlos Redczuk y su esposa Lía" />
          <figcaption className="text-muted mt-1 text-center font-serif">A la izquierda los misioneros Juan Carlos Redczuk y su esposa Lía</figcaption>
        </figure>
        <br />
        <p className="leading-relaxed text-carbon">
          La obra crece y el 13 de mayo de 1979, la congregación de Wanda se
          organiza en IGLESIA y se ordena al ministerio pastoral al misionero Juan
          Carlos Redczuk.</p>
        <p className="leading-relaxed text-carbon">A lo largo de los años el Señor bendijo su trabajo y pasaron por las aguas del
          bautismo más de 200 hermanos nuevos quienes depositaron su fe en la roca
          eterna de la salvación Jesucristo el Señor. Algunos quedaron en Wanda, otros se
          dispersaron por diferentes lugares en busca de trabajo y mejores medios de vida.</p>
          <p className="leading-relaxed text-carbon">Surgieron de esta iglesia nuevos obreros y pastores que Juan Carlos Redczuk
          menciona: Silvio Salinas, Miguel Bustamante, Oscar González y su esposa
          Liliana Andino, Ramón González y su esposa, Jorge González, Vicente Salinas y
          otros que surgieron de la membresía con distintos ministerios. También durante
          este período se construyó un templo con una capacidad de 200 personas.</p>

            <br />
        <figure>
          <img src="public/img/nuestraHistoria/imagen 1.png" alt="A la izquierda los misioneros Juan Carlos Redczuk y su esposa Lía" />
          <figcaption className="text-muted mt-1 text-center font-serif">A la izquierda los misioneros Juan Carlos Redczuk y su esposa Lía</figcaption>
        </figure>
        <br />
          <p className="leading-relaxed text-carbon">El pastor Juan Carlos Redczuk con su esposa Lía Kowalyszczyn y sus dos
          hijas: Rosalía y Mirna, permanecieron trabajando en Wanda 14 años,
          dedicando su vida a esta labor que fue fructífera.
          Luego continuaron el ministerio al cual Dios los llamó en otros lugares de la
          provincia y del país.
        </p>

        <h3 className="mb-3 mt-10 font-serif text-[1.8rem] text-accent">Nuestra Misión</h3>
        <p className="leading-relaxed text-carbon">Donde ser y hacer discípulos de Cristo, desde los hogares y hasta lo último de la tierra.</p>

        <h3 className="mb-3 mt-10 font-serif text-[1.8rem] text-accent">Nuestra Visión</h3>
        <p className="leading-relaxed text-carbon">
          Ser una iglesia que viva el Evangelio, crezca en comunión y sea un instrumento de transformación en la sociedad.
        </p>

        {/* ——— Distintivos Bautistas ——— */}
        <h3 className="mb-6 mt-10 font-serif text-[1.8rem] text-accent">Distintivos Bautistas</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {distintivos.map((d, i) => (
            <div
              key={i}
              className="rounded-xl border border-accent/40 hover:border-accent bg-white p-5 transition-all"
              style={{ boxShadow: '0 2px 12px rgba(184,134,11,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(184,134,11,0.22), 0 2px 8px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(184,134,11,0.12), 0 1px 4px rgba(0,0,0,0.06)'}
            >
              <h4 className="mb-1 font-serif text-[1.05rem] font-semibold text-primary">
                {d.titulo}
              </h4>
              <p className="text-sm leading-relaxed text-muted">{d.texto}</p>
            </div>
          ))}
        </div>

      </section>
      </div>
    </>
  )
}
