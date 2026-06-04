import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await signIn(email, password); navigate('/mis-predicciones') }
    catch (err) { setError(err.message.includes('Invalid') ? 'Email o contraseña incorrectos.' : err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pitch-bg">
      <div className="fixed inset-0 glow-top pointer-events-none"/>
      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="font-display text-4xl font-bold text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>Ingresar</h1>
          <p className="text-white/40 text-sm">Quiniela Mundial 2026</p>
        </div>
        <div className="glass-card rounded-3xl p-8">
          {error && <div className="mb-5 p-4 rounded-xl text-sm" style={{background:'rgba(255,100,100,0.1)',border:'1px solid rgba(255,100,100,0.25)',color:'#ff8080'}}>{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{color:'rgba(244,167,185,0.6)'}}>Correo electrónico</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" className="input-field"/>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{color:'rgba(244,167,185,0.6)'}}>Contraseña</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="input-field"/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 rounded-full animate-spin" style={{border:'2px solid rgba(17,31,24,0.3)',borderTopColor:'#111F18'}}/>Ingresando...</span> : 'Ingresar →'}
            </button>
          </form>
          <div className="mt-6 pt-6 text-center" style={{borderTop:'1px solid rgba(244,167,185,0.08)'}}>
            <p className="text-white/40 text-sm">¿No tienes cuenta? <Link to="/registro" className="font-semibold transition-colors" style={{color:'#F4A7B9'}}>Regístrate</Link></p>
          </div>
        </div>
        <div className="mt-5 text-center">
          <Link to="/tabla" className="text-sm text-white/30 hover:text-white/60 transition-colors">← Ver quiniela</Link>
        </div>
      </div>
    </div>
  )
}
