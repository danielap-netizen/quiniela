// Suscribe al calendario que se actualiza solo (servido por /api/calendario)
export function descargarCalendario() {
  // webcal:// hace que el teléfono abra la app de Calendario y ofrezca suscribirse
  const url = 'webcal://quiniela-chi.vercel.app/api/calendario'
  window.location.href = url
}
