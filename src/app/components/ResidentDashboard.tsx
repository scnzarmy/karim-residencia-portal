import { useState } from 'react'
import { Pin, LogOut, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { t } from '../translations'
import { supabase } from '../../lib/supabaseClient'
import ChatBot from './ChatBot'
import RulesPanel from './RulesPanel'

const NAMAZ_VENUE: Record<string, string> = { A: 'P1 Musallah', B: 'Block B Musallah', C: 'Masjid Ayesha' }

const TABS = ['noticeBoard', 'newsUpdates', 'liveStatus', 'namazTimings', 'complaints'] as const

export default function ResidentDashboard() {
  const { lang, profile, selectedBlock, notices, news, liveStatus, complaints, signOutAll, refreshBlockData } = useApp()
  const [tab, setTab] = useState<(typeof TABS)[number]>('noticeBoard')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [showRules, setShowRules] = useState(false)

  async function submitComplaint(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || !selectedBlock) return
    const { error } = await supabase.from('complaints').insert({
      block_id: selectedBlock,
      resident_id: profile.id,
      subject,
      description,
    })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(t(lang, 'submit'))
    setSubject('')
    setDescription('')
    refreshBlockData()
  }

  if (profile && !profile.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50 px-6 text-center">
        <div>
          <p className="text-forest-800 font-medium">{t(lang, 'pendingApproval')}</p>
          <button onClick={signOutAll} className="mt-4 text-sm text-forest-600 underline">
            {t(lang, 'logout')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="bg-white border-b border-sand-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-display font-semibold text-forest-900">{t(lang, 'appName')}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowRules(true)} className="text-sm text-forest-700 underline">
            {t(lang, 'rules')}
          </button>
          <button onClick={signOutAll} className="text-forest-600" aria-label={t(lang, 'logout')}>
            <LogOut size={18} />
          </button>
        </div>
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
            {t(lang, tb)}
          </button>
        ))}
      </nav>

      <main className="p-4 max-w-2xl mx-auto grid gap-3">
        {tab === 'noticeBoard' &&
          (notices.length ? (
            notices.map((n) => (
              <div key={n.id} className="bg-white border border-sand-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  {n.pinned && <Pin size={14} className="text-forest-600" />}
                  <h3 className="font-medium text-forest-900">{n.title}</h3>
                </div>
                <p className="text-sm text-forest-700">{n.body}</p>
              </div>
            ))
          ) : (
            <Empty lang={lang} />
          ))}

        {tab === 'newsUpdates' &&
          (news.length ? (
            news.map((n) => (
              <div key={n.id} className="bg-white border border-sand-200 rounded-xl p-4">
                <h3 className="font-medium text-forest-900 mb-1">{n.title}</h3>
                <p className="text-sm text-forest-700">{n.body}</p>
              </div>
            ))
          ) : (
            <Empty lang={lang} />
          ))}

        {tab === 'liveStatus' &&
          (liveStatus.length ? (
            <div className="grid gap-2">
              {liveStatus.map((s) => (
                <div key={s.id} className="bg-white border border-sand-200 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-forest-900 text-sm font-medium">{s.label}</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      s.status.toLowerCase().includes('available')
                        ? 'bg-forest-100 text-forest-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty lang={lang} />
          ))}

        {tab === 'namazTimings' && (
          <div className="bg-white border border-sand-200 rounded-xl p-4">
            <p className="text-forest-900 font-medium">{selectedBlock ? NAMAZ_VENUE[selectedBlock] : ''}</p>
          </div>
        )}

        {tab === 'complaints' && (
          <div className="grid gap-4">
            <form onSubmit={submitComplaint} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-3">
              <input
                required
                placeholder={t(lang, 'subject')}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border border-sand-200 rounded-lg px-3 py-2 text-sm"
              />
              <textarea
                required
                placeholder={t(lang, 'description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-sand-200 rounded-lg px-3 py-2 text-sm min-h-[80px]"
              />
              <button type="submit" className="flex items-center justify-center gap-2 bg-forest-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-forest-700 transition">
                <Send size={14} /> {t(lang, 'submitComplaint')}
              </button>
            </form>

            {complaints.map((c) => (
              <div key={c.id} className="bg-white border border-sand-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-forest-900">{c.subject}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sand-100 text-forest-700">
                    {t(lang, `status_${c.status}` as any)}
                  </span>
                </div>
                <p className="text-sm text-forest-700">{c.description}</p>
                {c.committee_reply && <p className="text-xs text-forest-500 mt-2 italic">{c.committee_reply}</p>}
              </div>
            ))}
          </div>
        )}
      </main>

      <ChatBot />
      {showRules && <RulesPanel onClose={() => setShowRules(false)} />}
    </div>
  )
}

function Empty({ lang }: { lang: 'en' | 'ur' }) {
  return <p className="text-center text-sm text-forest-500 py-10">{t(lang, 'noData')}</p>
}
