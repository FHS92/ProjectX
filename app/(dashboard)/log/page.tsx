import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { logs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'

const verticalMeta: Record<string, { icon: string; label: string }> = {
  shotgun: { icon: '🎯', label: 'Shotgun' },
  pistol:  { icon: '🔫', label: 'Pistol' },
  hunting: { icon: '🦆', label: 'Hunting' },
  fishing: { icon: '🎣', label: 'Fishing' },
  diving:  { icon: '🤿', label: 'Diving' },
  diy:     { icon: '🪵', label: 'DIY' },
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function subline(log: typeof logs.$inferSelect) {
  if (log.vertical === 'shotgun' || log.vertical === 'pistol') {
    return log.score != null && log.roundsTotal != null
      ? `${log.score} / ${log.roundsTotal}`
      : log.locationName ?? ''
  }
  if (log.vertical === 'hunting' || log.vertical === 'fishing') {
    const parts = [log.species, log.quantity != null ? `× ${log.quantity}` : null].filter(Boolean)
    return parts.join(' ') || log.locationName || ''
  }
  if (log.vertical === 'diving') {
    return log.depthMeters != null ? `${log.depthMeters}m · ${log.durationMinutes ?? '?'} min` : log.locationName ?? ''
  }
  if (log.vertical === 'diy') return log.projectName ?? ''
  return ''
}

export default async function LogPage() {
  const session = await auth()
  const entries = session?.user?.id
    ? await db.select().from(logs).where(eq(logs.userId, session.user.id)).orderBy(desc(logs.loggedAt))
    : []

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 0' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Logbook
        </h1>
        <Link href="/log/new" className="btn-primary" style={{ padding: '9px 18px', fontSize: '13px' }}>
          + New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 24px', textAlign: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '20px', boxShadow: 'var(--shadow-card)',
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📓</span>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            No entries yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '20px' }}>
            Your sessions will appear here.
          </p>
          <Link href="/log/new" className="btn-primary" style={{ fontSize: '13px', padding: '10px 22px' }}>
            Log your first session
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {entries.map((entry) => {
            const meta = verticalMeta[entry.vertical] ?? { icon: '📓', label: entry.vertical }
            return (
              <Link key={entry.id} href={`/log/${entry.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', gap: '14px', alignItems: 'center',
                  padding: '16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--amber)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'all 0.15s ease',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', background: 'var(--bg-raised)', border: '1px solid var(--border)',
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.title}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>
                      {meta.label} · {formatDate(entry.loggedAt)}
                      {entry.locationName ? ` · ${entry.locationName}` : ''}
                    </p>
                    {subline(entry) && (
                      <span style={{
                        display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '3px 10px',
                        borderRadius: '100px', marginTop: '6px',
                        background: 'rgba(200,134,10,0.1)', color: 'var(--amber)',
                        border: '1px solid rgba(200,134,10,0.25)', fontFamily: 'var(--font-inter)',
                      }}>
                        {subline(entry)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '16px', color: 'var(--text-subtle)', flexShrink: 0 }}>›</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
