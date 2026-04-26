import { BucketShell } from '@/components/buckets/BucketShell'

const verticals = [
  { id: 'shotgun', icon: '🎯', label: 'Shotgun' },
  { id: 'pistol', icon: '🔫', label: 'Pistol' },
  { id: 'hunting', icon: '🦆', label: 'Hunting' },
  { id: 'fishing', icon: '🎣', label: 'Fishing' },
  { id: 'diving', icon: '🤿', label: 'Diving' },
  { id: 'diy', icon: '🪵', label: 'DIY' },
]

export default function DiscoverPage() {
  return (
    <BucketShell
      icon="🗺️"
      title="Discover"
      description="Find spots, clubs, events, and check seasons and regulations."
      verticals={verticals}
    />
  )
}
