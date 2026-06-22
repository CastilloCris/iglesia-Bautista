import PageHero from '../components/PageHero.jsx'
import SectionTitle from '../components/SectionTitle.jsx'

const meetings = [
  ['Culto Principal', 'Domingo – 10:00 hs'],
  ['Reunión de Oración', 'Miércoles – 19:30 hs'],
  ['Escuela Bíblica', 'Domingo – 9:00 hs'],
]

export default function Meetings() {
  return (
    <>
      <PageHero title="Nuestras Reuniones" />
      <section className="container-page px-5 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {meetings.map(([title, time]) => (
            <article key={title} className="card-professional">
              <h3 className="mb-3 font-serif text-[1.5rem] text-beth-gold">{title}</h3>
              <p className="text-[1.1rem] font-semibold text-gray-300">{time}</p>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <SectionTitle>Cómo llegar</SectionTitle>
          <iframe
            title="Ubicación de Iglesia Bautista Beth-El"
            src="https://maps.app.goo.gl/baYcC2wLcqGBUCub9"
            width="100%"
            height="350"
            className="mt-6 rounded-lg border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>
    </>
  )
}
