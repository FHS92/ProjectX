const conditions = [
  { icon: '🌤', value: '18°C',     label: 'Weather' },
  { icon: '💨', value: '12 km/h',  label: 'Wind' },
  { icon: '🌕', value: 'Full',     label: 'Moon' },
  { icon: '🌊', value: 'Low 08:42', label: 'Tide' },
]

const quickLog = [
  { icon: '🎯', label: 'Shotgun' },
  { icon: '🔫', label: 'Pistol' },
  { icon: '🦆', label: 'Hunt' },
  { icon: '🎣', label: 'Fish' },
  { icon: '🤿', label: 'Dive' },
  { icon: '🪵', label: 'Build' },
]

const recentActivity = [
  { icon: '🎯', title: 'Clay Pigeon – Sporting',   meta: 'Stellenbosch Gun Club · 24 Apr', badge: '⬆ PB — 43/50',        isGood: true },
  { icon: '🦆', title: 'Duck Hunt – Berg River',   meta: 'Berg River Flats · 20 Apr · 4 birds', badge: '✓ Limit reached', isGood: true },
  { icon: '🎣', title: 'Shore Fishing – Blouberg', meta: 'Bloubergstrand · 18 Apr · 3 catches',  badge: 'Kob · Steenbras · Elf', isGood: false },
]

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 0' }}>

      {/* Greeting */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '6px', fontFamily: 'var(--font-inter)' }}>
          Saturday · 26 April 2026
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Good morning.
        </h1>
      </div>

      {/* Conditions */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
        padding: '18px 16px', marginBottom: '28px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '18px', boxShadow: 'var(--shadow-card)',
      }}>
        {conditions.map((c) => (
          <div key={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '22px' }}>{c.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-inter)' }}>{c.value}</span>
            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Log */}
      <p className="section-label" style={{ marginBottom: '12px' }}>Quick Log</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '32px' }}>
        {quickLog.map((q) => (
          <button key={q.label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            padding: '18px 8px', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: '16px',
            cursor: 'pointer', boxShadow: 'var(--shadow-card)',
          }}>
            <span style={{ fontSize: '26px' }}>{q.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-inter)' }}>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <p className="section-label" style={{ marginBottom: '12px' }}>Recent Activity</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {recentActivity.map((a) => (
          <div key={a.title} style={{
            display: 'flex', gap: '14px', alignItems: 'center', padding: '16px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderLeft: '3px solid var(--amber)', borderRadius: '16px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', background: 'var(--bg-raised)', border: '1px solid var(--border)',
            }}>
              {a.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {a.title}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)', marginBottom: '6px' }}>{a.meta}</p>
              <span style={{
                display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px',
                background: a.isGood ? 'var(--green-bg)' : 'rgba(200,134,10,0.1)',
                color: a.isGood ? 'var(--green)' : 'var(--amber)',
                border: `1px solid ${a.isGood ? 'rgba(90,173,53,0.25)' : 'rgba(200,134,10,0.25)'}`,
                fontFamily: 'var(--font-inter)',
              }}>
                {a.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
