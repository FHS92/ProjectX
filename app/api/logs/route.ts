import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { logs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entries = await db
    .select()
    .from(logs)
    .where(eq(logs.userId, session.user.id))
    .orderBy(desc(logs.loggedAt))

  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const {
    vertical, title, loggedAt, locationName, notes,
    score, roundsTotal, species, quantity, weight,
    depthMeters, durationMinutes, projectName, materialUsed,
  } = body

  if (!vertical || !title) {
    return NextResponse.json({ error: 'vertical and title are required' }, { status: 400 })
  }

  const [entry] = await db.insert(logs).values({
    userId:          session.user.id,
    vertical,
    title,
    loggedAt:        loggedAt ? new Date(loggedAt) : new Date(),
    locationName:    locationName || null,
    notes:           notes || null,
    score:           score ? parseInt(score) : null,
    roundsTotal:     roundsTotal ? parseInt(roundsTotal) : null,
    species:         species || null,
    quantity:        quantity ? parseInt(quantity) : null,
    weight:          weight ? parseFloat(weight) : null,
    depthMeters:     depthMeters ? parseFloat(depthMeters) : null,
    durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
    projectName:     projectName || null,
    materialUsed:    materialUsed || null,
  }).returning()

  return NextResponse.json(entry, { status: 201 })
}
