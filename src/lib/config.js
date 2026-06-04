// ============================================================
//  ⚙️  CONFIGURACIÓN CENTRAL
// ============================================================

// Deadline: 1 hora antes del partido inaugural (11 Jun 3pm ET = 2pm CDT)
export const FECHA_CIERRE = new Date('2026-06-11T14:00:00-05:00')

export const NOMBRE_TORNEO = 'Mundial 2026 · Familia Pereyra Fernández'
export const NOMBRE_CORTO = 'Quiniela Mundial 2026'

// ============================================================
//  72 PARTIDOS FASE DE GRUPOS · horarios en CDT (ET - 1h)
// ============================================================
export const PARTIDOS = [
  // ── GRUPO A ──
  { id:'A1', grupo:'A', local:'México',        visitante:'Sudáfrica',    fecha:'2026-06-11T14:00:00-05:00', ciudad:'México City',    localFlag:'🇲🇽', visitanteFlag:'🇿🇦' },
  { id:'A2', grupo:'A', local:'Corea del Sur', visitante:'Chequia',      fecha:'2026-06-11T21:00:00-05:00', ciudad:'Guadalajara',    localFlag:'🇰🇷', visitanteFlag:'🇨🇿' },
  { id:'A3', grupo:'A', local:'Chequia',       visitante:'Sudáfrica',    fecha:'2026-06-18T11:00:00-05:00', ciudad:'Atlanta',        localFlag:'🇨🇿', visitanteFlag:'🇿🇦' },
  { id:'A4', grupo:'A', local:'México',        visitante:'Corea del Sur',fecha:'2026-06-18T20:00:00-05:00', ciudad:'Guadalajara',    localFlag:'🇲🇽', visitanteFlag:'🇰🇷' },
  { id:'A5', grupo:'A', local:'Chequia',       visitante:'México',       fecha:'2026-06-24T20:00:00-05:00', ciudad:'México City',    localFlag:'🇨🇿', visitanteFlag:'🇲🇽' },
  { id:'A6', grupo:'A', local:'Sudáfrica',     visitante:'Corea del Sur',fecha:'2026-06-24T20:00:00-05:00', ciudad:'Monterrey',      localFlag:'🇿🇦', visitanteFlag:'🇰🇷' },
  // ── GRUPO B ──
  { id:'B1', grupo:'B', local:'Canadá',        visitante:'Bosnia',       fecha:'2026-06-12T14:00:00-05:00', ciudad:'Toronto',        localFlag:'🇨🇦', visitanteFlag:'🇧🇦' },
  { id:'B2', grupo:'B', local:'Qatar',         visitante:'Suiza',        fecha:'2026-06-13T14:00:00-05:00', ciudad:'San Francisco',  localFlag:'🇶🇦', visitanteFlag:'🇨🇭' },
  { id:'B3', grupo:'B', local:'Suiza',         visitante:'Bosnia',       fecha:'2026-06-18T14:00:00-05:00', ciudad:'Los Angeles',    localFlag:'🇨🇭', visitanteFlag:'🇧🇦' },
  { id:'B4', grupo:'B', local:'Canadá',        visitante:'Qatar',        fecha:'2026-06-18T17:00:00-05:00', ciudad:'Vancouver',      localFlag:'🇨🇦', visitanteFlag:'🇶🇦' },
  { id:'B5', grupo:'B', local:'Suiza',         visitante:'Canadá',       fecha:'2026-06-24T14:00:00-05:00', ciudad:'Vancouver',      localFlag:'🇨🇭', visitanteFlag:'🇨🇦' },
  { id:'B6', grupo:'B', local:'Bosnia',        visitante:'Qatar',        fecha:'2026-06-24T14:00:00-05:00', ciudad:'Seattle',        localFlag:'🇧🇦', visitanteFlag:'🇶🇦' },
  // ── GRUPO C ──
  { id:'C1', grupo:'C', local:'Brasil',        visitante:'Marruecos',    fecha:'2026-06-13T17:00:00-05:00', ciudad:'Nueva York',     localFlag:'🇧🇷', visitanteFlag:'🇲🇦' },
  { id:'C2', grupo:'C', local:'Haití',         visitante:'Escocia',      fecha:'2026-06-13T20:00:00-05:00', ciudad:'Boston',         localFlag:'🇭🇹', visitanteFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { id:'C3', grupo:'C', local:'Escocia',       visitante:'Marruecos',    fecha:'2026-06-19T17:00:00-05:00', ciudad:'Boston',         localFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitanteFlag:'🇲🇦' },
  { id:'C4', grupo:'C', local:'Brasil',        visitante:'Haití',        fecha:'2026-06-19T20:00:00-05:00', ciudad:'Philadelphia',   localFlag:'🇧🇷', visitanteFlag:'🇭🇹' },
  { id:'C5', grupo:'C', local:'Escocia',       visitante:'Brasil',       fecha:'2026-06-24T17:00:00-05:00', ciudad:'Miami',          localFlag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿', visitanteFlag:'🇧🇷' },
  { id:'C6', grupo:'C', local:'Marruecos',     visitante:'Haití',        fecha:'2026-06-24T17:00:00-05:00', ciudad:'Atlanta',        localFlag:'🇲🇦', visitanteFlag:'🇭🇹' },
  // ── GRUPO D ──
  { id:'D1', grupo:'D', local:'EUA',           visitante:'Paraguay',     fecha:'2026-06-12T20:00:00-05:00', ciudad:'Los Angeles',    localFlag:'🇺🇸', visitanteFlag:'🇵🇾' },
  { id:'D2', grupo:'D', local:'Australia',     visitante:'Turquía',      fecha:'2026-06-12T23:00:00-05:00', ciudad:'Vancouver',      localFlag:'🇦🇺', visitanteFlag:'🇹🇷' },
  { id:'D3', grupo:'D', local:'EUA',           visitante:'Australia',    fecha:'2026-06-19T14:00:00-05:00', ciudad:'Seattle',        localFlag:'🇺🇸', visitanteFlag:'🇦🇺' },
  { id:'D4', grupo:'D', local:'Turquía',       visitante:'Paraguay',     fecha:'2026-06-19T23:00:00-05:00', ciudad:'San Francisco',  localFlag:'🇹🇷', visitanteFlag:'🇵🇾' },
  { id:'D5', grupo:'D', local:'Turquía',       visitante:'EUA',          fecha:'2026-06-25T21:00:00-05:00', ciudad:'Los Angeles',    localFlag:'🇹🇷', visitanteFlag:'🇺🇸' },
  { id:'D6', grupo:'D', local:'Paraguay',      visitante:'Australia',    fecha:'2026-06-25T21:00:00-05:00', ciudad:'San Francisco',  localFlag:'🇵🇾', visitanteFlag:'🇦🇺' },
  // ── GRUPO E ──
  { id:'E1', grupo:'E', local:'Alemania',      visitante:'Curazao',      fecha:'2026-06-14T12:00:00-05:00', ciudad:'Houston',        localFlag:'🇩🇪', visitanteFlag:'🇨🇼' },
  { id:'E2', grupo:'E', local:'Costa de Marfil',visitante:'Ecuador',    fecha:'2026-06-14T18:00:00-05:00', ciudad:'Philadelphia',   localFlag:'🇨🇮', visitanteFlag:'🇪🇨' },
  { id:'E3', grupo:'E', local:'Alemania',      visitante:'Costa de Marfil',fecha:'2026-06-20T15:00:00-05:00',ciudad:'Toronto',      localFlag:'🇩🇪', visitanteFlag:'🇨🇮' },
  { id:'E4', grupo:'E', local:'Ecuador',       visitante:'Curazao',      fecha:'2026-06-20T19:00:00-05:00', ciudad:'Kansas City',    localFlag:'🇪🇨', visitanteFlag:'🇨🇼' },
  { id:'E5', grupo:'E', local:'Ecuador',       visitante:'Alemania',     fecha:'2026-06-25T15:00:00-05:00', ciudad:'Nueva York',     localFlag:'🇪🇨', visitanteFlag:'🇩🇪' },
  { id:'E6', grupo:'E', local:'Curazao',       visitante:'Costa de Marfil',fecha:'2026-06-25T15:00:00-05:00',ciudad:'Philadelphia', localFlag:'🇨🇼', visitanteFlag:'🇨🇮' },
  // ── GRUPO F ──
  { id:'F1', grupo:'F', local:'Países Bajos',  visitante:'Japón',        fecha:'2026-06-14T15:00:00-05:00', ciudad:'Dallas',         localFlag:'🇳🇱', visitanteFlag:'🇯🇵' },
  { id:'F2', grupo:'F', local:'Suecia',        visitante:'Túnez',        fecha:'2026-06-14T21:00:00-05:00', ciudad:'Monterrey',      localFlag:'🇸🇪', visitanteFlag:'🇹🇳' },
  { id:'F3', grupo:'F', local:'Países Bajos',  visitante:'Suecia',       fecha:'2026-06-20T12:00:00-05:00', ciudad:'Houston',        localFlag:'🇳🇱', visitanteFlag:'🇸🇪' },
  { id:'F4', grupo:'F', local:'Túnez',         visitante:'Japón',        fecha:'2026-06-20T23:00:00-05:00', ciudad:'Monterrey',      localFlag:'🇹🇳', visitanteFlag:'🇯🇵' },
  { id:'F5', grupo:'F', local:'Japón',         visitante:'Suecia',       fecha:'2026-06-25T18:00:00-05:00', ciudad:'Dallas',         localFlag:'🇯🇵', visitanteFlag:'🇸🇪' },
  { id:'F6', grupo:'F', local:'Túnez',         visitante:'Países Bajos', fecha:'2026-06-25T18:00:00-05:00', ciudad:'Kansas City',    localFlag:'🇹🇳', visitanteFlag:'🇳🇱' },
  // ── GRUPO G ──
  { id:'G1', grupo:'G', local:'Bélgica',       visitante:'Egipto',       fecha:'2026-06-15T14:00:00-05:00', ciudad:'Seattle',        localFlag:'🇧🇪', visitanteFlag:'🇪🇬' },
  { id:'G2', grupo:'G', local:'Irán',          visitante:'Nueva Zelanda',fecha:'2026-06-15T20:00:00-05:00', ciudad:'Los Angeles',    localFlag:'🇮🇷', visitanteFlag:'🇳🇿' },
  { id:'G3', grupo:'G', local:'Bélgica',       visitante:'Irán',         fecha:'2026-06-21T14:00:00-05:00', ciudad:'Los Angeles',    localFlag:'🇧🇪', visitanteFlag:'🇮🇷' },
  { id:'G4', grupo:'G', local:'Nueva Zelanda', visitante:'Egipto',       fecha:'2026-06-21T20:00:00-05:00', ciudad:'Vancouver',      localFlag:'🇳🇿', visitanteFlag:'🇪🇬' },
  { id:'G5', grupo:'G', local:'Egipto',        visitante:'Irán',         fecha:'2026-06-26T22:00:00-05:00', ciudad:'Seattle',        localFlag:'🇪🇬', visitanteFlag:'🇮🇷' },
  { id:'G6', grupo:'G', local:'Nueva Zelanda', visitante:'Bélgica',      fecha:'2026-06-26T22:00:00-05:00', ciudad:'Vancouver',      localFlag:'🇳🇿', visitanteFlag:'🇧🇪' },
  // ── GRUPO H ──
  { id:'H1', grupo:'H', local:'España',        visitante:'Cabo Verde',   fecha:'2026-06-15T11:00:00-05:00', ciudad:'Atlanta',        localFlag:'🇪🇸', visitanteFlag:'🇨🇻' },
  { id:'H2', grupo:'H', local:'Arabia Saudita',visitante:'Uruguay',      fecha:'2026-06-15T17:00:00-05:00', ciudad:'Miami',          localFlag:'🇸🇦', visitanteFlag:'🇺🇾' },
  { id:'H3', grupo:'H', local:'España',        visitante:'Arabia Saudita',fecha:'2026-06-21T11:00:00-05:00',ciudad:'Atlanta',        localFlag:'🇪🇸', visitanteFlag:'🇸🇦' },
  { id:'H4', grupo:'H', local:'Uruguay',       visitante:'Cabo Verde',   fecha:'2026-06-21T17:00:00-05:00', ciudad:'Miami',          localFlag:'🇺🇾', visitanteFlag:'🇨🇻' },
  { id:'H5', grupo:'H', local:'Cabo Verde',    visitante:'Arabia Saudita',fecha:'2026-06-26T19:00:00-05:00',ciudad:'Houston',        localFlag:'🇨🇻', visitanteFlag:'🇸🇦' },
  { id:'H6', grupo:'H', local:'Uruguay',       visitante:'España',       fecha:'2026-06-26T19:00:00-05:00', ciudad:'Guadalajara',    localFlag:'🇺🇾', visitanteFlag:'🇪🇸' },
  // ── GRUPO I ──
  { id:'I1', grupo:'I', local:'Francia',       visitante:'Senegal',      fecha:'2026-06-16T14:00:00-05:00', ciudad:'Nueva York',     localFlag:'🇫🇷', visitanteFlag:'🇸🇳' },
  { id:'I2', grupo:'I', local:'Irak',          visitante:'Noruega',      fecha:'2026-06-16T17:00:00-05:00', ciudad:'Boston',         localFlag:'🇮🇶', visitanteFlag:'🇳🇴' },
  { id:'I3', grupo:'I', local:'Francia',       visitante:'Irak',         fecha:'2026-06-22T16:00:00-05:00', ciudad:'Philadelphia',   localFlag:'🇫🇷', visitanteFlag:'🇮🇶' },
  { id:'I4', grupo:'I', local:'Noruega',       visitante:'Senegal',      fecha:'2026-06-22T19:00:00-05:00', ciudad:'Nueva York',     localFlag:'🇳🇴', visitanteFlag:'🇸🇳' },
  { id:'I5', grupo:'I', local:'Noruega',       visitante:'Francia',      fecha:'2026-06-26T14:00:00-05:00', ciudad:'Boston',         localFlag:'🇳🇴', visitanteFlag:'🇫🇷' },
  { id:'I6', grupo:'I', local:'Senegal',       visitante:'Irak',         fecha:'2026-06-26T14:00:00-05:00', ciudad:'Toronto',        localFlag:'🇸🇳', visitanteFlag:'🇮🇶' },
  // ── GRUPO J ──
  { id:'J1', grupo:'J', local:'Argentina',     visitante:'Argelia',      fecha:'2026-06-16T20:00:00-05:00', ciudad:'Kansas City',    localFlag:'🇦🇷', visitanteFlag:'🇩🇿' },
  { id:'J2', grupo:'J', local:'Austria',       visitante:'Jordania',     fecha:'2026-06-16T23:00:00-05:00', ciudad:'San Francisco',  localFlag:'🇦🇹', visitanteFlag:'🇯🇴' },
  { id:'J3', grupo:'J', local:'Argentina',     visitante:'Austria',      fecha:'2026-06-22T12:00:00-05:00', ciudad:'Dallas',         localFlag:'🇦🇷', visitanteFlag:'🇦🇹' },
  { id:'J4', grupo:'J', local:'Jordania',      visitante:'Argelia',      fecha:'2026-06-22T22:00:00-05:00', ciudad:'San Francisco',  localFlag:'🇯🇴', visitanteFlag:'🇩🇿' },
  { id:'J5', grupo:'J', local:'Argelia',       visitante:'Austria',      fecha:'2026-06-27T21:00:00-05:00', ciudad:'Kansas City',    localFlag:'🇩🇿', visitanteFlag:'🇦🇹' },
  { id:'J6', grupo:'J', local:'Jordania',      visitante:'Argentina',    fecha:'2026-06-27T21:00:00-05:00', ciudad:'Dallas',         localFlag:'🇯🇴', visitanteFlag:'🇦🇷' },
  // ── GRUPO K ──
  { id:'K1', grupo:'K', local:'Portugal',      visitante:'R.D. Congo',   fecha:'2026-06-17T12:00:00-05:00', ciudad:'Houston',        localFlag:'🇵🇹', visitanteFlag:'🇨🇩' },
  { id:'K2', grupo:'K', local:'Uzbekistán',    visitante:'Colombia',     fecha:'2026-06-17T21:00:00-05:00', ciudad:'México City',    localFlag:'🇺🇿', visitanteFlag:'🇨🇴' },
  { id:'K3', grupo:'K', local:'Portugal',      visitante:'Uzbekistán',   fecha:'2026-06-23T12:00:00-05:00', ciudad:'Houston',        localFlag:'🇵🇹', visitanteFlag:'🇺🇿' },
  { id:'K4', grupo:'K', local:'Colombia',      visitante:'R.D. Congo',   fecha:'2026-06-23T21:00:00-05:00', ciudad:'Guadalajara',    localFlag:'🇨🇴', visitanteFlag:'🇨🇩' },
  { id:'K5', grupo:'K', local:'Colombia',      visitante:'Portugal',     fecha:'2026-06-27T18:30:00-05:00', ciudad:'Miami',          localFlag:'🇨🇴', visitanteFlag:'🇵🇹' },
  { id:'K6', grupo:'K', local:'R.D. Congo',    visitante:'Uzbekistán',   fecha:'2026-06-27T18:30:00-05:00', ciudad:'Atlanta',        localFlag:'🇨🇩', visitanteFlag:'🇺🇿' },
  // ── GRUPO L ──
  { id:'L1', grupo:'L', local:'Inglaterra',    visitante:'Croacia',      fecha:'2026-06-17T15:00:00-05:00', ciudad:'Dallas',         localFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitanteFlag:'🇭🇷' },
  { id:'L2', grupo:'L', local:'Ghana',         visitante:'Panamá',       fecha:'2026-06-17T18:00:00-05:00', ciudad:'Toronto',        localFlag:'🇬🇭', visitanteFlag:'🇵🇦' },
  { id:'L3', grupo:'L', local:'Inglaterra',    visitante:'Ghana',        fecha:'2026-06-23T15:00:00-05:00', ciudad:'Boston',         localFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', visitanteFlag:'🇬🇭' },
  { id:'L4', grupo:'L', local:'Panamá',        visitante:'Croacia',      fecha:'2026-06-23T18:00:00-05:00', ciudad:'Toronto',        localFlag:'🇵🇦', visitanteFlag:'🇭🇷' },
  { id:'L5', grupo:'L', local:'Panamá',        visitante:'Inglaterra',   fecha:'2026-06-27T16:00:00-05:00', ciudad:'Nueva York',     localFlag:'🇵🇦', visitanteFlag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id:'L6', grupo:'L', local:'Croacia',       visitante:'Ghana',        fecha:'2026-06-27T16:00:00-05:00', ciudad:'Philadelphia',   localFlag:'🇭🇷', visitanteFlag:'🇬🇭' },
]

export const GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L']

export const PUNTOS_POR_ACIERTO = 1
