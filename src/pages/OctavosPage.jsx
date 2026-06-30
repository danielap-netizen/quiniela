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

function getResultadoOficial(partido, resultadoGuardado) {
  if (partido.resultadoOficial) {
    return partido.resultadoOficial
  }

  return resultadoGuardado?.resultado || null
}

function getDefinicionOficial(partido, resultadoGuardado) {
  if (partido.resultadoOficial) {
    return partido.definicionOficial || 'REGULAR'
  }

  return resultadoGuardado?.definicion || null
}

function getGolesLocal(partido, resultadoGuardado) {
  if (partido.resultadoOficial) {
    return partido.golesLocalOficial
  }

  return resultadoGuardado?.goles_local
}

function getGolesVisitante(partido, resultadoGuardado) {
  if (partido.resultadoOficial) {
    return partido.golesVisitanteOficial
  }

  return resultadoGuardado?.goles_visitante
}

function nombreCorto(nombre) {
  const partes = String(nombre || 'Participante').trim().split(/\s+/)

  return partes
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
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
