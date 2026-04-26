import { auth } from '@/lib/auth'

const quickLog = [
  { icon: '🎯', label: 'Shotgun' },
  { icon: '🔫', label: 'Pistol' },
  { icon: '🦆', label: 'Hunt' },
  { icon: '🎣', label: 'Fish' },
  { icon: '🤿', label: 'Dive' },
  { icon: '🪵', label: 'Build' },
]

const recentActivity = [
  { icon: '🎯', title: 'Clay Pigeon – Sporting', meta: 'Stellenbosch Gun Club · 24 Apr', badge: '⬆ PB — 43/50', badgeColor: '#6abf40', badgeBg: '#1e3a0a' },
  { icon: '🦆', title: 'Duck Hunt – Berg River', meta: 'Berg River Flats · 20 Apr · 4 birds', badge: '✓ Limit reached', badgeColor: '#6abf40', badgeBg: '#1e3a0a' },
  { icon: '🎣', title: 'Shore Fishing – Blouberg', meta: 'Bloubergstrand · 18 Apr · 3 catches', badge: '🐟 Kob · Steenbras · Elf', badgeColor: '#c8860a', badgeBg: '#2a1e08' },
]

export default async function DashboardPage() {
  const session = await auth()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Good morning, {firstName}.</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Saturday · 26 April 2026 · Cape Town</p>
      </div>

      {/* Conditions */}
      <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {[
          { icon: '🌤️', value: '18°C', label: 'Weather' },
          { icon: '💨', value: '12 km/h', label: 'Wind' },
          { icon: '🌕', value: 'Full', label: 'Moon' },
          { icon: '🌊', value: 'Low 08:42', label: 'Tide' },
        ].map((c) => (
          <div key={c.label} className="flex flex-col items-center gap-1">
            <span className="text-xl">{c.icon}</span>
            <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>{c.value}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Log */}
      <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Quick Log</p>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {quickLog.map((q) => (
          <button key={q.label} className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-colors" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <span className="text-2xl">{q.icon}</span>
            <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{q.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Recent Activity</p>
      <div className="flex flex-col gap-3">
        {recentActivity.map((a) => (
          <div key={a.title} className="flex gap-4 items-center p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--surface-raised)' }}>
              {a.icon}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.meta}</p>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1.5" style={{ background: a.badgeBg, color: a.badgeColor }}>{a.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
