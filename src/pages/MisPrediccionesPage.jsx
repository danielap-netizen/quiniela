import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { FECHA_CIERRE, PARTIDOS, GRUPOS } from '../lib/config'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function formatFecha(iso) {
  const d = new Date(iso)
  return format(d, "EEE d MMM · HH:mm 'CDT'", { locale: es })
}

function MatchCard({ partido, prediccion, onSave, disabled }) {
  const [sel, setSel] = useState(prediccion?.resultado || null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setSel(prediccion?.resultado || null) }, [prediccion])

  const isDirty = sel !== (prediccion?.resultado || null)
  const isOpen = new Date() < FECHA_CIERRE

  const handleSel = (v) => { if (!disabled) setSel(v) }
  const handleSave = async () => {
    if (!sel || !isDirty || disabled) return
    setSaving(true)
    try {
      await onSave(partido.id, sel)
      setSaved(true); setTimeout(() => setSaved(false), 1500)
    } finally { setSaving(false) }
  }

  const opts = [
    { key:'L', label:'Local', name: partido.local },
    { key:'E', label:'Empate', name: 'Empate' },
    { key:'V', label:'Visita', name: partido.visitante },
  ]

  return (
    <div className="match-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-mono uppercase tracking-wider" style={{color:'#F4A7B9'}}>Grupo {partido.grupo}</span>
        <span className="text-sm font-mono" style={{color:'rgba(240,240,238,0.78)'}}>{formatFecha(partido.fecha)}</span>
      </div>

      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex-1 text-right">
          <div className="text-3xl mb-0.5">{partido.localFlag}</div>
          <div className="font-bold text-lg text-white leading-tight" style={{fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:'0.01em'}}>{partido.local}</div>
          <div className="text-sm text-white/60 mt-0.5">Local</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {opts.map(o => (
            <button key={o.key} onClick={() => handleSel(o.key)}
              className={`lev-btn ${sel === o.key ? 'selected' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={o.name}>
              {o.key}
            </button>
          ))}
        </div>
        <div className="flex-1 text-left">
          <div className="text-3xl mb-0.5">{partido.visitanteFlag}</div>
          <div className="font-bold text-lg text-white leading-tight" style={{fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:'0.01em'}}>{partido.visitante}</div>
          <div className="text-sm text-white/60 mt-0.5">Visita</div>
        </div>
      </div>

      {sel && <div className="text-center text-base mb-3 font-medium" style={{color:'#F8C5D3'}}>
        {sel === 'L' ? `Gana ${partido.local}` : sel === 'V' ? `Gana ${partido.visitante}` : 'Empate'}
      </div>}

      {!disabled && (
        <button onClick={handleSave} disabled={!sel || !isDirty || saving}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: saved ? 'rgba(244,167,185,0.15)' : (sel && isDirty ? '#F4A7B9' : 'rgba(244,167,185,0.06)'),
            color: saved ? '#F4A7B9' : (sel && isDirty ? '#111F18' : 'rgba(244,167,185,0.3)'),
            cursor: (!sel || !isDirty) ? 'not-allowed' : 'pointer',
            fontFamily:"'Plus Jakarta Sans',sans-serif"
          }}>
          {saving ? 'Guardando...' : saved ? '✓ Guardado' : sel && isDirty ? 'Guardar predicción' : prediccion ? 'Guardado' : 'Elige un resultado'}
        </button>
      )}
      {disabled && (
        <div className="text-center text-sm font-mono py-1" style={{color:'rgba(244,167,185,0.55)'}}>
          {prediccion ? `✓ ${sel === 'L' ? partido.local : sel === 'V' ? partido.visitante : 'Empate'}` : '— sin predicción —'}
        </div>
      )}
    </div>
  )
}

export default function MisPrediccionesPage() {
  const { user } = useAuth()
  const [preds, setPreds] = useState({})
  const [loading, setLoading] = useState(true)
  const [grupoActivo, setGrupoActivo] = useState('A')
  const isOpen = new Date() < FECHA_CIERRE

  const fetchPreds = useCallback(async () => {
    if (!user) return
    const { data } = await supabase.from('predicciones').select('*').eq('user_id', user.id)
    const map = {}; (data || []).forEach(p => { map[p.partido_id] = p }); setPreds(map); setLoading(false)
  }, [user])

  useEffect(() => { fetchPreds() }, [fetchPreds])

  const handleSave = async (partidoId, resultado) => {
    if (new Date() >= FECHA_CIERRE) throw new Error('Quiniela cerrada')
    const existing = preds[partidoId]
    if (existing) {
      await supabase.from('predicciones').update({ resultado, updated_at: new Date().toISOString() }).eq('id', existing.id).eq('user_id', user.id)
      setPreds(p => ({ ...p, [partidoId]: { ...existing, resultado } }))
    } else {
      const { data } = await supabase.from('predicciones').insert({ user_id: user.id, partido_id: partidoId, resultado }).select().single()
      setPreds(p => ({ ...p, [partidoId]: data }))
    }
  }

  const partidosGrupo = PARTIDOS.filter(p => p.grupo === grupoActivo)
  const completadas = PARTIDOS.filter(p => preds[p.id]).length
  const pct = Math.round((completadas / PARTIDOS.length) * 100)

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-10 h-10 rounded-full animate-spin mx-auto mb-4" style={{border:'2px solid rgba(244,167,185,0.2)',borderTopColor:'#F4A7B9'}}/>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="font-bold text-4xl text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>Mis predicciones</h1>
        <p className="text-white/55 text-sm">
          {isOpen
            ? `Cierre: ${format(FECHA_CIERRE, "d 'de' MMMM, HH:mm 'CDT'", {locale:es})} · Puedes cambiar hasta entonces`
            : 'Quiniela cerrada · resultados bloqueados'}
        </p>
      </div>

      {!isOpen && (
        <div className="mb-6 p-4 rounded-2xl" style={{background:'rgba(244,167,185,0.06)',border:'1px solid rgba(244,167,185,0.15)'}}>
          <p className="text-sm" style={{color:'#F8C5D3'}}>🔒 La quiniela cerró. Tus predicciones están guardadas y visibles en la tabla pública.</p>
        </div>
      )}

      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-white/70">Progreso</span>
          <span className="text-sm font-mono" style={{color:'#F4A7B9'}}>{completadas}/{PARTIDOS.length}</span>
        </div>
        <div className="h-2 rounded-full" style={{background:'rgba(244,167,185,0.1)'}}>
          <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:'#F4A7B9'}}/>
        </div>
        {completadas === PARTIDOS.length ? (
          <p className="text-sm text-right mt-1.5" style={{color:'#F8C5D3'}}>✓ ¡Completaste los {PARTIDOS.length} partidos!</p>
        ) : (
          <p className="text-sm mt-2 font-semibold" style={{color:'#F4A7B9'}}>
            Te faltan {PARTIDOS.length - completadas} {PARTIDOS.length - completadas === 1 ? 'partido' : 'partidos'} por predecir
          </p>
        )}
        {isOpen && completadas < PARTIDOS.length && (
          <p className="text-xs mt-1" style={{color:'rgba(255,190,130,0.9)'}}>
            ⚠️ Los partidos sin predicción no suman puntos. Complétalos antes del cierre.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {['A','B','C','D','E','F','G','H','I','J','K','L'].map(g => {
          const total = PARTIDOS.filter(p => p.grupo === g).length
          const done = PARTIDOS.filter(p => p.grupo === g && preds[p.id]).length
          const active = g === grupoActivo
          return (
            <button key={g} onClick={() => setGrupoActivo(g)}
              className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-150"
              style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:'0.95rem',
                letterSpacing:'0.04em',
                background: active ? '#F4A7B9' : 'rgba(244,167,185,0.08)',
                color: active ? '#111F18' : done === total ? '#F8C5D3' : 'rgba(240,240,238,0.6)',
                border: active ? 'none' : done === total ? '1px solid rgba(244,167,185,0.35)' : '1px solid rgba(244,167,185,0.15)',
              }}>
              {g} {done === total ? '✓' : `${done}/${total}`}
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {partidosGrupo.map(p => (
          <MatchCard key={p.id} partido={p} prediccion={preds[p.id]} onSave={handleSave} disabled={!isOpen}/>
        ))}
      </div>

      <p className="text-center text-xs font-mono mt-8" style={{color:'rgba(244,167,185,0.35)'}}>
        {isOpen ? '💡 Tus predicciones se guardan automáticamente por partido.' : '🏆 Los resultados ya son públicos.'}
      </p>
    </div>
  )
}
