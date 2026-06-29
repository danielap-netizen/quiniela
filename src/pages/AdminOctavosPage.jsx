import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { ADMIN_EMAIL, OCTAVOS } from '../lib/config'
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

function getLabelDefinicion(value) {
  return DEFINICIONES.find((d) => d.value === value)?.label || ''
}

function AdminPartidoCard({ partido, resultadoGuardado, onSave }) {
  const resultadoInicial =
    resultadoGuardado?.resultado ||
    partido.resultadoOficial ||
    ''

  const definicionInicial =
    resultadoGuardado?.definicion ||
    partido.definicionOficial ||
    (partido.resultadoOficial ? 'REGULAR' : '')

  const golesLocalInicial =
    resultadoGuardado?.goles_local ??
    partido.golesLocalOficial ??
    ''

  const golesVisitanteInicial =
    resultadoGuardado?.goles_visitante ??
    partido.golesVisitanteOficial ??
    ''

  const [resultado, setResultado] = useState(resultadoInicial)
  const [definicion, setDefinicion] = useState(definicionInicial)
  const [golesLocal, setGolesLocal] = useState(golesLocalInicial)
  const [golesVisitante, setGolesVisitante] = useState(golesVisitanteInicial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setResultado(resultadoInicial)
    setDefinicion(definicionInicial)
    setGolesLocal(golesLocalInicial)
    setGolesVisitante(golesVisitanteInicial)
  }, [
    resultadoInicial,
    definicionInicial,
    golesLocalInicial,
    golesVisitanteInicial,
  ])

  const completo =
    resultado &&
    definicion &&
    golesLocal !== '' &&
    golesVisitante !== ''

  const ganador =
    resultado === 'L'
      ? partido.local
      : resultado === 'V'
        ? partido.visitante
        : null

  const handleSave = async () => {
    if (!completo) return

    setSaving(true)

    try {
      await onSave(partido, {
        resultado,
        definicion,
        goles_local: Number(golesLocal),
        goles_visitante: Number(golesVisitante),
      })

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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-white/35 text-xs font-mono tracking-widest uppercase">
            16avos · {partido.id}
          </p>

          <h2 className="text-white text-xl font-black mt-1">
            {partido.localFlag} {partido.local} vs {partido.visitanteFlag} {partido.visitante}
          </h2>

          <p className="text-white/45 text-sm mt-1">
            {partido.ciudad} · {formatFecha(partido.fecha)}
          </p>
        </div>

        {resultadoGuardado || partido.resultadoOficial ? (
          <div className="text-left sm:text-right">
            <p className="text-[#F4A7B9] text-sm font-bold">
              Resultado cargado
            </p>

            <p className="text-white/45 text-xs">
              {ganador ? `Avanzó ${ganador}` : ''}
            </p>
          </div>
        ) : (
          <p className="text-white/35 text-sm">
            Sin resultado
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-5">
        <button
          onClick={() => setResultado('L')}
          className="rounded-xl px-4 py-4 text-left transition-all"
          style={{
            background: resultado === 'L' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
            color: resultado === 'L' ? '#111F18' : '#fff',
            border:
              resultado === 'L'
                ? '1px solid #F4A7B9'
                : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-xs uppercase tracking-widest opacity-60">
            Avanzó
          </p>

          <p className="font-bold text-lg">
            {partido.localFlag} {partido.local}
          </p>
        </button>

        <div className="text-center text-white/30 font-bold">
          vs
        </div>

        <button
          onClick={() => setResultado('V')}
          className="rounded-xl px-4 py-4 text-left transition-all"
          style={{
            background: resultado === 'V' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
            color: resultado === 'V' ? '#111F18' : '#fff',
            border:
              resultado === 'V'
                ? '1px solid #F4A7B9'
                : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-xs uppercase tracking-widest opacity-60">
            Avanzó
          </p>

          <p className="font-bold text-lg">
            {partido.visitanteFlag} {partido.visitante}
          </p>
        </button>
      </div>

      <div className="mb-5">
        <p className="text-white/45 text-sm mb-3">
          ¿Cómo se definió el partido?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEFINICIONES.map((opcion) => (
            <button
              key={opcion.value}
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
              }}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <label className="block">
          <span className="text-white/45 text-sm">
            Goles {partido.local}
          </span>

          <input
            type="number"
            min="0"
            value={golesLocal}
            onChange={(e) => setGolesLocal(e.target.value)}
            className="mt-2 w-full rounded-xl px-4 py-3 text-white outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          />
        </label>

        <label className="block">
          <span className="text-white/45 text-sm">
            Goles {partido.visitante}
          </span>

          <input
            type="number"
            min="0"
            value={golesVisitante}
            onChange={(e) => setGolesVisitante(e.target.value)}
            className="mt-2 w-full rounded-xl px-4 py-3 text-white outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-white/45 text-sm">
            {resultado
              ? `Avanzó: ${ganador}`
              : 'Selecciona quién avanzó'}
          </p>

          <p className="text-white/35 text-xs mt-1">
            {definicion
              ? `Definición: ${getLabelDefinicion(definicion)}`
              : 'Selecciona cómo se definió el partido'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={!completo || saving}
          className="rounded-xl px-5 py-3 text-sm font-bold disabled:opacity-40"
          style={{
            background: '#F4A7B9',
            color: '#111F18',
          }}
        >
          {saving
            ? 'Guardando...'
            : saved
              ? '✓ Guardado'
              : 'Guardar resultado'}
        </button>
      </div>
    </div>
  )
}

export default function AdminOctavosPage() {
  const { user } = useAuth()

  const [resultados, setResultados] = useState({})
  const [loading, setLoading] = useState(true)

  const esAdmin = user?.email === ADMIN_EMAIL

  const cargarResultados = useCallback(async () => {
    const { data } = await supabase
      .from('resultados')
      .select('id,partido_id,resultado,definicion,goles_local,goles_visitante')

    const map = {}

    ;(data || []).forEach((r) => {
      map[r.partido_id] = r
    })

    setResultados(map)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargarResultados()
  }, [cargarResultados])

  const handleSave = async (partido, payload) => {
    const existing = resultados[partido.id]

    if (existing?.id) {
      const { data, error } = await supabase
        .from('resultados')
        .update({
          resultado: payload.resultado,
          definicion: payload.definicion,
          goles_local: payload.goles_local,
          goles_visitante: payload.goles_visitante,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error

      setResultados((prev) => ({
        ...prev,
        [partido.id]: data,
      }))

      return
    }

    const { data, error } = await supabase
      .from('resultados')
      .insert({
        partido_id: partido.id,
        resultado: payload.resultado,
        definicion: payload.definicion,
        goles_local: payload.goles_local,
        goles_visitante: payload.goles_visitante,
      })
      .select()
      .single()

    if (error) throw error

    setResultados((prev) => ({
      ...prev,
      [partido.id]: data,
    }))
  }

  if (!esAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1
          className="text-4xl font-black text-white"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Admin 16avos
        </h1>

        <p className="text-white/50 mt-3">
          No tienes permisos para ver esta página.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-white/50">
          Cargando admin de 16avos...
        </p>
      </div>
    )
  }

  const resultadosCargados = OCTAVOS.filter((partido) => {
    return resultados[partido.id] || partido.resultadoOficial
  }).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[#F4A7B9] text-sm font-bold uppercase tracking-widest">
          Admin
        </p>

        <h1
          className="text-4xl sm:text-5xl font-black text-white mt-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Resultados de 16avos
        </h1>

        <p className="text-white/55 mt-2">
          Captura quién avanzó, el marcador y si el partido se definió en tiempo regular, tiempos extras o penales.
        </p>
      </div>

      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: 'rgba(244,167,185,0.08)',
          border: '1px solid rgba(244,167,185,0.16)',
        }}
      >
        <p className="text-white font-bold">
          Resultados cargados: {resultadosCargados}/{OCTAVOS.length}
        </p>

        <p className="text-white/45 text-sm mt-1">
          Cada partido puede dar hasta 2 puntos: 1 por quién avanzó y 1 por cómo avanzó.
        </p>
      </div>

      {OCTAVOS.map((partido) => (
        <AdminPartidoCard
          key={partido.id}
          partido={partido}
          resultadoGuardado={resultados[partido.id]}
          onSave={handleSave}
        />
      ))}
    </div>
  )
}
