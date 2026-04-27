import { db } from '@/lib/db'
import { logs, matches } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteButton from './DeleteButton'

export const dynamic = 'force-dynamic'

// ─── Vertical meta ────────────────────────────────────────────────────────────

const verticalMeta: Record<string, { icon: string; label: string }> = {
  shotgun: { icon: '🎯', label: 'Shotgun Shooting' },
  pistol:  { icon: '🔫', label: 'Pistol IPSC' },
  hunting: { icon: '🦆', label: 'Hunting' },
  fishing: { icon: '🎣', label: 'Fishing' },
  diving:  { icon: '🤿', label: 'Diving' },
  diy:     { icon: '🪵', label: 'DIY & Builds' },
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── HF calc helpers ──────────────────────────────────────────────────────────

function computePoints(e: {
  powerFactor?: string | null
  alpha?: number | null
  charlie?: number | null
  delta?: number | null
  poppersKnocked?: number | null
  miniPoppersKnocked?: number | null
}) {
  const pfMinor = e.powerFactor !== 'major'
  const cVal = pfMinor ? 3 : 4
  const dVal = pfMinor ? 1 : 2
  return (
    (e.alpha ?? 0) * 5 +
    (e.charlie ?? 0) * cVal +
    (e.delta ?? 0) * dVal +
    (e.poppersKnocked ?? 0) * 5 +
    (e.miniPoppersKnocked ?? 0) * 5
  )
}

function computePenalties(e: {
  mike?: number | null
  noShoot?: number | null
  procErrors?: number | null
}) {
  return (
    (e.mike ?? 0) * 10 +
    (e.noShoot ?? 0) * 10 +
    (e.procErrors ?? 0) * 10
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'var(--text-subtle)',
      fontFamily: 'var(--font-inter)', marginBottom: '10px',
    }}>
      {children}
    </p>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--text-subtle)',
        fontFamily: 'var(--font-inter)', marginBottom: '4px',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)',
        fontFamily: 'var(--font-inter)',
      }}>
        {value}
      </p>
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      padding: '20px', borderRadius: '16px', marginBottom: '16px',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-card)',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Score display row ────────────────────────────────────────────────────────

function ScoreRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px' }}>
      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>{label}</span>
      <span style={{ fontSize: '15px', fontWeight: 700, color, fontFamily: 'var(--font-inter)' }}>{value}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const rows = await db
    .select({ log: logs, matchName: matches.name })
    .from(logs)
    .leftJoin(matches, eq(logs.matchId, matches.id))
    .where(eq(logs.id, id))

  if (!rows.length) notFound()

  const entry = rows[0].log
  const matchName = rows[0].matchName

  const meta = verticalMeta[entry.vertical] ?? { icon: '📓', label: entry.vertical }

  const points    = computePoints(entry)
  const penalties = computePenalties(entry)
  const net       = points - penalties

  const hasAnyScore =
    entry.alpha != null || entry.charlie != null || entry.delta != null ||
    entry.mike != null || entry.poppersKnocked != null || entry.miniPoppersKnocked != null

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 48px' }}>

      {/* ── Top row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Link href="/log" style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)',
          textDecoration: 'none',
        }}>
          ‹ Logbook
        </Link>
        <Link href={`/log/${id}/edit`} className="btn-primary" style={{
          fontSize: '13px', padding: '8px 18px', borderRadius: '10px', textDecoration: 'none',
        }}>
          Edit
        </Link>
      </div>

      {/* ── Header card ── */}
      <div style={{
        padding: '24px', borderRadius: '20px', marginBottom: '16px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderLeft: '4px solid var(--amber)', boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <span style={{ fontSize: '36px', lineHeight: 1 }}>{meta.icon}</span>
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--amber)',
              fontFamily: 'var(--font-inter)', marginBottom: '5px',
            }}>
              {meta.label}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-playfair)', fontSize: '22px',
              fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2,
            }}>
              {entry.title}
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>
          {formatDate(entry.loggedAt)}
          {entry.locationName && (
            <span style={{ marginLeft: '10px', color: 'var(--text-subtle)' }}>· {entry.locationName}</span>
          )}
        </p>
        {matchName && (
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginTop: '6px' }}>
            Match: <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{matchName}</span>
          </p>
        )}
        {entry.stageName && (
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginTop: '4px' }}>
            Stage: <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{entry.stageName}</span>
          </p>
        )}
      </div>

      {/* ════════════════════════════════════════
          PISTOL IPSC
      ════════════════════════════════════════ */}
      {entry.vertical === 'pistol' && <>

        {/* HF gradient card */}
        {entry.hitFactor != null && (
          <div style={{
            padding: '28px 24px', borderRadius: '16px', marginBottom: '16px',
            background: 'linear-gradient(135deg, rgba(200,134,10,0.12), rgba(200,134,10,0.04))',
            border: '1.5px solid var(--amber)', boxShadow: '0 0 28px rgba(200,134,10,0.12)',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--text-subtle)',
              fontFamily: 'var(--font-inter)', marginBottom: '8px',
            }}>
              Hit Factor
            </p>
            <p style={{
              fontFamily: 'var(--font-playfair)', fontSize: '48px',
              fontWeight: 800, color: 'var(--amber)', lineHeight: 1, marginBottom: '20px',
            }}>
              {entry.hitFactor.toFixed(4)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '3px' }}>POINTS</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#5aad35', fontFamily: 'var(--font-inter)' }}>+{points}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '3px' }}>PENALTIES</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#d94040', fontFamily: 'var(--font-inter)' }}>-{penalties}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '3px' }}>NET</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)' }}>{net}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stage details card */}
        {(entry.timerReading != null || entry.drawTime != null || entry.powerFactor) && (
          <Card>
            <SectionLabel>Stage Details</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {entry.timerReading != null && (
                <StatCell label="Timer" value={`${entry.timerReading}s`} />
              )}
              {entry.drawTime != null && (
                <StatCell label="Draw" value={`${entry.drawTime}s`} />
              )}
              {entry.powerFactor && (
                <div>
                  <p style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--text-subtle)',
                    fontFamily: 'var(--font-inter)', marginBottom: '4px',
                  }}>
                    Power Factor
                  </p>
                  <p style={{
                    fontSize: '13px', fontWeight: 700, textTransform: 'capitalize',
                    color: 'var(--amber)', fontFamily: 'var(--font-inter)',
                    background: 'rgba(200,134,10,0.1)', padding: '3px 10px',
                    borderRadius: '6px', display: 'inline-block',
                  }}>
                    {entry.powerFactor}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Score grid card */}
        {hasAnyScore && (
          <Card>
            <SectionLabel>Score Breakdown</SectionLabel>

            {/* Paper */}
            {(entry.alpha != null || entry.charlie != null || entry.delta != null || entry.mike != null) && (
              <div style={{ marginBottom: '14px' }}>
                <p style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-subtle)',
                  fontFamily: 'var(--font-inter)', marginBottom: '8px',
                }}>
                  Paper Hits
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                  {([
                    { key: 'alpha',   label: 'Alpha',   color: '#5aad35' },
                    { key: 'charlie', label: 'Charlie', color: '#c8860a' },
                    { key: 'delta',   label: 'Delta',   color: '#7a9074' },
                    { key: 'mike',    label: 'Mike',    color: '#d94040' },
                  ] as const).map(({ key, label, color }) => (
                    <div key={key} style={{
                      padding: '10px 6px', borderRadius: '10px',
                      background: 'var(--bg-raised)', border: '1px solid var(--border)',
                    }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color, fontFamily: 'var(--font-inter)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {label}
                      </p>
                      <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>
                        {entry[key] ?? 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steel */}
            {(entry.poppersKnocked != null || entry.miniPoppersKnocked != null) && (
              <div style={{ marginBottom: '14px' }}>
                <p style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-subtle)',
                  fontFamily: 'var(--font-inter)', marginBottom: '8px',
                }}>
                  Steel Knocked Down
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', textAlign: 'center' }}>
                  {([
                    { key: 'poppersKnocked',     label: 'Poppers' },
                    { key: 'miniPoppersKnocked',  label: 'Mini Pop.' },
                  ] as const).map(({ key, label }) => (
                    <div key={key} style={{
                      padding: '10px 6px', borderRadius: '10px',
                      background: 'var(--bg-raised)', border: '1px solid var(--border)',
                    }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#c8860a', fontFamily: 'var(--font-inter)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {label}
                      </p>
                      <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', lineHeight: 1 }}>
                        {entry[key] ?? 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Penalties */}
            {(entry.noShoot != null || entry.procErrors != null) && (
              <div>
                <p style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-subtle)',
                  fontFamily: 'var(--font-inter)', marginBottom: '8px',
                }}>
                  Penalties
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {entry.noShoot != null && (
                    <ScoreRow label="No-Shoot Hits" value={entry.noShoot} color="#d94040" />
                  )}
                  {entry.procErrors != null && (
                    <ScoreRow label="Procedural Errors" value={entry.procErrors} color="#d94040" />
                  )}
                </div>
              </div>
            )}
          </Card>
        )}
      </>}

      {/* ════════════════════════════════════════
          HUNTING / FISHING
      ════════════════════════════════════════ */}
      {(entry.vertical === 'hunting' || entry.vertical === 'fishing') &&
        (entry.species || entry.quantity != null || entry.weight != null) && (
        <Card>
          <SectionLabel>{entry.vertical === 'hunting' ? 'Harvest Details' : 'Catch Details'}</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {entry.species     && <StatCell label="Species"  value={entry.species} />}
            {entry.quantity != null && <StatCell label="Quantity" value={String(entry.quantity)} />}
            {entry.weight   != null && <StatCell label="Weight"   value={`${entry.weight} kg`} />}
          </div>
        </Card>
      )}

      {/* ════════════════════════════════════════
          DIVING
      ════════════════════════════════════════ */}
      {entry.vertical === 'diving' &&
        (entry.depthMeters != null || entry.durationMinutes != null) && (
        <Card>
          <SectionLabel>Dive Details</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {entry.depthMeters    != null && <StatCell label="Max Depth"  value={`${entry.depthMeters} m`} />}
            {entry.durationMinutes != null && <StatCell label="Duration"   value={`${entry.durationMinutes} min`} />}
          </div>
        </Card>
      )}

      {/* ════════════════════════════════════════
          DIY
      ════════════════════════════════════════ */}
      {entry.vertical === 'diy' &&
        (entry.projectName || entry.materialUsed) && (
        <Card>
          <SectionLabel>Project Details</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entry.projectName  && <StatCell label="Project Name"    value={entry.projectName} />}
            {entry.materialUsed && <StatCell label="Materials Used"  value={entry.materialUsed} />}
          </div>
        </Card>
      )}

      {/* ════════════════════════════════════════
          GEAR NOTES
      ════════════════════════════════════════ */}
      {entry.gearNotes && (
        <Card>
          <SectionLabel>Gear Used</SectionLabel>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
            {entry.gearNotes}
          </p>
        </Card>
      )}

      {/* ════════════════════════════════════════
          NOTES
      ════════════════════════════════════════ */}
      {entry.notes && (
        <Card>
          <SectionLabel>Notes</SectionLabel>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
            {entry.notes}
          </p>
        </Card>
      )}

      {/* ── Delete ── */}
      <DeleteButton id={id} />
    </div>
  )
}
