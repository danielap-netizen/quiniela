import { useState } from 'react'
import { PARTIDOS } from '../lib/config'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L']

function formatFecha(iso) {
  return format(new Date(iso), "EEE d MMM · HH:mm 'CDT'", { locale: es })
}

export default function PartidosPage() {
  const [grupoActivo, setGrupoActivo] = useState('A')
  const partidosGrupo = PARTIDOS.filter(p => p.grupo === grupoActivo)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-4xl text-white mb-1" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>Fase de Grupos</h1>
        <p className="text-white/40 text-sm">72 partidos · 11 – 27 de junio · Hora CDT</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {GRUPOS.map(g => (
          <button key={g} onClick={() => setGrupoActivo(g)}
            className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-150"
            style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:'0.95rem',
              letterSpacing:'0.04em',
              background: g === grupoActivo ? '#F4A7B9' : 'rgba(244,167,185,0.08)',
              color: g === grupoActivo ? '#111F18' : 'rgba(240,240,238,0.45)',
              border: g === grupoActivo ? 'none' : '1px solid rgba(244,167,185,0.1)',
            }}>
            Grupo {g}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {partidosGrupo.map((p, i) => (
          <div key={p.id} className="match-card animate-slide-up" style={{animationDelay:`${i*0.05}s`,animationFillMode:'both'}}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider" style={{color:'rgba(244,167,185,0.45)'}}>Grupo {p.grupo} · Jornada {i < 2 ? 1 : i < 4 ? 2 : 3}</span>
              <span className="text-xs font-mono" style={{color:'rgba(240,240,238,0.35)'}}>{p.ciudad}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-3xl">{p.localFlag}</span>
                <span className="font-bold text-xl text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{p.local}</span>
              </div>
              <div className="text-center px-3">
                <div className="text-xs font-mono text-white/30 mb-0.5">vs</div>
                <div className="text-xs font-mono" style={{color:'rgba(244,167,185,0.5)'}}>{formatFecha(p.fecha)}</div>
              </div>
              <div className="flex-1 flex items-center gap-2 justify-end">
                <span className="font-bold text-xl text-white" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{p.visitante}</span>
                <span className="text-3xl">{p.visitanteFlag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
