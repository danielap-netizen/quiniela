import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { FECHA_CIERRE, PARTIDOS, GRUPOS } from '../lib/config'
import { useAuth } from '../lib/auth'
import { descargarCalendario } from '../lib/calendario'

function nombreCorto(nombre) {
  const partes = String(nombre || 'Participante').trim().split(/\s+/)
  return partes.slice(0, 2)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
}

function unirNombres(lista) {
  const ns = lista.map(nombreCorto)
  if (ns.length === 0) return ''
  if (ns.length === 1) return ns[0]
  if (ns.length === 2) return `${ns[0]} y ${ns[1]}`
  return `${ns.slice(0, -1).join(', ')} y ${ns[ns.length - 1]}`
}

// Lee TODAS las filas de una tabla en bloques de 1000 (Supabase limita a 1000 por consulta)
async function leerTodo(tabla, columnas) {
  let todas = []
  let desde = 0
  const tam = 1000
  while (true) {
    const { data, error } = await supabase.from(tabla).select(columnas).range(desde, desde + tam - 1)
    if (error || !data || data.length === 0) break
    todas = todas.concat(data)
    if (data.length < tam) break
    desde += tam
  }
  return todas
}

// Baraja un arreglo al azar (Fisher-Yates)
function barajar(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function fraseNarracion(p, res, aciertos, total) {
  const esEmpate = res.resultado === 'E'
  const ganador = res.resultado === 'L' ? p.local : res.resultado === 'V' ? p.visitante : null
  let titulo = esEmpate ? '¡Repartición de puntos! Terminó en empate. 🤝' : `¡Ganó ${ganador}! ⚽`
  let sub
  if (total === 0) sub = ''
  else if (aciertos === 0) sub = '¡Nadie lo vio venir! Cero aciertos en este. 😅'
  else if (aciertos === total) sub = '¡Toda la familia le atinó! 🎯'
  else if (aciertos <= total * 0.3) sub = 'Sorpresa para muchos 😮'
  else if (aciertos >= total * 0.7) sub = '¡La familia lo veía venir!'
  else sub = 'Estuvo dividido el pronóstico.'
  return { titulo, sub }
}

function Countdown({ fechaCierre }) {
  const [diff, setDiff] = useState(fechaCierre - new Date())
  useEffect(() => { const t = setInterval(() => setDiff(fechaCierre - new Date()), 1000); return () => clearInterval(t) }, [fechaCierre])
  if (diff <= 0) return null
  const d = Math.floor(diff/(1000*60*60*24))
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60))
  const m = Math.floor((diff%(1000*60*60))/(1000*60))
  const s = Math.floor((diff%(1000*60))/1000)
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      {[{v:d,l:'días'},{v:h,l:'horas'},{v:m,l:'min'},{v:s,l:'seg'}].map(({v,l}) => (
        <div key={l} className="text-center">
          <div className="glass-card rounded-xl px-4 py-3 min-w-[62px]">
            <span className="font-bold text-4xl text-white tabular-nums" style={{fontFamily:"'Barlow Condensed',sans-serif"}}>{String(v).padStart(2,'0')}</span>
          </div>
          <span className="text-xs font-mono mt-1 block" style={{color:'rgba(244,167,185,0.5)'}}>{l}</span>
        </div>
      ))}
    </div>
  )
}

function Podio({ participantes }) {
  const porPuntaje = {}
  participantes.forEach(p => {
    if (!porPuntaje[p.pts]) porPuntaje[p.pts] = []
    porPuntaje[p.pts].push(p.nombre)
  })
  const puntajes = Object.keys(porPuntaje).map(Number).sort
