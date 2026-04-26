import { BucketShell } from '@/components/buckets/BucketShell'

const verticals = [
  { id: 'shotgun', icon: '🎯', label: 'Shotgun' },
  { id: 'pistol', icon: '🔫', label: 'Pistol' },
  { id: 'hunting', icon: '🦆', label: 'Hunting' },
  { id: 'fishing', icon: '🎣', label: 'Fishing' },
  { id: 'diving', icon: '🤿', label: 'Diving' },
  { id: 'diy', icon: '🪵', label: 'DIY' },
]

export default function CommunityPage() {
  return (
    <BucketShell
      icon="👥"
      title="Community"
      description="Share sessions, ask questions, and connect with fellow enthusiasts."
      verticals={verticals}
    />
  )
}
