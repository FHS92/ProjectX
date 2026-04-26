'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const verticals = [
  { id: 'shotgun', icon: '🎯', label: 'Shotgun' },
  { id: 'pistol',  icon: '🔫', label: 'Pistol' },
  { id: 'hunting', icon: '🦆', label: 'Hunting' },
  { id: 'fishing', icon: '🎣', label: 'Fishing' },
  { id: 'diving',  icon: '🤿', label: 'Diving' },
  { id: 'diy',     icon: '🪵', label: 'DIY' },
]

type VerticalId = 'shotgun' | 'pistol' | 'hunting' | 'fishing' | 'diving' | 'diy'

const disciplines: Record<string, string[]> = {
  shotgun: ['Sporting Clays', 'Skeet', 'Trap', 'FITASC', 'Down the Line'],
  pistol:  ['Practical / IPSC', 'IDPA', 'Target / Precision', 'Defensive'],
}

export default function NewLogPage() {
  const router = useRouter()
  const [vertical, setVertical] = useState<VerticalId>('shotgun')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, vertical }),
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
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 40px' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
          New Log Entry
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-inter)' }}>
          Select your activity then fill in the details.
        </p>
      </div>

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
              background: active ? 'linear-gradient(135deg, rgba(232,160,32,0.15), rgba(200,134,10,0.08))' : 'var(--bg-card)',
              border: active ? '1.5px solid var(--amber)' : '1px solid var(--border)',
              color: active ? 'var(--amber)' : 'var(--text-muted)',
              boxShadow: active ? '0 0 16px rgba(200,134,10,0.12)' : 'var(--shadow-card)',
            }}>
              <span style={{ fontSize: '24px' }}>{v.icon}</span>
              {v.label}
            </button>
          )
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Shared fields */}
        <Field label="Title" name="title" placeholder={defaultTitle(vertical)} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="Date" name="loggedAt" type="date" required />
          <Field label="Location" name="locationName" placeholder="e.g. Berg River" />
        </div>

        {/* Vertical-specific fields */}
        {(vertical === 'shotgun' || vertical === 'pistol') && <>
          <Select label="Discipline" name="discipline" options={disciplines[vertical]} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Score" name="score" type="number" placeholder="e.g. 43" />
            <Field label="Rounds" name="roundsTotal" type="number" placeholder="e.g. 50" />
          </div>
        </>}

        {(vertical === 'hunting') && <>
          <Field label="Species" name="species" placeholder="e.g. Duck" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Quantity" name="quantity" type="number" placeholder="e.g. 4" />
            <Field label="Weight (kg)" name="weight" type="number" placeholder="e.g. 1.2" />
          </div>
        </>}

        {(vertical === 'fishing') && <>
          <Field label="Species" name="species" placeholder="e.g. Kob" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Quantity" name="quantity" type="number" placeholder="e.g. 3" />
            <Field label="Weight (kg)" name="weight" type="number" placeholder="e.g. 2.4" />
          </div>
        </>}

        {(vertical === 'diving') && <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Depth (m)" name="depthMeters" type="number" placeholder="e.g. 18" />
            <Field label="Duration (min)" name="durationMinutes" type="number" placeholder="e.g. 45" />
          </div>
        </>}

        {(vertical === 'diy') && <>
          <Field label="Project Name" name="projectName" placeholder="e.g. Duck Call Build" required />
          <Field label="Materials Used" name="materialUsed" placeholder="e.g. Walnut, brass insert" />
        </>}

        <Field label="Notes" name="notes" placeholder="Conditions, observations, what worked..." textarea />

        {error && (
          <p style={{ fontSize: '13px', color: 'var(--red)', fontFamily: 'var(--font-inter)' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="button" onClick={() => router.back()} className="btn-ghost" style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={saving}>
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </div>

      </form>
    </div>
  )
}

function defaultTitle(v: VerticalId) {
  const map: Record<VerticalId, string> = {
    shotgun: 'e.g. Sporting Clays – Stellenbosch',
    pistol:  'e.g. IPSC Practice – Indoor Range',
    hunting: 'e.g. Duck Hunt – Berg River',
    fishing: 'e.g. Shore Fishing – Blouberg',
    diving:  'e.g. Reef Dive – Coral Gardens',
    diy:     'e.g. Duck Call Build',
  }
  return map[v]
}

function Field({ label, name, type = 'text', placeholder, required, textarea }: {
  label: string; name: string; type?: string
  placeholder?: string; required?: boolean; textarea?: boolean
}) {
  const shared = {
    name, placeholder, required,
    style: {
      width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
      background: 'var(--bg-raised)', border: '1px solid var(--border)',
      color: 'var(--text-primary)', fontFamily: 'var(--font-inter)',
      outline: 'none', resize: 'vertical' as const,
    } as React.CSSProperties,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>
        {label}
      </label>
      {textarea
        ? <textarea rows={3} {...shared} />
        : <input type={type} {...shared} />
      }
    </div>
  )
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>
        {label}
      </label>
      <select name={name} style={{
        width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
        background: 'var(--bg-raised)', border: '1px solid var(--border)',
        color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', outline: 'none',
      }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
