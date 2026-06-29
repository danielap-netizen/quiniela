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

export default function TablaEliminatoriasPage() {
  const [participantes, setParticipantes] = useState([])
  const [resultados, setResultados] = useState({})
  const [loading, setLoading] = useState(true)

  const cargar = useCallback(async () => {
    setLoading(true)

    const [profiles, predicciones, resultadosData] = await Promise.all([
      leerTodo('profiles', 'id,nombre,email,pago'),
      leerTodo('predicciones', 'user_id,partido_id,resultado'),
      leerTodo('resultados', 'partido_id,resultado,goles_local,goles_visitante'),
    ])

    const idsEliminatorias = ELIMINATORIAS.map((p) => p.id)

    const resMap = {}
    resultadosData.forEach((r) => {
      if (idsEliminatorias.includes(r.partido_id)) {
        resMap[r.partido_id] = r
      }
    })

    const predsPorUsuario = {}
    predicciones.forEach((p) => {
      if (!idsEliminatorias.includes(p.partido_id)) return

      if (!predsPorUsuario[p.user_id]) {
        predsPorUsuario[p.user_id] = {}
      }

      predsPorUsuario[p.user_id][p.partido_id] = p.resultado
    })

    const tablaCompleta = profiles.map((profile) => {
      const preds = predsPorUsuario[profile.id] || {}

      let puntos = 0

      ELIMINATORIAS.forEach((partido) => {
        const pred = preds[partido.id]
        const res = resMap[partido.id]

        if (pred && res && pred === res.resultado) {
          puntos += 1
        }
      })

      const hechas = Object.keys(preds).length
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
      }
    })

    const soloCompletos = tablaCompleta.filter((p) => p.completo)

    soloCompletos.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos
      return a.nombre.localeCompare(b.nombre)
    })

    setParticipantes(soloCompletos)
    setResultados(resMap)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-white/50">Cargando tabla de eliminatorias...</p>
      </div>
    )
  }

  const partidosConResultado = Object.keys(resultados).length

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
          Esta tabla es independiente de la fase de grupos. Solo aparecen quienes ya completaron sus predicciones de octavos.
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
          Cada acierto vale 1 punto. Por ahora esta tabla calcula octavos.
        </p>
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
            Todavía no hay participantes completos en octavos.
          </p>
          <p className="text-white/45 text-sm mt-2">
            En esta tabla solo aparecerán quienes hayan guardado sus 8 predicciones de octavos.
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
                    8/8 predicciones hechas · completo
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
      )}
    </div>
  )
}
