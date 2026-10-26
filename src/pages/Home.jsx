import { useEffect, useRef, Link as _Link } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'
import CelulasSlider from '../components/CelulasSlider.jsx'
import { useScrollAnimation, ANIM } from '../hooks/useScrollAnimation.js'

const crossPattern =
  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237C3D12' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

const features = [
  { title: 'Bíblia',    text: 'Enseñanza centrada en la Palabra de Dios.',   image: '/img/biblia.png'    },
  { title: 'Comunidad', text: 'Unidos en amor fraternal y compañerismo.',    image: '/img/comunidad.png' },
  { title: 'Oración',   text: 'Buscando el rostro de Dios juntos.',          image: '/img/oracion.png'   },
]

function FeatureItem({ feature, index }) {
  const [ref, visible] = useScrollAnimation(0.1)
  return (
    <article
      ref={ref}
      className={`max-w-[250px] text-center ${ANIM.fadeUp(visible)}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <img src={feature.image} alt={feature.title} className="mx-auto mb-3 h-16 w-16 object-contain drop-shadow transition hover:scale-110" />
      <h3 className="mb-1 font-serif text-xl text-primary">{feature.title}</h3>
      <p className="text-[0.95rem] text-muted">{feature.text}</p>
    </article>
  )
}

function MeetingCard({ titulo, horario, index }) {
  const [ref, visible] = useScrollAnimation(0.1)
  return (
    <article
      ref={ref}
      className={`card-professional ${ANIM.fadeUp(visible)}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <h3 className="mb-3 font-serif text-[1.5rem] text-primary">{titulo}</h3>
      <p className="text-[1.1rem] font-semibold text-muted">{horario}</p>
    </article>
  )
}

// ——— Hook de parallax ———
// Mueve el fondo a la mitad de la velocidad del scroll → efecto de profundidad
function useParallax(speed = 0.4) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respeta prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    function onScroll() {
      const rect = el.getBoundingClientRect()
      // Offset relativo al viewport; mueve desde arriba hasta abajo de la sección
      const offset = rect.top * speed
      el.style.backgroundPositionY = `calc(35% + ${offset}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return ref
}

export default function Home() {
  const [bienvenidaRef, bienvenidaVisible]   = useScrollAnimation(0.1)
  const [misionRef, misionVisible]           = useScrollAnimation(0.1)
  const [misionImgRef, misionImgVisible]     = useScrollAnimation(0.1)
  const [esperamosRef, esperamosVisible]     = useScrollAnimation(0.1)
  const [teEsperamosRef, teEsperamosVisible] = useScrollAnimation(0.1)

  // A1 — parallax en el panel izquierdo del hero
  const heroParallaxRef = useParallax(0.35)

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative w-full flex flex-col md:flex-row md:h-screen">

        {/* IZQUIERDA — parallax aplicado al fondo */}
        <div
          ref={heroParallaxRef}
          className="relative w-full md:w-[70%] h-screen md:h-full flex flex-col justify-between md:justify-center items-center md:items-end bg-cover bg-[position:14%_35%] md:bg-center px-6 py-20 md:py-0 md:pr-16"
          style={{ backgroundImage: "url('/img/hero-inicio.png')" }}
        >
          <div className="absolute inset-0 bg-black/25" />

          <div className="relative z-10 text-center md:text-right max-w-2xl animate-fadeInUp w-full h-full flex flex-col justify-between md:justify-center md:h-auto">

            {/* Título */}
            <div className="md:mb-5">
              <h1
                className="font-serif text-[2.2rem] md:text-6xl text-white font-bold leading-tight"
                style={{ textShadow: '0 0 8px rgba(212,160,23,0.9), 0 0 20px rgba(212,160,23,0.5), 0 3px 10px rgba(0,0,0,0.6)' }}
              >
                Iglesia Bautista<br className="md:hidden" /> Beth-El
              </h1>
            </div>

            {/* Subtítulo + separador */}
            <div className="flex flex-col items-center md:items-end">
              <p
                className="font-serif italic text-lg md:text-2xl text-white drop-shadow leading-snug"
                style={{ textShadow: '0 0 6px rgba(212,160,23,0.8), 0 0 14px rgba(212,160,23,0.4), 0 2px 6px rgba(0,0,0,0.5)' }}
              >
                Buscamos una relación con Dios<br />
                (Oración, Biblia y Comunidad)
              </p>
              <span className="hidden md:block w-16 h-[3px] bg-accent mt-4 rounded-full" />

              {/* Indicador de scroll — solo mobile */}
              <div className="mt-8 flex flex-col items-center gap-1 md:hidden">
                <span className="text-white/60 text-xs tracking-widest uppercase">Deslizá</span>
                <svg className="w-5 h-5 text-white/60 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* DIVISOR */}
        <div className="w-full h-[3px] md:w-[3px] md:h-full bg-gradient-to-r md:bg-gradient-to-b from-transparent via-accent to-transparent flex-shrink-0" />

        {/* DERECHA — panel WhatsApp */}
        <div
          className="relative w-full md:w-[30%] h-screen md:h-full overflow-hidden group cursor-pointer"
          onClick={() => window.open('https://wa.me/5493757505746?text=Hola%2C%20vi%20la%20p%C3%A1gina%20y%20quisiera%20recibir%20ayuda.', '_blank')}
        >
          <img
            src="/img/ayuda-2.jpeg"
            alt="¿Necesitás ayuda?"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <a
              href="https://wa.me/5493757505746?text=Hola%2C%20vi%20la%20p%C3%A1gina%20y%20quisiera%20recibir%20ayuda."
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white font-bold rounded-full shadow-xl hover:bg-[#1ebe5d] hover:scale-105 transition-all text-sm uppercase tracking-wide"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.849L.057 23.077a.75.75 0 0 0 .921.921l5.228-1.467A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 0 1-4.952-1.354l-.355-.211-3.685 1.034 1.034-3.685-.211-.355A9.726 9.726 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
              </svg>
              Escribinos al WhatsApp
            </a>
            <p className="text-white/80 text-xs mt-2 tracking-wide drop-shadow">Estamos para escucharte</p>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center md:group-hover:opacity-0 transition-opacity duration-300 hidden md:flex">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-white text-xs font-medium tracking-wide">¿Necesitás ayuda?</span>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Bienvenida ——— */}
      <section
        className="relative overflow-hidden px-5 py-20 text-center bg-secondary"
        style={{ borderTop: '2px solid #B8860B', borderBottom: '2px solid #B8860B' }}
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(184,134,11,0.08) 0%, transparent 70%)' }} />
        <div className="container-page relative z-10">
          <div ref={bienvenidaRef} className={ANIM.fadeUp(bienvenidaVisible)}>
            <SectionTitle>Bienvenidos</SectionTitle>
            <span className="mt-2 block font-serif text-[1.1rem] italic text-accent">
              "Yo me alegré con los que me decían: A la casa de Jehová iremos." — Salmos 122:1
            </span>
          </div>

          <div className="mb-10 mt-12 flex flex-wrap justify-center gap-10">
            {features.map((feature, i) => (
              <FeatureItem key={feature.title} feature={feature} index={i} />
            ))}
          </div>

          <div ref={esperamosRef} className={ANIM.fadeUp(esperamosVisible)}>
            <Link
              to="/quienes-somos"
              className="inline-block rounded-full border-2 border-accent px-10 py-3 font-bold uppercase tracking-wide text-accent transition hover:-translate-y-1 hover:bg-accent hover:text-white"
              style={{ boxShadow: '0 0 15px rgba(184,134,11,0.15)' }}
            >
              Conoce más sobre nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* ——— Nuestra Misión ——— */}
      <section
        className="relative overflow-hidden py-24 text-white"
        style={{ background: 'linear-gradient(135deg, #7C3D12 0%, #5D2E08 100%)', borderTop: '2px solid #B8860B', borderBottom: '2px solid #B8860B' }}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("${crossPattern}")` }} />
        <div className="container-page relative z-10 flex flex-col-reverse items-center justify-between gap-16 text-center md:flex-row md:text-left">
          <div ref={misionRef} className={`flex-1 ${ANIM.fadeLeft(misionVisible)}`}>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent-light mb-2">Propósito</p>
            <h2 className="font-serif text-[2.2rem] font-semibold text-white mb-4">Nuestra Misión</h2>
            <p className="mb-7 font-serif text-[1.4rem] italic leading-snug text-white/90 md:text-[1.8rem]">
              "Donde ser y hacer discípulos de Cristo, desde los hogares y hasta lo último de la tierra."
            </p>
            <span className="inline-block rounded-full border border-accent/50 bg-accent/10 px-4 py-2 text-xs uppercase tracking-widest text-accent-light">
              Mateo 28:19-20
            </span>
          </div>
          <div ref={misionImgRef} className={`flex flex-1 justify-center ${ANIM.fadeRight(misionImgVisible)}`}>
            <img src="/img/comunidad.png" alt="Misión Iglesia Bautista" className="max-w-[220px] animate-float drop-shadow-2xl md:max-w-[300px]" />
          </div>
        </div>
      </section>

      {/* ——— Células ——— */}
      <CelulasSlider />

      {/* ——— Nuestras Reuniones ——— */}
      <section className="py-20 bg-white" style={{ borderBottom: '2px solid #B8860B' }}>
        <div className="container-page">
          <SectionTitle>Nuestras Reuniones</SectionTitle>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
            <MeetingCard titulo="Culto Principal" horario="Domingo – 20:00 hs" index={0} />
            <MeetingCard titulo="Reunión de Jóvenes" horario="Sábado – 19:30 hs" index={1} />
          </div>
        </div>
      </section>

      {/* ——— Te esperamos ——— */}
      <section className="px-5 py-16 text-center bg-secondary" style={{ borderTop: '2px solid #B8860B' }}>
        <div ref={teEsperamosRef} className={ANIM.fadeUp(teEsperamosVisible)}>
          <h2 className="font-serif text-[2.5rem] text-primary">Te esperamos</h2>
          <p className="mt-3 text-muted">Queremos conocerte y caminar juntos en la fe.</p>
          <Link to="/contacto" className="btn">Contáctanos</Link>
        </div>
      </section>
    </>
  )
}
