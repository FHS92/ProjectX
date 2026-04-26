'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const verticalMeta: Record<string, { icon: string; label: string }> = {
  shotgun: { icon: '🎯', label: 'Shotgun Shooting' },
  pistol:  { icon: '🔫', label: 'Pistol Shooting' },
  hunting: { icon: '🦆', label: 'Hunting' },
  fishing: { icon: '🎣', label: 'Fishing' },
  diving:  { icon: '🤿', label: 'Diving' },
  diy:     { icon: '🪵', label: 'DIY & Builds' },
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [entry, setEntry] = useState<Record<string, unknown> | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/logs').then(r => r.json()).then((all: Record<string, unknown>[]) => {
      setEntry(all.find((e) => e.id === id) ?? null)
    })
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this log entry?')) return
    setDeleting(true)
    await fetch(`/api/logs/${id}`, { method: 'DELETE' })
    router.push('/log')
  }

  if (!entry) return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>Loading…</p>
    </div>
  )

  const meta = verticalMeta[entry.vertical as string] ?? { icon: '📓', label: String(entry.vertical) }

  const details: { label: string; value: unknown }[] = [
    entry.locationName  && { label: 'Location',      value: entry.locationName },
    entry.score != null && { label: 'Score',         value: `${entry.score}${entry.roundsTotal ? ` / ${entry.roundsTotal}` : ''}` },
    entry.species       && { label: 'Species',       value: entry.species },
    entry.quantity != null && { label: 'Quantity',   value: entry.quantity },
    entry.weight != null   && { label: 'Weight',     value: `${entry.weight} kg` },
    entry.depthMeters != null && { label: 'Depth',   value: `${entry.depthMeters} m` },
    entry.durationMinutes != null && { label: 'Duration', value: `${entry.durationMinutes} min` },
    entry.projectName   && { label: 'Project',       value: entry.projectName },
    entry.materialUsed  && { label: 'Materials',     value: entry.materialUsed },
  ].filter(Boolean) as { label: string; value: unknown }[]

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 40px' }}>

      {/* Back */}
      <button onClick={() => router.back()} style={{
        display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)',
      }}>
        ‹ Back to Logbook
      </button>

      {/* Header */}
      <div style={{
        padding: '24px', borderRadius: '20px', marginBottom: '16px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderLeft: '4px solid var(--amber)', boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '32px' }}>{meta.icon}</span>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber)', fontFamily: 'var(--font-inter)', marginBottom: '4px' }}>
              {meta.label}
            </p>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {entry.title as string}
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>
          {formatDate(entry.loggedAt as string)}
        </p>
      </div>

      {/* Details */}
      {details.length > 0 && (
        <div style={{
          padding: '20px', borderRadius: '16px', marginBottom: '16px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
        }}>
          {details.map((d) => (
            <div key={d.label}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '4px' }}>
                {d.label}
              </p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)' }}>
                {String(d.value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {entry.notes && (
        <div style={{
          padding: '20px', borderRadius: '16px', marginBottom: '24px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '10px' }}>
            Notes
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
            {entry.notes as string}
          </p>
        </div>
      )}

      {/* Delete */}
      <button onClick={handleDelete} disabled={deleting} style={{
        width: '100%', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
        background: 'var(--red-bg)', border: '1px solid rgba(217,64,64,0.3)',
        color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--font-inter)',
        transition: 'all 0.2s ease',
      }}>
        {deleting ? 'Deleting…' : 'Delete Entry'}
      </button>
    </div>
  )
}
