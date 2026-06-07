// Abre/suscribe el calendario según el dispositivo
export function descargarCalendario() {
  const host = 'quiniela-chi.vercel.app'
  const path = '/api/calendario'
  const ua = navigator.userAgent || navigator.vendor || ''

  const esApple = /iPhone|iPad|iPod|Macintosh/i.test(ua)
  const esAndroid = /Android/i.test(ua)

  if (esApple) {
    // iPhone/Mac: suscripción que se actualiza sola
    window.location.href = `webcal://${host}${path}`
  } else if (esAndroid) {
    // Android: agregar vía Google Calendar (suscripción por URL)
    const url = `https://${host}${path}`
    window.open(
      `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(url)}`,
      '_blank'
    )
  } else {
    // Computadora u otro: descarga directa del archivo
    window.location.href = `https://${host}${path}`
  }
}
