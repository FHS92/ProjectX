import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { logs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.delete(logs).where(eq(logs.id, id))
  return NextResponse.json({ success: true })
}
