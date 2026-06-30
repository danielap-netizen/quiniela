import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { OCTAVOS } from '../lib/config'

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

function getLabelDefinicion(value) {
  return DEFINICIONES.find((d) => d.value === value)?.label || ''
}

function getResultadoOficial(partido, resultadoGuardado) {
  if (partido.resultadoOficial) return partido.resultadoOficial
  return resultadoGuardado?.resultado || null
}

function getDefinicionOficial(partido, resultadoGuardado) {
  if (partido.resultadoOficial) return partido.definicionOficial || 'REGULAR'
  return resultadoGuardado?.definicion || null
}

function getGolesLocal(partido, resultadoGuardado) {
  if (partido.resultadoOficial) return partido.golesLocalOficial
  return resultadoGuardado?.goles_local
}

function getGolesVisitante(partido, resultadoGuardado) {
  if (partido.resultadoOficial) return partido.golesVisitanteOficial
  return resultadoGuardado?.goles_visitante
}

function nombreCorto(nombre) {
  const partes = String(nombre || 'Participante').trim().split(/\s+/)

  return partes
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
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

  if (partidosTerminados.length === 0) {
    return (
      <p className="text-white/45">
        Todavía no hay resultados. En cuanto se jueguen los partidos, aparecerán aquí.
      </p>
    )
  }

  const jugados = partidosTerminados.length
  const porJugar = OCTAVOS.length - jugados

  return (
    <div className="mb-8">
      <div className="flex gap-3 mb-5">
        <div
          className="flex-1 rounded-2xl px-5 py-3 text-center"
          style={{ background: 'rgba(244,167,185,0.08)', border: '1px solid rgba(244,167,185,0.16)' }}
        >
          <p className="text-white font-black text-3xl m-0" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {jugados}
          </p>
          <p className="text-[#F4A7B9] text-xs uppercase tracking-widest m-0">Jugados</p>
        </div>

        <div
          className="flex-1 rounded-2xl px-5 py-3 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-white font-black text-3xl m-0" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {porJugar}
          </p>
          <p className="text-white/40 text-xs uppercase tracking-widest m-0">Por jugar</p>
        </div>
      </div>

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

export default function ResultadosEliminatoriasPage() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [resultados, setResultados] = useState({})
  const [aciertosPorPartido, setAciertosPorPartido] = useState({})

  const cargarTodo = useCallback(async () => {
    if (!user) return

    const [perfilesArr, todasPredArr, resultadosData] = await Promise.all([
      leerTodo('profiles', 'id,nombre,email'),
      leerTodo('predicciones', 'user_id,partido_id,resultado,definicion'),
      supabase
        .from('resultados')
        .select('partido_id,resultado,definicion,goles_local,goles_visitante'),
    ])

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

    ;(todasPredArr || []).forEach((p) => {
      if (!idsOctavos.includes(p.partido_id)) return

      if (!predsPorUsuario[p.user_id]) {
        predsPorUsuario[p.user_id] = {}
      }

      predsPorUsuario[p.user_id][p.partido_id] = {
        resultado: p.resultado,
        definicion: p.definicion,
      }
    })

    const nombrePorId = {}
    ;(perfilesArr || []).forEach((profile) => {
      nombrePorId[profile.id] = profile.nombre || profile.email || 'Participante'
    })

    const aciertosMap = {}
    OCTAVOS.forEach((partido) => {
      const resultado = resMap[partido.id]
      const resultadoOficial = getResultadoOficial(partido, resultado)
      const definicionOficial = getDefinicionOficial(partido, resultado)

      const lista = []
      let totalConPred = 0

      ;(perfilesArr || []).forEach((profile) => {
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

    setResultados(resMap)
    setAciertosPorPartido(aciertosMap)
    setLoading(false)
  }, [user])

  useEffect(() => {
    cargarTodo()
  }, [cargarTodo])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-white/50">Cargando resultados...</p>
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
          Resultados
        </h1>

        <p className="text-white/55 mt-2">
          Cómo quedó cada partido y quién le atinó.
        </p>
      </div>

      <ResultadosTerminados resultados={resultados} aciertosPorPartido={aciertosPorPartido} />
    </div>
  )
}
