import { PARTIDOS, NOMBRE_CORTO } from './config'

// Convierte una fecha ISO a formato de calendario UTC: 20260611T190000Z
function aFormatoICS(iso) {
  const d = new Date(iso)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

// Genera el contenido de un archivo .ics con los 72 partidos
function generarICS() {
  const ahora = aFormatoICS(new Date().toISOString())
  let lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Quiniela Mundial 2026//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${NOMBRE_CORTO}`,
  ]

  PARTIDOS.forEach(p => {
    const inicio = aFormatoICS(p.fecha)
    // Duración estimada del partido: 2 horas
    const finDate = new Date(new Date(p.fecha).getTime() + 2 * 60 * 60 * 1000)
    const fin = aFormatoICS(finDate.toISOString())
    const titulo = `${p.local} vs ${p.visitante}`
    const desc = `Mundial 2026 · Grupo ${p.grupo} · ${p.ciudad}`

    lineas.push(
      'BEGIN:VEVENT',
      `UID:${p.id}@quiniela-mundial-2026`,
      `DTSTAMP:${ahora}`,
      `DTSTART:${inicio}`,
      `DTEND:${fin}`,
      `SUMMARY:⚽ ${titulo}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${p.ciudad}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${titulo} empieza en 30 minutos`,
      'END:VALARM',
      'END:VEVENT'
    )
  })

  lineas.push('END:VCALENDAR')
  return lineas.join('\r\n')
}

// Descarga el archivo .ics en el dispositivo del usuario
export function descargarCalendario() {
  const contenido = generarICS()
  const blob = new Blob([contenido], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mundial-2026.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
