import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function enviarWhatsApp(nombre, email, mensaje) {
    const texto = `Hola, soy ${nombre}.\nEmail: ${email}\nMensaje: ${mensaje}`
    const telefono = '549XXXXXXXXXX'
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, '_blank')
  }

  function handleSubmit(event) {
    event.preventDefault()
    enviarWhatsApp(form.name, form.email, form.message)
  }

  const inputClass =
    'w-full rounded-lg border border-beth-gold/30 bg-beth-night p-3 text-gray-200 outline-none transition placeholder:text-gray-500 focus:border-beth-gold focus:ring-2 focus:ring-beth-gold/20'

  return (
    <>
      <PageHero title="Contacto" />
      <section className="container-page px-5 py-16">
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-lg border-2 border-beth-gold/30 bg-beth-night p-10" style={{boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)'}}>
          <label className="mb-2 block font-semibold text-beth-gold" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            className={inputClass}
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />

          <label className="mb-2 mt-5 block font-semibold text-beth-gold" htmlFor="email">
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

          <label className="mb-2 mt-5 block font-semibold text-beth-gold" htmlFor="message">
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

          <button type="submit" className="btn">
            Enviar mensaje
          </button>
        </form>
      </section>
    </>
  )
}
