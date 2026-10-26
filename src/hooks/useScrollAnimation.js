import { useEffect, useRef, useState } from 'react'

/**
 * useScrollAnimation — dispara una clase CSS cuando el elemento entra en viewport.
 *
 * Uso:
 *   const [ref, visible] = useScrollAnimation()
 *   <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
 *
 * @param {number} threshold  — qué fracción del elemento debe ser visible (0–1). Default 0.15
 * @param {string} rootMargin — margen extra antes de disparar. Default '0px'
 */
export function useScrollAnimation(threshold = 0.15, rootMargin = '0px') {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el) // solo dispara una vez
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, visible]
}

/**
 * Classes de animación listas para usar con useScrollAnimation.
 * Importalas junto con el hook:
 *   import { useScrollAnimation, ANIM } from '../hooks/useScrollAnimation'
 */
export const ANIM = {
  // Sube desde abajo (para cards, secciones)
  fadeUp: (visible) =>
    `transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`,

  // Aparece desde la izquierda
  fadeLeft: (visible) =>
    `transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`,

  // Aparece desde la derecha
  fadeRight: (visible) =>
    `transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`,

  // Solo fade (sin movimiento)
  fade: (visible) =>
    `transition-opacity duration-700 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`,
}
