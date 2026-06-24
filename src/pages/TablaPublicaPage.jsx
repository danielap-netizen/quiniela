import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FECHA_CIERRE, PARTIDOS, GRUPOS } from '../lib/config'
import { useAuth } from '../lib/auth'
import { descargarCalendario } from '../lib/calendario'

function nombreCorto(nombre) {
  const partes = String(nombre || 'Participante').trim().split(/\s+/)
  return partes.slice(0, 2)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
}

function unirNombres(lista) {
  const ns = lista.map(nombreCorto)
  if (ns.length === 0) return ''
  if (ns.length === 1) return ns[0]
  if (ns.length === 2) return `${ns[0]} y ${ns[1]}`
  return `${ns.slice(0, -1).join(', ')} y ${ns[ns.length - 1]}`
}

async function leerTodo(tabla, columnas) {
  let todas = []
  let desde = 0
  const tam = 1000
  while (true) {
    const { data, error } = await supabase.from(tabla).select(columnas).range(desde, desde + tam - 1)
    if (error || !data || data.length === 0) break
    todas = todas.concat(data)
    if (data.length < tam) break
    desde += tam
  }
  return todas
}

function barajar(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function fraseNarracion(p, res, aciertos, total) {
  const esEmpate = res.resultado === 'E'
  const ganador = res.resultado === 'L' ? p.local : res.resultado === 'V' ? p.visitante : null
  let titulo = esEmpate ? '¡Repartición de puntos! Terminó en empate. 🤝' : `¡Ganó ${ganador}! ⚽`
  let sub
  if (total === 0) sub = ''
  else if (aciertos === 0) sub = '¡Nadie lo vio venir! Cero aciertos en este. 😅'
  else if (aciertos === total) sub = '¡Toda la familia le atinó! 🎯'
  else if (aciertos <= total * 0.3) sub = 'Sorpresa para muchos 😮'
  else if (aciertos >= total * 0.7) sub = '¡La familia lo veía venir!'
  else sub = 'Estuvo dividido el pronóstico.'
  return { titulo, sub }
}

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

function Podio({ participantes }) {
  const porPuntaje = {}
  participantes.forEach(p => {
    if (!porPuntaje[p.pts]) porPuntaje[p.pts] = []
    porPuntaje[p.pts].push(p.nombre)
  })
  const puntajes = Object.keys(porPuntaje).map(Number).sort((a,b) => b - a).slice(0, 3)
  if (puntajes.length === 0) return null

  const escalon = (idx) => {
    const pts = puntajes[idx]
    if (pts == null) return null
    return { pts, nombres: porPuntaje[pts] }
  }
  const oro = escalon(0), plata = escalon(1), bronce = escalon(2)

  const alturas = ['96px', '60px', '46px']
  const fondos = ['rgba(244,167,185,0.85)', 'rgba(244,167,185,0.25)', 'rgba(244,167,185,0.12)']
  const medallas = ['🥇', '🥈', '🥉']

  const campeones = oro.nombres
  let frase
  if (campeones.length === 1) frase = <>🎉 <span style={{color:'#F8C5D3',fontWeight:600}}>{nombreCorto(campeones[0])}</span> se corona campeón con <span style={{color:'#F8C5D3'}}>{oro.pts} aciertos</span>.</>
  else frase = <>🎉 ¡<span style={{color:'#F8C5D3',fontWeight:600}}>{unirNombres(campeones)}</span> comparten el título con <span style={{color:'#F8C5D3'}}>{oro.pts} aciertos</span> cada uno!</>

  const orden = [{ e: plata, i: 1 }, { e: oro, i: 0 }, { e: bronce, i: 2 }]

  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="glass-card rounded-3xl p-6" style={{border:'1px solid rgba(244,167,185,0.2)'}}>
        <div className="text-center mb-5">
          <div className="text-4xl">🏆</div>
          <div className="text-2xl text-white font-bold" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>
            {campeones.length > 1 ? '¡Empate en la cima!' : '¡Tenemos campeón!'}
          </div>
          <div className="text-xs font-mono" style={{color:'rgba(244,167,185,0.6)'}}>Fase de grupos · Mundial 2026</div>
        </div>

        <div className="flex items-end justify-center gap-2 mb-4">
          {orden.map(({ e, i }) => e && (
            <div key={i} className="flex-1 text-center">
              <div className="text-2xl">{medallas[i]}</div>
              <div className="text-white text-xs font-medium my-1 leading-tight" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>
                {e.nombres.map((n, k) => <div key={k}>{nombreCorto(n)}</div>)}
              </div>
              <div className="text-xs font-mono" style={{color:'#F8C5D3'}}>{e.pts} pts</div>
              <div style={{background:fondos[i], borderRadius:'8px 8px 0 0', height:alturas[i], marginTop:6, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:8}}>
                <span style={{color: i===0?'#111F18':'#fff', fontWeight: i===0?700:500, fontSize:i===0?'24px':'20px', fontFamily:"'Barlow Condensed',sans-serif"}}>{i+1}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4 text-center" style={{background:'rgba(244,167,185,0.06)'}}>
          <p className="text-sm m-0" style={{color:'rgba(255,255,255,0.7)', lineHeight:1.6}}>{frase}</p>
        </div>
      </div>
    </div>
  )
}

function VistaDestapada({ predsPorPartido }) {
  const [grupoActivo, setGrupoActivo] = useState('A')
  const partidosGrupo = PARTIDOS.filter(p => p.grupo === grupoActivo)
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
        {GRUPOS.map(g => (
          <button key={g} onClick={() => setGrupoActivo(g)}
            className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
            style={{
              fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.95rem', letterSpacing:'0.04em',
              background: g === grupoActivo ? '#F4A7B9' : 'rgba(244,167,185,0.08)',
              color: g === grupoActivo ? '#111F18' : 'rgba(240,240,238,0.5)',
            }}>
            Grupo {g}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {partidosGrupo.map(p => {
          const votos = predsPorPartido[p.id] || { L: [], E: [], V: [] }
          const cols = [
            { key:'L', titulo:`Gana ${p.local}`, gente: votos.L, bg:'rgba(244,167,185,0.85)', tc:'#111F18' },
            { key:'E', titulo:'Empate', gente: votos.E, bg:'rgba(244,167,185,0.3)', tc:'#F8C5D3' },
            { key:'V', titulo:`Gana ${p.visitante}`, gente: votos.V, bg:'rgba(244,167,185,0.18)', tc:'#F8C5D3' },
          ]
          return (
            <div key={p.id} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider" style={{color:'rgba(244,167,185,0.5)'}}>Grupo {p.grupo}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">{p.localFlag}</span>
                <span className="font-bold text-lg text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{p.local}</span>
                <span className="text-white/30 text-sm mx-1">vs</span>
                <span className="font-bold text-lg text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{p.visitante}</span>
                <span className="text-2xl">{p.visitanteFlag}</span>
              </div>
              <div className="flex gap-1.5 items-start">
                {cols.map(c => (
                  <div key={c.key} className="flex-1 min-w-0 rounded-xl overflow-hidden" style={{background:'rgba(244,167,185,0.06)'}}>
                    <div className="px-1 py-2 text-center" style={{background:c.bg}}>
                      <div className="font-bold text-xl" style={{color:c.tc, fontFamily:"'Barlow Condensed',sans-serif"}}>{c.gente.length}</div>
                      <div className="text-[10px] uppercase tracking-wide font-mono leading-tight px-1" style={{color:c.tc}}>{c.titulo}</div>
                    </div>
                    <div className="px-1.5 py-2">
                      {c.gente.length === 0
                        ? <div className="text-center text-xs py-1" style={{color:'rgba(255,255,255,0.2)'}}>—</div>
                        : c.gente.map((n, idx) => (
                          <div key={idx} className="text-xs py-1 text-center leading-tight" style={{color:'rgba(255,255,255,0.8)', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                            {nombreCorto(n)}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function VistaResultados({ resultados, predsPorPartido, totalJugadores }) {
  const jugados = PARTIDOS
    .filter(p => resultados[p.id] && resultados[p.id].resultado)
    .map(p => ({ p, res: resultados[p.id] }))
    .sort((a, b) => {
      const ta = a.res.updated_at ? new Date(a.res.updated_at).getTime() : 0
      const tb = b.res.updated_at ? new Date(b.res.updated_at).getTime() : 0
      return tb - ta
    })
  const porJugar = PARTIDOS.length - jugados.length
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-center gap-3 mb-6">
        <div className="glass-card rounded-2xl px-5 py-3 text-center">
          <div className="font-bold text-3xl text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{jugados.length}</div>
          <div className="text-[10px] uppercase tracking-wider font-mono" style={{color:'rgba(244,167,185,0.6)'}}>Jugados</div>
        </div>
        <div className="glass-card rounded-2xl px-5 py-3 text-center">
          <div className="font-bold text-3xl text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{porJugar}</div>
          <div className="text-[10px] uppercase tracking-wider font-mono" style={{color:'rgba(240,240,238,0.4)'}}>Por jugar</div>
        </div>
      </div>
      {jugados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">⚽</div>
          <p className="text-white/40">Aún no hay partidos jugados. ¡Pronto empieza la acción!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jugados.map(({ p, res }) => {
            const votos = predsPorPartido[p.id] || { L: [], E: [], V: [] }
            const aciertan = votos[res.resultado] || []
            const frase = fraseNarracion(p, res, aciertan.length, totalJugadores)
            const gl = res.goles_local, gv = res.goles_visitante
            return (
              <div key={p.id} className="glass-card rounded-2xl p-4" style={{background:'rgba(244,167,185,0.05)'}}>
                <div className="text-center mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{color:'rgba(244,167,185,0.5)'}}>Grupo {p.grupo} · Final</span>
                </div>
                <div className="flex items-center justify-center gap-3 my-2">
                  <div className="text-center flex-1">
                    <div className="text-3xl">{p.localFlag}</div>
                    <div className="text-white font-medium text-sm" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{p.local}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-3xl" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{gl != null ? gl : '?'}</span>
                    <span className="text-white/30">-</span>
                    <span className="text-white font-bold text-3xl" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{gv != null ? gv : '?'}</span>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-3xl">{p.visitanteFlag}</div>
                    <div className="text-white font-medium text-sm" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{p.visitante}</div>
                  </div>
                </div>
                <div className="text-center pt-1">
                  <span className="inline-block text-xs px-3 py-1.5 rounded-full font-mono" style={{background:'rgba(244,167,185,0.15)', color:'#F8C5D3'}}>
                    ✓ {aciertan.length} de {totalJugadores} le {aciertan.length === 1 ? 'atinó' : 'atinaron'}
                  </span>
                </div>
                <p className="text-center text-sm mt-3 mb-0" style={{color:'rgba(255,255,255,0.6)', lineHeight:1.5}}>
                  {frase.titulo}
                  {frase.sub && <><br/>{frase.sub}</>}
                  {aciertan.length > 0 && (
                    <><br/><span style={{color:'#F8C5D3'}}>{unirNombres(aciertan)}</span> {aciertan.length === 1 ? 'cantó' : 'cantaron'} el resultado.</>
                  )}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function TablaPublicaPage() {
  const { user } = useAuth()
  const [participantes, setParticipantes] = useState([])
  const [predsPorPartido, setPredsPorPartido] = useState({})
  const [resultados, setResultados] = useState({})
  const [totalReg, setTotalReg] = useState(0)
  const [totalJugadores, setTotalJugadores] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(null)

  const preview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1'
  const isOpen = (new Date() < FECHA_CIERRE) && !preview

  const load = useCallback(async () => {
    const { count } = await supabase.from('profiles').select('*',{count:'exact',head:true})
    setTotalReg(count || 0)
    const { data: resData } = await supabase.from('resultados').select('partido_id, resultado, goles_local, goles_visitante, updated_at')
    const resMap = {}; (resData || []).forEach(r => { resMap[r.partido_id] = r }); setResultados(resMap)

    if (!isOpen) {
      const [predsData, profilesData] = await Promise.all([
        leerTodo('predicciones', 'user_id, partido_id, resultado'),
        leerTodo('profiles', 'id, nombre')
      ])
      const nombreMap = {}; (profilesData || []).forEach(p => { nombreMap[p.id] = p.nombre })
      const byUser = {}
      const porPartido = {}
      ;(predsData || []).forEach(p => {
        if (!byUser[p.user_id]) byUser[p.user_id] = {}
        byUser[p.user_id][p.partido_id] = p.resultado
        if (!porPartido[p.partido_id]) porPartido[p.partido_id] = { L: [], E: [], V: [] }
        const nombre = nombreMap[p.user_id] || 'Participante'
        if (porPartido[p.partido_id][p.resultado]) porPartido[p.partido_id][p.resultado].push(nombre)
      })
      setPredsPorPartido(porPartido)
      setTotalJugadores(Object.keys(byUser).length)
      const lista = Object.entries(byUser).map(([uid, preds]) => {
        let pts = 0
        Object.entries(preds).forEach(([pid, pred]) => { if (resMap[pid] && resMap[pid].resultado === pred) pts++ })
        return { nombre: nombreMap[uid] || 'Participante', preds, pts }
      })
      const barajada = barajar(lista)
      barajada.sort((a,b) => b.pts - a.pts)
      setParticipantes(barajada)
      const hayRes = Object.values(resMap).some(r => r && r.resultado)
      setTab(prev => prev || (hayRes ? 'puntos' : 'predicciones'))
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

  const puntajesOrdenados = [...new Set(participantes.map(p => p.pts))].sort((a,b) => b - a)
  const lugarDe = (pts) => puntajesOrdenados.indexOf(pts) + 1
  const medallaDe = (pts) => { const l = lugarDe(pts); return l === 1 ? '🥇' : l === 2 ? '🥈' : l === 3 ? '🥉' : null }

  const recentPts = participantes.filter(p => p.pts > 0).slice(0,3)
  const totalConResultado = PARTIDOS.filter(p => resultados[p.id] && resultados[p.id].resultado).length
  const torneoTerminado = totalConResultado >= PARTIDOS.length && participantes.length > 0
  const tabActiva = tab || 'predicciones'

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
          {isOpen ? 'Quiniela abierta' : 'Quiniela cerrada'}
        </h1>
        <p className="text-white/40 max-w-lg mx-auto">
          {isOpen
            ? `¡Ya hay ${totalReg} ${totalReg === 1 ? 'participante' : 'participantes'}! Registra tus picks antes del cierre.`
            : '¡A ver cómo le fue a cada quien!'}
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
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                <button onClick={() => setTab('puntos')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{background: tabActiva==='puntos' ? '#F4A7B9' : 'rgba(244,167,185,0.08)', color: tabActiva==='puntos' ? '#111F18' : 'rgba(244,167,185,0.6)'}}>
                  🏆 Tabla
                </button>
                <button onClick={() => setTab('resultados')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{background: tabActiva==='resultados' ? '#F4A7B9' : 'rgba(244,167,185,0.08)', color: tabActiva==='resultados' ? '#111F18' : 'rgba(244,167,185,0.6)'}}>
                  ⚽ Resultados
                </button>
                <button onClick={() => setTab('predicciones')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{background: tabActiva==='predicciones' ? '#F4A7B9' : 'rgba(244,167,185,0.08)', color: tabActiva==='predicciones' ? '#111F18' : 'rgba(244,167,185,0.6)'}}>
                  👀 Predicciones
                </button>
              </div>

              {tabActiva === 'resultados' && <VistaResultados resultados={resultados} predsPorPartido={predsPorPartido} totalJugadores={totalJugadores} />}
              {tabActiva === 'predicciones' && <VistaDestapada predsPorPartido={predsPorPartido} />}

              {tabActiva === 'puntos' && (
                <>
                  {torneoTerminado && <Podio participantes={participantes} />}

                  {!torneoTerminado && recentPts.length > 0 && (
                    <div className="max-w-xl mx-auto mb-8">
                      <div className="glass-card rounded-2xl p-5" style={{border:'1px solid rgba(244,167,185,0.15)'}}>
                        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{color:'rgba(244,167,185,0.5)'}}>🔥 Lideran la quiniela</p>
                        {recentPts.map((p,i) => (
                          <div key={p.nombre} className="flex items-center justify-between py-2" style={{borderTop: i>0 ? '1px solid rgba(244,167,185,0.06)' : 'none'}}>
                            <span className="font-semibold text-white">{medallaDe(p.pts) ? medallaDe(p.pts) + ' ' : ''}{nombreCorto(p.nombre)}</span>
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
                                  {lugarDe(p.pts)}. {medallaDe(p.pts) ? medallaDe(p.pts) + ' ' : ''}{nombreCorto(p.nombre)}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-lg" style={{fontFamily:"'Barlow Condensed',sans-serif",color:'#F4A7B9'}}>{p.pts}</td>
                                {PARTIDOS.slice(0,20).map(m => {
                                  const pred = p.preds[m.id]
                                  const res = resultados[m.id]?.resultado
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
        </>
      )}
    </div>
  )
}
