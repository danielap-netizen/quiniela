import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { FECHA_CIERRE, PARTIDOS } from '../lib/config'

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState([])
  const [loading, setLoading] = useState(true)
  const isOpen = new Date() < FECHA_CIERRE

  const load = useCallback(async () => {
    // Trae los perfiles y cuántas predicciones lleva cada uno
    const [{ data: profs }, { data: preds }] = await Promise.all([
      supabase.from('profiles').select('id, nombre').order('nombre'),
      supabase.from('predicciones').select('user_id')
    ])
    const conteo = {}
    ;(preds || []).forEach(p => { conteo[p.user_id] = (conteo[p.user_id] || 0) + 1 })
    const lista = (profs || []).map(p => ({
      nombre: p.nombre || 'Participante',
      hechas: conteo[p.id] || 0
    }))
    setParticipantes(lista)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const onVisible = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [load])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-10 h-10 rounded-full animate-spin mx-auto" style={{border:'2px solid rgba(244,167,185,0.2)',borderTopColor:'#F4A7B9'}}/>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-4xl text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>Participantes</h1>
        <p className="text-white/55 text-sm">
          {participantes.length} {participantes.length === 1 ? 'persona registrada' : 'personas registradas'} en la quiniela
        </p>
      </div>

      {participantes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">👀</div>
          <p className="text-white/50">Aún no hay participantes. ¡Sé el primero!</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-2">
          {participantes.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{borderBottom: i < participantes.length - 1 ? '1px solid rgba(244,167,185,0.06)' : 'none'}}>
              <span className="flex items-center gap-3">
                <span className="font-mono text-sm" style={{color:'rgba(244,167,185,0.5)'}}>{i + 1}</span>
                <span className="font-semibold text-white">{p.nombre}</span>
              </span>
              {isOpen && (
                <span className="text-sm font-mono" style={{
                  color: p.hechas === PARTIDOS.length ? '#F8C5D3' : 'rgba(240,240,238,0.55)'
                }}>
                  {p.hechas === PARTIDOS.length ? '✓ completo' : `${p.hechas}/${PARTIDOS.length}`}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs font-mono mt-6" style={{color:'rgba(244,167,185,0.3)'}}>
        {isOpen ? 'El progreso de cada quien se actualiza solo' : 'Quiniela cerrada'}
      </p>
    </div>
  )
}
