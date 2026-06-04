import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

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
    e.preventDefault(); setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('Contraseña mínimo 6 caracteres.'); return }
    if (nombre.trim().length < 2) { setError('Ingresa tu nombre.'); return }
    setLoading(true)
    try {
      await signUp(email, password, nombre.trim())
      setSuccess(true)
      setTimeout(() => navigate('/mis-predicciones'), 1800)
    } catch (err) {
      setError(err.message.includes('already registered') ? 'Este correo ya está registrado.' : err.message)
    } finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4 pitch-bg">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>¡Ya estás adentro!</h2>
        <p className="text-white/50">Redirigiendo a tus predicciones...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pitch-bg py-12">
      <div className="fixed inset-0 glow-top pointer-events-none"/>
      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚽</div>
          <h1 className="font-display text-4xl font-bold text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>Únete a la quiniela</h1>
          <p className="text-white/40 text-sm">Mundial 2026 · Familia Pereyra Fernández</p>
        </div>
        <div className="glass-card rounded-3xl p-8">
          {error && <div className="mb-5 p-4 rounded-xl text-sm" style={{background:'rgba(255,100,100,0.1)',border:'1px solid rgba(255,100,100,0.25)',color:'#ff8080'}}>{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              {label:'Tu nombre',val:nombre,set:setNombre,type:'text',ph:'¿Cómo te llamas?',hint:'Solo tú y el admin ven tu nombre real.'},
              {label:'Correo electrónico',val:email,set:setEmail,type:'email',ph:'tu@email.com'},
              {label:'Contraseña',val:password,set:setPassword,type:'password',ph:'Mínimo 6 caracteres'},
              {label:'Confirmar contraseña',val:confirm,set:setConfirm,type:'password',ph:'Repite la contraseña'},
            ].map(({label,val,set,type,ph,hint}) => (
              <div key={label}>
                <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{color:'rgba(244,167,185,0.6)'}}>{label}</label>
                <input type={type} required value={val} onChange={e=>set(e.target.value)} placeholder={ph} className="input-field"/>
                {hint && <p className="mt-1.5 text-xs text-white/30">{hint}</p>}
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 rounded-full animate-spin" style={{border:'2px solid rgba(17,31,24,0.3)',borderTopColor:'#111F18'}}/>Un momento...</span> : '¡Quiero participar! →'}
            </button>
          </form>
          <div className="mt-6 pt-6 text-center" style={{borderTop:'1px solid rgba(244,167,185,0.08)'}}>
            <p className="text-white/40 text-sm">¿Ya tienes cuenta? <Link to="/login" className="font-semibold" style={{color:'#F4A7B9'}}>Ingresar</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
