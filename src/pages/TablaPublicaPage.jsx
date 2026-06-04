import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FECHA_CIERRE, PARTIDOS, NOMBRE_TORNEO } from '../lib/config'
import { useAuth } from '../lib/auth'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function Countdown({ fechaCierre }) {
  const [diff, setDiff] = useState(fechaCierre - new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setDiff(fechaCierre - new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [fechaCierre])

  if (diff <= 0) return null

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      {[
        { value: days, label: 'días' },
        { value: hours, label: 'horas' },
        { value: mins, label: 'min' },
        { value: secs, label: 'seg' },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="glass-card-dark rounded-xl px-4 py-3 min-w-[64px]">
            <span className="font-display font-extrabold text-3xl text-pitch-200 tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-pitch-600 text-xs font-mono mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  )
}

function ClosedView({ participantes }) {
  const [selected, setSelected] = useState(null)

  // Build matrix: participantes × partidos
  const phases = [...new Set(PARTIDOS.map(p => p.fase))]

  return (
    <div className="animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {participantes.map((p, i) => {
          const completadas = PARTIDOS.filter(m => p.predicciones[m.id]).length
          return (
            <button
              key={p.alias}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`glass-card rounded-2xl p-4 text-left transition-all duration-200 hover:border-pitch-400/30
                ${selected === i ? 'border-pitch-400/50 bg-pitch-800/20' : ''}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-pitch-800 flex items-center justify-center font-display font-bold text-sm text-pitch-300">
                  {i + 1}
                </div>
                <span className="font-display font-semibold text-sm text-pitch-200">{p.alias}</span>
              </div>
              <div className="text-xs font-mono text-pitch-500">
                {completadas}/{PARTIDOS.length} predicciones
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail table */}
      <div className="glass-card-dark rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pitch-800/50">
                <th className="text-left px-5 py-4 font-mono text-xs text-pitch-500 uppercase tracking-wider sticky left-0 bg-pitch-950/80 backdrop-blur-sm">
                  Partido
                </th>
                {participantes.map((p, i) => (
                  <th
                    key={p.alias}
                    className={`px-4 py-4 font-display text-xs text-pitch-400 whitespace-nowrap
                      ${selected === i ? 'text-pitch-200 bg-pitch-800/20' : ''}
                    `}
                  >
                    {p.alias}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {phases.map(fase => (
                <>
                  <tr key={`phase-${fase}`} className="bg-pitch-950/30">
                    <td
                      colSpan={participantes.length + 1}
                      className="px-5 py-2 text-xs font-mono text-pitch-600 uppercase tracking-widest"
                    >
                      {fase}
                    </td>
                  </tr>
                  {PARTIDOS.filter(m => m.fase === fase).map((match, ri) => (
                    <tr
                      key={match.id}
                      className={`border-b border-pitch-900/50 transition-colors hover:bg-pitch-900/20
                        ${ri % 2 === 0 ? '' : 'bg-pitch-950/20'}
                      `}
                    >
                      <td className="px-5 py-4 sticky left-0 bg-pitch-950/90 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{match.localFlag}</span>
                          <span className="text-pitch-500">vs</span>
                          <span className="text-lg">{match.visitanteFlag}</span>
                        </div>
                        <div className="text-xs text-pitch-600 font-mono mt-0.5">
                          {match.local} vs {match.visitante}
                        </div>
                      </td>
                      {participantes.map((p, i) => {
                        const pred = p.predicciones[match.id]
                        return (
                          <td
                            key={p.alias}
                            className={`px-4 py-4 text-center
                              ${selected === i ? 'bg-pitch-800/20' : ''}
                            `}
                          >
                            {pred ? (
                              <span className="font-mono font-bold text-pitch-200 tabular-nums">
                                {pred.goles_local}:{pred.goles_visitante}
                              </span>
                            ) : (
                              <span className="text-pitch-800 font-mono">–</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function TablaPublicaPage() {
  const { user } = useAuth()
  const [participantes, setParticipantes] = useState([])
  const [totalRegistrados, setTotalRegistrados] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isOpen = new Date() < FECHA_CIERRE

  useEffect(() => {
    const loadData = async () => {
      // Always get count of registered users
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      setTotalRegistrados(count || 0)

      if (!isOpen) {
        // Load all predictions and profiles for public view
        const [{ data: predsData, error: predsError }, { data: profilesData, error: profilesError }] =
          await Promise.all([
            supabase.from('predicciones').select('user_id, partido_id, goles_local, goles_visitante'),
            supabase.from('profiles').select('id, nombre'),
          ])

        if (predsError || profilesError) {
          setError('Error al cargar las predicciones: ' + (predsError?.message || profilesError?.message))
          setLoading(false)
          return
        }

        // Build a name lookup map
        const nombrePorId = {}
        profilesData.forEach(p => { nombrePorId[p.id] = p.nombre })

        // Group predictions by user
        const byUser = {}
        predsData.forEach(p => {
          if (!byUser[p.user_id]) byUser[p.user_id] = {}
          byUser[p.user_id][p.partido_id] = p
        })

        // Build list with real names, sorted by completeness desc
        const lista = Object.entries(byUser).map(([userId, preds]) => ({
          alias: nombrePorId[userId] || 'Participante',
          predicciones: preds,
        }))
        lista.sort((a, b) =>
          Object.keys(b.predicciones).length - Object.keys(a.predicciones).length
        )

        setParticipantes(lista)
      }
      setLoading(false)
    }

    loadData()
  }, [isOpen])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-pitch-400 text-xs font-mono uppercase tracking-widest mb-5">
          <span className="w-2 h-2 rounded-full bg-pitch-400 animate-pulse-slow inline-block" />
          {NOMBRE_TORNEO}
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-pitch-50 mb-3 leading-none">
          {isOpen ? 'Quiniela abierta' : 'Tabla de predicciones'}
        </h1>
        <p className="text-pitch-500 max-w-lg mx-auto text-sm">
          {isOpen
            ? `Registra tus predicciones antes del cierre. Actualmente ${totalRegistrados} participante${totalRegistrados !== 1 ? 's' : ''} registrado${totalRegistrados !== 1 ? 's' : ''}.`
            : `La quiniela ha cerrado. Aquí están todas las predicciones.`}
        </p>
      </div>

      {/* Open state */}
      {isOpen && (
        <div className="max-w-2xl mx-auto">
          {/* Countdown */}
          <div className="glass-card rounded-3xl p-8 text-center mb-8 animate-slide-up" style={{ animationFillMode: 'both' }}>
            <p className="text-pitch-500 text-xs font-mono uppercase tracking-widest mb-2">
              Cierra el
            </p>
            <p className="font-display font-bold text-xl text-pitch-200 mb-4">
              {format(FECHA_CIERRE, "EEEE d 'de' MMMM, HH:mm", { locale: es })}
            </p>
            <Countdown fechaCierre={FECHA_CIERRE} />
            <p className="text-pitch-600 text-xs font-mono mt-2">
              Después del cierre, las predicciones se publicarán automáticamente
            </p>
          </div>

          {/* CTA */}
          <div className="grid sm:grid-cols-2 gap-4">
            {user ? (
              <Link to="/mis-predicciones" className="btn-primary text-center block">
                ✏️ Editar mis predicciones
              </Link>
            ) : (
              <>
                <Link to="/registro" className="btn-gold text-center block">
                  🎯 Participar ahora
                </Link>
                <Link to="/login" className="btn-secondary text-center block">
                  Ya tengo cuenta →
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5 text-center">
              <div className="font-display font-extrabold text-4xl text-pitch-300 mb-1">
                {totalRegistrados}
              </div>
              <div className="text-pitch-600 text-xs font-mono uppercase tracking-wider">
                Participantes
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 text-center">
              <div className="font-display font-extrabold text-4xl text-pitch-300 mb-1">
                {PARTIDOS.length}
              </div>
              <div className="text-pitch-600 text-xs font-mono uppercase tracking-wider">
                Partidos
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Closed state */}
      {!isOpen && (
        <>
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-2 border-pitch-500/30 border-t-pitch-400 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-pitch-500 font-mono text-sm">Cargando tabla...</p>
            </div>
          ) : error ? (
            <div className="p-5 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          ) : participantes.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">📭</span>
              <p className="text-pitch-500">No hay predicciones registradas.</p>
            </div>
          ) : (
            <>
              {/* Closed banner */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                  <span className="text-3xl">🔒</span>
                  <div>
                    <p className="font-display font-semibold text-pitch-200">Quiniela cerrada</p>
                    <p className="text-pitch-500 text-xs font-mono">
                      Cerró el {format(FECHA_CIERRE, "d 'de' MMMM, HH:mm", { locale: es })} ·{' '}
                      {participantes.length} participantes
                    </p>
                  </div>
                </div>
              </div>

              {user && (
                <div className="max-w-2xl mx-auto mb-6">
                  <Link to="/mis-predicciones" className="btn-secondary text-sm block text-center">
                    Ver mis predicciones registradas
                  </Link>
                </div>
              )}

              <ClosedView participantes={participantes} />
            </>
          )}
        </>
      )}
    </div>
  )
}
