import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { OCTAVOS } from '../lib/config'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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

function getResultadoOficial(partido, resultadoGuardado) {
  if (partido.resultadoOficial) return partido.resultadoOficial
  return resultadoGuardado?.resultado || null
}

function getDefinicionOficial(partido, resultadoGuardado) {
  if (partido.resultadoOficial) return partido.definicionOficial || 'REGULAR'
  return resultadoGuardado?.definicion || null
}

function getValorPrediccion(partido, prediccion) {
  if (partido.bloqueado && partido.resultadoOficial) return partido.resultadoOficial
  return prediccion?.resultado || null
}

function getValorDefinicion(partido, prediccion) {
  if (partido.bloqueado && partido.resultadoOficial) return partido.definicionOficial || 'REGULAR'
  return prediccion?.definicion || null
}

function nombreCorto(nombre) {
  const partes = String(nombre || 'Participante').trim().split(/\s+/)

  return partes
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
}

function getDeadline(partido) {
  return new Date(new Date(partido.fecha).getTime() - 60 * 60 * 1000)
}

function TablaInicio({ participantes }) {
  if (participantes.length === 0) return null

  const puntajesOrdenados = [...new Set(participantes.map((p) => p.puntos))].sort((a, b) => b - a)
  const lugarDe = (pts) => puntajesOrdenados.indexOf(pts) + 1
  const medallaDe = (pts) => {
    const l = lugarDe(pts)
    return l === 1 ? '🥇' : l === 2 ? '🥈' : l === 3 ? '🥉' : null
  }

  return (
    <div className="mt-2">
      <h2
        className="text-2xl font-black text-white mb-3"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        Tabla de participantes
      </h2>

      <div className="space-y-3">
        {participantes.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-4 flex items-center justify-between gap-4"
            style={{
              background:
                lugarDe(p.puntos) === 1
                  ? 'rgba(244,167,185,0.14)'
                  : 'rgba(255,255,255,0.04)',
              border:
                lugarDe(p.puntos) === 1
                  ? '1px solid rgba(244,167,185,0.35)'
                  : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black flex-shrink-0"
                style={{
                  background: lugarDe(p.puntos) === 1 ? '#F4A7B9' : 'rgba(244,167,185,0.12)',
                  color: lugarDe(p.puntos) === 1 ? '#111F18' : '#F4A7B9',
                }}
              >
                {lugarDe(p.puntos)}
              </div>

              <div className="min-w-0">
                <p className="text-white font-bold truncate">
                  {medallaDe(p.puntos) ? medallaDe(p.puntos) + ' ' : ''}{nombreCorto(p.nombre)}
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

function formatCuenta(ms) {
  if (ms <= 0) return null
  const totalMin = Math.floor(ms / 60000)
  const dias = Math.floor(totalMin / (60 * 24))
  const horas = Math.floor((totalMin % (60 * 24)) / 60)
  const min = totalMin % 60

  if (dias > 0) return `${dias}d ${horas}h`
  const hh = String(horas).padStart(2, '0')
  const mm = String(min).padStart(2, '0')
  return `${hh}:${mm}`
}

export default function OctavosPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(new Date())
  const [resultados, setResultados] = useState({})
  const [participantes, setParticipantes] = useState([])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)

    return () => clearInterval(t)
  }, [])

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

    const tabla = (perfilesArr || []).map((profile) => {
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

    setResultados(resMap)
    setParticipantes(tablaConPuntos)
    setLoading(false)
  }, [user])

  useEffect(() => {
    cargarTodo()
  }, [cargarTodo])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-white/50">Cargando...</p>
      </div>
    )
  }

  const jugados = OCTAVOS.filter((p) => getResultadoOficial(p, resultados[p.id])).length
  const porJugar = OCTAVOS.length - jugados

  // Próximo partido: el primero (por fecha) que aún no se ha jugado
  const proximo = [...OCTAVOS]
    .filter((p) => !getResultadoOficial(p, resultados[p.id]))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0]

  const cuenta = proximo ? formatCuenta(getDeadline(proximo).getTime() - now.getTime()) : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* HERO */}
      <div
        className="rounded-3xl p-6 sm:p-7 mb-5"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(244,167,185,0.22), rgba(244,167,185,0.03) 65%)',
          border: '1px solid rgba(244,167,185,0.2)',
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-[#F8C5D3]">
          🔥 Quiniela Mundial 2026 · Familia Pereyra Fernández
        </p>

        <h1
          className="text-5xl font-black text-white mt-1.5 leading-none"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Eliminatorias
        </h1>

        <div
          className="inline-flex items-center gap-2 mt-3 px-3.5 py-1.5 rounded-full"
          style={{
            background: 'rgba(244,167,185,0.15)',
            border: '1px solid rgba(244,167,185,0.3)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#F4A7B9' }}
          />
          <span className="text-xs font-bold uppercase tracking-wide text-[#F8C5D3]">
            Fase: 16avos de final
          </span>
        </div>
      </div>

      {/* PRÓXIMO PARTIDO */}
      {proximo && cuenta && (
        <div
          className="rounded-2xl p-4 sm:p-5 mb-4"
          style={{
            background:
              'linear-gradient(100deg, rgba(244,167,185,0.16), rgba(244,167,185,0.03))',
            border: '1px solid rgba(244,167,185,0.2)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#F4A7B9]/70">
                ⏱️ Cierra pronto
              </p>

              <p
                className="text-lg font-black text-white mt-1"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {proximo.localFlag} {proximo.local} vs {proximo.visitante} {proximo.visitanteFlag}
              </p>
            </div>

            <div
              className="text-center rounded-xl px-4 py-2"
              style={{ background: 'rgba(17,31,24,0.4)' }}
            >
              <p
                className="text-2xl font-black text-[#F4A7B9] leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {cuenta}
              </p>

              <p className="text-[9px] uppercase text-white/40 mt-0.5">
                para cerrar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* JUGADOS / POR JUGAR */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(244,167,185,0.12)',
            border: '1px solid rgba(244,167,185,0.22)',
          }}
        >
          <p
            className="text-5xl font-black text-[#F4A7B9] leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {jugados}
          </p>

          <p className="text-xs font-bold uppercase tracking-wide text-[#F8C5D3] mt-1">
            Jugados
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p
            className="text-5xl font-black text-white leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {porJugar}
          </p>

          <p className="text-xs font-bold uppercase tracking-wide text-white/40 mt-1">
            Por jugar
          </p>
        </div>
      </div>

      {/* TABLA COMPLETA */}
      <TablaInicio participantes={participantes} />

      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => navigate('/predicciones-editar')}
        className="w-full rounded-2xl px-5 py-4 mb-2.5 mt-5 flex items-center justify-between"
        style={{
          background: '#F4A7B9',
          boxShadow: '0 4px 20px rgba(244,167,185,0.15)',
        }}
      >
        <span className="font-bold text-base text-[#111F18]">
          ✏️ Hacer mis predicciones
        </span>
        <span className="font-bold text-lg text-[#111F18]">→</span>
      </button>

      {/* BOTONES SECUNDARIOS */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => navigate('/predicciones-16avos')}
          className="rounded-2xl px-4 py-4 text-center font-semibold text-white"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          👀 Destapadas
        </button>

        <button
          onClick={() => navigate('/resultados-16avos')}
          className="rounded-2xl px-4 py-4 text-center font-semibold text-white"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          ⚽ Resultados
        </button>
      </div>
    </div>
  )
}
