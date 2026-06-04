import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { NOMBRE_TORNEO } from '../lib/config'

export default function RegisterPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (nombre.trim().length < 2) {
      setError('Ingresa tu nombre completo.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, nombre.trim())
      setSuccess(true)
      // Auto-redirect after 2s
      setTimeout(() => navigate('/mis-predicciones'), 2500)
    } catch (err) {
      if (err.message.includes('already registered')) {
        setError('Este correo ya está registrado. Intenta ingresar.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pitch-bg">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-pitch-600/30 border border-pitch-500/30 flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="font-display font-bold text-2xl text-pitch-50 mb-2">¡Registro exitoso!</h2>
          <p className="text-pitch-400">Redirigiendo a tus predicciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pitch-bg py-12">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(22,163,74,0.15) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md animate-slide-up" style={{ animationFillMode: 'both' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-pitch-800 border border-pitch-600/30 flex items-center justify-center text-3xl mx-auto mb-4">
            🎯
          </div>
          <h1 className="font-display font-extrabold text-3xl text-pitch-50 mb-1">Crear cuenta</h1>
          <p className="text-pitch-500 text-sm">{NOMBRE_TORNEO}</p>
        </div>

        <div className="glass-card rounded-3xl p-8">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-pitch-400 text-xs font-mono uppercase tracking-widest mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="input-field"
              />
              <p className="mt-1.5 text-pitch-600 text-xs">
                Este nombre es privado. En la tabla pública aparecerás como "Participante N".
              </p>
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-pitch-400 text-xs font-mono uppercase tracking-widest mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-pitch-900/30 border-t-pitch-900 rounded-full animate-spin" />
                  Registrando...
                </span>
              ) : 'Unirme a la quiniela →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-pitch-800/50 text-center">
            <p className="text-pitch-500 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-pitch-400 hover:text-pitch-200 font-medium transition-colors">
                Ingresar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
