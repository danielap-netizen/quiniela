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

async function leerTodo(tabla, columnas) {
  let todas = []
  let desde = 0
  const tam = 1000

  while (true) {
    const { data, error } = await supabase
      .from(tabla)
      .select(columnas)
      .range(desde, desde + tam - 1)

    if (error || !data || data.length === 0) break

    todas = todas.concat(data)

    if (data.length < tam) break

    desde += tam
  }

  return todas
}

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

function unirNombres(lista) {
  if (lista.length === 0) return ''
  if (lista.length === 1) return lista[0]
  if (lista.length === 2) return `${lista[0]} y ${lista[1]}`
  return `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`
}

function fraseBanda(aciertos, total) {
  if (total === 0) return ''
  if (aciertos === 0) return '¡Nadie la vio venir! 😅'
  if (aciertos === total) return '¡Toda la banda le atinó! 🎯'
  const prop = aciertos / total
  if (prop <= 0.3) return 'Sorpresón pa\' la raza 😮'
  if (prop >= 0.7) return '¡La bandita se volvió loca y le atinó! 🔥'
  return 'Estuvo dividida la raza'
}

function ResultadosTerminados({ resultados, aciertosPorPartido }) {
  const partidosTerminados = OCTAVOS.filter((partido) => {
    return Boolean(getResultadoOficial(partido, resultados[partido.id]))
  })

  if (partidosTerminados.length === 0) return null

  return (
    <div className="mb-8">
      <h2
        className="text-3xl font-black text-white mb-4"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        Resultados
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {partidosTerminados.map((partido) => {
          const resultado = resultados[partido.id]
          const ganador = getResultadoOficial(partido, resultado)
          const definicion = getDefinicionOficial(partido, resultado)
          const golesLocal = getGolesLocal(partido, resultado)
          const golesVisitante = getGolesVisitante(partido, resultado)

          const ganadorNombre =
            ganador === 'L'
              ? partido.local
              : ganador === 'V'
                ? partido.visitante
                : ''

          const info = aciertosPorPartido[partido.id] || { lista: [], totalConPred: 0 }
          const aciertanGanador = info.lista.filter((g) => g.ganador)
          const frase = fraseBanda(aciertanGanador.length, info.totalConPred)

          return (
            <div
              key={partido.id}
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-white/35 text-xs font-mono tracking-widest uppercase">
                {partido.id} · 16avos
              </p>

              <p className="text-white font-bold mt-2">
                {partido.localFlag} {partido.local} {golesLocal}-{golesVisitante} {partido.visitanteFlag} {partido.visitante}
              </p>

              <p className="text-[#F4A7B9] text-sm font-bold mt-2">
                Avanzó {ganadorNombre} · {getLabelDefinicion(definicion)}
              </p>

              {info.totalConPred > 0 && (
                <>
                  <div
                    className="mt-3 pt-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-white/70 text-sm font-semibold m-0">
                      ✓ {aciertanGanador.length} de {info.totalConPred} le {aciertanGanador.length === 1 ? 'atinó' : 'atinaron'} al ganador
                    </p>

                    {frase && (
                      <p className="text-white/45 text-sm mt-1 mb-0">
                        {frase}
                      </p>
                    )}
                  </div>

                  {info.lista.length > 0 && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      {info.lista.map((g, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-sm text-white/80">
                            {nombreCorto(g.nombre)}
                          </span>

                          <span className="flex items-center gap-1 flex-shrink-0">
                            {g.ganador && (
                              <span
                                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(244,167,185,0.18)', color: '#F8C5D3' }}
                              >
                                Ganador
                              </span>
                            )}
                            {g.definicion && (
                              <span
                                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(244,167,185,0.10)', color: 'rgba(248,197,211,0.8)' }}
                              >
                                Definición
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TablaInicio({ participantes }) {
  if (participantes.length === 0) return null

  return (
    <div className="mb-8">
      <h2
        className="text-3xl font-black text-white mb-4"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        Tabla de participantes
      </h2>

      <div className="space-y-3">
        {participantes.map((p, index) => (
          <div
            key={p.id}
            className="rounded-2xl p-4 flex items-center justify-between gap-4"
            style={{
              background:
                index === 0
                  ? 'rgba(244,167,185,0.14)'
                  : 'rgba(255,255,255,0.04)',
              border:
                index === 0
                  ? '1px solid rgba(244,167,185,0.35)'
                  : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black"
                style={{
                  background: index === 0 ? '#F4A7B9' : 'rgba(244,167,185,0.12)',
                  color: index === 0 ? '#111F18' : '#F4A7B9',
                }}
              >
                {index + 1}
              </div>

              <div className="min-w-0">
                <p className="text-white font-bold truncate">
                  {nombreCorto(p.nombre)}
                </p>

                <p className="text-white/40 text-sm">
                  {p.hechas}/{OCTAVOS.filter((o) => !o.bloqueado).length} predicciones hechas
                </p>

                <p className="text-white/35 text-xs mt-1">
                  {p.aciertosAvanza} ganador · {p.aciertosDefinicion} definición
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[#F4A7B9] text-2xl font-black">
                {p.puntos}
              </p>

              <p className="text-white/35 text-xs uppercase tracking-widest">
                puntos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OctavosPage() {
  const { user } = useAuth()

  const [preds, setPreds] = useState({})
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(new Date())
  const [resultados, setResultados] = useState({})
  const [participantes, setParticipantes] = useState([])
  const [aciertosPorPartido, setAciertosPorPartido] = useState({})

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)

    return () => clearInterval(t)
  }, [])

  const cargarTodo = useCallback(async () => {
    if (!user) return

    const [
      misPredicciones,
      perfilesArr,
      todasPredArr,
      resultadosData,
    ] = await Promise.all([
      supabase
        .from('predicciones')
        .select('*')
        .eq('user_id', user.id),
      leerTodo('profiles', 'id,nombre,email,pago'),
      leerTodo('predicciones', 'user_id,partido_id,resultado,definicion'),
      supabase
        .from('resultados')
        .select('partido_id,resultado,definicion,goles_local,goles_visitante'),
    ])

    const perfilesData = { data: perfilesArr }
    const todasPredicciones = { data: todasPredArr }

    const misMap = {}

    ;(misPredicciones.data || []).forEach((p) => {
      misMap[p.partido_id] = p
    })

    const resMap = {}

    ;(resultadosData.data || []).forEach((r) => {
      resMap[r.partido_id] = r
    })

    OCTAVOS.forEach((partido) => {
      if (partido.resultadoOficial) {
        resMap[partido.id] = {
          partido_id: partido.id,
          resultado: partido.resultadoOficial,
          definicion: partido.definicionOficial || 'REGULAR',
          goles_local: partido.golesLocalOficial,
          goles_visitante: partido.golesVisitanteOficial,
          oficial: true,
        }
      }
    })

    const idsOctavos = OCTAVOS.map((p) => p.id)

    const predsPorUsuario = {}

    ;(todasPredicciones.data || []).forEach((p) => {
      if (!idsOctavos.includes(p.partido_id)) return

      if (!predsPorUsuario[p.user_id]) {
        predsPorUsuario[p.user_id] = {}
      }

      predsPorUsuario[p.user_id][p.partido_id] = {
        resultado: p.resultado,
        definicion: p.definicion,
      }
    })

    const tabla = (perfilesData.data || []).map((profile) => {
      const userPreds = predsPorUsuario[profile.id] || {}

      let puntos = 0
      let aciertosAvanza = 0
      let aciertosDefinicion = 0
      let hechas = 0

      OCTAVOS.forEach((partido) => {
        const pred = userPreds[partido.id]
        const resultado = resMap[partido.id]

        const predResultado = getValorPrediccion(partido, pred)
        const predDefinicion = getValorDefinicion(partido, pred)

        const resultadoOficial = getResultadoOficial(partido, resultado)
        const definicionOficial = getDefinicionOficial(partido, resultado)

        if (!partido.bloqueado && pred?.resultado && pred?.definicion) {
          hechas += 1
        }

        if (predResultado && resultadoOficial && predResultado === resultadoOficial) {
          puntos += 1
          aciertosAvanza += 1
        }

        if (predDefinicion && definicionOficial && predDefinicion === definicionOficial) {
          puntos += 1
          aciertosDefinicion += 1
        }
      })

      return {
        id: profile.id,
        nombre: profile.nombre || profile.email || 'Participante',
        email: profile.email,
        puntos,
        hechas,
        aciertosAvanza,
        aciertosDefinicion,
      }
    })

    const tablaConPuntos = tabla
      .filter((p) => p.hechas > 0)
      .sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos
        if (b.aciertosAvanza !== a.aciertosAvanza) return b.aciertosAvanza - a.aciertosAvanza

        return a.nombre.localeCompare(b.nombre)
      })

    // Mapa de aciertos por partido (con nombres) para la narración de Resultados
    const nombrePorId = {}
    ;(perfilesData.data || []).forEach((profile) => {
      nombrePorId[profile.id] = profile.nombre || profile.email || 'Participante'
    })

    const aciertosMap = {}
    OCTAVOS.forEach((partido) => {
      const resultado = resMap[partido.id]
      const resultadoOficial = getResultadoOficial(partido, resultado)
      const definicionOficial = getDefinicionOficial(partido, resultado)

      const lista = []
      let totalConPred = 0

      ;(perfilesData.data || []).forEach((profile) => {
        const pred = (predsPorUsuario[profile.id] || {})[partido.id]
        if (!pred?.resultado) return

        totalConPred += 1

        const atinoGanador = resultadoOficial && pred.resultado === resultadoOficial
        const atinoDefinicion = definicionOficial && pred.definicion === definicionOficial

        if (atinoGanador || atinoDefinicion) {
          lista.push({
            nombre: nombrePorId[profile.id] || 'Participante',
            ganador: Boolean(atinoGanador),
            definicion: Boolean(atinoDefinicion),
          })
        }
      })

      aciertosMap[partido.id] = { lista, totalConPred }
    })

    setPreds(misMap)
    setResultados(resMap)
    setParticipantes(tablaConPuntos)
    setAciertosPorPartido(aciertosMap)
    setLoading(false)
  }, [user])

  useEffect(() => {
    cargarTodo()
  }, [cargarTodo])

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

    cargarTodo()
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
          Cargando 16avos...
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
          16avos
        </h1>

        <p className="text-white/55 mt-2">
          Seguimos con la fase de eliminatorias. Elige quién avanza y cómo se define cada partido.
        </p>
      </div>

      <ResultadosTerminados resultados={resultados} aciertosPorPartido={aciertosPorPartido} />

      <TablaInicio participantes={participantes} />

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
