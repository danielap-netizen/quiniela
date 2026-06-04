import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { FECHA_CIERRE, NOMBRE_TORNEO } from '../lib/config'
import { useState } from 'react'

function CountdownBadge() {
  const now = new Date()
  const isOpen = now < FECHA_CIERRE
  const diff = FECHA_CIERRE - now

  if (!isOpen) {
    return (
      <span className="badge-closed">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        CERRADA
      </span>
    )
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <span className="badge-open">
      <span className="w-1.5 h-1.5 rounded-full bg-pitch-400 inline-block animate-pulse" />
      {days > 0 ? `${days}d ${hours}h` : `${hours}h ${mins}m`} · ABIERTA
    </span>
  )
}

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navLinks = [
    { to: '/tabla', label: 'Tabla pública', icon: '🏆' },
    ...(user ? [{ to: '/mis-predicciones', label: 'Mis predicciones', icon: '✏️' }] : []),
  ]

  return (
    <div className="min-h-screen pitch-bg relative">
      {/* Radial glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(22,163,74,0.12) 0%, transparent 70%)' }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card-dark border-b border-pitch-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/tabla" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-pitch-600 flex items-center justify-center text-base group-hover:bg-pitch-500 transition-colors">
                ⚽
              </div>
              <span className="font-display font-bold text-lg text-pitch-50 hidden sm:block leading-none">
                {NOMBRE_TORNEO.split(' ').slice(0, 2).join(' ')}
              </span>
              <span className="font-display font-bold text-lg text-pitch-50 sm:hidden leading-none">
                Quiniela
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              <CountdownBadge />
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-medium transition-all duration-200
                    ${location.pathname === link.to
                      ? 'bg-pitch-700/60 text-pitch-100'
                      : 'text-pitch-400 hover:text-pitch-200 hover:bg-pitch-800/40'
                    }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display font-medium text-pitch-500 hover:text-pitch-300 hover:bg-pitch-800/40 transition-all duration-200"
                >
                  Salir →
                </button>
              ) : (
                <Link
                  to="/login"
                  className="ml-2 btn-primary text-sm py-2"
                >
                  Ingresar
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-pitch-400 hover:text-pitch-200 hover:bg-pitch-800/40 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-pitch-800/50 px-4 py-3 space-y-1">
            <div className="pb-2">
              <CountdownBadge />
            </div>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-display font-medium transition-colors
                  ${location.pathname === link.to
                    ? 'bg-pitch-700/60 text-pitch-100'
                    : 'text-pitch-400 hover:text-pitch-200 hover:bg-pitch-800/40'
                  }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false) }}
                className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-display font-medium text-pitch-500 hover:text-pitch-300 hover:bg-pitch-800/40 transition-colors"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-display font-medium text-pitch-400 hover:text-pitch-200"
              >
                Ingresar →
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-pitch-900/50 mt-16 py-8 text-center">
        <p className="text-pitch-700 text-xs font-mono">
          {NOMBRE_TORNEO} · Cierre {FECHA_CIERRE.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </footer>
    </div>
  )
}
