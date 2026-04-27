'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

type VerticalId = 'pistol' | 'shotgun' | 'hunting' | 'fishing' | 'diving' | 'diy'
type PowerFactor = 'minor' | 'major'

interface Match { id: string; name: string }

interface IPSCScores {
  alpha: string; charlie: string; delta: string; mike: string
  noShoot: string; procErrors: string
  poppersKnocked: string; miniPoppersKnocked: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VERTICALS = [
  { id: 'pistol',  icon: '🔫', label: 'Pistol IPSC' },
  { id: 'shotgun', icon: '🎯', label: 'Shotgun' },
  { id: 'hunting', icon: '🦆', label: 'Hunting' },
  { id: 'fishing', icon: '🎣', label: 'Fishing' },
  { id: 'diving',  icon: '🤿', label: 'Diving' },
  { id: 'diy',     icon: '🪵', label: 'DIY' },
]

const PLACEHOLDERS: Record<VerticalId, string> = {
  pistol:  'e.g. Stage 3 — El Presidente',
  shotgun: 'e.g. Sporting Clays — Stellenbosch',
  hunting: 'e.g. Duck Hunt — Berg River',
  fishing: 'e.g. Shore Fishing — Blouberg',
  diving:  'e.g. Reef Dive — Coral Gardens',
  diy:     'e.g. Duck Call Build',
}

// ─── HF Calculator ────────────────────────────────────────────────────────────

function calcHF(s: IPSCScores, pf: PowerFactor, timer: string, poppersKnocked: string, miniPoppersKnocked: string) {
  const cVal = pf === 'major' ? 4 : 3
  const dVal = pf === 'major' ? 2 : 1
  const a  = parseInt(s.alpha) || 0
  const c  = parseInt(s.charlie) || 0
  const d  = parseInt(s.delta) || 0
  const m  = parseInt(s.mike) || 0
  const ns = parseInt(s.noShoot) || 0
  const pe = parseInt(s.procErrors) || 0
  const pk = parseInt(poppersKnocked) || 0
  const mk = parseInt(miniPoppersKnocked) || 0
  const t  = parseFloat(timer) || 0

  const points   = (a * 5) + (c * cVal) + (d * dVal) + (pk * 5) + (mk * 5)
  const penalties = (m * 10) + (ns * 10) + (pe * 10)
  const net      = points - penalties

  return { points, penalties, net, hf: t > 0 ? (net / t) : null }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewLogPage() {
  const router = useRouter()
  const [vertical, setVertical]       = useState<VerticalId>('pistol')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [matches, setMatches]         = useState<Match[]>([])
  const [matchId, setMatchId]         = useState('')
  const [newMatchName, setNewMatchName] = useState('')
  const [showNewMatch, setShowNewMatch] = useState(false)

  // Power factor
  const [powerFactor, setPowerFactor] = useState<PowerFactor>('minor')

  // Target counts
  const [paperTargets,     setPaperTargets]     = useState('')
  const [popperTargets,    setPopperTargets]    = useState('')
  const [miniPopperTargets, setMiniPopperTargets] = useState('')
  const [noShootTargets,   setNoShootTargets]   = useState('')

  // Timer
  const [timerReading, setTimerReading] = useState('')
  const [drawTime,     setDrawTime]     = useState('')

  // Scores
  const [scores, setScores] = useState<IPSCScores>({
    alpha: '', charlie: '', delta: '', mike: '',
    noShoot: '', procErrors: '',
    poppersKnocked: '', miniPoppersKnocked: '',
  })

  // Two-step state
  const [calculated, setCalculated] = useState(false)
  const [hfResult, setHfResult]     = useState<{ points: number; penalties: number; net: number; hf: number | null } | null>(null)

  useEffect(() => {
    fetch('/api/matches').then(r => r.json()).then(setMatches)
  }, [])

  // Reset calculate when scores change
  useEffect(() => { setCalculated(false); setHfResult(null) }, [scores, timerReading, powerFactor])

  const setScore = useCallback((key: keyof IPSCScores, val: string) => {
    setScores(prev => ({ ...prev, [key]: val }))
  }, [])

  // Shot count display
  const requiredShots  = (parseInt(paperTargets) || 0) * 2 + (parseInt(popperTargets) || 0) + (parseInt(miniPopperTargets) || 0)
  const scoredOnPaper  = (parseInt(scores.alpha) || 0) + (parseInt(scores.charlie) || 0) + (parseInt(scores.delta) || 0) + (parseInt(scores.mike) || 0)
  const steelKnocked   = (parseInt(scores.poppersKnocked) || 0) + (parseInt(scores.miniPoppersKnocked) || 0)
  const noShootHits    = parseInt(scores.noShoot) || 0

  function handleCalculate() {
    const result = calcHF(scores, powerFactor, timerReading, scores.poppersKnocked, scores.miniPoppersKnocked)
    setHfResult(result)
    setCalculated(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!calculated || !hfResult) return
    setSaving(true)
    setError('')

    let resolvedMatchId = matchId
    if (showNewMatch && newMatchName) {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMatchName }),
      })
      resolvedMatchId = (await res.json()).id
    }

    const formData = Object.fromEntries(new FormData(e.currentTarget))
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData, vertical, matchId: resolvedMatchId || null,
        powerFactor, timerReading, drawTime,
        paperTargets, popperTargets, miniPopperTargets, noShootTargets,
        ...scores,
        hitFactor: hfResult.hf?.toFixed(4),
      }),
    })

    if (res.ok) { router.push('/log') }
    else {
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
        {VERTICALS.map((v) => {
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
            }}>
              <span style={{ fontSize: '22px' }}>{v.icon}</span>
              {v.label}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Shared fields ── */}
        <Field label="Title" name="title" placeholder={PLACEHOLDERS[vertical]} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="Date" name="loggedAt" type="date" required />
          <Field label="Location" name="locationName" placeholder="e.g. Cape Town" />
        </div>

        {/* ══════════════════════════════════════════════
            PISTOL IPSC
        ══════════════════════════════════════════════ */}
        {vertical === 'pistol' && <>

          {/* Match */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Label>Match</Label>
            {!showNewMatch ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={matchId} onChange={e => setMatchId(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
                  <option value="">No match / practice</option>
                  {matches.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <button type="button" onClick={() => setShowNewMatch(true)} style={ghostBtn}>+ New</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Match name" value={newMatchName}
                  onChange={e => setNewMatchName(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={() => setShowNewMatch(false)} style={ghostBtn}>Cancel</button>
              </div>
            )}
          </div>

          {/* Timer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label>Stage Time (sec)</Label>
              <input type="number" step="0.01" placeholder="e.g. 12.34"
                value={timerReading} onChange={e => setTimerReading(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Label>Draw Time (sec)</Label>
              <input type="number" step="0.01" placeholder="e.g. 1.45"
                value={drawTime} onChange={e => setDrawTime(e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* Power Factor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Label>Power Factor</Label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['minor', 'major'] as PowerFactor[]).map(pf => (
                <button key={pf} type="button" onClick={() => setPowerFactor(pf)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                  fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 700,
                  textTransform: 'capitalize', transition: 'all 0.15s',
                  background: powerFactor === pf ? 'rgba(200,134,10,0.12)' : 'var(--bg-raised)',
                  border: powerFactor === pf ? '1.5px solid var(--amber)' : '1px solid var(--border)',
                  color: powerFactor === pf ? 'var(--amber)' : 'var(--text-muted)',
                }}>
                  {pf} {pf === 'minor' ? '(A5 C3 D1)' : '(A5 C4 D2)'}
                </button>
              ))}
            </div>
          </div>

          {/* Target Setup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Label>Stage Target Setup</Label>
            <div style={{
              padding: '16px', borderRadius: '14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <TargetInput label="IPSC Paper" sub="× 2 shots" value={paperTargets} onChange={setPaperTargets} />
                <TargetInput label="IPSC Popper" sub="× 1 shot" value={popperTargets} onChange={setPopperTargets} />
                <TargetInput label="Mini Popper" sub="× 1 shot" value={miniPopperTargets} onChange={setMiniPopperTargets} />
                <TargetInput label="No-Shoot" sub="penalty" value={noShootTargets} onChange={setNoShootTargets} />
              </div>

              {/* Required shots display */}
              {requiredShots > 0 && (
                <div style={{
                  padding: '10px 14px', borderRadius: '10px', marginTop: '4px',
                  background: 'rgba(200,134,10,0.06)', border: '1px solid rgba(200,134,10,0.2)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>
                    Required shots
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-playfair)' }}>
                    {requiredShots}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Score Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Label>Score Breakdown</Label>
            <div style={{
              padding: '16px', borderRadius: '14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: '14px',
            }}>

              {/* Paper hits */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>
                  Paper Hits
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {([
                    { key: 'alpha',   label: 'Alpha',  color: '#5aad35' },
                    { key: 'charlie', label: 'Charlie', color: '#c8860a' },
                    { key: 'delta',   label: 'Delta',  color: '#7a9074' },
                    { key: 'mike',    label: 'Mike',   color: '#d94040' },
                  ] as const).map(({ key, label, color }) => (
                    <ScoreInput key={key} label={label} color={color}
                      value={scores[key]} onChange={v => setScore(key, v)} />
                  ))}
                </div>
              </div>

              {/* Steel hits */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>
                  Steel Knocked Down
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <ScoreInput label="Poppers" color="#c8860a"
                    value={scores.poppersKnocked} onChange={v => setScore('poppersKnocked', v)} />
                  <ScoreInput label="Mini Pop." color="#c8860a"
                    value={scores.miniPoppersKnocked} onChange={v => setScore('miniPoppersKnocked', v)} />
                </div>
              </div>

              {/* Penalties */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>
                  Penalties
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <ScoreInput label="No Shoot" color="#d94040"
                    value={scores.noShoot} onChange={v => setScore('noShoot', v)} />
                  <ScoreInput label="Proc Error" color="#d94040"
                    value={scores.procErrors} onChange={v => setScore('procErrors', v)} />
                </div>
              </div>

              {/* Shot counter */}
              <div style={{
                padding: '12px 14px', borderRadius: '10px',
                background: 'var(--bg-raised)', border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: '6px',
              }}>
                <ShotRow label="Required shots" value={requiredShots} total={requiredShots} />
                <ShotRow label="Paper scored" value={scoredOnPaper} total={requiredShots} />
                <ShotRow label="Steel knocked" value={steelKnocked} total={requiredShots} />
                <ShotRow label="No-Shoot hits" value={noShootHits} total={requiredShots} isWarning />
              </div>
            </div>
          </div>

          {/* Gear notes */}
          <Field label="Gear Used" name="gearNotes"
            placeholder="e.g. CZ Shadow 2, 147gr brass, iron sights" textarea />

          {/* Calculate button */}
          <button type="button" onClick={handleCalculate} style={{
            width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-inter)', transition: 'all 0.2s',
            background: 'var(--bg-raised)', border: '1.5px solid var(--amber)',
            color: 'var(--amber)', letterSpacing: '0.04em',
          }}>
            Calculate Hit Factor
          </button>

          {/* HF Result */}
          {calculated && hfResult && (
            <div style={{
              padding: '24px', borderRadius: '16px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(200,134,10,0.1), rgba(200,134,10,0.04))',
              border: '1.5px solid var(--amber)',
              boxShadow: '0 0 24px rgba(200,134,10,0.15)',
            }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>
                Hit Factor
              </p>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '48px', fontWeight: 800, color: 'var(--amber)', lineHeight: 1, marginBottom: '16px' }}>
                {hfResult.hf !== null ? hfResult.hf.toFixed(4) : '—'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '2px' }}>POINTS</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#5aad35', fontFamily: 'var(--font-inter)' }}>+{hfResult.points}</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '2px' }}>PENALTIES</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#d94040', fontFamily: 'var(--font-inter)' }}>-{hfResult.penalties}</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '2px' }}>NET</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)' }}>{hfResult.net}</p>
                </div>
              </div>
            </div>
          )}
        </>}

        {/* ══════════════════════════════════════════════
            SHOTGUN
        ══════════════════════════════════════════════ */}
        {vertical === 'shotgun' && <>
          <Field label="Gear Used" name="gearNotes"
            placeholder="e.g. Browning B525, 28g #8" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            HUNTING
        ══════════════════════════════════════════════ */}
        {vertical === 'hunting' && <>
          <Field label="Species" name="species" placeholder="e.g. Duck" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Quantity" name="quantity" type="number" placeholder="e.g. 4" />
            <Field label="Weight (kg)" name="weight" type="number" placeholder="e.g. 1.2" />
          </div>
          <Field label="Gear Used" name="gearNotes"
            placeholder="e.g. Mossberg 500, #2 steel" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            FISHING
        ══════════════════════════════════════════════ */}
        {vertical === 'fishing' && <>
          <Field label="Species" name="species" placeholder="e.g. Kob" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Quantity" name="quantity" type="number" placeholder="e.g. 3" />
            <Field label="Weight (kg)" name="weight" type="number" placeholder="e.g. 2.4" />
          </div>
          <Field label="Gear Used" name="gearNotes"
            placeholder="e.g. 4000 reel, 15lb mono, cut bait" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            DIVING
        ══════════════════════════════════════════════ */}
        {vertical === 'diving' && <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Depth (m)" name="depthMeters" type="number" placeholder="e.g. 18" />
            <Field label="Duration (min)" name="durationMinutes" type="number" placeholder="e.g. 45" />
          </div>
          <Field label="Gear Used" name="gearNotes"
            placeholder="e.g. Scubapro BCD, 12L tank" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            DIY
        ══════════════════════════════════════════════ */}
        {vertical === 'diy' && <>
          <Field label="Project Name" name="projectName"
            placeholder="e.g. Duck Call Build" required />
          <Field label="Materials Used" name="materialUsed"
            placeholder="e.g. Walnut, brass insert" />
        </>}

        <Field label="Notes" name="notes"
          placeholder="Conditions, observations, what worked..." textarea />

        {error && (
          <p style={{ fontSize: '13px', color: 'var(--red)', fontFamily: 'var(--font-inter)' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={() => router.back()} className="btn-ghost" style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{ flex: 2, opacity: (vertical === 'pistol' && !calculated) ? 0.4 : 1 }}
            disabled={saving || (vertical === 'pistol' && !calculated)}
          >
            {saving ? 'Saving…' : vertical === 'pistol' && !calculated ? 'Calculate first' : 'Save Entry'}
          </button>
        </div>

      </form>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function TargetInput({ label, sub, value, onChange }: {
  label: string; sub: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)' }}>{label}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>{sub}</span>
      </div>
      <input type="number" min="0" value={value} onChange={e => onChange(e.target.value)}
        placeholder="0" style={{ ...inputStyle, textAlign: 'center', padding: '10px 6px', fontSize: '20px', fontWeight: 700 }} />
    </div>
  )
}

function ScoreInput({ label, color, value, onChange }: {
  label: string; color: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color, fontFamily: 'var(--font-inter)' }}>
        {label}
      </span>
      <input type="number" min="0" value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, textAlign: 'center', padding: '10px 6px', fontSize: '22px', fontWeight: 700 }} />
    </div>
  )
}

function ShotRow({ label, value, total, isWarning }: {
  label: string; value: number; total: number; isWarning?: boolean
}) {
  if (total === 0 && value === 0) return null
  const color = isWarning && value > 0 ? '#d94040' : value > 0 ? 'var(--text-primary)' : 'var(--text-subtle)'
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 700, color, fontFamily: 'var(--font-inter)' }}>{value}</span>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', outline: 'none',
}

const selectStyle: React.CSSProperties = { ...inputStyle }

const ghostBtn: React.CSSProperties = {
  padding: '11px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  color: 'var(--amber)', cursor: 'pointer', fontFamily: 'var(--font-inter)',
  whiteSpace: 'nowrap',
}
