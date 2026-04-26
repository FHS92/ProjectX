import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/learn', icon: '🎓', label: 'Learn' },
  { href: '/gear', icon: '🎒', label: 'Gear' },
  { href: '/log', icon: '📓', label: 'Log' },
  { href: '/discover', icon: '🗺️', label: 'Discover' },
  { href: '/community', icon: '👥', label: 'Community' },
  { href: '/build', icon: '🪵', label: 'Build' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Top nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <span className="text-xl font-bold tracking-widest" style={{ color: 'var(--amber)', fontFamily: 'Georgia, serif' }}>
          FIELDLOG
        </span>
        <div className="flex items-center gap-3">
          <ViewToggle />
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--brown)', border: '2px solid var(--amber)', color: 'var(--text-primary)' }}>
            {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-3 border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5">
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

function ViewToggle() {
  return (
    <div className="flex items-center gap-1 rounded-lg p-1 text-xs" style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
      <span className="px-2 py-1 rounded-md font-semibold" style={{ background: 'var(--amber)', color: '#0d1a0d' }}>Sport</span>
      <span className="px-2 py-1 rounded-md" style={{ color: 'var(--text-muted)' }}>Bucket</span>
    </div>
  )
}
