import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { FECHA_CIERRE, NOMBRE_CORTO } from '../lib/config'
import { useState, useEffect } from 'react'

function StatusBadge() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const isOpen = now < FECHA_CIERRE
  const diff = FECHA_CIERRE - now
  if (!isOpen) return <span className="badge-closed"><span className="w-1.5 h-1.5 rounded-full bg-current inline-block"/>CERRADA</span>
  const d = Math.floor(diff/(1000*60*60*24))
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60))
  const m = Math.floor((diff%(1000*60*60))/(1000*60))
  const s = Math.floor((diff%(1000*60))/1000)
  return (
    <span className="badge-open">
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse"/>
      {d > 0 ? `${d}d ${h}h` : `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`} · ABIERTA
    </span>
  )
}

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/login') }

  const navLinks = [
    { to: '/tabla', label: 'Inicio', icon: '🏆' },
    { to: '/partidos', label: 'Partidos', icon: '⚽' },
    { to: '/participantes', label: 'Participantes', icon: '👥' },
    ...(user ? [{ to: '/mis-predicciones', label: 'Mis picks', icon: '✏️' }] : []),
  ]

  return (
    <div className="min-h-screen pitch-bg relative">
      <div className="fixed inset-0 glow-top pointer-events-none z-0"/>

      <nav className="sticky top-0 z-50 glass-card-dark" style={{borderBottom:'1px solid rgba(244,167,185,0.08)'}}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/tabla" className="flex items-center gap-3 group">
              <span className="text-2xl">🌍</span>
              <span className="font-display font-bold text-xl text-white hidden sm:block" style={{fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:'0.02em'}}>
                {NOMBRE_CORTO}
              </span>
              <span className="font-display font-bold text-lg text-white sm:hidden" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>
                Mundial 2026
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <StatusBadge />
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                    ${location.pathname === l.to
                      ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                  style={location.pathname === l.to ? {background:'rgba(244,167,185,0.12)'} : {}}>
                  <span>{l.icon}</span>{l.label}
                </Link>
              ))}
              {user
                ? <button onClick={handleSignOut} className="ml-1 text-sm font-semibold text-white/40 hover:text-white/70 transition-colors px-3 py-2">Salir →</button>
                : <Link to="/login" className="ml-2 btn-primary text-sm py-2 px-5">Ingresar</Link>
              }
            </div>

            <button className="md:hidden p-2 rounded-lg text-white/50 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden px-4 pb-3 space-y-1" style={{borderTop:'1px solid rgba(244,167,185,0.08)'}}>
            <div className="py-2"><StatusBadge /></div>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-colors
                  ${location.pathname === l.to ? 'text-white' : 'text-white/50'}`}
                style={location.pathname === l.to ? {background:'rgba(244,167,185,0.12)'} : {}}>
                <span>{l.icon}</span>{l.label}
              </Link>
            ))}
            {user
              ? <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="w-full text-left px-4 py-3 text-sm font-semibold text-white/40">Cerrar sesión</button>
              : <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-[#F4A7B9]">Ingresar →</Link>
            }
          </div>
        )}
      </nav>

      <main className="relative z-10">{children}</main>

      <footer className="mt-16 py-8 text-center" style={{borderTop:'1px solid rgba(244,167,185,0.06)'}}>
        <p className="text-white/20 text-xs font-mono">Mundial 2026 · Familia Pereyra Fernández · Predicciones cierran 11 jun · 12:00 CDMX</p>
      </footer>
    </div>
  )
}
