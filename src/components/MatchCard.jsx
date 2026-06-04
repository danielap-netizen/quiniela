import { useState, useEffect } from 'react'

export default function MatchCard({ partido, prediccion, onSave, disabled, saved }) {
  const [local, setLocal] = useState('')
  const [visitante, setVisitante] = useState('')
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (prediccion) {
      setLocal(String(prediccion.goles_local ?? ''))
      setVisitante(String(prediccion.goles_visitante ?? ''))
    }
  }, [prediccion])

  const isDirty =
    String(local) !== String(prediccion?.goles_local ?? '') ||
    String(visitante) !== String(prediccion?.goles_visitante ?? '')

  const isComplete = local !== '' && visitante !== ''

  const handleSave = async () => {
    if (!isComplete || disabled) return
    setSaving(true)
    try {
      await onSave(partido.id, parseInt(local), parseInt(visitante))
      setFlash(true)
      setTimeout(() => setFlash(false), 1200)
    } finally {
      setSaving(false)
    }
  }

  const handleInput = (setter) => (e) => {
    const val = e.target.value
    if (val === '' || (/^\d$/.test(val) && parseInt(val) <= 9)) {
      setter(val)
    }
  }

  const resultado =
    prediccion?.goles_local != null
      ? prediccion.goles_local > prediccion.goles_visitante
        ? partido.local
        : prediccion.goles_local < prediccion.goles_visitante
          ? partido.visitante
          : 'Empate'
      : null

  return (
    <div
      className={`match-card relative overflow-hidden transition-all duration-300
        ${flash ? 'border-pitch-400/60 bg-pitch-900/30' : ''}
        ${disabled ? 'opacity-75' : ''}
      `}
    >
      {/* Phase label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-pitch-600 uppercase tracking-wider">
          {partido.fase}
        </span>
        <span className="text-xs font-mono text-pitch-700">
          {partido.fecha}
        </span>
      </div>

      {/* Teams and score inputs */}
      <div className="flex items-center justify-between gap-3">
        {/* Local team */}
        <div className="flex-1 text-right">
          <span className="text-2xl block mb-1">{partido.localFlag}</span>
          <span className="font-display font-semibold text-sm text-pitch-100 leading-tight">
            {partido.local}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <input
            type="number"
            min="0"
            max="9"
            value={local}
            onChange={handleInput(setLocal)}
            disabled={disabled}
            placeholder="–"
            className={`score-input ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          />
          <span className="text-pitch-600 font-display font-bold text-xl">:</span>
          <input
            type="number"
            min="0"
            max="9"
            value={visitante}
            onChange={handleInput(setVisitante)}
            disabled={disabled}
            placeholder="–"
            className={`score-input ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          />
        </div>

        {/* Visitante team */}
        <div className="flex-1 text-left">
          <span className="text-2xl block mb-1">{partido.visitanteFlag}</span>
          <span className="font-display font-semibold text-sm text-pitch-100 leading-tight">
            {partido.visitante}
          </span>
        </div>
      </div>

      {/* Result prediction */}
      {resultado && (
        <div className="mt-3 text-center">
          <span className="text-xs font-mono text-pitch-500">
            Gana: <span className="text-pitch-400">{resultado}</span>
          </span>
        </div>
      )}

      {/* Save button */}
      {!disabled && (
        <div className="mt-4">
          <button
            onClick={handleSave}
            disabled={!isComplete || !isDirty || saving}
            className={`w-full py-2.5 rounded-xl text-sm font-display font-semibold transition-all duration-200
              ${flash
                ? 'bg-pitch-500/30 text-pitch-300 border border-pitch-500/40'
                : isDirty && isComplete
                  ? 'bg-pitch-600 hover:bg-pitch-500 text-white active:scale-98'
                  : 'bg-pitch-900/50 text-pitch-700 cursor-not-allowed'
              }`}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </span>
            ) : flash ? '✓ Guardado' : isDirty ? 'Guardar predicción' : 'Guardado'}
          </button>
        </div>
      )}

      {/* Disabled overlay message */}
      {disabled && (
        <div className="mt-4 text-center">
          <span className="text-xs font-mono text-amber-600 flex items-center justify-center gap-1.5">
            <span>🔒</span>
            {prediccion ? 'Predicción enviada' : 'Sin predicción registrada'}
          </span>
        </div>
      )}

      {/* Flash border effect */}
      {flash && (
        <div className="absolute inset-0 rounded-2xl border-2 border-pitch-400/50 pointer-events-none animate-pulse" />
      )}
    </div>
  )
}
