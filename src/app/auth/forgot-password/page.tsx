'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleReset = async () => {
    if (!email) { setError('Please enter your email'); return }
    setLoading(true); setError('')

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (resetError) { setError(resetError.message); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-white)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700 }}>K</span>
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600 }}>Karim Residencia</span>
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>📧</div>
            <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Email Sent</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--dark)', marginBottom: 16 }}>Check Your Inbox</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
              We've sent password reset instructions to <strong style={{ color: 'var(--dark)' }}>{email}</strong>.
            </p>
            <Link href="/auth/login" className="btn-outline" style={{ fontSize: 13 }}>Back to Sign In</Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Account Recovery</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--dark)', marginBottom: 12 }}>Forgot Password?</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40, lineHeight: 1.7 }}>
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {error && (
              <div style={{ padding: '12px 16px', background: '#FEF3F2', border: '1px solid #FECDC9', fontSize: 13, color: '#C0392B', marginBottom: 24 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
                Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReset()}
                placeholder="your@email.com"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button onClick={handleReset} disabled={loading} className="btn-primary"
              style={{ width: '100%', fontSize: 13, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer', marginBottom: 24 }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link href="/auth/login" style={{ display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--muted)', borderBottom: '1px solid transparent', transition: 'all 0.2s' }}>
              ← Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
