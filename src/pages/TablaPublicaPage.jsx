import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FECHA_CIERRE, PARTIDOS, NOMBRE_TORNEO } from '../lib/config'
import { useAuth } from '../lib/auth'
import { descargarCalendario } from '../lib/calendario'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function Countdown({ fechaCierre }) {
  const [diff, setDiff] = useState(fechaCierre - new Date())
  useEffect(() => { const t = setInterval(() => setDiff(fechaCierre - new Date()), 1000); return () => clearInterval(t) }, [fechaCierre])
  if (diff <= 0) return null
  const d = Math.floor(diff/(1000*60*60*24))
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60))
  const m = Math.floor((diff%(1000*60*60))/(1000*60))
  const s = Math.floor((diff%(1000*60))/1000)
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      {[{v:d,l:'días'},{v:h,l:'horas'},{v:m,l:'min'},{v:s,l:'seg'}].map(({v,l}) => (
        <div key={l} className="text-center">
          <div className="glass-card rounded-xl px-4 py-3 min-w-[62px]">
            <span className="font-bold text-4xl text-white tabular-nums" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{String(v).padStart(2,'0')}</span>
          </div>
          <span className="text-xs font-mono mt-1 block" style={{color:'rgba(244,167,185,0.5)'}}>{l}</span>
        </div>
      ))}
    </div>
  )
}

export default function TablaPublicaPage() {
  const { user } = useAuth()
  const [participantes, setParticipantes] = useState([])
  const [resultados, setResultados] = useState({})
  const [totalReg, setTotalReg] = useState(0)
  const [loading, setLoading] = useState(true)
  const isOpen = new Date() < FECHA_CIERRE

  const load = useCallback(async () => {
    const { count } = await supabase.from('profiles').select('*',{count:'exact',head:true})
    setTotalReg(count || 0)

    const { data: resData } = await supabase.from('resultados').select('partido_id, resultado')
    const resMap = {}; (resData || []).forEach(r => { resMap[r.partido_id] = r.resultado }); setResultados(resMap)

    if (!isOpen) {
      const [{ data: predsData }, { data: profilesData }] = await Promise.all([
        supabase.from('predicciones').select('user_id, partido_id, resultado'),
        supabase.from('profiles').select('id, nombre')
      ])
      const nombreMap = {}; (profilesData || []).forEach(p => { nombreMap[p.id] = p.nombre })
      const byUser = {}
      ;(predsData || []).forEach(p => {
        if (!byUser[p.user_id]) byUser[p.user_id] = {}
        byUser[p.user_id][p.partido_id] = p.resultado
      })
      const lista = Object.entries(byUser).map(([uid, preds]) => {
        let pts = 0
        Object.entries(preds).forEach(([pid, pred]) => { if (resMap[pid] && resMap[pid] === pred) pts++ })
        return { nombre: nombreMap[uid] || 'Participante', preds, pts }
      })
      lista.sort((a,b) => b.pts - a.pts)
      setParticipantes(lista)
    }
    setLoading(false)
  }, [isOpen])

  useEffect(() => {
    load()
    const onVisible = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', load)
    const intervalo = setInterval(load, 30000)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', load)
      clearInterval(intervalo)
    }
  }, [load])

  const recentPts = participantes.filter(p => p.pts > 0).slice(0,3)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8 animate-fade-in">
        <div className="text-5xl mb-4">🌍</div>
        <div className="inline-flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl mb-4 text-xs font-mono uppercase tracking-widest" style={{background:'rgba(244,167,185,0.08)',border:'1px solid rgba(244,167,185,0.15)',color:'rgba(244,167,185,0.7)'}}>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{background:'#F4A7B9'}}/>
            Mundial 2026
          </span>
          <span>Familia Pereyra Fernández</span>
        </div>
        <h1 className="font-bold leading-none text-white mb-3" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'clamp(2.5rem,6vw,4rem)'}}>
          {isOpen ? 'Quiniela abierta' : 'Tabla de puntos'}
        </h1>
        <p className="text-white/40 max-w-lg mx-auto">
          {isOpen
            ? `¡Ya hay ${totalReg} ${totalReg === 1 ? 'participante' : 'participantes'}! Registra tus picks antes del cierre.`
            : 'La quiniela cerró. Así van los puntos.'}
        </p>
      </div>

      {isOpen && (
        <div className="max-w-xl mx-auto">
          <div className="glass-card rounded-3xl p-8 text-center mb-6 animate-slide-up">
            <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{color:'rgba(244,167,185,0.5)'}}>Predicciones cierran el</p>
            <p className="font-bold text-2xl text-white mb-2" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>
              {new Intl.DateTimeFormat('es-MX',{timeZone:'America/Mexico_City',weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',hour12:false}).format(FECHA_CIERRE)} CDMX
            </p>
            <Countdown fechaCierre={FECHA_CIERRE}/>
            <p className="text-xs text-white/25 mt-2">1 hora antes del partido inaugural México 🇲🇽 vs Sudáfrica 🇿🇦</p>
          </div>

          <div className="glass-card rounded-3xl p-7 mb-6" style={{border:'1px solid rgba(244,167,185,0.12)'}}>
            <h2 className="font-bold text-2xl text-white mb-2" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>¿De qué va esto?</h2>
            <p className="text-white/55 leading-relaxed text-sm mb-4">
              Por tercer Mundial consecutivo, la familia Pereyra Fernández los invita a compartir cada partido juntos — aunque sea desde lejos. 🎉
            </p>
            <p className="text-white/55 leading-relaxed text-sm mb-4">
              Simple: predice si gana el local, hay empate o gana la visita en cada partido de la fase de grupos. <span style={{color:'rgba(244,167,185,0.8)'}}>1 punto por cada acierto.</span>
            </p>
            <p className="text-white/55 leading-relaxed text-sm">
              Y si nos picamos como pasó en el Mundial pasado... seguimos con octavos, cuartos, semis y final. Por ahora, que gane el mejor quinielas. 🏆
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {user
              ? <Link to="/mis-predicciones" className="btn-primary text-center block py-3.5">✏️ Mis picks</Link>
              : <Link to="/registro" className="btn-primary text-center block py-3.5">⚽ Participar</Link>
            }
            <Link to="/partidos" className="btn-secondary text-center block py-3.5">📅 Ver partidos</Link>
          </div>

          <button onClick={descargarCalendario} className="btn-secondary w-full text-center block py-3.5 mb-6">
            🗓️ Agregar los 72 partidos a mi calendario
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/participantes" className="glass-card rounded-2xl p-5 text-center block transition-all hover:scale-[1.02]">
              <div className="font-bold text-5xl text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{totalReg}</div>
              <div className="text-xs uppercase tracking-wider font-mono" style={{color:'rgba(244,167,185,0.7)'}}>Participantes →</div>
            </Link>
            <div className="glass-card rounded-2xl p-5 text-center">
              <div className="font-bold text-5xl text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>72</div>
              <div className="text-xs text-white/35 uppercase tracking-wider font-mono">Partidos</div>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 rounded-full animate-spin mx-auto" style={{border:'2px solid rgba(244,167,185,0.2)',borderTopColor:'#F4A7B9'}}/>
            </div>
          ) : (
            <>
              {recentPts.length > 0 && (
                <div className="max-w-xl mx-auto mb-8">
                  <div className="glass-card rounded-2xl p-5" style={{border:'1px solid rgba(244,167,185,0.15)'}}>
                    <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{color:'rgba(244,167,185,0.5)'}}>🔥 Lideran la quiniela</p>
                    {recentPts.map((p,i) => (
                      <div key={p.nombre} className="flex items-center justify-between py-2" style={{borderTop: i>0 ? '1px solid rgba(244,167,185,0.06)' : 'none'}}>
                        <span className="font-semibold text-white">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {p.nombre}</span>
                        <span className="font-bold text-lg" style={{fontFamily:"'Barlow Condensed',sans-serif",color:'#F4A7B9'}}>{p.pts} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {participantes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-white/40">No hay predicciones registradas.</p>
                </div>
              ) : (
                <div className="glass-card-dark rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{borderBottom:'1px solid rgba(244,167,185,0.08)'}}>
                          <th className="text-left px-5 py-4 text-xs font-mono uppercase tracking-wider sticky left-0" style={{color:'rgba(244,167,185,0.4)',background:'rgba(15,32,22,0.9)'}}>Participante</th>
                          <th className="px-4 py-4 text-xs font-mono uppercase tracking-wider" style={{color:'rgba(244,167,185,0.4)'}}>Pts</th>
                          {PARTIDOS.slice(0,20).map(m => (
                            <th key={m.id} className="px-2 py-4 text-xs font-mono" style={{color:'rgba(244,167,185,0.3)',minWidth:'52px'}}>
                              {m.localFlag}{m.visitanteFlag}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {participantes.map((p,i) => (
                          <tr key={p.nombre} style={{borderBottom:'1px solid rgba(244,167,185,0.05)',background: i%2===0 ? 'transparent' : 'rgba(244,167,185,0.02)'}}>
                            <td className="px-5 py-3 sticky left-0 font-semibold text-white" style={{background: i%2===0 ? 'rgba(15,32,22,0.85)' : 'rgba(17,28,21,0.85)'}}>
                              {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : `${i+1}. `}{p.nombre}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-lg" style={{fontFamily:"'Barlow Condensed',sans-serif",color:'#F4A7B9'}}>{p.pts}</td>
                            {PARTIDOS.slice(0,20).map(m => {
                              const pred = p.preds[m.id]
                              const res = resultados[m.id]
                              const correct = pred && res && pred === res
                              return (
                                <td key={m.id} className="px-2 py-3 text-center font-mono text-xs">
                                  <span style={{
                                    color: correct ? '#F4A7B9' : pred ? 'rgba(240,240,238,0.4)' : 'rgba(244,167,185,0.15)',
                                    fontFamily:"'Barlow Condensed',sans-serif",
                                    fontSize:'0.95rem',
                                    fontWeight: correct ? '700' : '400'
                                  }}>{pred || '–'}</span>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {PARTIDOS.length > 20 && <p className="text-center text-xs py-3" style={{color:'rgba(244,167,185,0.25)'}}>Mostrando primeros 20 partidos · Todos los puntos están calculados</p>}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
