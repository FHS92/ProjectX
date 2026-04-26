'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    // Auto sign-in after registration
    await signIn('credentials', { email, password, callbackUrl: '/dashboard', redirect: true })
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(200,134,10,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '24px', padding: '40px 36px',
        boxShadow: 'var(--shadow-raised)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.12em', marginBottom: '10px' }}>
            MANSAPP
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Create your account
          </h1>
        </div>

        {/* Register form */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <input
            type="text" placeholder="Full name" value={name}
            onChange={(e) => setName(e.target.value)} required
            style={inputStyle}
          />
          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            style={inputStyle}
          />
          <input
            type="password" placeholder="Password (min 6 characters)" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6}
            style={inputStyle}
          />
          {error && (
            <p style={{ fontSize: '13px', color: 'var(--red)', fontFamily: 'var(--font-inter)' }}>{error}</p>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'var(--font-inter)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          padding: '13px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
          background: 'var(--bg-raised)', border: '1px solid var(--border)',
          color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-inter)',
        }}>
          <GoogleIcon />
          Sign up with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px', fontFamily: 'var(--font-inter)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: '10px', fontSize: '14px',
  background: 'var(--bg-raised)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', fontFamily: 'var(--font-inter)', outline: 'none',
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
