import { BucketShell } from '@/components/buckets/BucketShell'

const verticals = [
  { id: 'shotgun', icon: '🎯', label: 'Shotgun' },
  { id: 'pistol', icon: '🔫', label: 'Pistol' },
  { id: 'hunting', icon: '🦆', label: 'Hunting' },
  { id: 'fishing', icon: '🎣', label: 'Fishing' },
  { id: 'diving', icon: '🤿', label: 'Diving' },
  { id: 'diy', icon: '🪵', label: 'DIY' },
]

export default function LearnPage() {
  return (
    <BucketShell
      icon="🎓"
      title="Learn"
      description="Tutorials, technique guides, and lessons across all disciplines."
      verticals={verticals}
    />
  )
}
