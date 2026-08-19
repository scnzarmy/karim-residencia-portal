'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Profile = { full_name: string; email: string; role: string } | null

export default function CommitteeDashboard({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const tabs = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'requests', icon: '🔧', label: 'Requests' },
    { id: 'announcements', icon: '📢', label: 'Post Notice' },
    { id: 'residents', icon: '👥', label: 'Residents' },
    { id: 'rules', icon: '📋', label: 'Rules' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--dark)', position: 'fixed', top: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', padding: '32px 0', zIndex: 10
      }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--cream)', fontWeight: 600 }}>Karim</div>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 2 }}>Committee Portal</div>
        </div>

        <div style={{ padding: '24px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <div style={{
            width: 48, height: 48, background: 'var(--terracotta)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700,
            color: 'white', marginBottom: 12
          }}>
            {profile?.full_name?.charAt(0) || 'C'}
          </div>
          <div style={{ fontSize: 14, color: 'var(--cream)', fontWeight: 500, marginBottom: 4 }}>
            {profile?.full_name || 'Committee Member'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Committee</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%', padding: '14px 24px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: activeTab === tab.id ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: 'none', borderLeft: `3px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--gold)' : 'rgba(245,240,232,0.6)',
              fontSize: 14, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          <button onClick={handleSignOut} style={{
            background: 'transparent', border: 'none',
            color: 'rgba(245,240,232,0.4)', fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s'
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.4)')}
          >← Sign Out</button>
        </div>
      </aside>

      <main style={{ marginLeft: 240, flex: 1, padding: '48px' }}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'requests' && <RequestsTab />}
        {activeTab === 'announcements' && <PostNoticeTab />}
        {activeTab === 'residents' && <ResidentsTab />}
        {activeTab === 'rules' && <ManageRulesTab />}
      </main>
    </div>
  )
}

function OverviewTab() {
  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Committee</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 8 }}>Overview</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 48 }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { label: 'Total Residents', value: '—', icon: '👥', note: 'Registered users' },
          { label: 'Open Requests', value: '0', icon: '🔧', note: 'Pending review' },
          { label: 'Active Notices', value: '4', icon: '📢', note: 'This month' },
          { label: 'Blocks', value: '5', icon: '🏢', note: 'A, B, C, D, E' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', padding: 24, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--dark)', fontWeight: 600 }}>{stat.value}</div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dark)', fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{stat.note}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--dark)', marginBottom: 24 }}>Recent Activity</h2>
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: 32 }}>
        <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
          Activity logs will appear here as residents interact with the portal.
        </p>
      </div>
    </div>
  )
}

function RequestsTab() {
  const requests = [
    { id: 'REQ-001', resident: 'Ahmed Ali', block: 'A', apt: '204', category: 'Plumbing', urgency: 'urgent', desc: 'Leaking pipe under kitchen sink', date: 'Mar 7, 2026', status: 'pending' },
    { id: 'REQ-002', resident: 'Fatima Khan', block: 'C', apt: '101', category: 'Electrical', urgency: 'normal', desc: 'Faulty light switch in bedroom', date: 'Mar 6, 2026', status: 'pending' },
  ]

  const urgencyColors: Record<string, string> = { urgent: 'var(--terracotta)', normal: 'var(--sage)', low: 'var(--muted)' }

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Management</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>Maintenance Requests</h1>

      {requests.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', padding: 48, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No pending requests.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requests.map((req, i) => (
            <div key={i} style={{ background: 'white', padding: '24px 28px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)' }}>{req.id}</span>
                    <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: urgencyColors[req.urgency], fontWeight: 500 }}>{req.urgency}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{req.category}</span>
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--dark)' }}>{req.desc}</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)', flexShrink: 0, marginLeft: 16 }}>{req.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{req.resident} — Block {req.block}, Apt {req.apt}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 12, padding: '8px 20px' }}>Accept</button>
                  <button className="btn-outline" style={{ fontSize: 12, padding: '8px 20px' }}>Dismiss</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PostNoticeTab() {
  const [form, setForm] = useState({ title: '', category: 'General', content: '' })
  const [posted, setPosted] = useState(false)

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Communication</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>Post Announcement</h1>

      {posted ? (
        <div style={{ background: 'white', padding: 48, border: '1px solid var(--border)', textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📢</div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--dark)', marginBottom: 12 }}>Notice Posted</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Your announcement has been published to all residents.</p>
          <button onClick={() => { setPosted(false); setForm({ title: '', category: 'General', content: '' }) }}
            className="btn-outline" style={{ marginTop: 24, fontSize: 13 }}>Post Another</button>
        </div>
      ) : (
        <div style={{ background: 'white', padding: 40, border: '1px solid var(--border)', maxWidth: 600 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title"
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', fontSize: 15, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', fontSize: 15, outline: 'none', background: 'white' }}>
              {['General', 'Utilities', 'Community', 'Rules', 'Amenities', 'Emergency'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: 8, fontWeight: 500 }}>Content</label>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="Write your announcement..." rows={6}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', fontSize: 15, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <button onClick={() => form.title && form.content && setPosted(true)}
            className="btn-primary" style={{ fontSize: 13, opacity: !form.title || !form.content ? 0.5 : 1 }}>
            Publish Announcement
          </button>
        </div>
      )}
    </div>
  )
}

function ResidentsTab() {
  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Directory</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>Residents</h1>
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: 48, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>
          Resident data will be pulled from your Supabase database once residents register through the portal.
        </p>
      </div>
    </div>
  )
}

function ManageRulesTab() {
  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Administration</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--dark)', marginBottom: 40 }}>Community Rules</h1>
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: 48, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>
          Rule management editor coming soon. For now, rules are shown to residents as configured in the portal.
        </p>
      </div>
    </div>
  )
}
