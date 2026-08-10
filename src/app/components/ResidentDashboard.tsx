import { useState } from 'react'
import {
  Pin,
  LogOut,
  Send,
  Bell,
  Newspaper,
  Activity,
  Moon,
  MessageSquareWarning,
  Wallet,
  CalendarDays,
  FileText,
  Vote,
  AlertTriangle,
  X,
  Download,
  Inbox,
  Menu,
  Building2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { t } from '../translations'
import { supabase } from '../../lib/supabaseClient'
import ChatBot from './ChatBot'
import RulesPanel from './RulesPanel'

const TILES = [
  { key: 'noticeBoard', icon: Bell, bg: 'bg-forest-100', fg: 'text-forest-700', accent: 'border-l-emerald-400' },
  { key: 'newsUpdates', icon: Newspaper, bg: 'bg-sky-100', fg: 'text-sky-700', accent: 'border-l-blue-400' },
  { key: 'liveStatus', icon: Activity, bg: 'bg-amber-100', fg: 'text-amber-700', accent: 'border-l-amber-400' },
  { key: 'namazTimings', icon: Moon, bg: 'bg-purple-100', fg: 'text-purple-700', accent: 'border-l-violet-400' },
  { key: 'complaints', icon: MessageSquareWarning, bg: 'bg-rose-100', fg: 'text-rose-700', accent: 'border-l-red-400' },
  { key: 'dues', icon: Wallet, bg: 'bg-emerald-100', fg: 'text-emerald-700', accent: 'border-l-teal-400' },
  { key: 'events', icon: CalendarDays, bg: 'bg-indigo-100', fg: 'text-indigo-700', accent: 'border-l-indigo-400' },
  { key: 'documents', icon: FileText, bg: 'bg-orange-100', fg: 'text-orange-700', accent: 'border-l-orange-400' },
  { key: 'polls', icon: Vote, bg: 'bg-cyan-100', fg: 'text-cyan-700', accent: 'border-l-cyan-400' },
] as const

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function ResidentDashboard() {
  const {
    lang,
    profile,
    selectedBlock,
    notices,
    news,
    liveStatus,
    complaints,
    blockInfo,
    dues,
    events,
    documents,
    activeAlert,
    polls,
    pollVotes,
    markDuePaid,
    createEvent: _createEvent,
    votePoll,
    dismissAlert,
    signOutAll,
    refreshBlockData,
  } = useApp()
  const [tab, setTab] = useState<(typeof TILES)[number]['key']>('noticeBoard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [showRules, setShowRules] = useState(false)
  const [proofNote, setProofNote] = useState('')
  const [amount, setAmount] = useState('')
  const [alertDismissed, setAlertDismissed] = useState(false)

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

  async function handleMarkPaid(e: React.FormEvent) {
    e.preventDefault()
    await markDuePaid(currentMonthKey(), Number(amount) || 0, proofNote)
    toast.success(t(lang, 'markPaid'))
    setProofNote('')
    setAmount('')
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

  const firstName = profile?.full_name?.split(' ')[0] ?? ''
  const currentMonthDue = dues.find((d) => d.month === currentMonthKey())
  const activePolls = polls.filter((p) => !p.closed)

  return (
    <div className="min-h-screen bg-sand-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 h-screen bg-forest-900 flex flex-col shrink-0 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <span className="bg-forest-600 text-white rounded-lg p-2 shrink-0">
            <Building2 size={18} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-white text-sm font-semibold leading-tight truncate">{t(lang, 'appName')}</p>
            <p className="text-white/50 text-[11px]">
              {firstName ? `Hi, ${firstName} · ${selectedBlock}` : selectedBlock}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {TILES.map(({ key, icon: Icon, accent }) => (
            <button
              key={key}
              onClick={() => {
                setTab(key)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-5 py-2.5 border-l-4 text-sm transition ${
                tab === key ? `${accent} bg-white/10 text-white font-medium` : 'border-l-transparent text-white/55 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <Icon size={16} />
              {t(lang, key)}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 grid gap-2">
          <button onClick={() => setShowRules(true)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm">
            <FileText size={16} />
            {t(lang, 'rules')}
          </button>
          <button onClick={signOutAll} className="flex items-center gap-2 text-white/70 hover:text-white text-sm">
            <LogOut size={16} />
            {t(lang, 'logout')}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between bg-forest-900 px-4 py-3 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} className="text-white" />
          </button>
          <span className="text-white font-display font-semibold text-sm">
            {t(lang, 'appName')} · {selectedBlock}
          </span>
          <span className="w-5" />
        </div>

        {activeAlert && !alertDismissed && (
          <div className="bg-rose-600 text-white px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">{activeAlert.title}</p>
              <p className="text-xs text-rose-50 mt-0.5">{activeAlert.message}</p>
            </div>
            <button
              onClick={() => {
                setAlertDismissed(true)
                dismissAlert(activeAlert.id)
              }}
              aria-label={t(lang, 'dismiss')}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="hidden md:flex items-center justify-between bg-white border-b border-sand-200 px-6 py-4">
          <div>
            <p className="text-xs text-forest-400">{selectedBlock ? `${t(lang, 'appName')} · ${selectedBlock}` : ''}</p>
            <h1 className="font-display text-lg font-semibold text-forest-900">{t(lang, tab)}</h1>
          </div>
          <button onClick={() => setShowRules(true)} className="text-xs text-forest-600 underline">
            {t(lang, 'rules')}
          </button>
        </div>

        <main className="p-4 md:p-6 max-w-3xl mx-auto grid gap-3 content-start">
        {tab === 'noticeBoard' &&
          (notices.length ? (
            notices.map((n) => (
              <div key={n.id} className="bg-white border border-sand-200 border-l-4 border-l-forest-400 rounded-xl p-4">
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
              <div key={n.id} className="bg-white border border-sand-200 border-l-4 border-l-sky-400 rounded-xl p-4">
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
          <div className="bg-white border border-sand-200 border-l-4 border-l-purple-400 rounded-xl p-4">
            <p className="text-forest-900 font-medium mb-3">{blockInfo?.namaz_venue}</p>
            <div className="grid grid-cols-2 gap-2">
              {(['fajr', 'zuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
                <div key={prayer} className="bg-purple-50 rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-purple-800 font-medium">{t(lang, prayer)}</span>
                  <span className="text-xs text-forest-700">
                    {blockInfo?.[`namaz_${prayer}` as keyof typeof blockInfo] || '—'}
                  </span>
                </div>
              ))}
            </div>
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
                className="border border-sand-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-forest-400"
              />
              <textarea
                required
                placeholder={t(lang, 'description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-sand-200 rounded-lg px-3 py-2 text-sm min-h-[80px] outline-none focus:border-forest-400"
              />
              <button type="submit" className="flex items-center justify-center gap-2 bg-forest-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-forest-700 transition">
                <Send size={14} /> {t(lang, 'submitComplaint')}
              </button>
            </form>

            {complaints.map((c) => (
              <div key={c.id} className="bg-white border border-sand-200 border-l-4 border-l-rose-400 rounded-xl p-4">
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

        {tab === 'dues' && (
          <div className="grid gap-4">
            <div className="bg-gradient-to-br from-forest-900 to-forest-800 rounded-2xl p-5 text-white">
              <p className="text-white/60 text-xs mb-1">{currentMonthKey()}</p>
              <p className="font-display text-3xl font-semibold mb-3">
                {currentMonthDue ? currentMonthDue.amount : (amount || '—')}
              </p>
              {!currentMonthDue && (
                <form onSubmit={handleMarkPaid} className="grid gap-2">
                  <input
                    required
                    type="number"
                    placeholder={t(lang, 'amount')}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:border-white/40"
                  />
                  <input
                    placeholder={t(lang, 'paymentProof')}
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:border-white/40"
                  />
                  <button className="bg-emerald-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-emerald-600 transition">
                    {t(lang, 'markPaid')}
                  </button>
                </form>
              )}
              {currentMonthDue && (
                <p className="text-sm font-medium text-white/90">
                  {currentMonthDue.status === 'confirmed' ? t(lang, 'duesConfirmed') : t(lang, 'duesMarkedPaid')}
                </p>
              )}
            </div>

            {dues.map((d) => (
              <div key={d.id} className="bg-white border border-sand-200 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-forest-900">{d.month}</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    d.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {d.status === 'confirmed' ? t(lang, 'duesConfirmed') : d.status === 'marked_paid' ? t(lang, 'duesMarkedPaid') : t(lang, 'duesPending')}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'events' &&
          (events.length ? (
            events.map((ev) => (
              <div key={ev.id} className="bg-white border border-sand-200 border-l-4 border-l-indigo-400 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-forest-900">{ev.title}</h3>
                  <span className="text-xs text-indigo-700 bg-indigo-100 rounded-full px-2 py-0.5">{ev.event_date}</span>
                </div>
                {ev.description && <p className="text-sm text-forest-700">{ev.description}</p>}
              </div>
            ))
          ) : (
            <Empty lang={lang} />
          ))}

        {tab === 'documents' &&
          (documents.length ? (
            documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-sand-200 border-l-4 border-l-orange-400 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition"
              >
                <span className="text-sm font-medium text-forest-900">{doc.title}</span>
                <Download size={16} className="text-orange-600" />
              </a>
            ))
          ) : (
            <Empty lang={lang} />
          ))}

        {tab === 'polls' && (
          <div className="grid gap-4">
            {activePolls.length ? (
              activePolls.map((p) => {
                const myVote = pollVotes.find((v) => v.poll_id === p.id && v.resident_id === profile?.id)
                const votesForPoll = pollVotes.filter((v) => v.poll_id === p.id)
                return (
                  <div key={p.id} className="bg-white border border-sand-200 border-l-4 border-l-cyan-400 rounded-xl p-4 grid gap-2">
                    <h3 className="font-medium text-forest-900">{p.question}</h3>
                    {p.options.map((opt, i) => {
                      const count = votesForPoll.filter((v) => v.option_index === i).length
                      return (
                        <button
                          key={i}
                          disabled={!!myVote}
                          onClick={() => votePoll(p.id, i)}
                          className={`text-left text-sm rounded-lg px-3 py-2 border transition ${
                            myVote?.option_index === i
                              ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                              : 'border-sand-200 hover:bg-sand-50 text-forest-800'
                          } ${myVote ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {opt} {myVote && <span className="text-xs text-forest-400">· {count} {t(lang, 'votes')}</span>}
                        </button>
                      )
                    })}
                  </div>
                )
              })
            ) : (
              <Empty lang={lang} />
            )}
          </div>
        )}
        </main>

        <ChatBot />
        {showRules && <RulesPanel onClose={() => setShowRules(false)} />}
      </div>
    </div>
  )
}

function Empty({ lang }: { lang: 'en' | 'ur' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white/70 backdrop-blur border border-dashed border-sand-300 rounded-2xl">
      <span className="bg-sand-100 text-forest-400 rounded-full p-3 mb-3">
        <Inbox size={22} />
      </span>
      <p className="text-sm text-forest-500">{t(lang, 'noData')}</p>
    </div>
  )
}
