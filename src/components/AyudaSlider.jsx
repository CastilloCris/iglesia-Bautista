import { useState, useEffect, useCallback } from 'react';

const SLIDES = [
  { src: '/img/ayuda-1.jpeg', alt: 'Necesitás ayuda - versión 1' },
  { src: '/img/ayuda-2.jpeg', alt: 'Necesitás ayuda - versión 2' },
  { src: '/img/ayuda-3.jpeg', alt: 'Necesitás ayuda - versión 3' },
];

const WHATSAPP_NUMBER = '5493757505746'; // formato: 549 + número sin 0
const WHATSAPP_MSG    = encodeURIComponent('Hola, vi la página de la iglesia y quisiera recibir ayuda.');

export default function AyudaSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % SLIDES.length);
  }, []);

  const prev = () => {
    setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);
  };

  // Auto-avance cada 4 segundos
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section className="bg-secondary py-10 px-4">

      {/* Slider */}
      <div
        className="relative mx-auto max-w-sm overflow-hidden rounded-2xl shadow-lg border border-accent/30"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Imágenes */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <img
              key={i}
              src={slide.src}
              alt={slide.alt}
              className="w-full flex-shrink-0 object-cover"
              style={{ aspectRatio: '9/16', maxHeight: '480px', objectPosition: 'top' }}
            />
          ))}
        </div>

        {/* Botón anterior */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
          aria-label="Anterior"
        >
          ‹
        </button>

        {/* Botón siguiente */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
          aria-label="Siguiente"
        >
          ›
        </button>

        {/* Indicadores de punto */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'bg-accent w-4' : 'bg-white/60 w-2'
              }`}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Texto introductorio */}
      <div className="text-center mt-6">
        <p className="text-muted text-sm uppercase tracking-widest font-semibold mb-1">
          Estamos para vos
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-primary">
          ¿Necesitás hablar con alguien?
        </h2>
        <p className="text-carbon mt-2 text-base">
          Comunicate con nosotros, estamos dispuestos a escucharte.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-8 py-3 bg-[#25D366] text-white font-bold rounded-full shadow hover:bg-[#1ebe5d] hover:scale-105 transition-all text-sm uppercase tracking-wide"
        >
          {/* Ícono WhatsApp SVG inline */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.849L.057 23.077a.75.75 0 0 0 .921.921l5.228-1.467A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 0 1-4.952-1.354l-.355-.211-3.685 1.034 1.034-3.685-.211-.355A9.726 9.726 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
          Escribinos al WhatsApp
        </a>
      </div>

    </section>
  );
}
