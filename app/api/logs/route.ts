import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logs } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const entries = await db.select().from(logs).orderBy(desc(logs.loggedAt))
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    vertical, title, loggedAt, locationName, notes,
    species, quantity, weight,
    depthMeters, durationMinutes,
    projectName, materialUsed,
    matchId, stageName, timerReading, drawTime,
    alpha, charlie, delta, mike, noShoot, procErrors,
    targetTypes, gearNotes,
  } = body

  if (!vertical || !title) {
    return NextResponse.json({ error: 'vertical and title are required.' }, { status: 400 })
  }

  // Calculate hit factor for IPSC
  const a = parseInt(alpha) || 0
  const c = parseInt(charlie) || 0
  const d = parseInt(delta) || 0
  const m = parseInt(mike) || 0
  const ns = parseInt(noShoot) || 0
  const pe = parseInt(procErrors) || 0
  const t = parseFloat(timerReading) || 0
  const hitFactor = t > 0 ? parseFloat(((a * 5 + c * 3 + d * 1 - m * 10 - ns * 10 - pe * 10) / t).toFixed(4)) : null

  const [entry] = await db.insert(logs).values({
    vertical,
    title,
    loggedAt:        loggedAt ? new Date(loggedAt) : new Date(),
    locationName:    locationName || null,
    notes:           notes || null,
    species:         species || null,
    quantity:        quantity ? parseInt(quantity) : null,
    weight:          weight ? parseFloat(weight) : null,
    depthMeters:     depthMeters ? parseFloat(depthMeters) : null,
    durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
    projectName:     projectName || null,
    materialUsed:    materialUsed || null,
    matchId:         matchId || null,
    stageName:       stageName || null,
    timerReading:    t || null,
    drawTime:        drawTime ? parseFloat(drawTime) : null,
    alpha:           a || null,
    charlie:         c || null,
    delta:           d || null,
    mike:            m || null,
    noShoot:         ns || null,
    procErrors:      pe || null,
    targetTypes:     targetTypes || null,
    gearNotes:       gearNotes || null,
    hitFactor,
  }).returning()

  return NextResponse.json(entry, { status: 201 })
}
