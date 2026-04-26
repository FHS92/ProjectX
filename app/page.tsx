import Link from 'next/link'

const verticals = [
  { icon: '🎯', label: 'Shotgun' },
  { icon: '🔫', label: 'Pistol' },
  { icon: '🦆', label: 'Hunting' },
  { icon: '🎣', label: 'Fishing' },
  { icon: '🤿', label: 'Diving' },
  { icon: '🪵', label: 'DIY & Builds' },
]

const features = [
  {
    icon: '📓',
    title: 'Log Every Session',
    desc: 'Scores, catches, dives, hunts — every detail of every outing, in one place.',
  },
  {
    icon: '🗺️',
    title: 'Discover Spots',
    desc: 'GPS-tagged locations, conditions, tide tables and community-verified spots.',
  },
  {
    icon: '🎓',
    title: 'Learn from Experts',
    desc: 'Technique guides, safety courses and reviews from serious practitioners.',
  },
]

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 32px',
        background: 'rgba(13, 22, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.12em' }}>
          MANSAPP
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/login" className="btn-ghost" style={{ padding: '9px 20px', fontSize: '13px' }}>Sign in</Link>
          <Link href="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: '13px' }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '500px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(200,134,10,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: '100px',
          background: 'var(--green-bg)', border: '1px solid rgba(90,173,53,0.3)',
          color: 'var(--green)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '32px',
        }}>
          For serious outdoor enthusiasts
        </div>

        <h1 style={{
          fontFamily: 'var(--font-playfair)', fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 800, lineHeight: 1.1, marginBottom: '24px',
          maxWidth: '780px', color: 'var(--text-primary)',
        }}>
          One app for every sport{' '}
          <span style={{ color: 'var(--amber)' }}>you live for.</span>
        </h1>

        <p style={{
          fontSize: '17px', lineHeight: 1.7, color: 'var(--text-muted)',
          maxWidth: '520px', marginBottom: '40px',
        }}>
          Log your sessions, discover new spots, learn from experts, and connect with a community that takes the field as seriously as you do.
        </p>

        <Link href="/register" className="btn-primary" style={{ fontSize: '15px', padding: '14px 36px' }}>
          Create your free account
        </Link>

        {/* Vertical chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '56px' }}>
          {verticals.map((v) => (
            <div key={v.label} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '100px',
              background: 'var(--bg-raised)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', fontSize: '13px',
            }}>
              <span>{v.icon}</span><span>{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 24px 96px', maxWidth: '1040px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {features.map((f) => (
            <div key={f.title} className="card card-amber" style={{ padding: '32px' }}>
              <div style={{ fontSize: '32px', marginBottom: '18px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', fontSize: '12px', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-subtle)' }}>
        © 2026 MANSAPP · Built for the field.
      </footer>
    </main>
  )
}
