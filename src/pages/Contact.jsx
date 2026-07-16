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

  return (
    <>
      <PageHero title="Contacto" />

      <div className="min-h-screen bg-secondary">
        <section className="container-page px-5 py-16">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-lg rounded-xl bg-white p-10"
            style={{
              border: '2px solid rgba(184,134,11,0.35)',
              boxShadow: '0 4px 24px rgba(184,134,11,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <h2 className="mb-6 font-serif text-2xl text-primary text-center">Escribinos</h2>

            <label className="mb-2 block font-semibold text-primary" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              className={inputClass}
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />

            <label className="mb-2 mt-5 block font-semibold text-primary" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClass}
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />

            <label className="mb-2 mt-5 block font-semibold text-primary" htmlFor="message">
              Mensaje
            </label>
            <textarea
              id="message"
              rows="5"
              className={inputClass}
              required
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
            />

            <button type="submit" className="btn mt-6 w-full">
              Enviar mensaje
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
