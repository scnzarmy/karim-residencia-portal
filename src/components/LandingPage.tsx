'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '24px 48px',
        background: scrolled ? 'rgba(250,250,247,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40, height: 40, background: 'var(--dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700 }}>K</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: 'var(--dark)' }}>Karim</div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: -2 }}>Residencia</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#about" style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark-80)' }}>About</a>
          <a href="#amenities" style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark-80)' }}>Amenities</a>
          <Link href="/auth/login" style={{
            fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--dark)', borderBottom: '1px solid var(--gold)', paddingBottom: 2
          }}>Resident Portal</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        height: '100vh',
        background: 'linear-gradient(160deg, var(--dark) 0%, #2C2B20 60%, #3D3525 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '15%', right: '8%',
          width: 320, height: 450,
          border: '1px solid rgba(216,195,154,0.3)',
          transform: 'rotate(3deg)'
        }} />
        <div style={{
          position: 'absolute', top: '18%', right: '6%',
          width: 320, height: 450,
          border: '1px solid rgba(216,195,154,0.15)',
          transform: 'rotate(-2deg)'
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(transparent, rgba(216,195,154,0.05))'
        }} />

        {/* Gold accent line */}
        <div style={{
          position: 'absolute', left: 48, top: '50%', transform: 'translateY(-50%)',
          width: 3, height: 120, background: 'var(--gold)'
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px', width: '100%' }}>
          <div style={{ marginLeft: 24 }}>
            <p style={{
              fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: 24, fontWeight: 500
            }}>
              Premium Residential Community
            </p>
            <h1 style={{
              fontSize: 'clamp(52px, 7vw, 92px)',
              fontFamily: 'Playfair Display, serif',
              fontWeight: 600, color: 'var(--cream)',
              lineHeight: 1.05, marginBottom: 32
            }}>
              Karim<br />
              <span style={{ color: 'var(--gold)' }}>Residencia</span>
            </h1>
            <p style={{
              fontSize: 18, color: 'rgba(245,240,232,0.65)',
              maxWidth: 480, lineHeight: 1.7, marginBottom: 48,
              fontWeight: 300
            }}>
              A distinguished community where refined living meets thoughtful management. 
              Your home portal awaits.
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Link href="/auth/login" className="btn-primary" style={{ fontSize: 13 }}>
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-outline" style={{
                color: 'var(--cream)', borderColor: 'rgba(245,240,232,0.4)', fontSize: 13
              }}>
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
        }}>
          <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(216,195,154,0.7)' }}>Scroll</span>
          <div style={{
            width: 1, height: 48,
            background: 'linear-gradient(var(--gold), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite'
          }} />
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '120px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Est. 2024
            </p>
            <h2 style={{ fontSize: 48, marginBottom: 24, color: 'var(--dark)' }}>
              A Place to Call Home
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
              Karim Residencia is built on the principles of community, comfort, and refined living. 
              Our resident portal brings everything you need — maintenance, announcements, rules, and 
              communication — into one elegant space.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 15 }}>
              Whether you're a resident checking in or a committee member managing operations, 
              your dashboard is designed to make life simpler.
            </p>
          </div>
          <div style={{
            background: 'var(--cream)',
            padding: 56, position: 'relative',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              position: 'absolute', top: -16, left: -16,
              width: 80, height: 80, background: 'var(--gold)', opacity: 0.2
            }} />
            {[
              { number: '200+', label: 'Residential Units' },
              { number: '5', label: 'Blocks' },
              { number: '24/7', label: 'Security' },
              { number: '100%', label: 'Digital Management' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '24px 0',
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--dark)', fontWeight: 600 }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.05em', marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" style={{ padding: '80px 0', background: 'var(--dark)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16, textAlign: 'center' }}>
            What We Offer
          </p>
          <h2 style={{ fontSize: 48, color: 'var(--cream)', textAlign: 'center', marginBottom: 64 }}>
            Community Amenities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {[
              { icon: '🏊', title: 'Swimming Pool', desc: 'Olympic-size pool with dedicated swim lanes and a children\'s area' },
              { icon: '🌿', title: 'Landscaped Gardens', desc: 'Beautifully maintained green spaces and walking paths throughout' },
              { icon: '🏋️', title: 'Fitness Center', desc: 'State-of-the-art gymnasium available to all residents' },
              { icon: '🎾', title: 'Sports Courts', desc: 'Tennis and basketball courts for residents and guests' },
              { icon: '🛡️', title: 'Gated Security', desc: '24/7 professional security team and CCTV surveillance' },
              { icon: '🅿️', title: 'Covered Parking', desc: 'Dedicated parking spots with visitor parking available' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '40px 32px', background: '#222220',
                borderTop: '2px solid transparent',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
                onMouseEnter={e => (e.currentTarget.style.borderTopColor = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.borderTopColor = 'transparent')}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--cream)', marginBottom: 12 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
          Resident Portal
        </p>
        <h2 style={{ fontSize: 52, marginBottom: 24, color: 'var(--dark)' }}>
          Access Your Dashboard
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
          Sign in to manage your apartment, view announcements, submit maintenance requests, and connect with your community.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Link href="/auth/login" className="btn-primary">Sign In</Link>
          <Link href="/auth/signup" className="btn-outline">Create Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 80px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--dark)' }}>
          Karim <span style={{ color: 'var(--gold)' }}>Residencia</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          © 2026 Karim Residencia. All rights reserved.
        </p>
      </footer>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.4; transform: scaleY(0.6); }
        }
      `}</style>
    </div>
  )
}
