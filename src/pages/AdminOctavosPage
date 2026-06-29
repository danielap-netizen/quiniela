import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { OCTAVOS, ADMIN_EMAIL } from '../lib/config'

function OctavoAdminCard({ partido, resultado, onSave }) {
  const [gl, setGl] = useState(resultado?.goles_local ?? '')
  const [gv, setGv] = useState(resultado?.goles_visitante ?? '')
  const [winner, setWinner] = useState(resultado?.resultado ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setGl(resultado?.goles_local ?? '')
    setGv(resultado?.goles_visitante ?? '')
    setWinner(resultado?.resultado ?? '')
  }, [resultado])

  const canSave = gl !== '' && gv !== '' && winner

  const handleSave = async () => {
    if (!canSave) return

    setSaving(true)
    try {
      await onSave(partido.id, Number(gl), Number(gv), winner)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="rounded-2xl p-5 mb-4"
      style={{
        background: 'rgba(244,167,185,0.06)',
        border: '1px solid rgba(244,167,185,0.14)',
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-white/35 text-xs font-mono tracking-widest uppercase">
            Octavos · {partido.id}
          </p>
          <p className="text-white font-bold">
            {partido.local} vs {partido.visitante}
          </p>
          <p className="text-white/40 text-sm">{partido.ciudad}</p>
        </div>

        {resultado && (
          <p className="text-[#F4A7B9] text-sm font-bold">✓ Guardado</p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <div>
          <p className="text-white/60 text-sm mb-2">{partido.local}</p>
          <input
            type="number"
            min="0"
            value={gl}
            onChange={(e) => setGl(e.target.value)}
            className="w-full h-12 rounded-xl text-center text-xl font-bold"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>

        <p className="text-white/30 font-bold pt-7">-</p>

        <div>
          <p className="text-white/60 text-sm mb-2">{partido.visitante}</p>
          <input
            type="number"
            min="0"
            value={gv}
            onChange={(e) => setGv(e.target.value)}
            className="w-full h-12 rounded-xl text-center text-xl font-bold"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-white/45 text-sm mb-2">
          ¿Quién avanzó? Esto importa si hubo empate y penales.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setWinner('L')}
            className="rounded-xl px-4 py-3 font-bold text-left"
            style={{
              background: winner === 'L' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
              color: winner === 'L' ? '#111F18' : '#fff',
              border: '1px solid rgba(244,167,185,0.18)',
            }}
          >
            Avanzó {partido.local}
          </button>

          <button
            onClick={() => setWinner('V')}
            className="rounded-xl px-4 py-3 font-bold text-left"
            style={{
              background: winner === 'V' ? '#F4A7B9' : 'rgba(255,255,255,0.04)',
              color: winner === 'V' ? '#111F18' : '#fff',
              border: '1px solid rgba(244,167,185,0.18)',
            }}
          >
            Avanzó {partido.visitante}
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        className="mt-4 rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-40"
        style={{ background: '#F4A7B9', color: '#111F18' }}
      >
        {saving ? 'Guardando...' : 'Guardar resultado'}
      </button>
    </div>
  )
}

export default function AdminOctavosPage() {
  const { user } = useAuth()
  const [resultados, setResultados] = useState({})
  const [loading, setLoading] = useState(true)

  const esAdmin = user?.email === ADMIN_EMAIL

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from('resultados')
      .select('*')

    const map = {}
    ;(data || []).forEach((r) => {
      map[r.partido_id] = r
    })

    setResultados(map)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (esAdmin) fetchData()
  }, [esAdmin, fetchData])

  if (!user) return <Navigate to="/login" replace />
  if (!esAdmin) return <Navigate to="/tabla" replace />

  const handleSaveResultado = async (partidoId, gl, gv, winner) => {
    const payload = {
      partido_id: partidoId,
      goles_local: gl,
      goles_visitante: gv,
      resultado: winner,
      updated_at: new Date().toISOString(),
    }

    await supabase
      .from('resultados')
      .upsert(payload)

    setResultados((prev) => ({
      ...prev,
      [partidoId]: payload,
    }))
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-white/50">Cargando admin de octavos...</p>
      </div>
    )
  }

  const guardados = OCTAVOS.filter((p) => resultados[p.id]).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-[#F4A7B9] text-sm font-bold uppercase tracking-widest">
          Admin
        </p>

        <h1
          className="text-4xl sm:text-5xl font-black text-white mt-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Resultados de octavos
        </h1>

        <p className="text-white/55 mt-2">
          {guardados}/{OCTAVOS.length} resultados cargados.
        </p>
      </div>

      {OCTAVOS.map((partido) => (
        <OctavoAdminCard
          key={partido.id}
          partido={partido}
          resultado={resultados[partido.id]}
          onSave={handleSaveResultado}
        />
      ))}
    </div>
  )
}
