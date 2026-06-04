// ============================================================
//  ⚙️  CONFIGURACIÓN CENTRAL DE LA QUINIELA
// ============================================================

// 🗓️  FECHA_CIERRE: momento exacto en que se bloquean las predicciones
//   Formato: 'YYYY-MM-DDTHH:mm:ss' en hora local del servidor
//   Cambia esta fecha antes de publicar el torneo.
export const FECHA_CIERRE = new Date('2025-07-15T20:00:00')

// ⚽  PARTIDOS DE LA QUINIELA
//   id: identificador único (no cambiar una vez creado)
//   fase: etiqueta visual
//   fecha: cuándo se juega (solo informativo)
export const PARTIDOS = [
  {
    id: 'match_1',
    local: 'Argentina',
    visitante: 'Brasil',
    fase: 'Cuartos de Final',
    fecha: '16 jul · 18:00',
    localFlag: '🇦🇷',
    visitanteFlag: '🇧🇷',
  },
  {
    id: 'match_2',
    local: 'Francia',
    visitante: 'España',
    fase: 'Cuartos de Final',
    fecha: '16 jul · 21:00',
    localFlag: '🇫🇷',
    visitanteFlag: '🇪🇸',
  },
  {
    id: 'match_3',
    local: 'Alemania',
    visitante: 'Portugal',
    fase: 'Cuartos de Final',
    fecha: '17 jul · 18:00',
    localFlag: '🇩🇪',
    visitanteFlag: '🇵🇹',
  },
  {
    id: 'match_4',
    local: 'Inglaterra',
    visitante: 'México',
    fase: 'Cuartos de Final',
    fecha: '17 jul · 21:00',
    localFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    visitanteFlag: '🇲🇽',
  },
  {
    id: 'match_5',
    local: 'Uruguay',
    visitante: 'Colombia',
    fase: 'Semifinal',
    fecha: '20 jul · 18:00',
    localFlag: '🇺🇾',
    visitanteFlag: '🇨🇴',
  },
  {
    id: 'match_6',
    local: 'Marruecos',
    visitante: 'Japón',
    fase: 'Semifinal',
    fecha: '20 jul · 21:00',
    localFlag: '🇲🇦',
    visitanteFlag: '🇯🇵',
  },
  {
    id: 'match_7',
    local: 'TBD',
    visitante: 'TBD',
    fase: 'Final',
    fecha: '24 jul · 20:00',
    localFlag: '🏆',
    visitanteFlag: '🏆',
  },
]

// 🏆  NOMBRE DEL TORNEO
export const NOMBRE_TORNEO = 'Quiniela Copa de Campeones 2025'

// 📊  SISTEMA DE PUNTOS
export const PUNTOS = {
  resultado_exacto: 3,   // Marca exacta correcta
  ganador_correcto: 1,   // Solo acertó quién gana (o empate)
}
