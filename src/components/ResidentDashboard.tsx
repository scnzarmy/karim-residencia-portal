'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Profile = { full_name: string; email: string; block: string; apartment: string; role: string } | null

export default function ResidentDashboard({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState('home')
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'maintenance', icon: '🔧', label: 'Maintenance' },
    { id: 'dues', icon: '💰', label: 'Dues' },
    { id: 'announcements', icon: '📢', label: 'Notices' },
    { id: 'rules', icon: '📋', label: 'Rules' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--dark)', position: 'fixed', top: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', padding: '32px 0', zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(216,195,154,0.15)' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--cream)', fontWeight: 600 }}>Karim</div>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 2 }}>Residencia</div>
        </div>

        {/* User info */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(216,195,154,0.15)' }}>
          <div style={{
            width: 48, height: 48, background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700,
            color: 'var(--dark)', marginBottom: 12
          }}>
            {profile?.full_name?.charAt(0) || 'R'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--cream)', fontWeight: 500, marginBottom: 4 }}>
            {profile?.full_name || 'Resident'}
          </div>
          {profile?.block && (
            <div style={{ fontSize: 12, color: 'rgba(216,195,154,0.7)' }}>
              Block {profile.block} — Apt {profile.apartment}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%', padding: '14px 24px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: activeTab === tab.id ? 'rgba(216,195,154,0.1)' : 'transparent',
              border: 'none', borderLeft: `3px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--gold)' : 'rgba(245,240,232,0.6)',
              fontSize: 14, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(216,195,154,0.15)' }}>
          <button onClick={handleSignOut} style={{
            background: 'transparent', border: 'none',
            color: 'rgba(245,240,232,0.4)', fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'color 0.2s'
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.4)')}
          >
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '48px' }}>
        {activeTab === 'home' && <HomeTab profile={profile} />}
        {activeTab === 'maintenance' && <MaintenanceTab />}
        {activeTab === 'dues' && <DuesTab profile={profile} />}
        {activeTab === 'announcements' && <AnnouncementsTab />}
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'profile' && <ProfileTab profile={profile} />}
      </main>
    </div>
  )
}

function HomeTab({ profile }: { profile: Profile }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>{greeting}</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 8 }}>
        {profile?.full_name?.split(' ')[0] || 'Resident'}
      </h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 48 }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { label: 'Open Requests', value: '0', icon: '🔧', color: 'var(--terracotta)' },
          { label: 'New Notices', value: '2', icon: '📢', color: 'var(--gold)' },
          { label: 'Your Unit', value: `${profile?.block || '—'}${profile?.apartment || ''}`, icon: '🏠', color: 'var(--sage)' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', padding: 28, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, color: 'var(--dark)', fontWeight: 600 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent announcements */}
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--dark)', marginBottom: 24 }}>Recent Announcements</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { title: 'Water Supply Maintenance', date: 'March 7, 2026', desc: 'Water supply will be interrupted on March 10 from 9 AM to 1 PM for maintenance work.' },
          { title: 'Community Meeting', date: 'March 5, 2026', desc: 'Monthly community meeting scheduled for March 15 at 7 PM in the community hall.' },
        ].map((ann, i) => (
          <div key={i} style={{ background: 'white', padding: '20px 24px', border: '1px solid var(--border)', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ width: 3, height: '100%', minHeight: 40, background: 'var(--gold)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dark)', marginBottom: 4 }}>{ann.title}</div>
              <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 8 }}>{ann.date}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{ann.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MaintenanceTab() {
  const [form, setForm] = useState({ category: '', description: '', urgency: 'normal' })
  const [image, setImage] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Services</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>Maintenance Request</h1>

      {submitted ? (
        <div style={{ background: 'white', padding: 48, border: '1px solid var(--border)', textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--dark)', marginBottom: 12 }}>Request Submitted</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>Your maintenance request has been received. The committee will review and respond shortly.</p>
          <button onClick={() => { setSubmitted(false); setForm({ category: '', description: '', urgency: 'normal' }); setImage(null) }}
            className="btn-outline" style={{ marginTop: 24, fontSize: 13 }}>New Request</button>
        </div>
      ) : (
        <div style={{ background: 'white', padding: 40, border: '1px solid var(--border)', maxWidth: 560 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', fontSize: 15, outline: 'none', background: 'white', color: form.category ? 'var(--dark)' : 'var(--muted)' }}>
              <option value="">Select category</option>
              {['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Pest Control', 'Structural', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>Urgency</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['low', 'normal', 'urgent'].map(u => (
                <button key={u} onClick={() => setForm(p => ({ ...p, urgency: u }))} style={{
                  flex: 1, padding: '10px', border: `1px solid ${form.urgency === u ? 'var(--dark)' : 'var(--border)'}`,
                  background: form.urgency === u ? 'var(--dark)' : 'transparent',
                  color: form.urgency === u ? 'var(--cream)' : 'var(--dark)',
                  fontSize: 13, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s'
                }}>{u}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe the issue in detail..." rows={5}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', fontSize: 15, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>
              Photo (Optional)
              <span style={{ color: 'var(--muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', fontSize: 12 }}> — Attach an image to help show the issue</span>
            </label>
            {image ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={image} alt="Uploaded" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', border: '1px solid var(--border)' }} />
                <button onClick={() => setImage(null)} style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--dark)', color: 'var(--cream)',
                  border: 'none', cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>×</button>
              </div>
            ) : (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '32px', border: '2px dashed var(--border)', cursor: 'pointer',
                transition: 'border-color 0.2s', background: 'var(--warm-white)'
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Click to upload a photo</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>JPG, PNG up to 5MB</div>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          <button onClick={() => form.category && form.description && setSubmitted(true)}
            className="btn-primary" style={{ fontSize: 13, opacity: !form.category || !form.description ? 0.5 : 1 }}>
            Submit Request
          </button>
        </div>
      )}
    </div>
  )
}

function DuesTab({ profile }: { profile: Profile }) {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [paidMonths, setPaidMonths] = useState<string[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const currentYear = new Date().getFullYear()
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const currentMonthIndex = new Date().getMonth()
  const dues = months.slice(0, currentMonthIndex + 1).map((month, i) => ({
    month,
    year: currentYear,
    amount: '5,000',
    status: paidMonths.includes(month) ? 'paid' : 'pending',
    dueDate: `5th ${month}`,
  }))

  const handlePayNow = () => {
    if (selectedMonth) {
      setPaidMonths(prev => [...prev, selectedMonth])
      setShowPaymentModal(true)
      setTimeout(() => setShowPaymentModal(false), 3000)
      setSelectedMonth('')
    }
  }

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Payments</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>Monthly Dues</h1>

      {showPaymentModal && (
        <div style={{
          background: '#E8F5E9', border: '1px solid #4CAF50', padding: '16px 24px',
          marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontWeight: 500, color: '#2E7D32', fontSize: 14 }}>Payment Successful!</div>
            <div style={{ fontSize: 13, color: '#558B2F' }}>Your payment has been recorded. Receipt will be sent to your email.</div>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        <div style={{ background: 'white', padding: 24, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Total Dues</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--dark)', fontWeight: 600 }}>PKR {(dues.length * 5000).toLocaleString()}</div>
        </div>
        <div style={{ background: 'white', padding: 24, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Paid</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#4CAF50', fontWeight: 600 }}>PKR {(paidMonths.length * 5000).toLocaleString()}</div>
        </div>
        <div style={{ background: 'white', padding: 24, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Pending</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--terracotta)', fontWeight: 600 }}>PKR {((dues.length - paidMonths.length) * 5000).toLocaleString()}</div>
        </div>
      </div>

      {/* Dues list */}
      <div style={{ background: 'white', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--dark)' }}>Payment History</h3>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Unit: {profile?.block || '—'}{profile?.apartment || ''}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {dues.reverse().map((d, i) => (
            <div key={i} style={{
              padding: '18px 28px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: i < dues.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 40, height: 40,
                  background: d.status === 'paid' ? '#E8F5E9' : '#FFF3E0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18
                }}>
                  {d.status === 'paid' ? '✅' : '⏳'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--dark)' }}>{d.month} {d.year}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Due by {d.dueDate}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--dark)' }}>PKR {d.amount}</span>
                {d.status === 'pending' ? (
                  <button
                    onClick={() => { setSelectedMonth(d.month); handlePayNow() }}
                    className="btn-primary"
                    style={{ fontSize: 12, padding: '8px 20px' }}
                  >Pay Now</button>
                ) : (
                  <span style={{ fontSize: 12, color: '#4CAF50', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paid</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnnouncementsTab() {
  const notices = [
    { title: 'Water Supply Maintenance', date: 'March 7, 2026', category: 'Utilities', desc: 'Water supply will be interrupted on March 10 from 9 AM to 1 PM for routine maintenance work on the main pipeline. Please store water in advance.' },
    { title: 'Monthly Community Meeting', date: 'March 5, 2026', category: 'Community', desc: 'Monthly community meeting scheduled for March 15 at 7 PM in the community hall. All residents are encouraged to attend.' },
    { title: 'Parking Rules Reminder', date: 'February 28, 2026', category: 'Rules', desc: 'Please ensure vehicles are parked only in designated spots. Unauthorized parking may result in towing at owner\'s expense.' },
    { title: 'New Gym Equipment', date: 'February 20, 2026', category: 'Amenities', desc: 'New fitness equipment has been installed in the community gym. Hours: 6 AM to 10 PM daily.' },
  ]

  const categoryColors: Record<string, string> = {
    Utilities: 'var(--terracotta)', Community: 'var(--sage)', Rules: 'var(--gold)', Amenities: '#6B8CAE'
  }

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Community</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>Announcements</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {notices.map((n, i) => (
          <div key={i} style={{ background: 'white', padding: '28px 32px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: categoryColors[n.category] || 'var(--gold)', fontWeight: 500 }}>{n.category}</span>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--dark)', marginTop: 4 }}>{n.title}</h3>
              </div>
              <span style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0, marginLeft: 16 }}>{n.date}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{n.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RulesTab() {
  const rules = [
    { section: 'General Conduct', items: ['Residents must maintain decorum in all common areas.', 'Noise levels must be kept reasonable, especially between 10 PM and 7 AM.', 'Guests are the responsibility of the resident who invites them.'] },
    { section: 'Parking', items: ['Each unit is allocated one designated parking spot.', 'Visitor parking is available near the main gate on a first-come basis.', 'Vehicles must not block emergency access routes.'] },
    { section: 'Common Areas', items: ['Common areas are for the use of all residents equally.', 'Littering in any common area is strictly prohibited.', 'Pets must be on a leash in all outdoor common areas.'] },
    { section: 'Maintenance', items: ['Report maintenance issues through the resident portal.', 'Residents are responsible for damages caused by negligence.', 'No structural modifications without committee approval.'] },
  ]

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Guidelines</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 8 }}>Community Rules</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 40, lineHeight: 1.7 }}>
        These guidelines ensure a harmonious living environment for all residents. Please review them carefully.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {rules.map((rule, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--border)' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 28, height: 28, background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--dark)' }}>{rule.section}</h3>
            </div>
            <div style={{ padding: '20px 28px' }}>
              {rule.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderBottom: j < rule.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginTop: 7, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileTab({ profile }: { profile: Profile }) {
  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Account</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>My Profile</h1>
      <div style={{ background: 'white', padding: 40, border: '1px solid var(--border)', maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 72, height: 72, background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700 }}>{profile?.full_name?.charAt(0) || 'R'}</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--dark)' }}>{profile?.full_name || '—'}</div>
            <div style={{ fontSize: 13, color: 'var(--gold)', textTransform: 'capitalize', marginTop: 4 }}>{profile?.role || 'Resident'}</div>
          </div>
        </div>
        {[
          { label: 'Email', value: profile?.email },
          { label: 'Block', value: profile?.block ? `Block ${profile.block}` : '—' },
          { label: 'Apartment', value: profile?.apartment || '—' },
          { label: 'Role', value: profile?.role || 'Resident' },
        ].map((field, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 500 }}>{field.label}</span>
            <span style={{ fontSize: 14, color: 'var(--dark)', textTransform: 'capitalize' }}>{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
