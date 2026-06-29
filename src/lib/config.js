import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { FECHA_CIERRE, NOMBRE_CORTO } from '../lib/config'
import { useState, useEffect } from 'react'

function StatusBadge() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const isOpen = now < FECHA_CIERRE
  const diff = FECHA_CIERRE - now

  if (!isOpen) {
    return (
      <div
        className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-widest"
        style={{
          background: 'rgba(244,167,185,0.10)',
          color: '#F4A7B9',
          border: '1px solid rgba(244,167,185,0.20)',
        }}
      >
        ELIMINATORIAS
      </div>
    )
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  return (
    <div
      className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-widest"
      style={{
        background: 'rgba(244,167,185,0.10)',
        color: '#F4A7B9',
        border: '1px solid rgba(244,167,185,0.20)',
      }}
    >
      {d > 0
        ? `${d}d ${h}h`
        : `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`}{' '}
      · GRUPOS
    </div>
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
    ...(user ? [{ to: '/octavos', label: '16avos', icon: '🏆' }] : []),
    { to: '/tabla-eliminatorias', label: 'Eliminatorias', icon: '🔥' },
    { to: '/partidos', label: 'Partidos', icon: '⚽' },
    { to: '/participantes', label: 'Participantes', icon: '' },
    ...(user ? [{ to: '/mis-predicciones', label: 'Mis picks', icon: '✏️' }] : []),
    { to: '/tabla', label: 'Grupos', icon: '' },
  ]

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#111F18' }}
    >
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: 'rgba(17,31,24,0.92)',
          borderColor: 'rgba(244,167,185,0.12)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link to="/octavos" className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black"
                  style={{
                    background: '#F4A7B9',
                    color: '#111F18',
                  }}
                >
                  Q
                </div>

                <div className="min-w-0">
                  <p
                    className="text-white font-black leading-none truncate"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {NOMBRE_CORTO}
                  </p>
                  <p className="text-white/35 text-xs leading-none mt-1">
                    Seguimos con la fase de eliminatorias
                  </p>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => {
                const active = location.pathname === l.to

                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      active ? 'text-white' : 'text-white/50 hover:text-white'
                    }`}
                    style={
                      active
                        ? { background: 'rgba(244,167,185,0.12)' }
                        : {}
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {l.icon}
                      {l.label}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <StatusBadge />

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold text-white/40 hover:text-[#F4A7B9] transition-colors"
                >
                  Salir →
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#F4A7B9]"
                >
                  Ingresar
                </Link>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          {menuOpen && (
            <div
              className="md:hidden pb-4 pt-2 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((l) => {
                  const active = location.pathname === l.to

                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        active ? 'text-white' : 'text-white/50'
                      }`}
                      style={
                        active
                          ? { background: 'rgba(244,167,185,0.12)' }
                          : {}
                      }
                    >
                      <span>{l.icon}</span>
                      <span>{l.label}</span>
                    </Link>
                  )
                })}

                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-white/40"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-[#F4A7B9]"
                  >
                    Ingresar →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer
        className="border-t py-6"
        style={{ borderColor: 'rgba(244,167,185,0.10)' }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-white/30 text-xs">
            Mundial 2026 · Familia Pereyra Fernández · Seguimos con la fase de eliminatorias
          </p>
        </div>
      </footer>
    </div>
  )
}
