'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this log entry?')) return
    setDeleting(true)
    await fetch(`/api/logs/${id}`, { method: 'DELETE' })
    router.push('/log')
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        background: 'transparent',
        border: '1px solid rgba(217,64,64,0.4)',
        color: '#d94040',
        cursor: 'pointer',
        fontFamily: 'var(--font-inter)',
        fontSize: '13px',
        fontWeight: 600,
      }}
    >
      {deleting ? 'Deleting…' : 'Delete Entry'}
    </button>
  )
}
