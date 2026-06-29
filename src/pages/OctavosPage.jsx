import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { OCTAVOS, FECHA_CIERRE_OCTAVOS } from '../lib/config'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function formatFecha(iso) {
  return format(new Date(iso), "EEE d MMM · HH:mm 'hrs'", { locale: es })
}

function OctavosCard({ partido, prediccion, onSave, disabled }) {
  const [sel, setSel] = useState(prediccion?.resultado || null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSel(prediccion?.resultado || null)
  }, [prediccion])

  const isDirty = sel !== (prediccion?.resultado || null)

  const handleSave = async () => {
    if (!sel || !isDirty || disabled) return

    setSaving(true)
    try {
      await onSave(partido.id, sel)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="rounded-2xl p-5 mb-4"
      style={{
        background: 'rgba(244,167,185,0.06)',
        border: '1px solid rgba(244,167,185,0.14)',
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-white/35 text-xs font-mono tracking-widest uppercase">
            Octavos · {partido.id}
          </p>
          <p className="text-white/45 text-sm">
            {partido.ciudad} · {formatFecha(partido.fecha)}
          </p>
        </div>

        <p className="text-[#F4A7B9] text-xs font-bold uppercase tracking-widest">
          1 punto
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <button
          disabled={disabled}
          onClick={() => setSel('L')}
          className="rounded-xl px-4 py-4 text-left transition-all"
          style={{
            background: sel === 'L' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
            color: sel === 'L' ? '#111F18' : '#fff',
            border: sel === 'L'
              ? '1px solid #F4A7B9'
              : '1px solid rgba(255,255,255,0.08)',
            opacity: disabled ? 0.55 : 1,
          }}
        >
          <p className="text-xs uppercase tracking-widest opacity-60">Avanza</p>
          <p className="font-bold text-lg">{partido.localFlag} {partido.local}</p>
        </button>

        <div className="text-center text-white/30 font-bold">vs</div>

        <button
          disabled={disabled}
          onClick={() => setSel('V')}
          className="rounded-xl px-4 py-4 text-left transition-all"
          style={{
            background: sel === 'V' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
            color: sel === 'V' ? '#111F18' : '#fff',
            border: sel === 'V'
              ? '1px solid #F4A7B9'
              : '1px solid rgba(255,255,255,0.08)',
            opacity: disabled ? 0.55 : 1,
          }}
        >
          <p className="text-xs uppercase tracking-widest opacity-60">Avanza</p>
          <p className="font-bold text-lg">{partido.visitanteFlag} {partido.visitante}</p>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-white/45 text-sm">
          {sel
            ? sel === 'L'
              ? `Elegiste que avanza ${partido.local}`
              : `Elegiste que avanza ${partido.visitante}`
            : 'Elige quién avanza'}
        </p>

        {!disabled && (
          <button
            onClick={handleSave}
            disabled={!sel || !isDirty || saving}
            className="rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-40"
            style={{
              background: '#F4A7B9',
              color: '#111F18',
            }}
          >
            {saving
              ? 'Guardando...'
              : saved
                ? '✓ Guardado'
                : isDirty && sel
                  ? 'Guardar'
                  : prediccion
                    ? 'Guardado'
                    : 'Elige'}
          </button>
        )}

        {disabled && (
          <p className="text-[#F4A7B9] text-sm font-bold">
            {prediccion ? '✓ Guardado' : 'Sin predicción'}
          </p>
        )}
      </div>
    </div>
  )
}

export default function OctavosPage() {
  const { user } = useAuth()
  const [preds, setPreds] = useState({})
  const [loading, setLoading] = useState(true)

  const isOpen = new Date() < FECHA_CIERRE_OCTAVOS

  const fetchPreds = useCallback(async () => {
    if (!user) return

    const { data } = await supabase
      .from('predicciones')
      .select('*')
      .eq('user_id', user.id)

    const map = {}
    ;(data || []).forEach((p) => {
      map[p.partido_id] = p
    })

    setPreds(map)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchPreds()
  }, [fetchPreds])

  const handleSave = async (partidoId, resultado) => {
    if (new Date() >= FECHA_CIERRE_OCTAVOS) {
      throw new Error('Octavos cerrados')
    }

    const existing = preds[partidoId]

    if (existing) {
      await supabase
        .from('predicciones')
        .update({
          resultado,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('user_id', user.id)

      setPreds((prev) => ({
        ...prev,
        [partidoId]: {
          ...existing,
          resultado,
        },
      }))
    } else {
      const { data } = await supabase
        .from('predicciones')
        .insert({
          user_id: user.id,
          partido_id: partidoId,
          resultado,
        })
        .select()
        .single()

      setPreds((prev) => ({
        ...prev,
        [partidoId]: data,
      }))
    }
  }

  const completadas = OCTAVOS.filter((p) => preds[p.id]).length
  const faltantes = OCTAVOS.length - completadas

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-white/50">Cargando octavos...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[#F4A7B9] text-sm font-bold uppercase tracking-widest">
          Eliminatorias
        </p>

        <h1
          className="text-4xl sm:text-5xl font-black text-white mt-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Octavos
        </h1>

        <p className="text-white/55 mt-2">
          Esta quiniela es independiente de la fase de grupos. Aquí eliges quién avanza.
        </p>
      </div>

      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: 'rgba(244,167,185,0.08)',
          border: '1px solid rgba(244,167,185,0.16)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-white font-bold">
              Progreso: {completadas}/{OCTAVOS.length}
            </p>
            <p className="text-white/45 text-sm">
              {faltantes === 0
                ? '✓ Ya completaste tus octavos.'
                : `Te faltan ${faltantes} ${faltantes === 1 ? 'partido' : 'partidos'} por predecir.`}
            </p>
          </div>

          <div>
            <p className="text-[#F4A7B9] text-sm font-bold">
              {isOpen ? 'Abierto' : 'Cerrado'}
            </p>
            <p className="text-white/35 text-xs">
              Cierre: {format(FECHA_CIERRE_OCTAVOS, "d MMM · HH:mm 'hrs'", { locale: es })}
            </p>
          </div>
        </div>
      </div>

      {OCTAVOS.map((partido) => (
        <OctavosCard
          key={partido.id}
          partido={partido}
          prediccion={preds[partido.id]}
          onSave={handleSave}
          disabled={!isOpen}
        />
      ))}
    </div>
  )
}
