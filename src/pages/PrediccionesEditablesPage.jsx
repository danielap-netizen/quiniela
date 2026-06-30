import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { OCTAVOS } from '../lib/config'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const DEFINICIONES = [
  { value: 'REGULAR', label: 'Tiempo regular' },
  { value: 'EXTRAS', label: 'Tiempos extras' },
  { value: 'PENALES', label: 'Penales' },
]

function formatFecha(iso) {
  return format(new Date(iso), "EEE d MMM · HH:mm 'hrs'", { locale: es })
}

function getDeadline(partido) {
  return new Date(new Date(partido.fecha).getTime() - 60 * 60 * 1000)
}

function puedeEditarPartido(partido, now) {
  if (partido.bloqueado) return false
  return now < getDeadline(partido)
}

function getLabelDefinicion(value) {
  return DEFINICIONES.find((d) => d.value === value)?.label || ''
}

function getValorPrediccion(partido, prediccion) {
  if (partido.bloqueado && partido.resultadoOficial) {
    return partido.resultadoOficial
  }

  return prediccion?.resultado || null
}

function getValorDefinicion(partido, prediccion) {
  if (partido.bloqueado && partido.resultadoOficial) {
    return partido.definicionOficial || 'REGULAR'
  }

  return prediccion?.definicion || null
}

function DieciseisavosCard({ partido, prediccion, onSave, now }) {
  const valorInicial = getValorPrediccion(partido, prediccion)
  const definicionInicial = getValorDefinicion(partido, prediccion)
  const editable = puedeEditarPartido(partido, now)

  const [sel, setSel] = useState(valorInicial)
  const [definicion, setDefinicion] = useState(definicionInicial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSel(getValorPrediccion(partido, prediccion))
    setDefinicion(getValorDefinicion(partido, prediccion))
  }, [partido, prediccion])

  const isDirty = sel !== valorInicial || definicion !== definicionInicial
  const canSave = editable && sel && definicion && isDirty

  const handleSave = async () => {
    if (!canSave) return

    setSaving(true)

    try {
      await onSave(partido, sel, definicion)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } finally {
      setSaving(false)
    }
  }

  const ganadorOficial =
    partido.resultadoOficial === 'L'
      ? partido.local
      : partido.resultadoOficial === 'V'
        ? partido.visitante
        : null

  return (
    <div
      className="rounded-2xl p-5 mb-4"
      style={{
        background: partido.bloqueado
          ? 'rgba(244,167,185,0.10)'
          : 'rgba(244,167,185,0.06)',
        border: partido.bloqueado
          ? '1px solid rgba(244,167,185,0.30)'
          : '1px solid rgba(244,167,185,0.14)',
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-white/35 text-xs font-mono tracking-widest uppercase">
            16avos · {partido.id}
          </p>

          <p className="text-white/45 text-sm">
            {partido.ciudad} · {formatFecha(partido.fecha)}
          </p>
        </div>

        <p className="text-[#F4A7B9] text-xs font-bold uppercase tracking-widest">
          hasta 2 puntos
        </p>
      </div>

      {partido.bloqueado && (
        <div
          className="rounded-xl p-3 mb-4"
          style={{
            background: 'rgba(244,167,185,0.12)',
            border: '1px solid rgba(244,167,185,0.18)',
          }}
        >
          <p className="text-[#F4A7B9] text-sm font-bold">
            Partido cerrado · {partido.local} {partido.golesLocalOficial}-{partido.golesVisitanteOficial} {partido.visitante}
          </p>

          <p className="text-white/50 text-sm mt-1">
            {partido.notaResultado || `Avanzó ${ganadorOficial}.`}
          </p>

          <p className="text-white/40 text-sm mt-1">
            Definición: {getLabelDefinicion(definicionInicial)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <button
          disabled={!editable}
          onClick={() => setSel('L')}
          className="rounded-xl px-4 py-4 text-left transition-all"
          style={{
            background: sel === 'L' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
            color: sel === 'L' ? '#111F18' : '#fff',
            border: sel === 'L'
              ? '1px solid #F4A7B9'
              : '1px solid rgba(255,255,255,0.08)',
            opacity: !editable && sel !== 'L' ? 0.35 : 1,
          }}
        >
          <p className="text-xs uppercase tracking-widest opacity-60">
            Avanza
          </p>

          <p className="font-bold text-lg">
            {partido.localFlag} {partido.local}
          </p>
        </button>

        <div className="text-center text-white/30 font-bold">
          vs
        </div>

        <button
          disabled={!editable}
          onClick={() => setSel('V')}
          className="rounded-xl px-4 py-4 text-left transition-all"
          style={{
            background: sel === 'V' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
            color: sel === 'V' ? '#111F18' : '#fff',
            border: sel === 'V'
              ? '1px solid #F4A7B9'
              : '1px solid rgba(255,255,255,0.08)',
            opacity: !editable && sel !== 'V' ? 0.35 : 1,
          }}
        >
          <p className="text-xs uppercase tracking-widest opacity-60">
            Avanza
          </p>

          <p className="font-bold text-lg">
            {partido.visitanteFlag} {partido.visitante}
          </p>
        </button>
      </div>

      <div className="mt-4">
        <p className="text-white/45 text-sm mb-3">
          ¿Cómo crees que se define el partido?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEFINICIONES.map((opcion) => (
            <button
              key={opcion.value}
              disabled={!editable}
              onClick={() => setDefinicion(opcion.value)}
              className="rounded-xl px-4 py-3 text-sm font-bold transition-all"
              style={{
                background:
                  definicion === opcion.value
                    ? '#F4A7B9'
                    : 'rgba(255,255,255,0.04)',
                color:
                  definicion === opcion.value
                    ? '#111F18'
                    : '#fff',
                border:
                  definicion === opcion.value
                    ? '1px solid #F4A7B9'
                    : '1px solid rgba(255,255,255,0.08)',
                opacity:
                  !editable && definicion !== opcion.value
                    ? 0.35
                    : 1,
              }}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-white/45 text-sm">
            {sel
              ? sel === 'L'
                ? `Elegiste que avanza ${partido.local}`
                : `Elegiste que avanza ${partido.visitante}`
              : 'Elige quién avanza'}
          </p>

          <p className="text-white/35 text-xs mt-1">
            {definicion
              ? `Definición elegida: ${getLabelDefinicion(definicion)}`
              : 'También debes elegir cómo se define el partido.'}
          </p>

          {!partido.bloqueado && (
            <p className="text-white/30 text-xs mt-1">
              Puedes cambiar este partido hasta: {format(getDeadline(partido), "d MMM · HH:mm 'hrs'", { locale: es })}
            </p>
          )}
        </div>

        {editable ? (
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
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
                : isDirty && sel && definicion
                  ? 'Guardar'
                  : prediccion
                    ? 'Guardado'
                    : 'Elige'}
          </button>
        ) : (
          <p className="text-[#F4A7B9] text-sm font-bold">
            {partido.bloqueado
              ? 'Resultado definido'
              : prediccion
                ? '✓ Guardado'
                : 'Cerrado'}
          </p>
        )}
      </div>
    </div>
  )
}

export default function PrediccionesEditablesPage() {
  const { user } = useAuth()

  const [preds, setPreds] = useState({})
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)

    return () => clearInterval(t)
  }, [])

  const cargar = useCallback(async () => {
    if (!user) return

    const { data } = await supabase
      .from('predicciones')
      .select('*')
      .eq('user_id', user.id)

    const misMap = {}

    ;(data || []).forEach((p) => {
      misMap[p.partido_id] = p
    })

    setPreds(misMap)
    setLoading(false)
  }, [user])

  useEffect(() => {
    cargar()
  }, [cargar])

  const handleSave = async (partido, resultado, definicion) => {
    if (!puedeEditarPartido(partido, new Date())) {
      throw new Error('Este partido ya cerró')
    }

    const existing = preds[partido.id]

    if (existing) {
      await supabase
        .from('predicciones')
        .update({
          resultado,
          definicion,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('user_id', user.id)

      setPreds((prev) => ({
        ...prev,
        [partido.id]: {
          ...existing,
          resultado,
          definicion,
        },
      }))
    } else {
      const { data } = await supabase
        .from('predicciones')
        .insert({
          user_id: user.id,
          partido_id: partido.id,
          resultado,
          definicion,
        })
        .select()
        .single()

      setPreds((prev) => ({
        ...prev,
        [partido.id]: data,
      }))
    }
  }

  const completadas = OCTAVOS.filter((p) => {
    if (p.bloqueado && p.resultadoOficial) return true

    const pred = preds[p.id]

    return Boolean(pred?.resultado && pred?.definicion)
  }).length

  const faltantes = OCTAVOS.length - completadas

  const partidosEditables = OCTAVOS.filter((p) =>
    puedeEditarPartido(p, now)
  ).length

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-white/50">
          Cargando predicciones...
        </p>
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
          Hacer mis predicciones
        </h1>

        <p className="text-white/55 mt-2">
          Elige quién avanza y cómo se define cada partido de 16avos.
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
                ? '✓ Ya completaste tus predicciones de 16avos.'
                : `Te faltan ${faltantes} ${faltantes === 1 ? 'partido' : 'partidos'} por completar.`}
            </p>
          </div>

          <div>
            <p className="text-[#F4A7B9] text-sm font-bold">
              {partidosEditables > 0
                ? `${partidosEditables} abiertos`
                : 'Todos cerrados'}
            </p>

            <p className="text-white/35 text-xs">
              Cada partido cierra 1 hora antes de empezar.
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-3 mt-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-white/55 text-sm">
            Cada partido vale hasta 2 puntos: 1 por atinar quién avanza y 1 por atinar si se define en tiempo regular, tiempos extras o penales.
          </p>
        </div>
      </div>

      {OCTAVOS.map((partido) => (
        <DieciseisavosCard
          key={partido.id}
          partido={partido}
          prediccion={preds[partido.id]}
          onSave={handleSave}
          now={now}
        />
      ))}
    </div>
  )
}
