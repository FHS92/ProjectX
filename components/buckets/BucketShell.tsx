interface BucketShellProps {
  icon: string
  title: string
  description: string
  verticals: { id: string; icon: string; label: string }[]
  children?: React.ReactNode
}

export function BucketShell({ icon, title, description, verticals, children }: BucketShellProps) {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: 'var(--text-primary)' }}>{title}</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>

      {/* Vertical filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        <button className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'var(--amber)', color: '#0d1a0d' }}>
          All
        </button>
        {verticals.map((v) => (
          <button key={v.id} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <span>{v.icon}</span>
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      {children ?? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">{icon}</span>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Content coming soon.<br />Your team is building this.</p>
        </div>
      )}
    </div>
  )
}
