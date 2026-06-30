import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { OCTAVOS } from '../lib/config'

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

function labelDefinicion(value) {
  if (value === 'REGULAR') return 'Regular'
  if (value === 'EXTRAS') return 'Extras'
  if (value === 'PENALES') return 'Penales'

  return ''
}

export default function PrediccionesEliminatoriasPage() {
  const [predsPorPartido, setPredsPorPartido] = useState({})
  const [totalJugadores, setTotalJugadores] = useState(0)
  const [loading, setLoading] = useState(true)

  const cargar = useCallback(async () => {
    setLoading(true)

    const [profiles, predicciones] = await Promise.all([
      leerTodo('profiles', 'id,nombre,email'),
      leerTodo('predicciones', 'user_id,partido_id,resultado,definicion'),
    ])

    const nombreMap = {}
    profiles.forEach((p) => {
      nombreMap[p.id] = p.nombre || p.email || 'Participante'
    })

    const idsOctavos = OCTAVOS.map((p) => p.id)

    const porPartido = {}
    const usuariosConPred = {}

    predicciones.forEach((p) => {
      if (!idsOctavos.includes(p.partido_id)) return
      if (!p.resultado) return

      if (!porPartido[p.partido_id]) {
        porPartido[p.partido_id] = { L: [], V: [] }
      }

      const lado = p.resultado === 'L' ? 'L' : p.resultado === 'V' ? 'V' : null
      if (!lado) return

      porPartido[p.partido_id][lado].push({
        nombre: nombreMap[p.user_id] || 'Participante',
        definicion: p.definicion,
      })

      usuariosConPred[p.user_id] = true
    })

    setPredsPorPartido(porPartido)
    setTotalJugadores(Object.keys(usuariosConPred).length)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-white/50">Cargando predicciones...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[#F4A7B9] text-sm font-bold uppercase tracking-widest">
          Eliminatorias · Mundial 2026
        </p>

        <h1
          className="text-4xl sm:text-5xl font-black text-white mt-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Predicciones de 16avos
        </h1>

        <p className="text-white/55 mt-2">
          Mira qué eligió cada quien en cada partido. {totalJugadores} {totalJugadores === 1 ? 'participante ha' : 'participantes han'} hecho sus picks.
        </p>
      </div>

      <div className="space-y-4">
        {OCTAVOS.map((partido) => {
          const votos = predsPorPartido[partido.id] || { L: [], V: [] }

          const columnas = [
            { lado: 'L', equipo: partido.local, flag: partido.localFlag, gente: votos.L },
            { lado: 'V', equipo: partido.visitante, flag: partido.visitanteFlag, gente: votos.V },
          ]

          return (
            <div
              key={partido.id}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(244,167,185,0.06)',
                border: '1px solid rgba(244,167,185,0.14)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-white/35">
                  {partido.id} · 16avos
                </span>

                {partido.bloqueado && (
                  <span className="text-xs font-bold text-[#F4A7B9]">
                    Cerrado
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="text-2xl">{partido.localFlag}</span>
                <span className="font-bold text-lg text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {partido.local}
                </span>
                <span className="text-white/30 text-sm mx-1">vs</span>
                <span className="font-bold text-lg text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {partido.visitante}
                </span>
                <span className="text-2xl">{partido.visitanteFlag}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {columnas.map((col) => (
                  <div
                    key={col.lado}
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div
                      className="px-3 py-2 text-center"
                      style={{ background: 'rgba(244,167,185,0.16)' }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-[#F8C5D3] m-0">
                        Avanza {col.flag} {col.equipo}
                      </p>
                      <p className="text-white font-black text-lg m-0" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {col.gente.length}
                      </p>
                    </div>

                    <div className="px-2 py-2">
                      {col.gente.length === 0 ? (
                        <p className="text-center text-xs py-2 text-white/20 m-0">—</p>
                      ) : (
                        col.gente.map((g, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 px-2 py-1.5"
                          >
                            <span className="text-sm text-white/80 truncate">
                              {nombreCorto(g.nombre)}
                            </span>

                            {g.definicion && (
                              <span
                                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{
                                  background: 'rgba(244,167,185,0.15)',
                                  color: '#F8C5D3',
                                }}
                              >
                                {labelDefinicion(g.definicion)}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
