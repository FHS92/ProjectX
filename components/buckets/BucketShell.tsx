interface Vertical {
  id: string
  icon: string
  label: string
}

interface BucketShellProps {
  icon: string
  title: string
  description: string
  verticals: Vertical[]
  children?: React.ReactNode
}

export function BucketShell({ icon, title, description, verticals, children }: BucketShellProps) {
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 18px 0' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
            background: 'linear-gradient(135deg, var(--bg-raised), var(--bg-card))',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
          }}>
            {icon}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {title}
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, fontFamily: 'var(--font-inter)', paddingLeft: '62px' }}>
          {description}
        </p>
      </div>

      {/* Filter pills */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '24px' }}>
        <button style={{
          flexShrink: 0, padding: '7px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
          background: 'linear-gradient(135deg, var(--amber-light), var(--amber))',
          color: '#060e06', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-inter)', letterSpacing: '0.03em',
          boxShadow: '0 2px 8px rgba(200,134,10,0.25)',
        }}>
          All
        </button>
        {verticals.map((v) => (
          <button key={v.id} style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontFamily: 'var(--font-inter)', transition: 'all 0.2s ease',
          }}>
            <span style={{ fontSize: '14px' }}>{v.icon}</span>
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      {children ?? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '64px 24px', textAlign: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '20px', boxShadow: 'var(--shadow-card)',
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>{icon}</span>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Coming soon
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', lineHeight: 1.6 }}>
            Your team is building this section.
          </p>
        </div>
      )}
    </div>
  )
}
