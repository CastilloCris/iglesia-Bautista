import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'

const crossPattern =
  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

const features = [
  { title: 'Bíblia', text: 'Enseñanza centrada en la Palabra de Dios.', image: '/img/biblia.png' },
  { title: 'Comunidad', text: 'Unidos en amor fraternal y compañerismo.', image: '/img/comunidad.png' },
  { title: 'Oración', text: 'Buscando el rostro de Dios juntos.', image: '/img/oracion.png' },
]

export default function Home() {
  return (
    <>
      <section className="hero-section relative flex h-screen min-h-[100dvh] items-center justify-center overflow-hidden bg-cover px-5 pr-[5%] text-center md:justify-end md:text-center" style={{ backgroundImage: 'url("/img/ChatGPT Image 6 feb 2026, 14_43_58.png")', backgroundPosition: 'center 30%' }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-[95dvh] max-w-[700px] animate-fadeInUp flex-col justify-between py-6 md:mr-[5%] md:block md:h-auto md:p-5">
          <h1 className="font-serif text-[2.2rem] font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] md:mb-5 md:text-[3.8rem]">
            Iglesia Bautista Beth-El
          </h1>
          <p className="mb-[20vh] font-serif text-base italic leading-snug text-white/95 drop-shadow-md md:mb-0 md:text-[1.8rem]">
            Buscamos una relación con Dios
            <br />
            (Oración, Biblia y Comunidad)
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-20 text-center" style={{background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f0f 100%)', borderTop: '2px solid #d4af37', borderBottom: '2px solid #d4af37'}}>
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full" style={{background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'}} />
        <div className="container-page relative z-10">
          <SectionTitle>Bienvenidos</SectionTitle>
          <span className="mt-2 block font-serif text-[1.1rem] italic text-beth-gold">
            "Yo me alegré con los que me decían: A la casa de Jehová iremos." — Salmos 122:1
          </span>

          <div className="mb-10 mt-12 flex flex-wrap justify-center gap-10">
            {features.map((feature) => (
              <article key={feature.title} className="max-w-[250px] text-center">
                <img src={feature.image} alt={feature.title} className="mx-auto mb-3 h-16 w-16 object-contain drop-shadow transition hover:scale-110" />
                <h3 className="mb-1 font-serif text-xl text-beth-gold">{feature.title}</h3>
                <p className="text-[0.95rem] text-gray-300">{feature.text}</p>
              </article>
            ))}
          </div>

          <Link to="/quienes-somos" className="inline-block rounded-full border-2 border-beth-gold px-10 py-3 font-bold uppercase tracking-wide text-beth-gold transition hover:-translate-y-1 hover:bg-beth-gold hover:text-black" style={{boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'}}>
            Conoce más sobre nosotros
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 text-white" style={{background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)', borderTop: '2px solid #d4af37', borderBottom: '2px solid #d4af37'}}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("${crossPattern}")` }} />
        <div className="container-page relative z-10 flex flex-col-reverse items-center justify-between gap-16 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <SectionTitle align="left" light>
              Nuestra Misión
            </SectionTitle>
            <p className="mb-7 font-serif text-[1.4rem] italic leading-snug text-beth-gold md:text-[1.8rem]">
              "Donde ser y hacer discípulos de Cristo, desde los hogares y hasta lo último de la tierra."
            </p>
            <span className="inline-block rounded-full border border-beth-gold/30 bg-beth-gold/10 px-4 py-2 text-xs uppercase tracking-widest text-beth-gold">
              Mateo 28:19-20
            </span>
          </div>
          <div className="flex flex-1 justify-center">
            <img src="/img/comunidad.png" alt="Misión Iglesia Bautista" className="max-w-[220px] animate-float drop-shadow-2xl md:max-w-[300px]" />
          </div>
        </div>
      </section>

      <section className="px-5 py-20 text-center" style={{background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f0f 100%)', borderTop: '2px solid #d4af37', borderBottom: '2px solid #d4af37'}}>
        <div className="container-page">
          <h2 className="font-serif text-[2.5rem] text-beth-gold">Células</h2>
          <span className="mb-8 block text-[1.2rem] text-beth-goldSoft">Las iglesias en las casas</span>
          <p className="text-gray-300">Descubre un grupo pequeño cerca de ti donde crecer en fe y comunidad.</p>
          <Link to="/celulas" className="btn">
            Ver cuál está más cerca de tu casa
          </Link>
        </div>
      </section>

      <section className="py-20" style={{background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)', borderBottom: '2px solid #d4af37'}}>
        <div className="container-page">
          <SectionTitle>Nuestras Reuniones</SectionTitle>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
            <article className="card-professional">
              <h3 className="mb-3 font-serif text-[1.5rem] text-beth-gold">Culto Principal</h3>
              <p className="text-[1.1rem] font-semibold text-gray-300">Domingo – 20:00 hs</p>
            </article>
            <article className="card-professional">
              <h3 className="mb-3 font-serif text-[1.5rem] text-beth-gold">Reunión de Jóvenes</h3>
              <p className="text-[1.1rem] font-semibold text-gray-300">Sábado – 19:30 hs</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 text-center" style={{background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f0f 100%)', borderTop: '2px solid #d4af37'}}>
        <h2 className="font-serif text-[2.5rem] text-beth-gold">Te esperamos</h2>
        <p className="mt-3 text-beth-goldSoft">Queremos conocerte y caminar juntos en la fe.</p>
        <Link to="/contacto" className="btn">
          Contáctanos
        </Link>
      </section>
    </>
  )
}