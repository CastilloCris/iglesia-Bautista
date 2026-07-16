import PageHero from '../components/PageHero.jsx'
import SectionTitle from '../components/SectionTitle.jsx'

const meetings = [
  ['Culto Principal', 'Domingo – 19:30 hs'],
  ['Culto de Jovenes', 'Sabados – 19:30 hs'],
  ['Escuela Bíblica', 'Domingo – 9:00 hs'],
]

export default function Meetings() {
  return (
    <>
      <PageHero title="Nuestras Reuniones" />
      <div className="min-h-screen bg-secondary">
      <section className="container-page px-5 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {meetings.map(([title, time]) => (
            <article key={title} className="card-professional">
              <h3 className="mb-3 font-serif text-[1.5rem] text-primary">{title}</h3>
              <p className="text-[1.1rem] font-semibold text-muted">{time}</p>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <SectionTitle>Cómo llegar</SectionTitle>
          <iframe
            title="Ubicación de Iglesia Bautista Beth-El"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d519.7873792988271!2d-54.5773898443362!3d-25.96845464731712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f6e2ee1759b411%3A0x8018270f2d579197!2sIglesia%20Bautista%20Beth-el!5e1!3m2!1ses!2sar!4v1782311797139!5m2!1ses!2sar"
            width="100%"
            height="350"
            className="mt-6 rounded-xl border border-accent/30 shadow-sm"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </section>
      </div>
    </>
  )
}
