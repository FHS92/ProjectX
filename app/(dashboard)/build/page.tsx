import { BucketShell } from '@/components/buckets/BucketShell'

const verticals = [
  { id: 'shotgun', icon: '🎯', label: 'Shotgun' },
  { id: 'pistol', icon: '🔫', label: 'Pistol' },
  { id: 'hunting', icon: '🦆', label: 'Hunting' },
  { id: 'fishing', icon: '🎣', label: 'Fishing' },
  { id: 'diving', icon: '🤿', label: 'Diving' },
  { id: 'diy', icon: '🪵', label: 'DIY' },
]

export default function BuildPage() {
  return (
    <BucketShell
      icon="🪵"
      title="Build"
      description="DIY projects, workshop builds, mods, and craftsmanship guides."
      verticals={verticals}
    />
  )
}
