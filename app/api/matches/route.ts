import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { matches } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const all = await db.select().from(matches).orderBy(desc(matches.matchDate))
  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  const { name, location, matchDate } = await req.json()
  if (!name) return NextResponse.json({ error: 'Match name is required.' }, { status: 400 })

  const [match] = await db.insert(matches).values({
    name,
    location: location || null,
    matchDate: matchDate ? new Date(matchDate) : new Date(),
  }).returning()

  return NextResponse.json(match, { status: 201 })
}
