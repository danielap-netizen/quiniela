// ============================================================
// CONFIGURACIÓN CENTRAL
// ============================================================

export const FECHA_CIERRE = new Date('2026-06-11T18:00:00Z')

export const ADMIN_EMAIL = 'danielapereyraf@gmail.com'

export const NOMBRE_TORNEO = 'Mundial 2026 · Familia Pereyra Fernández'
export const NOMBRE_CORTO = 'Quiniela Mundial 2026'

// ============================================================
// 72 PARTIDOS FASE DE GRUPOS
// ============================================================

export const PARTIDOS = [
  // GRUPO A
  { id: 'A1', grupo: 'A', local: 'México', visitante: 'Sudáfrica', fecha: '2026-06-11T19:00:00Z', ciudad: 'Ciudad de México', localFlag: '', visitanteFlag: '' },
  { id: 'A2', grupo: 'A', local: 'Corea del Sur', visitante: 'Chequia', fecha: '2026-06-12T02:00:00Z', ciudad: 'Guadalajara', localFlag: '', visitanteFlag: '' },
  { id: 'A3', grupo: 'A', local: 'Chequia', visitante: 'Sudáfrica', fecha: '2026-06-18T16:00:00Z', ciudad: 'Atlanta', localFlag: '', visitanteFlag: '' },
  { id: 'A4', grupo: 'A', local: 'México', visitante: 'Corea del Sur', fecha: '2026-06-19T01:00:00Z', ciudad: 'Guadalajara', localFlag: '', visitanteFlag: '' },
  { id: 'A5', grupo: 'A', local: 'Chequia', visitante: 'México', fecha: '2026-06-25T01:00:00Z', ciudad: 'Ciudad de México', localFlag: '', visitanteFlag: '' },
  { id: 'A6', grupo: 'A', local: 'Sudáfrica', visitante: 'Corea del Sur', fecha: '2026-06-25T01:00:00Z', ciudad: 'Monterrey', localFlag: '', visitanteFlag: '' },

  // GRUPO B
  { id: 'B1', grupo: 'B', local: 'Canadá', visitante: 'Bosnia', fecha: '2026-06-12T19:00:00Z', ciudad: 'Toronto', localFlag: '', visitanteFlag: '' },
  { id: 'B2', grupo: 'B', local: 'Qatar', visitante: 'Suiza', fecha: '2026-06-13T19:00:00Z', ciudad: 'San Francisco', localFlag: '', visitanteFlag: '' },
  { id: 'B3', grupo: 'B', local: 'Suiza', visitante: 'Bosnia', fecha: '2026-06-18T19:00:00Z', ciudad: 'Los Ángeles', localFlag: '', visitanteFlag: '' },
  { id: 'B4', grupo: 'B', local: 'Canadá', visitante: 'Qatar', fecha: '2026-06-18T22:00:00Z', ciudad: 'Vancouver', localFlag: '', visitanteFlag: '' },
  { id: 'B5', grupo: 'B', local: 'Suiza', visitante: 'Canadá', fecha: '2026-06-24T19:00:00Z', ciudad: 'Vancouver', localFlag: '', visitanteFlag: '' },
  { id: 'B6', grupo: 'B', local: 'Bosnia', visitante: 'Qatar', fecha: '2026-06-24T19:00:00Z', ciudad: 'Seattle', localFlag: '', visitanteFlag: '' },

  // GRUPO C
  { id: 'C1', grupo: 'C', local: 'Brasil', visitante: 'Marruecos', fecha: '2026-06-13T22:00:00Z', ciudad: 'Nueva Jersey', localFlag: '', visitanteFlag: '' },
  { id: 'C2', grupo: 'C', local: 'Haití', visitante: 'Escocia', fecha: '2026-06-14T01:00:00Z', ciudad: 'Boston', localFlag: '', visitanteFlag: '' },
  { id: 'C3', grupo: 'C', local: 'Escocia', visitante: 'Marruecos', fecha: '2026-06-19T22:00:00Z', ciudad: 'Boston', localFlag: '', visitanteFlag: '' },
  { id: 'C4', grupo: 'C', local: 'Brasil', visitante: 'Haití', fecha: '2026-06-20T00:30:00Z', ciudad: 'Philadelphia', localFlag: '', visitanteFlag: '' },
  { id: 'C5', grupo: 'C', local: 'Escocia', visitante: 'Brasil', fecha: '2026-06-24T22:00:00Z', ciudad: 'Miami', localFlag: '', visitanteFlag: '' },
  { id: 'C6', grupo: 'C', local: 'Marruecos', visitante: 'Haití', fecha: '2026-06-24T22:00:00Z', ciudad: 'Atlanta', localFlag: '', visitanteFlag: '' },

  // GRUPO D
  { id: 'D1', grupo: 'D', local: 'EUA', visitante: 'Paraguay', fecha: '2026-06-13T01:00:00Z', ciudad: 'Los Ángeles', localFlag: '', visitanteFlag: '' },
  { id: 'D2', grupo: 'D', local: 'Australia', visitante: 'Turquía', fecha: '2026-06-14T04:00:00Z', ciudad: 'Vancouver', localFlag: '', visitanteFlag: '' },
  { id: 'D3', grupo: 'D', local: 'EUA', visitante: 'Australia', fecha: '2026-06-19T19:00:00Z', ciudad: 'Seattle', localFlag: '', visitanteFlag: '' },
  { id: 'D4', grupo: 'D', local: 'Turquía', visitante: 'Paraguay', fecha: '2026-06-20T03:00:00Z', ciudad: 'San Francisco', localFlag: '', visitanteFlag: '' },
  { id: 'D5', grupo: 'D', local: 'Turquía', visitante: 'EUA', fecha: '2026-06-26T02:00:00Z', ciudad: 'Los Ángeles', localFlag: '', visitanteFlag: '' },
  { id: 'D6', grupo: 'D', local: 'Paraguay', visitante: 'Australia', fecha: '2026-06-26T02:00:00Z', ciudad: 'San Francisco', localFlag: '', visitanteFlag: '' },

  // GRUPO E
  { id: 'E1', grupo: 'E', local: 'Alemania', visitante: 'Curazao', fecha: '2026-06-14T17:00:00Z', ciudad: 'Houston', localFlag: '', visitanteFlag: '' },
  { id: 'E2', grupo: 'E', local: 'Costa de Marfil', visitante: 'Ecuador', fecha: '2026-06-14T23:00:00Z', ciudad: 'Philadelphia', localFlag: '', visitanteFlag: '' },
  { id: 'E3', grupo: 'E', local: 'Alemania', visitante: 'Costa de Marfil', fecha: '2026-06-20T20:00:00Z', ciudad: 'Toronto', localFlag: '', visitanteFlag: '' },
  { id: 'E4', grupo: 'E', local: 'Ecuador', visitante: 'Curazao', fecha: '2026-06-21T00:00:00Z', ciudad: 'Kansas City', localFlag: '', visitanteFlag: '' },
  { id: 'E5', grupo: 'E', local: 'Ecuador', visitante: 'Alemania', fecha: '2026-06-25T20:00:00Z', ciudad: 'Nueva Jersey', localFlag: '', visitanteFlag: '' },
  { id: 'E6', grupo: 'E', local: 'Curazao', visitante: 'Costa de Marfil', fecha: '2026-06-25T20:00:00Z', ciudad: 'Philadelphia', localFlag: '', visitanteFlag: '' },

  // GRUPO F
  { id: 'F1', grupo: 'F', local: 'Países Bajos', visitante: 'Japón', fecha: '2026-06-14T20:00:00Z', ciudad: 'Dallas', localFlag: '', visitanteFlag: '' },
  { id: 'F2', grupo: 'F', local: 'Suecia', visitante: 'Túnez', fecha: '2026-06-15T02:00:00Z', ciudad: 'Monterrey', localFlag: '', visitanteFlag: '' },
  { id: 'F3', grupo: 'F', local: 'Países Bajos', visitante: 'Suecia', fecha: '2026-06-20T17:00:00Z', ciudad: 'Houston', localFlag: '', visitanteFlag: '' },
  { id: 'F4', grupo: 'F', local: 'Túnez', visitante: 'Japón', fecha: '2026-06-21T04:00:00Z', ciudad: 'Monterrey', localFlag: '', visitanteFlag: '' },
  { id: 'F5', grupo: 'F', local: 'Japón', visitante: 'Suecia', fecha: '2026-06-25T23:00:00Z', ciudad: 'Dallas', localFlag: '', visitanteFlag: '' },
  { id: 'F6', grupo: 'F', local: 'Túnez', visitante: 'Países Bajos', fecha: '2026-06-25T23:00:00Z', ciudad: 'Kansas City', localFlag: '', visitanteFlag: '' },

  // GRUPO G
  { id: 'G1', grupo: 'G', local: 'Bélgica', visitante: 'Egipto', fecha: '2026-06-15T19:00:00Z', ciudad: 'Seattle', localFlag: '', visitanteFlag: '' },
  { id: 'G2', grupo: 'G', local: 'Irán', visitante: 'Nueva Zelanda', fecha: '2026-06-16T01:00:00Z', ciudad: 'Los Ángeles', localFlag: '', visitanteFlag: '' },
  { id: 'G3', grupo: 'G', local: 'Bélgica', visitante: 'Irán', fecha: '2026-06-21T19:00:00Z', ciudad: 'Los Ángeles', localFlag: '', visitanteFlag: '' },
  { id: 'G4', grupo: 'G', local: 'Nueva Zelanda', visitante: 'Egipto', fecha: '2026-06-22T01:00:00Z', ciudad: 'Vancouver', localFlag: '', visitanteFlag: '' },
  { id: 'G5', grupo: 'G', local: 'Egipto', visitante: 'Irán', fecha: '2026-06-27T03:00:00Z', ciudad: 'Seattle', localFlag: '', visitanteFlag: '' },
  { id: 'G6', grupo: 'G', local: 'Nueva Zelanda', visitante: 'Bélgica', fecha: '2026-06-27T03:00:00Z', ciudad: 'Vancouver', localFlag: '', visitanteFlag: '' },

  // GRUPO H
  { id: 'H1', grupo: 'H', local: 'España', visitante: 'Cabo Verde', fecha: '2026-06-15T16:00:00Z', ciudad: 'Atlanta', localFlag: '', visitanteFlag: '' },
  { id: 'H2', grupo: 'H', local: 'Arabia Saudita', visitante: 'Uruguay', fecha: '2026-06-15T22:00:00Z', ciudad: 'Miami', localFlag: '', visitanteFlag: '' },
  { id: 'H3', grupo: 'H', local: 'España', visitante: 'Arabia Saudita', fecha: '2026-06-21T16:00:00Z', ciudad: 'Atlanta', localFlag: '', visitanteFlag: '' },
  { id: 'H4', grupo: 'H', local: 'Uruguay', visitante: 'Cabo Verde', fecha: '2026-06-21T22:00:00Z', ciudad: 'Miami', localFlag: '', visitanteFlag: '' },
  { id: 'H5', grupo: 'H', local: 'Cabo Verde', visitante: 'Arabia Saudita', fecha: '2026-06-27T00:00:00Z', ciudad: 'Houston', localFlag: '', visitanteFlag: '' },
  { id: 'H6', grupo: 'H', local: 'Uruguay', visitante: 'España', fecha: '2026-06-27T00:00:00Z', ciudad: 'Guadalajara', localFlag: '', visitanteFlag: '' },

  // GRUPO I
  { id: 'I1', grupo: 'I', local: 'Francia', visitante: 'Senegal', fecha: '2026-06-16T19:00:00Z', ciudad: 'Nueva Jersey', localFlag: '', visitanteFlag: '' },
  { id: 'I2', grupo: 'I', local: 'Irak', visitante: 'Noruega', fecha: '2026-06-16T22:00:00Z', ciudad: 'Boston', localFlag: '', visitanteFlag: '' },
  { id: 'I3', grupo: 'I', local: 'Francia', visitante: 'Irak', fecha: '2026-06-22T21:00:00Z', ciudad: 'Philadelphia', localFlag: '', visitanteFlag: '' },
  { id: 'I4', grupo: 'I', local: 'Noruega', visitante: 'Senegal', fecha: '2026-06-23T00:00:00Z', ciudad: 'Nueva Jersey', localFlag: '', visitanteFlag: '' },
  { id: 'I5', grupo: 'I', local: 'Noruega', visitante: 'Francia', fecha: '2026-06-26T19:00:00Z', ciudad: 'Boston', localFlag: '', visitanteFlag: '' },
  { id: 'I6', grupo: 'I', local: 'Senegal', visitante: 'Irak', fecha: '2026-06-26T19:00:00Z', ciudad: 'Toronto', localFlag: '', visitanteFlag: '' },

  // GRUPO J
  { id: 'J1', grupo: 'J', local: 'Argentina', visitante: 'Argelia', fecha: '2026-06-17T01:00:00Z', ciudad: 'Kansas City', localFlag: '', visitanteFlag: '' },
  { id: 'J2', grupo: 'J', local: 'Austria', visitante: 'Jordania', fecha: '2026-06-17T04:00:00Z', ciudad: 'San Francisco', localFlag: '', visitanteFlag: '' },
  { id: 'J3', grupo: 'J', local: 'Argentina', visitante: 'Austria', fecha: '2026-06-22T17:00:00Z', ciudad: 'Dallas', localFlag: '', visitanteFlag: '' },
  { id: 'J4', grupo: 'J', local: 'Jordania', visitante: 'Argelia', fecha: '2026-06-23T03:00:00Z', ciudad: 'San Francisco', localFlag: '', visitanteFlag: '' },
  { id: 'J5', grupo: 'J', local: 'Argelia', visitante: 'Austria', fecha: '2026-06-28T02:00:00Z', ciudad: 'Kansas City', localFlag: '', visitanteFlag: '' },
  { id: 'J6', grupo: 'J', local: 'Jordania', visitante: 'Argentina', fecha: '2026-06-28T02:00:00Z', ciudad: 'Dallas', localFlag: '', visitanteFlag: '' },

  // GRUPO K
  { id: 'K1', grupo: 'K', local: 'Portugal', visitante: 'RD Congo', fecha: '2026-06-17T17:00:00Z', ciudad: 'Houston', localFlag: '', visitanteFlag: '' },
  { id: 'K2', grupo: 'K', local: 'Uzbekistán', visitante: 'Colombia', fecha: '2026-06-18T02:00:00Z', ciudad: 'Ciudad de México', localFlag: '', visitanteFlag: '' },
  { id: 'K3', grupo: 'K', local: 'Portugal', visitante: 'Uzbekistán', fecha: '2026-06-23T17:00:00Z', ciudad: 'Houston', localFlag: '', visitanteFlag: '' },
  { id: 'K4', grupo: 'K', local: 'Colombia', visitante: 'RD Congo', fecha: '2026-06-24T02:00:00Z', ciudad: 'Guadalajara', localFlag: '', visitanteFlag: '' },
  { id: 'K5', grupo: 'K', local: 'Colombia', visitante: 'Portugal', fecha: '2026-06-27T23:30:00Z', ciudad: 'Miami', localFlag: '', visitanteFlag: '' },
  { id: 'K6', grupo: 'K', local: 'RD Congo', visitante: 'Uzbekistán', fecha: '2026-06-27T23:30:00Z', ciudad: 'Atlanta', localFlag: '', visitanteFlag: '' },

  // GRUPO L
  { id: 'L1', grupo: 'L', local: 'Inglaterra', visitante: 'Croacia', fecha: '2026-06-17T20:00:00Z', ciudad: 'Dallas', localFlag: '', visitanteFlag: '' },
  { id: 'L2', grupo: 'L', local: 'Ghana', visitante: 'Panamá', fecha: '2026-06-17T23:00:00Z', ciudad: 'Toronto', localFlag: '', visitanteFlag: '' },
  { id: 'L3', grupo: 'L', local: 'Inglaterra', visitante: 'Ghana', fecha: '2026-06-23T20:00:00Z', ciudad: 'Boston', localFlag: '', visitanteFlag: '' },
  { id: 'L4', grupo: 'L', local: 'Panamá', visitante: 'Croacia', fecha: '2026-06-23T23:00:00Z', ciudad: 'Toronto', localFlag: '', visitanteFlag: '' },
  { id: 'L5', grupo: 'L', local: 'Panamá', visitante: 'Inglaterra', fecha: '2026-06-27T21:00:00Z', ciudad: 'Nueva Jersey', localFlag: '', visitanteFlag: '' },
  { id: 'L6', grupo: 'L', local: 'Croacia', visitante: 'Ghana', fecha: '2026-06-27T21:00:00Z', ciudad: 'Philadelphia', localFlag: '', visitanteFlag: '' },
]

export const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export const PUNTOS_POR_ACIERTO = 1

// ============================================================
// ELIMINATORIAS · 16AVOS
// Quiniela separada de fase de grupos.
// Cada acierto vale 1 punto.
// L = avanza el equipo de la izquierda
// V = avanza el equipo de la derecha
// ============================================================

export const FECHA_CIERRE_DIECISEISAVOS = new Date('2026-06-28T12:00:00-06:00')

export const DIECISEISAVOS = [
  {
    id: 'M73',
    fase: '16avos',
    local: 'Sudáfrica',
    visitante: 'Canadá',
    fecha: '2026-06-28T13:00:00-06:00',
    ciudad: 'Los Angeles Stadium',
    localFlag: '🇿🇦',
    visitanteFlag: '🇨🇦',
    bloqueado: true,
    resultadoOficial: 'V',
    golesLocalOficial: 0,
    golesVisitanteOficial: 1,
    notaResultado: 'Canadá ganó 1-0 y ya avanzó.',
  },
  {
    id: 'M74',
    fase: '16avos',
    local: 'Brasil',
    visitante: 'Japón',
    fecha: '2026-06-29T11:00:00-06:00',
    ciudad: 'Houston Stadium',
    localFlag: '🇧🇷',
    visitanteFlag: '🇯🇵',
  },
  {
    id: 'M75',
    fase: '16avos',
    local: 'Alemania',
    visitante: 'Paraguay',
    fecha: '2026-06-29T14:30:00-06:00',
    ciudad: 'Boston Stadium',
    localFlag: '🇩🇪',
    visitanteFlag: '🇵🇾',
  },
  {
    id: 'M76',
    fase: '16avos',
    local: 'Países Bajos',
    visitante: 'Marruecos',
    fecha: '2026-06-29T19:00:00-06:00',
    ciudad: 'Estadio Monterrey',
    localFlag: '🇳🇱',
    visitanteFlag: '🇲🇦',
  },
  {
    id: 'M77',
    fase: '16avos',
    local: 'Costa de Marfil',
    visitante: 'Noruega',
    fecha: '2026-06-30T11:00:00-06:00',
    ciudad: 'Dallas Stadium',
    localFlag: '🇨🇮',
    visitanteFlag: '🇳🇴',
  },
  {
    id: 'M78',
    fase: '16avos',
    local: 'Francia',
    visitante: 'Suecia',
    fecha: '2026-06-30T15:00:00-06:00',
    ciudad: 'New York / New Jersey Stadium',
    localFlag: '🇫🇷',
    visitanteFlag: '🇸🇪',
  },
  {
    id: 'M79',
    fase: '16avos',
    local: 'México',
    visitante: 'Ecuador',
    fecha: '2026-06-30T19:00:00-06:00',
    ciudad: 'Estadio Ciudad de México',
    localFlag: '🇲🇽',
    visitanteFlag: '🇪🇨',
  },
  {
    id: 'M80',
    fase: '16avos',
    local: 'Inglaterra',
    visitante: 'RD Congo',
    fecha: '2026-07-01T10:00:00-06:00',
    ciudad: 'Atlanta Stadium',
    localFlag: '🏴',
    visitanteFlag: '🇨🇩',
  },
  {
    id: 'M81',
    fase: '16avos',
    local: 'Bélgica',
    visitante: 'Senegal',
    fecha: '2026-07-01T14:00:00-06:00',
    ciudad: 'Seattle Stadium',
    localFlag: '🇧🇪',
    visitanteFlag: '🇸🇳',
  },
  {
    id: 'M82',
    fase: '16avos',
    local: 'Estados Unidos',
    visitante: 'Bosnia',
    fecha: '2026-07-01T18:00:00-06:00',
    ciudad: 'San Francisco Stadium',
    localFlag: '🇺🇸',
    visitanteFlag: '🇧🇦',
  },
  {
    id: 'M83',
    fase: '16avos',
    local: 'España',
    visitante: 'Austria',
    fecha: '2026-07-02T13:00:00-06:00',
    ciudad: 'Los Angeles Stadium',
    localFlag: '🇪🇸',
    visitanteFlag: '🇦🇹',
  },
  {
    id: 'M84',
    fase: '16avos',
    local: 'Portugal',
    visitante: 'Croacia',
    fecha: '2026-07-02T17:00:00-06:00',
    ciudad: 'Toronto Stadium',
    localFlag: '🇵🇹',
    visitanteFlag: '🇭🇷',
  },
  {
    id: 'M85',
    fase: '16avos',
    local: 'Suiza',
    visitante: 'Argelia',
    fecha: '2026-07-02T21:00:00-06:00',
    ciudad: 'Vancouver Stadium',
    localFlag: '🇨🇭',
    visitanteFlag: '🇩🇿',
  },
  {
    id: 'M86',
    fase: '16avos',
    local: 'Australia',
    visitante: 'Egipto',
    fecha: '2026-07-03T12:00:00-06:00',
    ciudad: 'Dallas Stadium',
    localFlag: '🇦🇺',
    visitanteFlag: '🇪🇬',
  },
  {
    id: 'M87',
    fase: '16avos',
    local: 'Argentina',
    visitante: 'Cabo Verde',
    fecha: '2026-07-03T16:00:00-06:00',
    ciudad: 'Miami Stadium',
    localFlag: '🇦🇷',
    visitanteFlag: '🇨🇻',
  },
  {
    id: 'M88',
    fase: '16avos',
    local: 'Colombia',
    visitante: 'Ghana',
    fecha: '2026-07-03T19:30:00-06:00',
    ciudad: 'Kansas City Stadium',
    localFlag: '🇨🇴',
    visitanteFlag: '🇬🇭',
  },
]

// ============================================================
// ELIMINATORIAS · OCTAVOS DE FINAL
// Mismos puntos: 1 por acertar quién avanza + 1 por la definición.
// Los partidos "por definir" van bloqueados hasta tener equipos.
// ============================================================

export const FECHA_CIERRE_OCTAVOS_FINAL = new Date('2026-07-04T10:00:00-06:00')

export const OCTAVOS_FINAL = [
  {
    id: 'M89',
    fase: 'octavos',
    local: 'Canadá',
    visitante: 'Marruecos',
    fecha: '2026-07-04T11:00:00-06:00',
    ciudad: 'Houston Stadium',
    localFlag: '🇨🇦',
    visitanteFlag: '🇲🇦',
  },
  {
    id: 'M90',
    fase: 'octavos',
    local: 'Paraguay',
    visitante: 'Francia',
    fecha: '2026-07-04T15:00:00-06:00',
    ciudad: 'Filadelfia Stadium',
    localFlag: '🇵🇾',
    visitanteFlag: '🇫🇷',
  },
  {
    id: 'M91',
    fase: 'octavos',
    local: 'Brasil',
    visitante: 'Noruega',
    fecha: '2026-07-05T14:00:00-06:00',
    ciudad: 'New York / New Jersey Stadium',
    localFlag: '🇧🇷',
    visitanteFlag: '🇳🇴',
  },
  {
    id: 'M92',
    fase: 'octavos',
    local: 'México',
    visitante: 'Inglaterra',
    fecha: '2026-07-05T18:00:00-06:00',
    ciudad: 'Estadio Ciudad de México',
    localFlag: '🇲🇽',
    visitanteFlag: '🏴',
  },
  {
    id: 'M93',
    fase: 'octavos',
    local: 'Por definir',
    visitante: 'Por definir',
    fecha: '2026-07-06T13:00:00-06:00',
    ciudad: 'Dallas Stadium',
    localFlag: '⚽',
    visitanteFlag: '⚽',
    bloqueado: true,
    notaResultado: 'Los equipos se definen con los resultados de 16avos.',
  },
  {
    id: 'M94',
    fase: 'octavos',
    local: 'Estados Unidos',
    visitante: 'Bélgica',
    fecha: '2026-07-06T18:00:00-06:00',
    ciudad: 'Seattle Stadium',
    localFlag: '🇺🇸',
    visitanteFlag: '🇧🇪',
  },
  {
    id: 'M95',
    fase: 'octavos',
    local: 'Por definir',
    visitante: 'Por definir',
    fecha: '2026-07-07T10:00:00-06:00',
    ciudad: 'Atlanta Stadium',
    localFlag: '⚽',
    visitanteFlag: '⚽',
    bloqueado: true,
    notaResultado: 'Los equipos se definen con los resultados de 16avos.',
  },
  {
    id: 'M96',
    fase: 'octavos',
    local: 'Por definir',
    visitante: 'Por definir',
    fecha: '2026-07-07T14:00:00-06:00',
    ciudad: 'Vancouver Stadium (BC Place)',
    localFlag: '⚽',
    visitanteFlag: '⚽',
    bloqueado: true,
    notaResultado: 'Los equipos se definen con los resultados de 16avos.',
  },
]

// Estos alias evitan romper los archivos que todavía usan el nombre OCTAVOS.
// OCTAVOS ahora incluye TODAS las fases de eliminatorias jugadas hasta ahora,
// para que los puntos se sumen automáticamente (16avos + octavos + ...).
export const FECHA_CIERRE_OCTAVOS = FECHA_CIERRE_DIECISEISAVOS
export const OCTAVOS = [...DIECISEISAVOS, ...OCTAVOS_FINAL]

export const ELIMINATORIAS = [...DIECISEISAVOS, ...OCTAVOS_FINAL]

export const PUNTOS_POR_ACIERTO_ELIMINATORIAS = 1
