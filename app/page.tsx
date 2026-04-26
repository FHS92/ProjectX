import Link from 'next/link'

const verticals = [
  { icon: '🎯', label: 'Shotgun Shooting' },
  { icon: '🔫', label: 'Pistol Shooting' },
  { icon: '🦆', label: 'Hunting' },
  { icon: '🎣', label: 'Fishing' },
  { icon: '🤿', label: 'Diving' },
  { icon: '🪵', label: 'DIY & Builds' },
]

const features = [
  { icon: '📓', title: 'Log Everything', desc: 'Scores, catches, dives, hunts — every session captured in one place.' },
  { icon: '🗺️', title: 'Discover Spots', desc: 'GPS-tagged locations, conditions, and community-shared spots.' },
  { icon: '🎓', title: 'Keep Learning', desc: 'Tutorials and guides from experts across all 6 disciplines.' },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <span className="text-2xl font-bold tracking-widest" style={{ color: 'var(--amber)', fontFamily: 'Georgia, serif' }}>
          FIELDLOG
        </span>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm rounded-lg" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            Sign in
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm rounded-lg font-semibold" style={{ background: 'var(--amber)', color: '#0d1a0d' }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 flex-1">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase" style={{ background: 'var(--green-badge-bg)', color: 'var(--green-badge)' }}>
          For serious outdoor enthusiasts
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6 max-w-3xl" style={{ fontFamily: 'Georgia, serif', color: 'var(--text-primary)' }}>
          One app for every sport<br />
          <span style={{ color: 'var(--amber)' }}>you live for.</span>
        </h1>
        <p className="text-lg mb-10 max-w-xl" style={{ color: 'var(--text-muted)' }}>
          Log your sessions, discover new spots, learn from experts, and connect with a community that takes the field as seriously as you do.
        </p>
        <Link href="/register" className="px-8 py-4 rounded-xl text-base font-bold" style={{ background: 'var(--amber)', color: '#0d1a0d' }}>
          Create your free account
        </Link>

        {/* Vertical chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {verticals.map((v) => (
            <div key={v.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Georgia, serif', color: 'var(--text-primary)' }}>{f.title}</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-subtle)' }}>
        © 2026 FieldLog · Built for the field.
      </footer>
    </main>
  )
}
