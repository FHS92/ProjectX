import { signIn } from '@/lib/auth'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(200,134,10,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '24px', padding: '40px 36px',
        boxShadow: 'var(--shadow-raised)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.12em', marginBottom: '10px' }}>
            MANSAPP
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-inter)' }}>
            Sign in to your account
          </p>
        </div>

        <form action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/dashboard' })
        }}>
          <button type="submit" style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
            background: 'var(--bg-raised)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease',
            fontFamily: 'var(--font-inter)',
          }}>
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '28px', fontFamily: 'var(--font-inter)' }}>
          No account?{' '}
          <Link href="/register" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 600 }}>
            Create one free
          </Link>
        </p>
      </div>
    </main>
  )
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
