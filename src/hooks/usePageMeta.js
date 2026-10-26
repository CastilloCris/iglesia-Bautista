// Hook para actualizar el <title> y la <meta description> por página
// Uso: usePageMeta('Título de la página', 'Descripción opcional')
import { useEffect } from 'react'

const BASE_TITLE = 'Iglesia Bautista Beth-El — Wanda, Misiones'
const BASE_DESC  = 'Buscamos una relación con Dios basada en la oración, la Biblia y la comunidad. Te esperamos en Wanda, Misiones.'

export default function usePageMeta(title, description) {
  useEffect(() => {
    // Título
    document.title = title
      ? `${title} · ${BASE_TITLE}`
      : BASE_TITLE

    // Meta description
    const desc = description || BASE_DESC
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', desc)

    // Open Graph
    const setOg = (prop, val) => {
      let el = document.querySelector(`meta[property="${prop}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.setAttribute('content', val)
    }
    setOg('og:title', title ? `${title} · ${BASE_TITLE}` : BASE_TITLE)
    setOg('og:description', desc)

    // Restaurar al desmontar
    return () => {
      document.title = BASE_TITLE
      metaDesc?.setAttribute('content', BASE_DESC)
    }
  }, [title, description])
}
