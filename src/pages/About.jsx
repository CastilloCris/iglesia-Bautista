import PageHero from '../components/PageHero.jsx'

export default function About() {
  return (
    <>
      <PageHero title="Quiénes Somos" />
      <section className="container-page max-w-3xl px-5 py-16">
        <h3 className="mb-3 font-serif text-[1.8rem] text-beth-gold">Nuestra Historia</h3>
        <p className="leading-relaxed text-gray-300">
          La Iglesia Bautista Beth-El nace con el deseo de glorificar a Dios, predicar Su Palabra y servir a la comunidad,
          formando discípulos comprometidos con Jesucristo.
        </p>

        <h3 className="mb-3 mt-10 font-serif text-[1.8rem] text-beth-gold">Nuestra Misión</h3>
        <p className="leading-relaxed text-gray-300">Donde ser y hacer discípulos de Cristo, desde los hogares y hasta lo último de la tierra.</p>

        <h3 className="mb-3 mt-10 font-serif text-[1.8rem] text-beth-gold">Nuestra Visión</h3>
        <p className="leading-relaxed text-gray-300">
          Ser una iglesia que viva el Evangelio, crezca en comunión y sea un instrumento de transformación en la sociedad.
        </p>

        <h3 className="mb-3 mt-10 font-serif text-[1.8rem] text-beth-gold">Nuestros Valores</h3>
        <ul className="list-inside list-disc space-y-2 text-gray-300">
          <li>La Biblia como Palabra de Dios</li>
          <li>La oración como fundamento</li>
          <li>La comunidad cristiana</li>
          <li>El servicio y el amor al prójimo</li>
        </ul>
      </section>
    </>
  )
}
