import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { FECHA_CIERRE, PARTIDOS, NOMBRE_TORNEO } from '../lib/config'
import MatchCard from '../components/MatchCard'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function CerradaBanner() {
  return (
    <div className="mb-8 p-5 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-start gap-4">
      <span className="text-2xl flex-shrink-0">🔒</span>
      <div>
        <h3 className="font-display font-bold text-amber-400 mb-1">Quiniela cerrada</h3>
        <p className="text-amber-600 text-sm">
          La fecha límite ya pasó. Tus predicciones han quedado registradas y se publicarán en la tabla pública.
          Ya puedes ver las predicciones de todos en la{' '}
          <a href="/tabla" className="text-amber-400 underline">tabla pública</a>.
        </p>
      </div>
    </div>
  )
}

function ProgressBar({ total, completadas }) {
  const pct = total === 0 ? 0 : Math.round((completadas / total) * 100)
  return (
    <div className="glass-card rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-display font-medium text-pitch-300">
          Progreso de predicciones
        </span>
        <span className="font-mono text-sm text-pitch-400">
          <span className="text-pitch-200 font-bold">{completadas}</span>/{total}
        </span>
      </div>
      <div className="h-2 bg-pitch-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pitch-600 to-pitch-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {completadas === total && (
        <p className="mt-2 text-xs font-mono text-pitch-500 text-right">
          ✓ Todas las predicciones completas
        </p>
      )}
    </div>
  )
}

export default function MisPrediccionesPage() {
  const { user } = useAuth()
  const [predicciones, setPredicciones] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isOpen = new Date() < FECHA_CIERRE

  const fetchPredicciones = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('predicciones')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      setError('Error al cargar tus predicciones: ' + error.message)
    } else {
      const map = {}
      data.forEach(p => { map[p.partido_id] = p })
      setPredicciones(map)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchPredicciones()
  }, [fetchPredicciones])

  const handleSave = async (partidoId, golesLocal, golesVisitante) => {
    // Server-side guard: check closure again
    if (new Date() >= FECHA_CIERRE) {
      throw new Error('La quiniela está cerrada.')
    }

    const existing = predicciones[partidoId]
    if (existing) {
      const { error } = await supabase
        .from('predicciones')
        .update({ goles_local: golesLocal, goles_visitante: golesVisitante, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .eq('user_id', user.id)

      if (error) throw error
      setPredicciones(prev => ({
        ...prev,
        [partidoId]: { ...existing, goles_local: golesLocal, goles_visitante: golesVisitante }
      }))
    } else {
      const { data, error } = await supabase
        .from('predicciones')
        .insert({
          user_id: user.id,
          partido_id: partidoId,
          goles_local: golesLocal,
          goles_visitante: golesVisitante,
        })
        .select()
        .single()

      if (error) throw error
      setPredicciones(prev => ({ ...prev, [partidoId]: data }))
    }
  }

  const completadas = PARTIDOS.filter(p => predicciones[p.id] != null).length

  // Group by phase
  const phases = [...new Set(PARTIDOS.map(p => p.fase))]

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-2 border-pitch-500/30 border-t-pitch-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-pitch-500 font-mono text-sm">Cargando predicciones...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✏️</span>
          <div>
            <h1 className="font-display font-extrabold text-3xl text-pitch-50">Mis predicciones</h1>
            <p className="text-pitch-500 text-sm mt-0.5">
              {isOpen
                ? `Cierre: ${format(FECHA_CIERRE, "d 'de' MMMM, HH:mm", { locale: es })}`
                : 'La quiniela está cerrada'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {!isOpen && <CerradaBanner />}

      <ProgressBar total={PARTIDOS.length} completadas={completadas} />

      {/* Matches by phase */}
      {phases.map(fase => (
        <div key={fase} className="mb-8">
          <h2 className="font-display font-bold text-sm text-pitch-500 uppercase tracking-widest mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-pitch-800" />
            {fase}
            <span className="flex-1 h-px bg-pitch-800" />
          </h2>
          <div className="space-y-4">
            {PARTIDOS.filter(p => p.fase === fase).map(partido => (
              <div key={partido.id} className="stagger-child animate-slide-up" style={{ animationFillMode: 'both' }}>
                <MatchCard
                  partido={partido}
                  prediccion={predicciones[partido.id]}
                  onSave={handleSave}
                  disabled={!isOpen}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom note */}
      <div className="mt-8 p-4 rounded-xl bg-pitch-950/50 border border-pitch-800/30 text-center">
        <p className="text-pitch-600 text-xs font-mono">
          {isOpen
            ? '💡 Tus predicciones se guardan automáticamente. Puedes editarlas hasta el cierre.'
            : '🏆 Las predicciones de todos ya son visibles en la tabla pública.'}
        </p>
      </div>
    </div>
  )
}
