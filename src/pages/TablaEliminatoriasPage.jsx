import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { ELIMINATORIAS } from '../lib/config'

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

function nombreCorto(nombre) {
  const partes = String(nombre || 'Participante').trim().split(/\s+/)

  return partes
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
}

function getLabelDefinicion(value) {
  if (value === 'REGULAR') return 'Tiempo regular'
  if (value === 'EXTRAS') return 'Tiempos extras'
  if (value === 'PENALES') return 'Penales'

  return ''
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

function getPrediccionResultado(partido, prediccion) {
  if (partido.bloqueado && partido.resultadoOficial) {
    return partido.resultadoOficial
  }

  return prediccion?.resultado || null
}

function getPrediccionDefinicion(partido, prediccion) {
  if (partido.bloqueado && partido.resultadoOficial) {
    return partido.definicionOficial || 'REGULAR'
  }

  return prediccion?.definicion || null
}

export default function TablaEliminatoriasPage() {
  const [participantes, setParticipantes] = useState([])
  const [resultados, setResultados] = useState({})
  const [loading, setLoading] = useState(true)

  const cargar = useCallback(async () => {
    setLoading(true)

    const [profiles, predicciones, resultadosData] = await Promise.all([
      leerTodo('profiles', 'id,nombre,email,pago'),
      leerTodo('predicciones', 'user_id,partido_id,resultado,definicion'),
      leerTodo('resultados', 'partido_id,resultado,definicion,goles_local,goles_visitante'),
    ])

    const idsEliminatorias = ELIMINATORIAS.map((p) => p.id)

    const resMap = {}

    resultadosData.forEach((r) => {
      if (idsEliminatorias.includes(r.partido_id)) {
        resMap[r.partido_id] = r
      }
    })

    ELIMINATORIAS.forEach((partido) => {
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

    const predsPorUsuario = {}

    predicciones.forEach((p) => {
      if (!idsEliminatorias.includes(p.partido_id)) return

      if (!predsPorUsuario[p.user_id]) {
        predsPorUsuario[p.user_id] = {}
      }

      predsPorUsuario[p.user_id][p.partido_id] = {
        resultado: p.resultado,
        definicion: p.definicion,
      }
    })

    const tablaCompleta = profiles.map((profile) => {
      const preds = predsPorUsuario[profile.id] || {}

      let puntos = 0
      let hechas = 0
      let aciertosAvanza = 0
      let aciertosDefinicion = 0

      ELIMINATORIAS.forEach((partido) => {
        const prediccion = preds[partido.id]
        const resultadoGuardado = resMap[partido.id]

        const predResultado = getPrediccionResultado(partido, prediccion)
        const predDefinicion = getPrediccionDefinicion(partido, prediccion)

        const resultadoOficial = getResultadoOficial(partido, resultadoGuardado)
        const definicionOficial = getDefinicionOficial(partido, resultadoGuardado)

        if (predResultado && predDefinicion) {
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

      const faltantes = ELIMINATORIAS.length - hechas

      return {
        id: profile.id,
        nombre: profile.nombre || profile.email || 'Participante',
        email: profile.email,
        pago: profile.pago,
        puntos,
        hechas,
        faltantes,
        completo: faltantes === 0,
        aciertosAvanza,
        aciertosDefinicion,
      }
    })

    // Mostrar a quienes hicieron AL MENOS 1 prediccion de eliminatorias
    const participantesEliminatorias = tablaCompleta.filter((p) => p.hechas > 0)

    participantesEliminatorias.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos
      if (b.aciertosAvanza !== a.aciertosAvanza) return b.aciertosAvanza - a.aciertosAvanza

      return a.nombre.localeCompare(b.nombre)
    })

    setParticipantes(participantesEliminatorias)
    setResultados(resMap)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-white/50">
          Cargando tabla de eliminatorias...
        </p>
      </div>
    )
  }

  const maxPuntos = ELIMINATORIAS.length * 2

  const partidosConResultado = ELIMINATORIAS.filter((partido) => {
    const resultadoGuardado = resultados[partido.id]
    const resultadoOficial = getResultadoOficial(partido, resultadoGuardado)
    const definicionOficial = getDefinicionOficial(partido, resultadoGuardado)

    return Boolean(resultadoOficial && definicionOficial)
  }).length

  const primerPartido = ELIMINATORIAS[0]
  const primerResultado = resultados[primerPartido?.id]
  const primerDefinicion = getDefinicionOficial(primerPartido, primerResultado)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[#F4A7B9] text-sm font-bold uppercase tracking-widest">
          Quiniela Mundial 2026
        </p>

        <h1
          className="text-4xl sm:text-5xl font-black text-white mt-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Tabla de eliminatorias
        </h1>

        <p className="text-white/55 mt-2">
          Esta tabla es independiente de la fase de grupos. Cada partido puede dar hasta 2 puntos.
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
          Resultados cargados: {partidosConResultado}/{ELIMINATORIAS.length}
        </p>

        <p className="text-white/45 text-sm mt-1">
          1 punto por atinar quién avanza y 1 punto por atinar cómo se definió: tiempo regular, tiempos extras o penales.
        </p>

        {primerPartido?.resultadoOficial && (
          <p className="text-white/45 text-sm mt-2">
            Canadá ya cuenta como ganador del primer partido cerrado. Definición: {getLabelDefinicion(primerDefinicion)}.
          </p>
        )}
      </div>

      {participantes.length === 0 ? (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-white font-bold text-lg">
            Todavía no hay participantes en 16avos.
          </p>

          <p className="text-white/45 text-sm mt-2">
            Aquí aparecerá quien haya hecho al menos una predicción de 16avos.
          </p>
        </div>
      ) : (
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
                    {p.hechas}/{ELIMINATORIAS.length} predicciones hechas{p.completo ? ' · completo' : ''}
                  </p>

                  <p className="text-white/30 text-xs mt-1">
                    {p.aciertosAvanza} aciertos de ganador · {p.aciertosDefinicion} aciertos de definición
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[#F4A7B9] text-2xl font-black">
                  {p.puntos}
                </p>

                <p className="text-white/35 text-xs uppercase tracking-widest">
                  de {maxPuntos} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
