'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', block: '', apartment: '', role: 'resident' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSignup = async () => {
    if (!form.fullName || !form.email || !form.password) { setError('Please fill in all required fields'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true); setError('')

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          role: form.role,
          block: form.block,
          apartment: form.apartment
        }
      }
    })

    if (authError) { setError(authError.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-white)' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 48 }}>
          <div style={{ width: 64, height: 64, background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
            <span style={{ fontSize: 28 }}>✓</span>
          </div>
          <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Registration Submitted</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--dark)', marginBottom: 16 }}>Check Your Email</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>
            We've sent a confirmation link to <strong style={{ color: 'var(--dark)' }}>{form.email}</strong>. 
            Click it to activate your account, then sign in.
          </p>
          <Link href="/auth/login" className="btn-primary" style={{ display: 'inline-block', marginTop: 32, fontSize: 13 }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700 }}>K</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600 }}>Karim Residencia</div>
          </div>
        </Link>

        <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>New Resident</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 8 }}>Create Account</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40 }}>
          Already registered?{' '}
          <Link href="/auth/login" style={{ color: 'var(--dark)', borderBottom: '1px solid var(--gold)' }}>Sign in</Link>
        </p>

        {error && (
          <div style={{ padding: '12px 16px', background: '#FEF3F2', border: '1px solid #FECDC9', fontSize: 13, color: '#C0392B', marginBottom: 24 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gap: 24 }}>
          {/* Role selection */}
          <div>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 12, fontWeight: 500 }}>
              I am a
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['resident', 'committee'].map(role => (
                <button key={role} onClick={() => update('role', role)} style={{
                  padding: '14px', border: `1px solid ${form.role === role ? 'var(--dark)' : 'var(--border)'}`,
                  background: form.role === role ? 'var(--dark)' : 'transparent',
                  color: form.role === role ? 'var(--cream)' : 'var(--dark)',
                  fontSize: 13, letterSpacing: '0.05em', textTransform: 'capitalize',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  {role === 'resident' ? '🏠 Resident' : '🏛️ Committee Member'}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
              Full Name *
            </label>
            <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Muhammad Karim"
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
              Email Address *
            </label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com"
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Block & Apartment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
                Block
              </label>
              <select value={form.block} onChange={e => update('block', e.target.value)}
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: form.block ? 'var(--dark)' : 'var(--muted)', outline: 'none', appearance: 'none' }}>
                <option value="">Select Block</option>
                {['A', 'B', 'C', 'D', 'E'].map(b => <option key={b} value={b}>Block {b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
                Apartment No.
              </label>
              <input type="text" value={form.apartment} onChange={e => update('apartment', e.target.value)} placeholder="e.g. 201"
                style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
              Password *
            </label>
            <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 6 characters"
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
              Confirm Password *
            </label>
            <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••••"
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', background: 'var(--warm-white)', fontSize: 15, color: 'var(--dark)', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <button onClick={handleSignup} disabled={loading} className="btn-primary"
            style={{ fontSize: 13, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
