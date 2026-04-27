import { db } from '@/lib/db'
import { logs, matches } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import EditForm from './EditForm'

export const dynamic = 'force-dynamic'

export default async function EditLogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const rows = await db
    .select({ log: logs, matchName: matches.name })
    .from(logs)
    .leftJoin(matches, eq(logs.matchId, matches.id))
    .where(eq(logs.id, id))

  if (!rows.length) notFound()

  const entry = rows[0].log
  const matchName = rows[0].matchName

  return (
    <EditForm
      entry={{ ...entry, loggedAt: entry.loggedAt.toISOString() }}
      matchName={matchName ?? null}
    />
  )
}
