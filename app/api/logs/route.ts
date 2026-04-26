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
    powerFactor,
    paperTargets, popperTargets, miniPopperTargets, noShootTargets,
    alpha, charlie, delta, mike, noShoot, procErrors,
    poppersKnocked, miniPoppersKnocked,
    gearNotes, hitFactor,
  } = body

  if (!vertical || !title) {
    return NextResponse.json({ error: 'vertical and title are required.' }, { status: 400 })
  }

  const [entry] = await db.insert(logs).values({
    vertical,
    title,
    loggedAt:            loggedAt ? new Date(loggedAt) : new Date(),
    locationName:        locationName || null,
    notes:               notes || null,
    species:             species || null,
    quantity:            quantity ? parseInt(quantity) : null,
    weight:              weight ? parseFloat(weight) : null,
    depthMeters:         depthMeters ? parseFloat(depthMeters) : null,
    durationMinutes:     durationMinutes ? parseInt(durationMinutes) : null,
    projectName:         projectName || null,
    materialUsed:        materialUsed || null,
    matchId:             matchId || null,
    stageName:           stageName || null,
    timerReading:        timerReading ? parseFloat(timerReading) : null,
    drawTime:            drawTime ? parseFloat(drawTime) : null,
    powerFactor:         powerFactor || 'minor',
    paperTargets:        paperTargets ? parseInt(paperTargets) : null,
    popperTargets:       popperTargets ? parseInt(popperTargets) : null,
    miniPopperTargets:   miniPopperTargets ? parseInt(miniPopperTargets) : null,
    noShootTargets:      noShootTargets ? parseInt(noShootTargets) : null,
    alpha:               alpha ? parseInt(alpha) : null,
    charlie:             charlie ? parseInt(charlie) : null,
    delta:               delta ? parseInt(delta) : null,
    mike:                mike ? parseInt(mike) : null,
    noShoot:             noShoot ? parseInt(noShoot) : null,
    procErrors:          procErrors ? parseInt(procErrors) : null,
    poppersKnocked:      poppersKnocked ? parseInt(poppersKnocked) : null,
    miniPoppersKnocked:  miniPoppersKnocked ? parseInt(miniPoppersKnocked) : null,
    gearNotes:           gearNotes || null,
    hitFactor:           hitFactor ? parseFloat(hitFactor) : null,
  }).returning()

  return NextResponse.json(entry, { status: 201 })
}
