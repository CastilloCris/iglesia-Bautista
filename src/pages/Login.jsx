import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import useAuth from '../hooks/useAuth.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!authLoading && user) {
      navigate(location.state?.from?.pathname ?? '/admin', { replace: true })
    }
  }, [authLoading, location.state?.from?.pathname, navigate, user])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate(location.state?.from?.pathname ?? '/admin', { replace: true })
  }

  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-secondary px-5 py-16">
      <div className="w-full max-w-md">
        {/* Logo / encabezado */}
        <div className="mb-8 text-center">
          <img src="/logo_iglesia.png" alt="Logo Iglesia Bautista Beth-El" className="mx-auto h-20 w-auto object-contain" />
          <h1 className="mt-5 font-serif text-3xl font-bold text-primary">Panel Administrativo</h1>
          <p className="mt-2 text-muted">Ingresá con tu usuario de Supabase Auth.</p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-10"
          style={{
            border: '2px solid rgba(184,134,11,0.35)',
            boxShadow: '0 4px 24px rgba(184,134,11,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <label className="block text-sm font-bold text-primary" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-input mt-2"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label className="mt-5 block text-sm font-bold text-primary" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="form-input mt-2"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && (
            <p className="mt-4 rounded-md border border-red-300/50 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button type="submit" className="btn mt-6 w-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </section>
  )
}
