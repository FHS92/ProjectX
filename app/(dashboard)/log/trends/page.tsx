'use client'

import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

interface LogEntry {
  id: string
  vertical: string
  title: string
  loggedAt: string
  hitFactor?: number | null
  alpha?: number | null
  charlie?: number | null
  delta?: number | null
  mike?: number | null
  noShoot?: number | null
  procErrors?: number | null
  drawTime?: number | null
  stageName?: string | null
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function aZonePct(e: LogEntry) {
  const total = (e.alpha ?? 0) + (e.charlie ?? 0) + (e.delta ?? 0) + (e.mike ?? 0)
  if (!total) return null
  return parseFloat(((( e.alpha ?? 0) / total) * 100).toFixed(1))
}

const chartStyle = {
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-card)',
}

export default function TrendsPage() {
  const [entries, setEntries] = useState<LogEntry[]>([])

  useEffect(() => {
    fetch('/api/logs')
      .then(r => r.json())
      .then((all: LogEntry[]) => {
        const ipsc = all
          .filter(e => e.vertical === 'pistol')
          .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())
        setEntries(ipsc)
      })
  }, [])

  const hitFactorData = entries
    .filter(e => e.hitFactor != null)
    .map(e => ({ date: fmtDate(e.loggedAt), value: e.hitFactor, label: e.stageName || e.title }))

  const aZoneData = entries
    .filter(e => aZonePct(e) !== null)
    .map(e => ({ date: fmtDate(e.loggedAt), value: aZonePct(e), label: e.stageName || e.title }))

  const drawTimeData = entries
    .filter(e => e.drawTime != null)
    .map(e => ({ date: fmtDate(e.loggedAt), value: e.drawTime, label: e.stageName || e.title }))

  const empty = entries.length === 0

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 18px 40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Trends
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-inter)' }}>
          Pistol IPSC performance over time.
        </p>
      </div>

      {empty ? (
        <div style={{
          ...chartStyle, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📈</span>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            No data yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>
            Log some IPSC stages to see your trends.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <Chart title="Hit Factor" data={hitFactorData} color="#c8860a" unit="" />
          <Chart title="A-Zone %" data={aZoneData} color="#5aad35" unit="%" />
          <Chart title="Draw Time" data={drawTimeData} color="#7a9074" unit="s" />

          {/* Summary stats */}
          <div style={{
            ...chartStyle,
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          }}>
            <Stat label="Stages Logged" value={String(entries.length)} />
            <Stat
              label="Best HF"
              value={hitFactorData.length ? String(Math.max(...hitFactorData.map(d => d.value as number)).toFixed(4)) : '—'}
            />
            <Stat
              label="Avg A-Zone"
              value={aZoneData.length ? `${(aZoneData.reduce((s, d) => s + (d.value as number), 0) / aZoneData.length).toFixed(1)}%` : '—'}
            />
          </div>

        </div>
      )}
    </div>
  )
}

function Chart({ title, data, color, unit }: {
  title: string
  data: { date: string; value: number | null | undefined; label: string }[]
  color: string
  unit: string
}) {
  if (!data.length) return null
  return (
    <div style={chartStyle}>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '16px' }}>
        {title}
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-subtle)', fontSize: 10, fontFamily: 'var(--font-inter)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--text-subtle)', fontSize: 10, fontFamily: 'var(--font-inter)' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: 'var(--font-inter)', fontSize: '12px' }}
            labelStyle={{ color: 'var(--text-muted)' }}
            itemStyle={{ color }}
            formatter={(v) => [`${v}${unit}`, title]}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)', marginBottom: '6px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 700, color: 'var(--amber)' }}>
        {value}
      </p>
    </div>
  )
}
