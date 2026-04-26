'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const verticals = [
  { id: 'pistol',  icon: '🔫', label: 'Pistol IPSC' },
  { id: 'shotgun', icon: '🎯', label: 'Shotgun' },
  { id: 'hunting', icon: '🦆', label: 'Hunting' },
  { id: 'fishing', icon: '🎣', label: 'Fishing' },
  { id: 'diving',  icon: '🤿', label: 'Diving' },
  { id: 'diy',     icon: '🪵', label: 'DIY' },
]

const TARGET_TYPES = ['IPSC Paper', 'IPSC Popper', 'IPSC Mini Popper']

type VerticalId = 'pistol' | 'shotgun' | 'hunting' | 'fishing' | 'diving' | 'diy'

interface Match { id: string; name: string; location?: string }

function calcHitFactor(a: number, c: number, d: number, m: number, ns: number, pe: number, t: number) {
  if (t <= 0) return null
  return ((a * 5 + c * 3 + d * 1 - m * 10 - ns * 10 - pe * 10) / t).toFixed(4)
}

export default function NewLogPage() {
  const router = useRouter()
  const [vertical, setVertical] = useState<VerticalId>('pistol')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [matches, setMatches] = useState<Match[]>([])
  const [matchId, setMatchId] = useState('')
  const [newMatchName, setNewMatchName] = useState('')
  const [showNewMatch, setShowNewMatch] = useState(false)
  const [selectedTargetTypes, setSelectedTargetTypes] = useState<string[]>([])

  // IPSC score fields for live hit factor preview
  const [alpha, setAlpha]       = useState('')
  const [charlie, setCharlie]   = useState('')
  const [delta, setDelta]       = useState('')
  const [mike, setMike]         = useState('')
  const [noShoot, setNoShoot]   = useState('')
  const [procErrors, setProcErrors] = useState('')
  const [timerReading, setTimerReading] = useState('')

  const hitFactorPreview = calcHitFactor(
    parseInt(alpha) || 0, parseInt(charlie) || 0, parseInt(delta) || 0,
    parseInt(mike) || 0, parseInt(noShoot) || 0, parseInt(procErrors) || 0,
    parseFloat(timerReading) || 0,
  )

  useEffect(() => {
    fetch('/api/matches').then(r => r.json()).then(setMatches)
  }, [])

  const toggleTargetType = useCallback((t: string) => {
    setSelectedTargetTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    let resolvedMatchId = matchId

    if (showNewMatch && newMatchName) {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMatchName }),
      })
      const match = await res.json()
      resolvedMatchId = match.id
    }

    const data = Object.fromEntries(new FormData(e.currentTarget))
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data, vertical,
        matchId: resolvedMatchId || null,
        alpha, charlie, delta, mike, noShoot, procErrors, timerReading,
        targetTypes: selectedTargetTypes.join(', '),
      }),
    })

    if (res.ok) {
      router.push('/log')
    } else {
      const json = await res.json()
      setError(json.error ?? 'Something went wrong.')
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
        New Log Entry
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', fontFamily: 'var(--font-inter)' }}>
        Select your activity then fill in the details.
      </p>

      {/* Vertical selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '28px' }}>
        {verticals.map((v) => {
          const active = vertical === v.id
          return (
            <button key={v.id} type="button" onClick={() => setVertical(v.id as VerticalId)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '14px 8px', borderRadius: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: 600,
              transition: 'all 0.15s ease',
              background: active ? 'rgba(200,134,10,0.1)' : 'var(--bg-card)',
              border: active ? '1.5px solid var(--amber)' : '1px solid var(--border)',
              color: active ? 'var(--amber)' : 'var(--text-muted)',
              boxShadow: active ? '0 0 16px rgba(200,134,10,0.12)' : 'var(--shadow-card)',
            }}>
              <span style={{ fontSize: '22px' }}>{v.icon}</span>
              {v.label}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Shared */}
        <Field label="Title / Stage Name" name="title" placeholder={placeholders[vertical]} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="Date" name="loggedAt" type="date" required />
          <Field label="Location" name="locationName" placeholder="e.g. Cape Town" />
        </div>

        {/* ── PISTOL IPSC ─────────────────────────────────── */}
        {vertical === 'pistol' && <>
          {/* Match selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Label>Match</Label>
            {!showNewMatch ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={matchId} onChange={e => setMatchId(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
                  <option value="">No match / practice</option>
                  {matches.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <button type="button" onClick={() => setShowNewMatch(true)} style={{
                  padding: '11px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  background: 'var(--bg-raised)', border: '1px solid var(--border)',
                  color: 'var(--amber)', cursor: 'pointer', fontFamily: 'var(--font-inter)',
                  whiteSpace: 'nowrap',
                }}>+ New</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text" placeholder="Match name" value={newMatchName}
                  onChange={e => setNewMatchName(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button type="button" onClick={() => setShowNewMatch(false)} style={{
                  padding: '11px 14px', borderRadius: '10px', fontSize: '13px',
                  background: 'var(--bg-raised)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-inter)',
                }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Timer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label>Stage Time (sec)</Label>
              <input type="number" step="0.01" placeholder="e.g. 12.34" value={timerReading}
                onChange={e => setTimerReading(e.target.value)} style={inputStyle} />
            </div>
            <Field label="Draw Time (sec)" name="drawTime" type="number" placeholder="e.g. 1.45" />
          </div>

          {/* Hit factor preview */}
          {hitFactorPreview !== null && (
            <div style={{
              padding: '14px 16px', borderRadius: '12px', textAlign: 'center',
              background: 'rgba(200,134,10,0.08)', border: '1px solid rgba(200,134,10,0.25)',
            }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '4px' }}>
                Hit Factor Preview
              </p>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 700, color: 'var(--amber)' }}>
                {hitFactorPreview}
              </p>
            </div>
          )}

          {/* Score breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Label>Score Breakdown</Label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
              padding: '16px', borderRadius: '14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
            }}>
              {[
                { label: 'Alpha', color: '#5aad35', val: alpha, set: setAlpha },
                { label: 'Charlie', color: '#c8860a', val: charlie, set: setCharlie },
                { label: 'Delta', color: '#7a9074', val: delta, set: setDelta },
                { label: 'Mike', color: '#d94040', val: mike, set: setMike },
                { label: 'No Shoot', color: '#d94040', val: noShoot, set: setNoShoot },
                { label: 'Proc Error', color: '#d94040', val: procErrors, set: setProcErrors },
              ].map(({ label, color, val, set }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color, fontFamily: 'var(--font-inter)' }}>
                    {label}
                  </span>
                  <input
                    type="number" min="0" value={val}
                    onChange={e => set(e.target.value)}
                    style={{ ...inputStyle, textAlign: 'center', padding: '8px 6px', fontSize: '18px', fontWeight: 700 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Target types */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Label>Target Types</Label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TARGET_TYPES.map(t => {
                const active = selectedTargetTypes.includes(t)
                return (
                  <button key={t} type="button" onClick={() => toggleTargetType(t)} style={{
                    padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
                    fontFamily: 'var(--font-inter)', cursor: 'pointer', transition: 'all 0.15s',
                    background: active ? 'rgba(200,134,10,0.12)' : 'var(--bg-raised)',
                    border: active ? '1px solid var(--amber)' : '1px solid var(--border)',
                    color: active ? 'var(--amber)' : 'var(--text-muted)',
                  }}>{t}</button>
                )
              })}
            </div>
          </div>

          {/* Gear notes */}
          <Field label="Gear Used" name="gearNotes" placeholder="e.g. CZ Shadow 2, 147gr brass, iron sights" textarea />
        </>}

        {/* ── SHOTGUN ─────────────────────────────────────── */}
        {vertical === 'shotgun' && <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Score" name="score" type="number" placeholder="e.g. 43" />
            <Field label="Rounds" name="roundsTotal" type="number" placeholder="e.g. 50" />
          </div>
          <Field label="Gear Used" name="gearNotes" placeholder="e.g. Browning B525, 28g #8" textarea />
        </>}

        {/* ── HUNTING ─────────────────────────────────────── */}
        {vertical === 'hunting' && <>
          <Field label="Species" name="species" placeholder="e.g. Duck" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Quantity" name="quantity" type="number" placeholder="e.g. 4" />
            <Field label="Weight (kg)" name="weight" type="number" placeholder="e.g. 1.2" />
          </div>
          <Field label="Gear Used" name="gearNotes" placeholder="e.g. Mossberg 500, #2 steel" textarea />
        </>}

        {/* ── FISHING ─────────────────────────────────────── */}
        {vertical === 'fishing' && <>
          <Field label="Species" name="species" placeholder="e.g. Kob" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Quantity" name="quantity" type="number" placeholder="e.g. 3" />
            <Field label="Weight (kg)" name="weight" type="number" placeholder="e.g. 2.4" />
          </div>
          <Field label="Gear Used" name="gearNotes" placeholder="e.g. 4000 reel, 15lb mono, cut bait" textarea />
        </>}

        {/* ── DIVING ──────────────────────────────────────── */}
        {vertical === 'diving' && <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Depth (m)" name="depthMeters" type="number" placeholder="e.g. 18" />
            <Field label="Duration (min)" name="durationMinutes" type="number" placeholder="e.g. 45" />
          </div>
          <Field label="Gear Used" name="gearNotes" placeholder="e.g. Scubapro BCD, 12L tank" textarea />
        </>}

        {/* ── DIY ─────────────────────────────────────────── */}
        {vertical === 'diy' && <>
          <Field label="Project Name" name="projectName" placeholder="e.g. Duck Call Build" required />
          <Field label="Materials Used" name="materialUsed" placeholder="e.g. Walnut, brass insert" />
          <Field label="Notes" name="gearNotes" placeholder="Build notes, dimensions, finish..." textarea />
        </>}

        {/* General notes (all except DIY which has its own) */}
        {vertical !== 'diy' && (
          <Field label="Notes" name="notes" placeholder="Conditions, observations, what worked..." textarea />
        )}

        {error && <p style={{ fontSize: '13px', color: 'var(--red)', fontFamily: 'var(--font-inter)' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="button" onClick={() => router.back()} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={saving}>
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </div>

      </form>
    </div>
  )
}

const placeholders: Record<string, string> = {
  pistol:  'e.g. Stage 3 — El Presidente',
  shotgun: 'e.g. Sporting Clays — Stellenbosch',
  hunting: 'e.g. Duck Hunt — Berg River',
  fishing: 'e.g. Shore Fishing — Blouberg',
  diving:  'e.g. Reef Dive — Coral Gardens',
  diy:     'e.g. Duck Call Build',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', outline: 'none',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>
      {children}
    </span>
  )
}

function Field({ label, name, type = 'text', placeholder, required, textarea }: {
  label: string; name: string; type?: string
  placeholder?: string; required?: boolean; textarea?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Label>{label}</Label>
      {textarea
        ? <textarea name={name} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        : <input type={type} name={name} placeholder={placeholder} required={required} style={inputStyle} />
      }
    </div>
  )
}
