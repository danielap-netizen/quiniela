import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { NOMBRE_TORNEO } from '../lib/config'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/mis-predicciones')
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pitch-bg">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(22,163,74,0.15) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md animate-slide-up" style={{ animationFillMode: 'both' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-pitch-800 border border-pitch-600/30 flex items-center justify-center text-3xl mx-auto mb-4">
            ⚽
          </div>
          <h1 className="font-display font-extrabold text-3xl text-pitch-50 mb-1">Ingresar</h1>
          <p className="text-pitch-500 text-sm">{NOMBRE_TORNEO}</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-pitch-400 text-xs font-mono uppercase tracking-widest mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-pitch-400 text-xs font-mono uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : 'Ingresar →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-pitch-800/50 text-center">
            <p className="text-pitch-500 text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-pitch-400 hover:text-pitch-200 font-medium transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/tabla" className="text-pitch-600 hover:text-pitch-400 text-sm transition-colors">
            ← Ver tabla pública
          </Link>
        </div>
      </div>
    </div>
  )
}
