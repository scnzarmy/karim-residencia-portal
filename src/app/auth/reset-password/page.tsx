'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleReset = async () => {
    if (!password || !confirmPassword) { setError('Please fill in both fields'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true); setError('')

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) { setError(updateError.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/auth/login'), 3000)
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

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>✅</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--dark)', marginBottom: 12 }}>Password Updated!</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15 }}>Redirecting you to sign in...</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>New Password</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--dark)', marginBottom: 12 }}>Reset Password</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40 }}>Choose a strong new password for your account.</p>

            {error && (
              <div style={{ padding: '12px 16px', background: '#FEF3F2', border: '1px solid #FECDC9', fontSize: 13, color: '#C0392B', marginBottom: 24 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
                New Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
                Confirm Password
              </label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button onClick={handleReset} disabled={loading} className="btn-primary"
              style={{ width: '100%', fontSize: 13, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
