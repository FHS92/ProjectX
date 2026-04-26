import Link from 'next/link'

const navItems = [
  { href: '/dashboard', icon: '⌂', label: 'Home' },
  { href: '/learn',     icon: '◎', label: 'Learn' },
  { href: '/gear',      icon: '◈', label: 'Gear' },
  { href: '/log',       icon: '▣', label: 'Log' },
  { href: '/discover',  icon: '◉', label: 'Discover' },
  { href: '/community', icon: '◫', label: 'Community' },
  { href: '/build',     icon: '◧', label: 'Build' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>

      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'rgba(8, 15, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <span style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.1em' }}>
          MANSAPP
        </span>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '2px',
          padding: '3px', borderRadius: '10px',
          background: 'var(--bg-raised)', border: '1px solid var(--border)',
        }}>
          <span style={{
            padding: '5px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: 700,
            background: 'linear-gradient(135deg, var(--amber-light), var(--amber))',
            color: '#060e06', letterSpacing: '0.04em', cursor: 'pointer',
          }}>Sport</span>
          <span style={{
            padding: '5px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: 500,
            color: 'var(--text-subtle)', cursor: 'pointer', letterSpacing: '0.04em',
          }}>Bucket</span>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '76px' }}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '8px 0 20px',
        background: 'rgba(8, 15, 8, 0.94)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            textDecoration: 'none', padding: '4px 8px',
          }}>
            <span style={{ fontSize: '16px', color: 'var(--text-subtle)', lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
