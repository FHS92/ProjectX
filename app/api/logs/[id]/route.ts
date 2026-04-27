import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

import { logs, matches } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rows = await db
    .select({ log: logs, matchName: matches.name })
    .from(logs)
    .leftJoin(matches, eq(logs.matchId, matches.id))
    .where(eq(logs.id, id))
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { log, matchName } = rows[0]
  return NextResponse.json({ ...log, matchName: matchName ?? null })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const {
    title, loggedAt, locationName, notes,
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
  const [entry] = await db.update(logs).set({
    title:               title || undefined,
    loggedAt:            loggedAt ? new Date(loggedAt) : undefined,
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
  }).where(eq(logs.id, id)).returning()
  return NextResponse.json(entry)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.delete(logs).where(eq(logs.id, id))
  return NextResponse.json({ success: true })
}
