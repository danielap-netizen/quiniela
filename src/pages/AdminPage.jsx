import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { PARTIDOS, GRUPOS, ADMIN_EMAIL } from '../lib/config'

// Deduce L/E/V a partir del marcador
function deducirLEV(gl, gv) {
  if (gl == null || gv == null) return null
  if (gl > gv) return 'L'
  if (gl < gv) return 'V'
  return 'E'
}

function PartidoAdmin({ partido, resultado, onSave }) {
  const [gl, setGl] = useState(resultado?.goles_local ?? '')
  const [gv, setGv] = useState(resultado?.goles_visitante ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setGl(resultado?.goles_local ?? '')
    setGv(resultado?.goles_visitante ?? '')
  }, [resultado])

  const lev = deducirLEV(
    gl === '' ? null : Number(gl),
    gv === '' ? null : Number(gv)
  )

  const handleSave = async () => {
    if (gl === '' || gv === '') return
    setSaving(true)
    try {
      await onSave(partido.id, Number(gl), Number(gv), lev)
      setSaved(true); setTimeout(() => setSaved(false), 1500)
    } finally { setSaving(false) }
  }

  return (
    <div className="match-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wider" style={{color:'rgba(244,167,185,0.5)'}}>Grupo {partido.grupo} · {partido.id}</span>
        {lev && <span className="text-xs font-mono font-bold" style={{color:'#F4A7B9'}}>
          {lev === 'L' ? `Gana ${partido.local}` : lev === 'V' ? `Gana ${partido.visitante}` : 'Empate'}
        </span>}
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="flex-1 text-right">
          <span className="text-2xl mr-1">{partido.localFlag}</span>
          <span className="font-bold text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{partido.local}</span>
        </div>
        <input type="number" min="0" value={gl} onChange={e => setGl(e.target.value)}
          className="w-12 h-12 text-center text-xl font-bold rounded-lg"
          style={{background:'rgba(244,167,185,0.08)',color:'#fff',border:'1px solid rgba(244,167,185,0.2)'}}/>
        <span className="text-white/30">-</span>
        <input type="number" min="0" value={gv} onChange={e => setGv(e.target.value)}
          className="w-12 h-12 text-center text-xl font-bold rounded-lg"
          style={{background:'rgba(244,167,185,0.08)',color:'#fff',border:'1px solid rgba(244,167,185,0.2)'}}/>
        <div className="flex-1 text-left">
          <span className="font-bold text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{partido.visitante}</span>
          <span className="text-2xl ml-1">{partido.visitanteFlag}</span>
        </div>
      </div>
      <button onClick={handleSave} disabled={gl === '' || gv === '' || saving}
        className="w-full mt-3 py-2 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: saved ? 'rgba(244,167,185,0.15)' : (gl !== '' && gv !== '' ? '#F4A7B9' : 'rgba(244,167,185,0.06)'),
          color: saved ? '#F4A7B9' : (gl !== '' && gv !== '' ? '#111F18' : 'rgba(244,167,185,0.3)'),
          cursor: (gl === '' || gv === '') ? 'not-allowed' : 'pointer',
          fontFamily:"'Plus Jakarta Sans',sans-serif"
        }}>
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar resultado'}
      </button>
    </div>
  )
}

export default function AdminPage() {
  const { user } = useAuth()
  const [resultados, setResultados] = useState({})
  const [participantes, setParticipantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [grupoActivo, setGrupoActivo] = useState('A')
  const [tab, setTab] = useState('resultados')

  const esAdmin = user?.email === ADMIN_EMAIL

  const fetchData = useCallback(async () => {
    const { data: res } = await supabase.from('resultados').select('*')
    const map = {}; (res || []).forEach(r => { map[r.partido_id] = r }); setResultados(map)
    const { data: profs } = await supabase.from('profiles').select('*').order('nombre')
    setParticipantes(profs || [])
    setLoading(false)
  }, [])

  useEffect(() => { if (esAdmin) fetchData() }, [esAdmin, fetchData])

  if (!user) return <Navigate to="/login" replace />
  if (!esAdmin) return <Navigate to="/tabla" replace />

  const handleSaveResultado = async (partidoId, gl, gv, lev) => {
    await supabase.from('resultados').upsert({
      partido_id: partidoId,
      goles_local: gl,
      goles_visitante: gv,
      resultado: lev,
      updated_at: new Date().toISOString()
    })
    setResultados(r => ({ ...r, [partidoId]: { partido_id: partidoId, goles_local: gl, goles_visitante: gv, resultado: lev } }))
  }

  const togglePago = async (perfil) => {
    const nuevo = !perfil.pago
    await supabase.from('profiles').update({ pago: nuevo }).eq('id', perfil.id)
    setParticipantes(ps => ps.map(p => p.id === perfil.id ? { ...p, pago: nuevo } : p))
  }

  const partidosGrupo = PARTIDOS.filter(p => p.grupo === grupoActivo)
  const totalConResultado = PARTIDOS.filter(p => resultados[p.id]).length

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-10 h-10 rounded-full animate-spin mx-auto" style={{border:'2px solid rgba(244,167,185,0.2)',borderTopColor:'#F4A7B9'}}/>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-bold text-4xl text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>Panel de administración</h1>
      <p className="text-white/40 text-sm mb-6">Solo tú ves esta página · {totalConResultado}/{PARTIDOS.length} resultados cargados</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('resultados')}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{background: tab==='resultados' ? '#F4A7B9' : 'rgba(244,167,185,0.08)', color: tab==='resultados' ? '#111F18' : 'rgba(244,167,185,0.6)'}}>
          Resultados
        </button>
        <button onClick={() => setTab('pagos')}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{background: tab==='pagos' ? '#F4A7B9' : 'rgba(244,167,185,0.08)', color: tab==='pagos' ? '#111F18' : 'rgba(244,167,185,0.6)'}}>
          Pagos
        </button>
      </div>

      {tab === 'resultados' && (
        <>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {GRUPOS.map(g => {
              const total = PARTIDOS.filter(p => p.grupo === g).length
              const done = PARTIDOS.filter(p => p.grupo === g && resultados[p.id]).length
              const active = g === grupoActivo
              return (
                <button key={g} onClick={() => setGrupoActivo(g)}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    fontFamily:"'Barlow Condensed',sans-serif", fontSize:'0.95rem',
                    background: active ? '#F4A7B9' : 'rgba(244,167,185,0.08)',
                    color: active ? '#111F18' : done === total ? 'rgba(244,167,185,0.7)' : 'rgba(240,240,238,0.4)',
                  }}>
                  {g} {done === total ? '✓' : `${done}/${total}`}
                </button>
              )
            })}
          </div>
          <div className="space-y-3">
            {partidosGrupo.map(p => (
              <PartidoAdmin key={p.id} partido={p} resultado={resultados[p.id]} onSave={handleSaveResultado}/>
            ))}
          </div>
        </>
      )}

      {tab === 'pagos' && (
        <div className="glass-card rounded-2xl p-2">
          {participantes.length === 0 && <p className="text-white/40 text-sm p-4">Aún no hay participantes registrados.</p>}
          {participantes.map(p => (
            <button key={p.id} onClick={() => togglePago(p)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-white/5">
              <span className="text-white font-medium">{p.nombre || p.email}</span>
              <span className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  background: p.pago ? 'rgba(244,167,185,0.15)' : 'rgba(255,255,255,0.05)',
                  color: p.pago ? '#F4A7B9' : 'rgba(255,255,255,0.3)'
                }}>
                {p.pago ? '✓ Pagó' : 'Sin pagar'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
