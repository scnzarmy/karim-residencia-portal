import { useState } from 'react'
import { LogOut, Pin, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { t } from '../translations'
import { supabase } from '../../lib/supabaseClient'

const TABS = [
  'overview',
  'residentManagement',
  'pendingRequests',
  'noticeBoard',
  'newsUpdates',
  'liveStatus',
  'complaints',
] as const

export default function CommitteeDashboard() {
  const {
    lang,
    selectedBlock,
    notices,
    news,
    liveStatus,
    complaints,
    pendingResidents,
    approvedResidents,
    signOutAll,
    refreshBlockData,
  } = useApp()
  const [tab, setTab] = useState<(typeof TABS)[number]>('overview')

  async function approveResident(id: string) {
    const { error } = await supabase.from('profiles').update({ approved: true }).eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success(t(lang, 'approve'))
      refreshBlockData()
    }
  }

  async function removeResident(id: string) {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) toast.error(error.message)
    else refreshBlockData()
  }

  async function togglePin(id: string, pinned: boolean) {
    await supabase.from('notices').update({ pinned: !pinned }).eq('id', id)
    refreshBlockData()
  }

  async function deleteNotice(id: string) {
    await supabase.from('notices').delete().eq('id', id)
    refreshBlockData()
  }

  async function createNotice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value
    await supabase.from('notices').insert({ block_id: selectedBlock, title, body, pinned: false })
    form.reset()
    refreshBlockData()
  }

  async function createNews(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value
    await supabase.from('news').insert({ block_id: selectedBlock, title, body })
    form.reset()
    refreshBlockData()
  }

  async function addStatus(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const label = (form.elements.namedItem('label') as HTMLInputElement).value
    const status = (form.elements.namedItem('status') as HTMLInputElement).value
    await supabase.from('live_status').insert({ block_id: selectedBlock, label, status })
    form.reset()
    refreshBlockData()
  }

  async function replyComplaint(id: string, reply: string, status: string) {
    await supabase.from('complaints').update({ committee_reply: reply, status }).eq('id', id)
    refreshBlockData()
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="bg-white border-b border-sand-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-display font-semibold text-forest-900">
          {t(lang, 'appName')} · {selectedBlock}
        </h1>
        <button onClick={signOutAll} className="text-forest-600" aria-label={t(lang, 'logout')}>
          <LogOut size={18} />
        </button>
      </header>

      <nav className="flex gap-1 overflow-x-auto px-4 py-2 bg-white border-b border-sand-200 sticky top-[57px] z-10">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              tab === tb ? 'bg-forest-600 text-white' : 'text-forest-700 hover:bg-forest-50'
            }`}
          >
            {tb === 'noticeBoard' || tb === 'newsUpdates' ? t(lang, tb) : t(lang, tb)}
          </button>
        ))}
      </nav>

      <main className="p-4 max-w-2xl mx-auto grid gap-4">
        {tab === 'overview' && (
          <div className="grid grid-cols-3 gap-3">
            <StatCard label={t(lang, 'residentManagement')} value={approvedResidents.length} />
            <StatCard label={t(lang, 'pendingRequests')} value={pendingResidents.length} />
            <StatCard label={t(lang, 'noticeBoard')} value={notices.length} />
          </div>
        )}

        {tab === 'residentManagement' && (
          <div className="grid gap-2">
            {approvedResidents.length ? (
              approvedResidents.map((r) => (
                <div key={r.id} className="bg-white border border-sand-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-forest-900">{r.full_name}</p>
                    <p className="text-xs text-forest-500">{r.house_number}</p>
                  </div>
                  <button onClick={() => removeResident(r.id)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <Empty lang={lang} />
            )}
          </div>
        )}

        {tab === 'pendingRequests' && (
          <div className="grid gap-2">
            {pendingResidents.length ? (
              pendingResidents.map((r) => (
                <div key={r.id} className="bg-white border border-sand-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-forest-900">{r.full_name}</p>
                    <p className="text-xs text-forest-500">{r.house_number}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveResident(r.id)} className="text-forest-600">
                      <Check size={18} />
                    </button>
                    <button onClick={() => removeResident(r.id)} className="text-red-600">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <Empty lang={lang} />
            )}
          </div>
        )}

        {tab === 'noticeBoard' && (
          <div className="grid gap-4">
            <form onSubmit={createNotice} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
              <input name="title" required placeholder={t(lang, 'subject')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <textarea name="body" required placeholder={t(lang, 'description')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <button className="bg-forest-600 text-white rounded-lg py-2 text-sm font-medium">{t(lang, 'createNotice')}</button>
            </form>
            {notices.map((n) => (
              <div key={n.id} className="bg-white border border-sand-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-forest-900">{n.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => togglePin(n.id, n.pinned)} className={n.pinned ? 'text-forest-600' : 'text-forest-300'}>
                      <Pin size={16} />
                    </button>
                    <button onClick={() => deleteNotice(n.id)} className="text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-forest-700">{n.body}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'newsUpdates' && (
          <div className="grid gap-4">
            <form onSubmit={createNews} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
              <input name="title" required placeholder={t(lang, 'subject')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <textarea name="body" required placeholder={t(lang, 'description')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <button className="bg-forest-600 text-white rounded-lg py-2 text-sm font-medium">{t(lang, 'createNotice')}</button>
            </form>
            {news.map((n) => (
              <div key={n.id} className="bg-white border border-sand-200 rounded-xl p-4">
                <h3 className="font-medium text-forest-900 mb-1">{n.title}</h3>
                <p className="text-sm text-forest-700">{n.body}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'liveStatus' && (
          <div className="grid gap-4">
            <form onSubmit={addStatus} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
              <input name="label" required placeholder="e.g. Water Supply" className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <input name="status" required placeholder="e.g. Available" className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <button className="bg-forest-600 text-white rounded-lg py-2 text-sm font-medium">{t(lang, 'submit')}</button>
            </form>
            {liveStatus.map((s) => (
              <div key={s.id} className="bg-white border border-sand-200 rounded-xl p-4 flex items-center justify-between">
                <span className="text-forest-900 text-sm font-medium">{s.label}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-sand-100 text-forest-700">{s.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'complaints' && (
          <div className="grid gap-3">
            {complaints.length ? (
              complaints.map((c) => <ComplaintRow key={c.id} c={c} lang={lang} onReply={replyComplaint} />)
            ) : (
              <Empty lang={lang} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function ComplaintRow({
  c,
  lang,
  onReply,
}: {
  c: { id: string; subject: string; description: string; status: string; committee_reply: string | null }
  lang: 'en' | 'ur'
  onReply: (id: string, reply: string, status: string) => void
}) {
  const [reply, setReply] = useState(c.committee_reply ?? '')
  return (
    <div className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
      <h3 className="font-medium text-forest-900">{c.subject}</h3>
      <p className="text-sm text-forest-700">{c.description}</p>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder={t(lang, 'description')}
        className="border border-sand-200 rounded-lg px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button onClick={() => onReply(c.id, reply, 'in_progress')} className="text-xs bg-amber-100 text-amber-800 rounded-full px-3 py-1">
          {t(lang, 'status_in_progress')}
        </button>
        <button onClick={() => onReply(c.id, reply, 'resolved')} className="text-xs bg-forest-100 text-forest-700 rounded-full px-3 py-1">
          {t(lang, 'status_resolved')}
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-sand-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-display font-semibold text-forest-900">{value}</p>
      <p className="text-xs text-forest-600 mt-1">{label}</p>
    </div>
  )
}

function Empty({ lang }: { lang: 'en' | 'ur' }) {
  return <p className="text-center text-sm text-forest-500 py-10">{t(lang, 'noData')}</p>
}
