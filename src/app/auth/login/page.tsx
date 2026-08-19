'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Fetch role and redirect
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role === 'committee') router.push('/committee')
      else router.push('/dashboard')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: 'var(--warm-white)'
    }}>
      {/* Left - Decorative panel */}
      <div style={{
        background: 'linear-gradient(160deg, var(--dark) 0%, #2C2B20 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          border: '60px solid rgba(216,195,154,0.08)'
        }} />
        <div style={{
          position: 'absolute', top: 120, right: 40,
          width: 200, height: 280,
          border: '1px solid rgba(216,195,154,0.2)',
          transform: 'rotate(5deg)'
        }} />

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--dark)' }}>K</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: 'var(--cream)' }}>Karim</div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: -2 }}>Residencia</div>
          </div>
        </Link>

        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 42, color: 'var(--cream)', lineHeight: 1.2, marginBottom: 20 }}>
            Welcome<br />Back Home
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(245,240,232,0.5)', lineHeight: 1.7, maxWidth: 320, fontWeight: 300 }}>
            Sign in to access your resident portal, manage requests, and stay connected with your community.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24, zIndex: 1 }}>
          {['Community', 'Security', 'Comfort'].map((word) => (
            <div key={word} style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '0 auto 8px' }} />
              <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(216,195,154,0.7)' }}>{word}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Login form */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px'
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            Resident Portal
          </p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--dark)', marginBottom: 8 }}>
            Sign In
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40 }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: 'var(--dark)', borderBottom: '1px solid var(--gold)' }}>
              Register here
            </Link>
          </p>

          {error && (
            <div style={{
              padding: '12px 16px', background: '#FEF3F2',
              border: '1px solid #FECDC9', borderRadius: 4,
              fontSize: 13, color: '#C0392B', marginBottom: 24
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="your@email.com"
              style={{
                width: '100%', padding: '14px 16px',
                border: '1px solid var(--border)', background: 'var(--warm-white)',
                fontSize: 15, color: 'var(--dark)',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '14px 16px',
                border: '1px solid var(--border)', background: 'var(--warm-white)',
                fontSize: 15, color: 'var(--dark)',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 32 }}>
            <Link href="/auth/forgot-password" style={{ fontSize: 13, color: 'var(--muted)', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', fontSize: 13, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
              This portal is exclusively for Karim Residencia<br />residents and committee members.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
