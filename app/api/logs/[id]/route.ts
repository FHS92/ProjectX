import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { logs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  await db.delete(logs).where(
    and(eq(logs.id, id), eq(logs.userId, session.user.id))
  )

  return NextResponse.json({ success: true })
}
