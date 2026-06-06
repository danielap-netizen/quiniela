import { PARTIDOS, NOMBRE_CORTO } from './config'

// Convierte una fecha ISO a formato de calendario UTC: 20260611T190000Z
function aFormatoICS(iso) {
  const d = new Date(iso)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

// Limpia texto para que sea seguro en un archivo .ics
function limpiar(texto) {
  return String(texto)
    .replace(/\\/g, '')
    .replace(/,/g, ' ')
    .replace(/;/g, ' ')
    .replace(/·/g, '-')
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
    `X-WR-CALNAME:${limpiar(NOMBRE_CORTO)}`,
  ]

  PARTIDOS.forEach(p => {
    const inicio = aFormatoICS(p.fecha)
    const finDate = new Date(new Date(p.fecha).getTime() + 2 * 60 * 60 * 1000)
    const fin = aFormatoICS(finDate.toISOString())
    const titulo = limpiar(`${p.local} vs ${p.visitante}`)
    const desc = limpiar(`Mundial 2026 - Grupo ${p.grupo} - ${p.ciudad}`)
    const lugar = limpiar(p.ciudad)

    lineas.push(
      'BEGIN:VEVENT',
      `UID:mundial2026-${p.id}@quiniela`,
      `DTSTAMP:${ahora}`,
      `DTSTART:${inicio}`,
      `DTEND:${fin}`,
      `SUMMARY:${titulo}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${lugar}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${titulo}`,
      'TRIGGER:-PT30M',
      'END:VALARM',
      'END:VEVENT'
    )
  })

  lineas.push('END:VCALENDAR')
  lineas.push('')
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
