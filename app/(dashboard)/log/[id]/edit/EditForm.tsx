'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

type PowerFactor = 'minor' | 'major'

interface Match { id: string; name: string }

interface IPSCScores {
  alpha: string; charlie: string; delta: string; mike: string
  noShoot: string; procErrors: string
  poppersKnocked: string; miniPoppersKnocked: string
}

export interface EntryProp {
  id: string
  vertical: string
  title: string
  loggedAt: string
  locationName?: string | null
  notes?: string | null
  gearNotes?: string | null
  matchId?: string | null
  powerFactor?: string | null
  timerReading?: number | null
  drawTime?: number | null
  paperTargets?: number | null
  popperTargets?: number | null
  miniPopperTargets?: number | null
  noShootTargets?: number | null
  alpha?: number | null
  charlie?: number | null
  delta?: number | null
  mike?: number | null
  noShoot?: number | null
  procErrors?: number | null
  poppersKnocked?: number | null
  miniPoppersKnocked?: number | null
  hitFactor?: number | null
  species?: string | null
  quantity?: number | null
  weight?: number | null
  depthMeters?: number | null
  durationMinutes?: number | null
  projectName?: string | null
  materialUsed?: string | null
  shotgunDiscipline?: string | null
  score?: number | null
  roundsTotal?: number | null
  dtlFirstBarrel?: number | null
  dtlSecondBarrel?: number | null
  visibility?: number | null
  waterTemp?: number | null
  gasMix?: string | null
  tankStart?: number | null
  tankEnd?: number | null
  weightUsed?: number | null
  diveType?: string | null
  buddy?: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VERTICAL_META: Record<string, { icon: string; label: string }> = {
  pistol:  { icon: '🔫', label: 'Pistol IPSC' },
  shotgun: { icon: '🎯', label: 'Shotgun' },
  hunting: { icon: '🦆', label: 'Hunting' },
  fishing: { icon: '🎣', label: 'Fishing' },
  diving:  { icon: '🤿', label: 'Diving' },
  diy:     { icon: '🪵', label: 'DIY' },
}

function numStr(v: number | null | undefined): string {
  return v != null ? String(v) : ''
}

function calcHF(s: IPSCScores, pf: PowerFactor, timer: string) {
  const cVal = pf === 'major' ? 4 : 3
  const dVal = pf === 'major' ? 2 : 1
  const a  = parseInt(s.alpha) || 0
  const c  = parseInt(s.charlie) || 0
  const d  = parseInt(s.delta) || 0
  const m  = parseInt(s.mike) || 0
  const ns = parseInt(s.noShoot) || 0
  const pe = parseInt(s.procErrors) || 0
  const pk = parseInt(s.poppersKnocked) || 0
  const mk = parseInt(s.miniPoppersKnocked) || 0
  const t  = parseFloat(timer) || 0
  const points    = (a * 5) + (c * cVal) + (d * dVal) + (pk * 5) + (mk * 5)
  const penalties = (m * 10) + (ns * 10) + (pe * 10)
  const net       = points - penalties
  return { points, penalties, net, hf: t > 0 ? net / t : null }
}

function initHfResult(e: EntryProp) {
  if (e.hitFactor == null) return null
  const pf = e.powerFactor === 'major'
  const cVal = pf ? 4 : 3
  const dVal = pf ? 2 : 1
  const points    = (e.alpha ?? 0) * 5 + (e.charlie ?? 0) * cVal + (e.delta ?? 0) * dVal +
                    (e.poppersKnocked ?? 0) * 5 + (e.miniPoppersKnocked ?? 0) * 5
  const penalties = ((e.mike ?? 0) + (e.noShoot ?? 0) + (e.procErrors ?? 0)) * 10
  return { hf: e.hitFactor, points, penalties, net: points - penalties }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditForm({ entry, matchName }: { entry: EntryProp; matchName?: string | null }) {
  const router = useRouter()
  const vertical = entry.vertical
  const meta = VERTICAL_META[vertical] ?? { icon: '📓', label: vertical }

  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [matches, setMatches]   = useState<Match[]>([])

  // Common fields
  const [title, setTitle]               = useState(entry.title)
  const [loggedAtStr, setLoggedAtStr]   = useState(
    entry.loggedAt ? new Date(entry.loggedAt).toISOString().slice(0, 10) : ''
  )
  const [locationName, setLocationName] = useState(entry.locationName ?? '')
  const [notes, setNotes]               = useState(entry.notes ?? '')
  const [gearNotes, setGearNotes]       = useState(entry.gearNotes ?? '')

  // Pistol
  const [matchId, setMatchId]               = useState(entry.matchId ?? '')
  const [showNewMatch, setShowNewMatch]     = useState(false)
  const [newMatchName, setNewMatchName]     = useState('')
  const [powerFactor, setPowerFactor]       = useState<PowerFactor>((entry.powerFactor as PowerFactor) ?? 'minor')
  const [timerReading, setTimerReading]     = useState(numStr(entry.timerReading))
  const [drawTime, setDrawTime]             = useState(numStr(entry.drawTime))
  const [paperTargets, setPaperTargets]     = useState(numStr(entry.paperTargets))
  const [popperTargets, setPopperTargets]   = useState(numStr(entry.popperTargets))
  const [miniPopperTargets, setMiniPopperTargets] = useState(numStr(entry.miniPopperTargets))
  const [noShootTargets, setNoShootTargets] = useState(numStr(entry.noShootTargets))
  const [scores, setScores] = useState<IPSCScores>({
    alpha:              numStr(entry.alpha),
    charlie:            numStr(entry.charlie),
    delta:              numStr(entry.delta),
    mike:               numStr(entry.mike),
    noShoot:            numStr(entry.noShoot),
    procErrors:         numStr(entry.procErrors),
    poppersKnocked:     numStr(entry.poppersKnocked),
    miniPoppersKnocked: numStr(entry.miniPoppersKnocked),
  })
  const [calculated, setCalculated] = useState(entry.hitFactor != null)
  const [hfResult, setHfResult]     = useState<{ points: number; penalties: number; net: number; hf: number | null } | null>(
    initHfResult(entry)
  )

  // Hunting / Fishing
  const [species, setSpecies]   = useState(entry.species ?? '')
  const [quantity, setQuantity] = useState(numStr(entry.quantity))
  const [weight, setWeight]     = useState(numStr(entry.weight))

  // Diving
  const [depthMeters, setDepthMeters]         = useState(numStr(entry.depthMeters))
  const [durationMinutes, setDurationMinutes] = useState(numStr(entry.durationMinutes))
  type DiveType = 'reef' | 'wreck' | 'wall' | 'cave' | 'night' | 'drift' | 'boat' | 'shore'
  type GasMix   = 'air'  | 'nitrox32' | 'nitrox36' | 'nitrox40' | 'trimix'
  const [diveType,  setDiveType]  = useState<DiveType | ''>((entry.diveType as DiveType) ?? '')
  const [gasMix,    setGasMix]    = useState<GasMix | ''>((entry.gasMix as GasMix) ?? '')
  const [visibility,    setVisibility]    = useState(numStr(entry.visibility))
  const [waterTemp,     setWaterTemp]     = useState(numStr(entry.waterTemp))
  const [dTankStart,    setDTankStart]    = useState(numStr(entry.tankStart))
  const [dTankEnd,      setDTankEnd]      = useState(numStr(entry.tankEnd))
  const [weightUsed,    setWeightUsed]    = useState(numStr(entry.weightUsed))
  const [buddy,         setBuddy]         = useState(entry.buddy ?? '')

  // DIY
  const [projectName, setProjectName]   = useState(entry.projectName ?? '')
  const [materialUsed, setMaterialUsed] = useState(entry.materialUsed ?? '')

  // Shotgun
  type ShotgunDiscipline = 'skeet' | 'trap_dtl' | 'trap_olympic' | 'compak' | 'zz'
  const [shotgunDiscipline, setShotgunDiscipline] = useState<ShotgunDiscipline | ''>(
    (entry.shotgunDiscipline as ShotgunDiscipline) ?? ''
  )
  const [sgScore,    setSgScore]   = useState(numStr(entry.score))
  const [sgTotal,    setSgTotal]   = useState(numStr(entry.roundsTotal) || '25')
  const [dtlFirst,   setDtlFirst]  = useState(numStr(entry.dtlFirstBarrel))
  const [dtlSecond,  setDtlSecond] = useState(numStr(entry.dtlSecondBarrel))

  useEffect(() => {
    if (vertical === 'pistol') {
      fetch('/api/matches').then(r => r.json()).then(setMatches)
    }
  }, [vertical])

  // Skip resetting HF on first render (pre-filled data)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    setCalculated(false)
    setHfResult(null)
  }, [scores, timerReading, powerFactor])

  const setScore = useCallback((key: keyof IPSCScores, val: string) => {
    setScores(prev => ({ ...prev, [key]: val }))
  }, [])

  const requiredShots = (parseInt(paperTargets) || 0) * 2 + (parseInt(popperTargets) || 0) + (parseInt(miniPopperTargets) || 0)
  const scoredOnPaper = (parseInt(scores.alpha) || 0) + (parseInt(scores.charlie) || 0) + (parseInt(scores.delta) || 0) + (parseInt(scores.mike) || 0)
  const steelKnocked  = (parseInt(scores.poppersKnocked) || 0) + (parseInt(scores.miniPoppersKnocked) || 0)
  const noShootHits   = parseInt(scores.noShoot) || 0

  function handleCalculate() {
    const result = calcHF(scores, powerFactor, timerReading)
    setHfResult(result)
    setCalculated(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (vertical === 'pistol' && (!calculated || !hfResult)) return
    setSaving(true)
    setError('')

    try {
      let resolvedMatchId = matchId
      if (showNewMatch && newMatchName) {
        const matchRes = await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newMatchName }),
        })
        resolvedMatchId = (await matchRes.json()).id
      }

      const res = await fetch(`/api/logs/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical,
          title, loggedAt: loggedAtStr, locationName, notes, gearNotes,
          matchId: resolvedMatchId || null,
          powerFactor, timerReading, drawTime,
          paperTargets, popperTargets, miniPopperTargets, noShootTargets,
          ...scores,
          hitFactor: hfResult?.hf?.toFixed(4) ?? null,
          species, quantity, weight,
          depthMeters, durationMinutes,
          visibility, waterTemp, gasMix,
          tankStart: dTankStart, tankEnd: dTankEnd,
          weightUsed, diveType, buddy,
          projectName, materialUsed,
          shotgunDiscipline: vertical === 'shotgun' ? shotgunDiscipline || null : null,
          score: vertical === 'shotgun'
            ? shotgunDiscipline === 'trap_dtl'
              ? String((parseInt(dtlFirst) || 0) * 3 + (parseInt(dtlSecond) || 0) * 2)
              : sgScore || null
            : null,
          roundsTotal: vertical === 'shotgun' ? sgTotal || null : null,
          dtlFirstBarrel:  vertical === 'shotgun' && shotgunDiscipline === 'trap_dtl' ? dtlFirst  || null : null,
          dtlSecondBarrel: vertical === 'shotgun' && shotgunDiscipline === 'trap_dtl' ? dtlSecond || null : null,
        }),
      })

      if (res.ok) {
        router.push(`/log/${entry.id}`)
      } else {
        const text = await res.text()
        let msg = 'Something went wrong.'
        try { msg = JSON.parse(text).error ?? msg } catch { /* non-JSON */ }
        setError(msg)
        setSaving(false)
      }
    } catch {
      setError('Network error — please try again.')
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 48px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Edit Entry
        </h1>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', fontWeight: 700, padding: '6px 12px',
          borderRadius: '8px', fontFamily: 'var(--font-inter)',
          background: 'rgba(200,134,10,0.1)', border: '1px solid rgba(200,134,10,0.25)', color: 'var(--amber)',
        }}>
          {meta.icon} {meta.label}
        </span>
      </div>
      <button type="button" onClick={() => router.back()} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', marginBottom: '24px',
      }}>
        ‹ Back
      </button>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Common fields ── */}
        <CF label="Title" value={title} onChange={setTitle} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <CF label="Date" type="date" value={loggedAtStr} onChange={setLoggedAtStr} required />
          <CF label="Location" value={locationName} onChange={setLocationName} placeholder="e.g. Cape Town" />
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
                <select value={matchId} onChange={e => setMatchId(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                  <option value="">No match / practice</option>
                  {matches.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  {matchName && entry.matchId && !matches.find(m => m.id === entry.matchId) && (
                    <option value={entry.matchId}>{matchName}</option>
                  )}
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
            <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <TargetInput label="IPSC Paper" sub="× 2 shots" value={paperTargets} onChange={setPaperTargets} />
                <TargetInput label="IPSC Popper" sub="× 1 shot" value={popperTargets} onChange={setPopperTargets} />
                <TargetInput label="Mini Popper" sub="× 1 shot" value={miniPopperTargets} onChange={setMiniPopperTargets} />
                <TargetInput label="No-Shoot" sub="penalty" value={noShootTargets} onChange={setNoShootTargets} />
              </div>
              {requiredShots > 0 && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', marginTop: '4px', background: 'rgba(200,134,10,0.06)', border: '1px solid rgba(200,134,10,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>Required shots</span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-playfair)' }}>{requiredShots}</span>
                </div>
              )}
            </div>
          </div>

          {/* Score Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Label>Score Breakdown</Label>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>Paper Hits</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {([
                    { key: 'alpha',   label: 'Alpha',   color: '#5aad35' },
                    { key: 'charlie', label: 'Charlie', color: '#c8860a' },
                    { key: 'delta',   label: 'Delta',   color: '#7a9074' },
                    { key: 'mike',    label: 'Mike',    color: '#d94040' },
                  ] as const).map(({ key, label, color }) => (
                    <ScoreInput key={key} label={label} color={color}
                      value={scores[key]} onChange={v => setScore(key, v)} />
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>Steel Knocked Down</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <ScoreInput label="Poppers" color="#c8860a" value={scores.poppersKnocked} onChange={v => setScore('poppersKnocked', v)} />
                  <ScoreInput label="Mini Pop." color="#c8860a" value={scores.miniPoppersKnocked} onChange={v => setScore('miniPoppersKnocked', v)} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>Penalties</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <ScoreInput label="No Shoot" color="#d94040" value={scores.noShoot} onChange={v => setScore('noShoot', v)} />
                  <ScoreInput label="Proc Error" color="#d94040" value={scores.procErrors} onChange={v => setScore('procErrors', v)} />
                </div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--bg-raised)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <ShotRow label="Required shots" value={requiredShots} total={requiredShots} />
                <ShotRow label="Paper scored"   value={scoredOnPaper} total={requiredShots} />
                <ShotRow label="Steel knocked"  value={steelKnocked}  total={requiredShots} />
                <ShotRow label="No-Shoot hits"  value={noShootHits}   total={requiredShots} isWarning />
              </div>
            </div>
          </div>

          <CF label="Gear Used" value={gearNotes} onChange={setGearNotes} placeholder="e.g. CZ Shadow 2, 147gr brass, iron sights" textarea />

          {/* Calculate button */}
          <button type="button" onClick={handleCalculate} style={{
            width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-inter)', transition: 'all 0.2s',
            background: 'var(--bg-raised)', border: '1.5px solid var(--amber)',
            color: 'var(--amber)', letterSpacing: '0.04em',
          }}>
            {calculated ? 'Recalculate Hit Factor' : 'Calculate Hit Factor'}
          </button>

          {/* HF Result */}
          {calculated && hfResult && (
            <div style={{ padding: '24px', borderRadius: '16px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(200,134,10,0.1), rgba(200,134,10,0.04))', border: '1.5px solid var(--amber)', boxShadow: '0 0 24px rgba(200,134,10,0.15)' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '8px' }}>Hit Factor</p>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '48px', fontWeight: 800, color: 'var(--amber)', lineHeight: 1, marginBottom: '16px' }}>
                {hfResult.hf !== null ? hfResult.hf.toFixed(4) : '—'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                <div><p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '2px' }}>POINTS</p><p style={{ fontSize: '16px', fontWeight: 700, color: '#5aad35', fontFamily: 'var(--font-inter)' }}>+{hfResult.points}</p></div>
                <div><p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '2px' }}>PENALTIES</p><p style={{ fontSize: '16px', fontWeight: 700, color: '#d94040', fontFamily: 'var(--font-inter)' }}>-{hfResult.penalties}</p></div>
                <div><p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '2px' }}>NET</p><p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)' }}>{hfResult.net}</p></div>
              </div>
            </div>
          )}
        </>}

        {/* ══════════════════════════════════════════════
            SHOTGUN
        ══════════════════════════════════════════════ */}
        {vertical === 'shotgun' && <>
          {/* Discipline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Label>Discipline</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {([
                { id: 'skeet',        label: 'Olympic Skeet', icon: '🎯' },
                { id: 'trap_dtl',     label: 'Trap — DTL',    icon: '🏆' },
                { id: 'trap_olympic', label: 'Olympic Trap',  icon: '🎖' },
                { id: 'compak',       label: 'Compak',        icon: '🎪' },
                { id: 'zz',           label: 'ZZ Bird',       icon: '⚡' },
              ] as const).map(d => (
                <button key={d.id} type="button"
                  onClick={() => { setShotgunDiscipline(d.id); setSgScore(''); setSgTotal('25'); setDtlFirst(''); setDtlSecond('') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                    fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 600,
                    transition: 'all 0.15s',
                    background: shotgunDiscipline === d.id ? 'rgba(200,134,10,0.12)' : 'var(--bg-raised)',
                    border: shotgunDiscipline === d.id ? '1.5px solid var(--amber)' : '1px solid var(--border)',
                    color: shotgunDiscipline === d.id ? 'var(--amber)' : 'var(--text-muted)',
                  }}>
                  <span style={{ fontSize: '18px' }}>{d.icon}</span>{d.label}
                </button>
              ))}
            </div>
          </div>

          {/* DTL score */}
          {shotgunDiscipline === 'trap_dtl' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Label>DTL Score</Label>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#5aad35', fontFamily: 'var(--font-inter)' }}>1st Barrel</span>
                    <input type="number" min="0" max="25" value={dtlFirst} onChange={e => setDtlFirst(e.target.value)}
                      placeholder="0" style={{ ...inputStyle, textAlign: 'center', fontSize: '22px', fontWeight: 700, padding: '10px 6px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#c8860a', fontFamily: 'var(--font-inter)' }}>2nd Barrel</span>
                    <input type="number" min="0" max="25" value={dtlSecond} onChange={e => setDtlSecond(e.target.value)}
                      placeholder="0" style={{ ...inputStyle, textAlign: 'center', fontSize: '22px', fontWeight: 700, padding: '10px 6px' }} />
                  </div>
                </div>
                {(dtlFirst || dtlSecond) && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(200,134,10,0.06)', border: '1px solid rgba(200,134,10,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>Weighted score / 75</span>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-playfair)' }}>
                      {(parseInt(dtlFirst) || 0) * 3 + (parseInt(dtlSecond) || 0) * 2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skeet / Olympic Trap / Compak */}
          {(shotgunDiscipline === 'skeet' || shotgunDiscipline === 'trap_olympic' || shotgunDiscipline === 'compak') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Label>Score</Label>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#5aad35', fontFamily: 'var(--font-inter)' }}>Hits</span>
                    <input type="number" min="0" value={sgScore} onChange={e => setSgScore(e.target.value)}
                      placeholder="0" style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', fontWeight: 700, padding: '10px 6px' }} />
                  </div>
                  <span style={{ fontSize: '22px', color: 'var(--text-subtle)', textAlign: 'center' }}>/</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>Targets</span>
                    <input type="number" min="1" value={sgTotal} onChange={e => setSgTotal(e.target.value)}
                      style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', fontWeight: 700, padding: '10px 6px' }} />
                  </div>
                </div>
                {sgScore && parseInt(sgTotal) > 0 && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(200,134,10,0.06)', border: '1px solid rgba(200,134,10,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>Hit rate</span>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-playfair)' }}>
                      {((parseInt(sgScore) / parseInt(sgTotal)) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ZZ Bird */}
          {shotgunDiscipline === 'zz' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Label>ZZ Score</Label>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#5aad35', fontFamily: 'var(--font-inter)' }}>ZZ Killed</span>
                    <input type="number" min="0" value={sgScore} onChange={e => setSgScore(e.target.value)}
                      placeholder="0" style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', fontWeight: 700, padding: '10px 6px' }} />
                  </div>
                  <span style={{ fontSize: '22px', color: 'var(--text-subtle)', textAlign: 'center' }}>/</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>Birds</span>
                    <input type="number" min="1" value={sgTotal} onChange={e => setSgTotal(e.target.value)}
                      style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', fontWeight: 700, padding: '10px 6px' }} />
                  </div>
                </div>
                {sgScore && parseInt(sgTotal) > 0 && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(200,134,10,0.06)', border: '1px solid rgba(200,134,10,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>Kill rate</span>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-playfair)' }}>
                      {((parseInt(sgScore) / parseInt(sgTotal)) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <CF label="Gear Used" value={gearNotes} onChange={setGearNotes} placeholder="e.g. Browning B525, 28g #8, improved cyl" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            HUNTING
        ══════════════════════════════════════════════ */}
        {vertical === 'hunting' && <>
          <CF label="Species" value={species} onChange={setSpecies} placeholder="e.g. Duck" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CF label="Quantity" type="number" value={quantity} onChange={setQuantity} placeholder="e.g. 4" />
            <CF label="Weight (kg)" type="number" value={weight} onChange={setWeight} placeholder="e.g. 1.2" />
          </div>
          <CF label="Gear Used" value={gearNotes} onChange={setGearNotes} placeholder="e.g. Mossberg 500, #2 steel" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            FISHING
        ══════════════════════════════════════════════ */}
        {vertical === 'fishing' && <>
          <CF label="Species" value={species} onChange={setSpecies} placeholder="e.g. Kob" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CF label="Quantity" type="number" value={quantity} onChange={setQuantity} placeholder="e.g. 3" />
            <CF label="Weight (kg)" type="number" value={weight} onChange={setWeight} placeholder="e.g. 2.4" />
          </div>
          <CF label="Gear Used" value={gearNotes} onChange={setGearNotes} placeholder="e.g. 4000 reel, 15lb mono" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            DIVING
        ══════════════════════════════════════════════ */}
        {vertical === 'diving' && <>

          {/* Dive Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Label>Dive Type</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {([
                { id: 'reef',  icon: '🪸', label: 'Reef' },
                { id: 'wreck', icon: '🚢', label: 'Wreck' },
                { id: 'wall',  icon: '🌊', label: 'Wall' },
                { id: 'cave',  icon: '🪨', label: 'Cave' },
                { id: 'night', icon: '🌙', label: 'Night' },
                { id: 'drift', icon: '💨', label: 'Drift' },
                { id: 'boat',  icon: '⛵', label: 'Boat' },
                { id: 'shore', icon: '🏖', label: 'Shore' },
              ] as const).map(t => (
                <button key={t.id} type="button" onClick={() => setDiveType(t.id)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '10px 6px', borderRadius: '10px', cursor: 'pointer',
                  fontFamily: 'var(--font-inter)', fontSize: '10px', fontWeight: 600,
                  transition: 'all 0.15s',
                  background: diveType === t.id ? 'rgba(200,134,10,0.12)' : 'var(--bg-raised)',
                  border: diveType === t.id ? '1.5px solid var(--amber)' : '1px solid var(--border)',
                  color: diveType === t.id ? 'var(--amber)' : 'var(--text-muted)',
                }}>
                  <span style={{ fontSize: '20px' }}>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Depth & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CF label="Max Depth (m)" type="number" value={depthMeters} onChange={setDepthMeters} placeholder="e.g. 18" />
            <CF label="Duration (min)" type="number" value={durationMinutes} onChange={setDurationMinutes} placeholder="e.g. 45" />
          </div>

          {/* Conditions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CF label="Visibility (m)" type="number" value={visibility} onChange={setVisibility} placeholder="e.g. 15" />
            <CF label="Water Temp (°C)" type="number" value={waterTemp} onChange={setWaterTemp} placeholder="e.g. 22" />
          </div>

          {/* Gas Mix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Label>Gas Mix</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {([
                { id: 'air',      label: 'Air',    sub: '21% O₂' },
                { id: 'nitrox32', label: 'EAN 32', sub: '32% O₂' },
                { id: 'nitrox36', label: 'EAN 36', sub: '36% O₂' },
                { id: 'nitrox40', label: 'EAN 40', sub: '40% O₂' },
                { id: 'trimix',   label: 'Trimix', sub: 'He mix' },
              ] as const).map(g => (
                <button key={g.id} type="button" onClick={() => setGasMix(g.id)} style={{
                  padding: '10px 6px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                  fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: 700,
                  transition: 'all 0.15s',
                  background: gasMix === g.id ? 'rgba(200,134,10,0.12)' : 'var(--bg-raised)',
                  border: gasMix === g.id ? '1.5px solid var(--amber)' : '1px solid var(--border)',
                  color: gasMix === g.id ? 'var(--amber)' : 'var(--text-muted)',
                }}>
                  <div>{g.label}</div>
                  <div style={{ fontSize: '9px', marginTop: '2px', opacity: 0.75 }}>{g.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tank Pressure */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Label>Tank Pressure</Label>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#5aad35', fontFamily: 'var(--font-inter)' }}>Start (bar)</span>
                  <input type="number" min="0" max="300" value={dTankStart} onChange={e => setDTankStart(e.target.value)}
                    placeholder="200" style={{ ...inputStyle, textAlign: 'center', fontSize: '22px', fontWeight: 700, padding: '10px 6px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#d94040', fontFamily: 'var(--font-inter)' }}>End (bar)</span>
                  <input type="number" min="0" max="300" value={dTankEnd} onChange={e => setDTankEnd(e.target.value)}
                    placeholder="50" style={{ ...inputStyle, textAlign: 'center', fontSize: '22px', fontWeight: 700, padding: '10px 6px' }} />
                </div>
              </div>
              {dTankStart && dTankEnd && parseInt(dTankStart) > parseInt(dTankEnd) && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(200,134,10,0.06)', border: '1px solid rgba(200,134,10,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>Air consumed</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-playfair)' }}>
                    {parseInt(dTankStart) - parseInt(dTankEnd)} bar
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Weight & Buddy */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CF label="Weight (kg)" type="number" value={weightUsed} onChange={setWeightUsed} placeholder="e.g. 6" />
            <CF label="Buddy" value={buddy} onChange={setBuddy} placeholder="e.g. Marco" />
          </div>

          <CF label="Gear Used" value={gearNotes} onChange={setGearNotes} placeholder="e.g. Scubapro BCD, Mares reg, 12L alu" textarea />
        </>}

        {/* ══════════════════════════════════════════════
            DIY
        ══════════════════════════════════════════════ */}
        {vertical === 'diy' && <>
          <CF label="Project Name" value={projectName} onChange={setProjectName} placeholder="e.g. Duck Call Build" required />
          <CF label="Materials Used" value={materialUsed} onChange={setMaterialUsed} placeholder="e.g. Walnut, brass insert" />
        </>}

        <CF label="Notes" value={notes} onChange={setNotes} placeholder="Conditions, observations, what worked…" textarea />

        {error && (
          <p style={{ fontSize: '13px', color: '#d94040', fontFamily: 'var(--font-inter)' }}>{error}</p>
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
            {saving ? 'Saving…' : vertical === 'pistol' && !calculated ? 'Calculate first' : 'Save Changes'}
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

function CF({ label, value, onChange, type = 'text', placeholder, required, textarea }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean; textarea?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Label>{label}</Label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={inputStyle} />
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
  boxSizing: 'border-box',
}

const ghostBtn: React.CSSProperties = {
  padding: '11px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  color: 'var(--amber)', cursor: 'pointer', fontFamily: 'var(--font-inter)',
  whiteSpace: 'nowrap',
}
