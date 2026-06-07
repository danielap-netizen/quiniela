import { createClient } from '@supabase/supabase-js'

// Los 72 partidos (mismos datos que el config del front)
const PARTIDOS = [
  { id:'A1', grupo:'A', local:'México', visitante:'Sudáfrica', fecha:'2026-06-11T19:00:00Z', ciudad:'Ciudad de México' },
  { id:'A2', grupo:'A', local:'Corea del Sur', visitante:'Chequia', fecha:'2026-06-12T02:00:00Z', ciudad:'Guadalajara' },
  { id:'A3', grupo:'A', local:'Chequia', visitante:'Sudáfrica', fecha:'2026-06-18T16:00:00Z', ciudad:'Atlanta' },
  { id:'A4', grupo:'A', local:'México', visitante:'Corea del Sur', fecha:'2026-06-19T01:00:00Z', ciudad:'Guadalajara' },
  { id:'A5', grupo:'A', local:'Chequia', visitante:'México', fecha:'2026-06-25T01:00:00Z', ciudad:'Ciudad de México' },
  { id:'A6', grupo:'A', local:'Sudáfrica', visitante:'Corea del Sur', fecha:'2026-06-25T01:00:00Z', ciudad:'Monterrey' },
  { id:'B1', grupo:'B', local:'Canadá', visitante:'Bosnia', fecha:'2026-06-12T19:00:00Z', ciudad:'Toronto' },
  { id:'B2', grupo:'B', local:'Qatar', visitante:'Suiza', fecha:'2026-06-13T19:00:00Z', ciudad:'San Francisco' },
  { id:'B3', grupo:'B', local:'Suiza', visitante:'Bosnia', fecha:'2026-06-18T19:00:00Z', ciudad:'Los Ángeles' },
  { id:'B4', grupo:'B', local:'Canadá', visitante:'Qatar', fecha:'2026-06-18T22:00:00Z', ciudad:'Vancouver' },
  { id:'B5', grupo:'B', local:'Suiza', visitante:'Canadá', fecha:'2026-06-24T19:00:00Z', ciudad:'Vancouver' },
  { id:'B6', grupo:'B', local:'Bosnia', visitante:'Qatar', fecha:'2026-06-24T19:00:00Z', ciudad:'Seattle' },
  { id:'C1', grupo:'C', local:'Brasil', visitante:'Marruecos', fecha:'2026-06-13T22:00:00Z', ciudad:'Nueva Jersey' },
  { id:'C2', grupo:'C', local:'Haití', visitante:'Escocia', fecha:'2026-06-14T01:00:00Z', ciudad:'Boston' },
  { id:'C3', grupo:'C', local:'Escocia', visitante:'Marruecos', fecha:'2026-06-19T22:00:00Z', ciudad:'Boston' },
  { id:'C4', grupo:'C', local:'Brasil', visitante:'Haití', fecha:'2026-06-20T00:30:00Z', ciudad:'Philadelphia' },
  { id:'C5', grupo:'C', local:'Escocia', visitante:'Brasil', fecha:'2026-06-24T22:00:00Z', ciudad:'Miami' },
  { id:'C6', grupo:'C', local:'Marruecos', visitante:'Haití', fecha:'2026-06-24T22:00:00Z', ciudad:'Atlanta' },
  { id:'D1', grupo:'D', local:'EUA', visitante:'Paraguay', fecha:'2026-06-13T01:00:00Z', ciudad:'Los Ángeles' },
  { id:'D2', grupo:'D', local:'Australia', visitante:'Turquía', fecha:'2026-06-14T04:00:00Z', ciudad:'Vancouver' },
  { id:'D3', grupo:'D', local:'EUA', visitante:'Australia', fecha:'2026-06-19T19:00:00Z', ciudad:'Seattle' },
  { id:'D4', grupo:'D', local:'Turquía', visitante:'Paraguay', fecha:'2026-06-20T03:00:00Z', ciudad:'San Francisco' },
  { id:'D5', grupo:'D', local:'Turquía', visitante:'EUA', fecha:'2026-06-26T02:00:00Z', ciudad:'Los Ángeles' },
  { id:'D6', grupo:'D', local:'Paraguay', visitante:'Australia', fecha:'2026-06-26T02:00:00Z', ciudad:'San Francisco' },
  { id:'E1', grupo:'E', local:'Alemania', visitante:'Curazao', fecha:'2026-06-14T17:00:00Z', ciudad:'Houston' },
  { id:'E2', grupo:'E', local:'Costa de Marfil', visitante:'Ecuador', fecha:'2026-06-14T23:00:00Z', ciudad:'Philadelphia' },
  { id:'E3', grupo:'E', local:'Alemania', visitante:'Costa de Marfil', fecha:'2026-06-20T20:00:00Z', ciudad:'Toronto' },
  { id:'E4', grupo:'E', local:'Ecuador', visitante:'Curazao', fecha:'2026-06-21T00:00:00Z', ciudad:'Kansas City' },
  { id:'E5', grupo:'E', local:'Ecuador', visitante:'Alemania', fecha:'2026-06-25T20:00:00Z', ciudad:'Nueva Jersey' },
  { id:'E6', grupo:'E', local:'Curazao', visitante:'Costa de Marfil', fecha:'2026-06-25T20:00:00Z', ciudad:'Philadelphia' },
  { id:'F1', grupo:'F', local:'Países Bajos', visitante:'Japón', fecha:'2026-06-14T20:00:00Z', ciudad:'Dallas' },
  { id:'F2', grupo:'F', local:'Suecia', visitante:'Túnez', fecha:'2026-06-15T02:00:00Z', ciudad:'Monterrey' },
  { id:'F3', grupo:'F', local:'Países Bajos', visitante:'Suecia', fecha:'2026-06-20T17:00:00Z', ciudad:'Houston' },
  { id:'F4', grupo:'F', local:'Túnez', visitante:'Japón', fecha:'2026-06-21T04:00:00Z', ciudad:'Monterrey' },
  { id:'F5', grupo:'F', local:'Japón', visitante:'Suecia', fecha:'2026-06-25T23:00:00Z', ciudad:'Dallas' },
  { id:'F6', grupo:'F', local:'Túnez', visitante:'Países Bajos', fecha:'2026-06-25T23:00:00Z', ciudad:'Kansas City' },
  { id:'G1', grupo:'G', local:'Bélgica', visitante:'Egipto', fecha:'2026-06-15T19:00:00Z', ciudad:'Seattle' },
  { id:'G2', grupo:'G', local:'Irán', visitante:'Nueva Zelanda', fecha:'2026-06-16T01:00:00Z', ciudad:'Los Ángeles' },
  { id:'G3', grupo:'G', local:'Bélgica', visitante:'Irán', fecha:'2026-06-21T19:00:00Z', ciudad:'Los Ángeles' },
  { id:'G4', grupo:'G', local:'Nueva Zelanda', visitante:'Egipto', fecha:'2026-06-22T01:00:00Z', ciudad:'Vancouver' },
  { id:'G5', grupo:'G', local:'Egipto', visitante:'Irán', fecha:'2026-06-27T03:00:00Z', ciudad:'Seattle' },
  { id:'G6', grupo:'G', local:'Nueva Zelanda', visitante:'Bélgica', fecha:'2026-06-27T03:00:00Z', ciudad:'Vancouver' },
  { id:'H1', grupo:'H', local:'España', visitante:'Cabo Verde', fecha:'2026-06-15T16:00:00Z', ciudad:'Atlanta' },
  { id:'H2', grupo:'H', local:'Arabia Saudita', visitante:'Uruguay', fecha:'2026-06-15T22:00:00Z', ciudad:'Miami' },
  { id:'H3', grupo:'H', local:'España', visitante:'Arabia Saudita', fecha:'2026-06-21T16:00:00Z', ciudad:'Atlanta' },
  { id:'H4', grupo:'H', local:'Uruguay', visitante:'Cabo Verde', fecha:'2026-06-21T22:00:00Z', ciudad:'Miami' },
  { id:'H5', grupo:'H', local:'Cabo Verde', visitante:'Arabia Saudita', fecha:'2026-06-27T00:00:00Z', ciudad:'Houston' },
  { id:'H6', grupo:'H', local:'Uruguay', visitante:'España', fecha:'2026-06-27T00:00:00Z', ciudad:'Guadalajara' },
  { id:'I1', grupo:'I', local:'Francia', visitante:'Senegal', fecha:'2026-06-16T19:00:00Z', ciudad:'Nueva Jersey' },
  { id:'I2', grupo:'I', local:'Irak', visitante:'Noruega', fecha:'2026-06-16T22:00:00Z', ciudad:'Boston' },
  { id:'I3', grupo:'I', local:'Francia', visitante:'Irak', fecha:'2026-06-22T21:00:00Z', ciudad:'Philadelphia' },
  { id:'I4', grupo:'I', local:'Noruega', visitante:'Senegal', fecha:'2026-06-23T00:00:00Z', ciudad:'Nueva Jersey' },
  { id:'I5', grupo:'I', local:'Noruega', visitante:'Francia', fecha:'2026-06-26T19:00:00Z', ciudad:'Boston' },
  { id:'I6', grupo:'I', local:'Senegal', visitante:'Irak', fecha:'2026-06-26T19:00:00Z', ciudad:'Toronto' },
  { id:'J1', grupo:'J', local:'Argentina', visitante:'Argelia', fecha:'2026-06-17T01:00:00Z', ciudad:'Kansas City' },
  { id:'J2', grupo:'J', local:'Austria', visitante:'Jordania', fecha:'2026-06-17T04:00:00Z', ciudad:'San Francisco' },
  { id:'J3', grupo:'J', local:'Argentina', visitante:'Austria', fecha:'2026-06-22T17:00:00Z', ciudad:'Dallas' },
  { id:'J4', grupo:'J', local:'Jordania', visitante:'Argelia', fecha:'2026-06-23T03:00:00Z', ciudad:'San Francisco' },
  { id:'J5', grupo:'J', local:'Argelia', visitante:'Austria', fecha:'2026-06-28T02:00:00Z', ciudad:'Kansas City' },
  { id:'J6', grupo:'J', local:'Jordania', visitante:'Argentina', fecha:'2026-06-28T02:00:00Z', ciudad:'Dallas' },
  { id:'K1', grupo:'K', local:'Portugal', visitante:'R.D. Congo', fecha:'2026-06-17T17:00:00Z', ciudad:'Houston' },
  { id:'K2', grupo:'K', local:'Uzbekistán', visitante:'Colombia', fecha:'2026-06-18T02:00:00Z', ciudad:'Ciudad de México' },
  { id:'K3', grupo:'K', local:'Portugal', visitante:'Uzbekistán', fecha:'2026-06-23T17:00:00Z', ciudad:'Houston' },
  { id:'K4', grupo:'K', local:'Colombia', visitante:'R.D. Congo', fecha:'2026-06-24T02:00:00Z', ciudad:'Guadalajara' },
  { id:'K5', grupo:'K', local:'Colombia', visitante:'Portugal', fecha:'2026-06-27T23:30:00Z', ciudad:'Miami' },
  { id:'K6', grupo:'K', local:'R.D. Congo', visitante:'Uzbekistán', fecha:'2026-06-27T23:30:00Z', ciudad:'Atlanta' },
  { id:'L1', grupo:'L', local:'Inglaterra', visitante:'Croacia', fecha:'2026-06-17T20:00:00Z', ciudad:'Dallas' },
  { id:'L2', grupo:'L', local:'Ghana', visitante:'Panamá', fecha:'2026-06-17T23:00:00Z', ciudad:'Toronto' },
  { id:'L3', grupo:'L', local:'Inglaterra', visitante:'Ghana', fecha:'2026-06-23T20:00:00Z', ciudad:'Boston' },
  { id:'L4', grupo:'L', local:'Panamá', visitante:'Croacia', fecha:'2026-06-23T23:00:00Z', ciudad:'Toronto' },
  { id:'L5', grupo:'L', local:'Panamá', visitante:'Inglaterra', fecha:'2026-06-27T21:00:00Z', ciudad:'Nueva Jersey' },
  { id:'L6', grupo:'L', local:'Croacia', visitante:'Ghana', fecha:'2026-06-27T21:00:00Z', ciudad:'Philadelphia' },
]

function fmt(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function limpiar(t) {
  return String(t).replace(/\\/g, '').replace(/,/g, ' ').replace(/;/g, ' ').replace(/·/g, '-')
}

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  let resultados = {}
  try {
    const { data } = await supabase.from('resultados').select('partido_id, goles_local, goles_visitante')
    ;(data || []).forEach(r => { resultados[r.partido_id] = r })
  } catch (e) {
    // si falla, seguimos sin resultados
  }

  const ahora = fmt(new Date().toISOString())
  let lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mundial 2026//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Mundial 2026',
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
  ]

  PARTIDOS.forEach(p => {
    const inicio = fmt(p.fecha)
    const fin = fmt(new Date(new Date(p.fecha).getTime() + 2*60*60*1000).toISOString())
    const r = resultados[p.id]
    let titulo = `⚽ ${p.local} vs ${p.visitante}`
    if (r && r.goles_local != null && r.goles_visitante != null) {
      titulo = `⚽ ${p.local} ${r.goles_local}-${r.goles_visitante} ${p.visitante}`
    }
    lineas.push(
      'BEGIN:VEVENT',
      `UID:mundial2026-${p.id}@quiniela`,
      `DTSTAMP:${ahora}`,
      `DTSTART:${inicio}`,
      `DTEND:${fin}`,
      `SUMMARY:${limpiar(titulo)}`,
      `DESCRIPTION:${limpiar(`Mundial 2026 - Grupo ${p.grupo} - ${p.ciudad}`)}`,
      `LOCATION:${limpiar(p.ciudad)}`,
      'END:VEVENT'
    )
  })

  lineas.push('END:VCALENDAR', '')

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.status(200).send(lineas.join('\r\n'))
}
