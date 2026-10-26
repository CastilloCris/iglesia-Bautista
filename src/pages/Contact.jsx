import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function enviarWhatsApp(nombre, email, mensaje) {
    const texto = `Hola, soy ${nombre}.\nEmail: ${email}\nMensaje: ${mensaje}`
    const telefono = '5493757505746'
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, '_blank')
  }

  function handleSubmit(event) {
    event.preventDefault()
    enviarWhatsApp(form.name, form.email, form.message)
  }

  const inputClass =
    'w-full rounded-lg border border-accent/30 bg-white p-3 text-carbon outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/20'

  const cardStyle = {
    border: '2px solid rgba(184,134,11,0.35)',
    boxShadow: '0 4px 24px rgba(184,134,11,0.12), 0 2px 8px rgba(0,0,0,0.06)',
  }

  return (
    <>
      <PageHero title="Contacto" />

      <div className="min-h-screen bg-secondary">
        <section className="container-page px-5 py-16">

          {/* Grid 2 columnas en desktop */}
          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">

            {/* ——— Columna izquierda: Formulario ——— */}
            <form
              onSubmit={handleSubmit}
              className="rounded-xl bg-white p-8 lg:p-10"
              style={cardStyle}
            >
              <h2 className="mb-6 font-serif text-2xl text-primary text-center">Escribinos</h2>

              <label className="mb-2 block font-semibold text-primary" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                className={inputClass}
                placeholder="Tu nombre completo"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <label className="mb-2 mt-5 block font-semibold text-primary" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                placeholder="tu@email.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <label className="mb-2 mt-5 block font-semibold text-primary" htmlFor="message">
                Mensaje
              </label>
              <textarea
                id="message"
                rows="5"
                className={inputClass}
                placeholder="¿En qué podemos ayudarte?"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <button type="submit" className="btn mt-6 w-full">
                Enviar mensaje
              </button>

              <p className="mt-4 text-center text-xs text-muted">
                Al enviar, se abrirá WhatsApp con tu mensaje listo.
              </p>
            </form>

            {/* ——— Columna derecha: Info + Mapa ——— */}
            <div className="flex flex-col gap-6">

              {/* Tarjeta de información */}
              <div className="rounded-xl bg-white p-8" style={cardStyle}>
                <h2 className="mb-6 font-serif text-2xl text-primary">Dónde encontrarnos</h2>

                {/* Dirección */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-2xl mt-0.5 flex-shrink-0">📍</span>
                  <div>
                    <p className="font-semibold text-primary">Dirección</p>
                    <p className="text-carbon">Wanda, Misiones, Argentina</p>
                    <a
                      href="https://maps.app.goo.gl/YpZELJsMpDkMxHaN8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:text-primary underline transition-colors"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-2xl mt-0.5 flex-shrink-0">📱</span>
                  <div>
                    <p className="font-semibold text-primary">WhatsApp</p>
                    <a
                      href="https://wa.me/5493757505746"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-carbon hover:text-primary transition-colors"
                    >
                      +54 9 3757 505746
                    </a>
                  </div>
                </div>

                {/* Horarios */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5 flex-shrink-0">🕐</span>
                  <div>
                    <p className="font-semibold text-primary mb-1">Horarios de reunión</p>
                    <p className="text-carbon text-sm">
                      Domingo – 19:30 hs
                      <span className="text-muted"> · Culto Principal</span>
                    </p>
                    <p className="text-carbon text-sm">
                      Sábado – 19:30 hs
                      <span className="text-muted"> · Reunión de Jóvenes</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa embebido */}
              <div
                className="rounded-xl overflow-hidden"
                style={cardStyle}
              >
                <iframe
                  title="Ubicación de Iglesia Bautista Beth-El"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d519.7873792988271!2d-54.5773898443362!3d-25.96845464731712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f6e2ee1759b411%3A0x8018270f2d579197!2sIglesia%20Bautista%20Beth-el!5e1!3m2!1ses!2sar!4v1782311797139!5m2!1ses!2sar"
                  width="100%"
                  height="280"
                  allowFullScreen
                  loading="lazy"
                  style={{ display: 'block' }}
                />
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  )
}
