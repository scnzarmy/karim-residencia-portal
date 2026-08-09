import { useState, useEffect, useRef } from 'react'
import {
  LogOut,
  Pin,
  Trash2,
  Check,
  X,
  LayoutGrid,
  Users,
  UserPlus,
  Bell,
  Newspaper,
  Activity,
  MessageSquareWarning,
  Moon,
  Wallet,
  CalendarDays,
  FileText,
  AlertTriangle,
  Vote,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { t } from '../translations'
import { supabase } from '../../lib/supabaseClient'

const TABS = [
  { key: 'overview', icon: LayoutGrid, bg: 'bg-forest-100', fg: 'text-forest-700' },
  { key: 'residentManagement', icon: Users, bg: 'bg-sky-100', fg: 'text-sky-700' },
  { key: 'pendingRequests', icon: UserPlus, bg: 'bg-amber-100', fg: 'text-amber-700' },
  { key: 'noticeBoard', icon: Bell, bg: 'bg-forest-100', fg: 'text-forest-700' },
  { key: 'newsUpdates', icon: Newspaper, bg: 'bg-sky-100', fg: 'text-sky-700' },
  { key: 'liveStatus', icon: Activity, bg: 'bg-purple-100', fg: 'text-purple-700' },
  { key: 'namazTimings', icon: Moon, bg: 'bg-purple-100', fg: 'text-purple-700' },
  { key: 'dues', icon: Wallet, bg: 'bg-emerald-100', fg: 'text-emerald-700' },
  { key: 'events', icon: CalendarDays, bg: 'bg-indigo-100', fg: 'text-indigo-700' },
  { key: 'documents', icon: FileText, bg: 'bg-orange-100', fg: 'text-orange-700' },
  { key: 'alerts', icon: AlertTriangle, bg: 'bg-rose-100', fg: 'text-rose-700' },
  { key: 'polls', icon: Vote, bg: 'bg-cyan-100', fg: 'text-cyan-700' },
  { key: 'complaints', icon: MessageSquareWarning, bg: 'bg-rose-100', fg: 'text-rose-700' },
] as const

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const PRAYERS = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'] as const

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
    blockInfo,
    updateNamazTiming,
    allDues,
    events,
    documents,
    activeAlert,
    polls,
    pollVotes,
    confirmDue,
    createEvent,
    deleteEvent,
    uploadDocument,
    deleteDocument,
    createAlert,
    dismissAlert,
    createPoll,
    closePoll,
    signOutAll,
    refreshBlockData,
  } = useApp()
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('overview')
  const [prayerDraft, setPrayerDraft] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [docTitle, setDocTitle] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (blockInfo) {
      setPrayerDraft({
        fajr: blockInfo.namaz_fajr,
        zuhr: blockInfo.namaz_zuhr,
        asr: blockInfo.namaz_asr,
        maghrib: blockInfo.namaz_maghrib,
        isha: blockInfo.namaz_isha,
      })
    }
  }, [blockInfo])

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

  async function savePrayerTimes() {
    for (const p of PRAYERS) {
      await updateNamazTiming(`namaz_${p}` as any, prayerDraft[p] ?? '')
    }
    toast.success(t(lang, 'submit'))
  }

  async function handleCreateEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value
    const date = (form.elements.namedItem('date') as HTMLInputElement).value
    await createEvent(title, description, date)
    form.reset()
  }

  async function handleUploadDocument(e: React.FormEvent) {
    e.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file || !docTitle) return
    setUploading(true)
    try {
      await uploadDocument(docTitle, file)
      toast.success(t(lang, 'submit'))
      setDocTitle('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed')
    }
    setUploading(false)
  }

  async function handleCreateAlert(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value
    await createAlert(title, message)
    form.reset()
    toast.success(t(lang, 'sendAlert'))
  }

  async function handleCreatePoll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const question = (form.elements.namedItem('question') as HTMLInputElement).value
    const optionsRaw = (form.elements.namedItem('options') as HTMLTextAreaElement).value
    const options = optionsRaw.split('\n').map((o) => o.trim()).filter(Boolean)
    if (options.length < 2) {
      toast.error('Add at least 2 options')
      return
    }
    await createPoll(question, options)
    form.reset()
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <header
        className="relative bg-cover bg-center px-5 pt-5 pb-3 sticky top-0 z-10"
        style={{ backgroundImage: "url('/building-secondary.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/85 to-forest-800/90" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/70">{t(lang, 'committee')}</p>
              <h1 className="font-display text-xl font-semibold text-white">
                {t(lang, 'appName')} · {selectedBlock}
              </h1>
            </div>
            <button onClick={signOutAll} className="text-white/90" aria-label={t(lang, 'logout')}>
              <LogOut size={18} />
            </button>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-1">
            {TABS.map(({ key, icon: Icon, bg, fg }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${
                  tab === key ? 'bg-white text-forest-800' : `${bg} ${fg}`
                }`}
              >
                <Icon size={13} />
                {t(lang, key)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto grid gap-4">
        {tab === 'overview' && (
          <div className="grid grid-cols-3 gap-3">
            <StatCard label={t(lang, 'residentManagement')} value={approvedResidents.length} bg="bg-sky-100" fg="text-sky-700" />
            <StatCard label={t(lang, 'pendingRequests')} value={pendingResidents.length} bg="bg-amber-100" fg="text-amber-700" />
            <StatCard label={t(lang, 'noticeBoard')} value={notices.length} bg="bg-forest-100" fg="text-forest-700" />
          </div>
        )}

        {tab === 'residentManagement' && (
          <div className="grid grid-cols-2 gap-3">
            {approvedResidents.length ? (
              approvedResidents.map((r) => (
                <div key={r.id} className="bg-white border border-sand-200 rounded-xl p-4 flex flex-col items-center text-center gap-2">
                  <span className="bg-sky-100 text-sky-700 rounded-full w-11 h-11 flex items-center justify-center font-medium text-sm">
                    {initials(r.full_name)}
                  </span>
                  <div>
                    <p className="font-medium text-forest-900 text-sm">{r.full_name}</p>
                    <p className="text-xs text-forest-500">{r.house_number}</p>
                  </div>
                  <button onClick={() => removeResident(r.id)} className="text-red-600">
                    <Trash2 size={14} />
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
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-100 text-amber-700 rounded-full w-9 h-9 flex items-center justify-center font-medium text-xs">
                      {initials(r.full_name)}
                    </span>
                    <div>
                      <p className="font-medium text-forest-900 text-sm">{r.full_name}</p>
                      <p className="text-xs text-forest-500">{r.house_number}</p>
                    </div>
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
              <div key={n.id} className="bg-white border border-sand-200 border-l-4 border-l-forest-400 rounded-xl p-4">
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
              <div key={n.id} className="bg-white border border-sand-200 border-l-4 border-l-sky-400 rounded-xl p-4">
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
                <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">{s.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'namazTimings' && (
          <div className="bg-white border border-sand-200 border-l-4 border-l-purple-400 rounded-xl p-4 grid gap-3">
            <p className="text-forest-900 font-medium">{blockInfo?.namaz_venue ?? 'Masjid Ayesha'}</p>
            <div className="grid grid-cols-2 gap-2">
              {PRAYERS.map((p) => (
                <label key={p} className="grid gap-1 text-xs">
                  <span className="text-purple-800 font-medium">{t(lang, p)}</span>
                  <input
                    value={prayerDraft[p] ?? ''}
                    onChange={(e) => setPrayerDraft((prev) => ({ ...prev, [p]: e.target.value }))}
                    placeholder="e.g. 5:15 AM"
                    className="border border-sand-200 rounded-lg px-2 py-1.5 text-sm"
                  />
                </label>
              ))}
            </div>
            <button onClick={savePrayerTimes} className="bg-forest-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-forest-700 transition">
              {t(lang, 'submit')}
            </button>
          </div>
        )}

        {tab === 'dues' && (
          <div className="grid gap-2">
            {allDues.length ? (
              allDues.map((d) => (
                <div key={d.id} className="bg-white border border-sand-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-forest-900">{d.month}</p>
                    <p className="text-xs text-forest-500">
                      {t(lang, 'amount')}: {d.amount} {d.proof_note ? `· ${d.proof_note}` : ''}
                    </p>
                  </div>
                  {d.status === 'confirmed' ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{t(lang, 'duesConfirmed')}</span>
                  ) : (
                    <button
                      onClick={() => confirmDue(d.id)}
                      className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition"
                    >
                      {t(lang, 'confirm')}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <Empty lang={lang} />
            )}
          </div>
        )}

        {tab === 'events' && (
          <div className="grid gap-4">
            <form onSubmit={handleCreateEvent} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
              <input name="title" required placeholder={t(lang, 'subject')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <input name="date" required type="date" className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <textarea name="description" placeholder={t(lang, 'description')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <button className="bg-forest-600 text-white rounded-lg py-2 text-sm font-medium">{t(lang, 'newEvent')}</button>
            </form>
            {events.map((ev) => (
              <div key={ev.id} className="bg-white border border-sand-200 border-l-4 border-l-indigo-400 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-forest-900">{ev.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-700 bg-indigo-100 rounded-full px-2 py-0.5">{ev.event_date}</span>
                    <button onClick={() => deleteEvent(ev.id)} className="text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {ev.description && <p className="text-sm text-forest-700">{ev.description}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'documents' && (
          <div className="grid gap-4">
            <form onSubmit={handleUploadDocument} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
              <input
                required
                placeholder={t(lang, 'documentTitle')}
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="border border-sand-200 rounded-lg px-3 py-2 text-sm"
              />
              <input ref={fileInputRef} required type="file" accept="application/pdf" className="text-sm" />
              <button disabled={uploading} className="flex items-center justify-center gap-2 bg-forest-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50">
                <Upload size={14} /> {uploading ? '…' : t(lang, 'uploadDocument')}
              </button>
            </form>
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white border border-sand-200 border-l-4 border-l-orange-400 rounded-xl p-4 flex items-center justify-between">
                <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-forest-900 underline">
                  {doc.title}
                </a>
                <button onClick={() => deleteDocument(doc.id, doc.file_url)} className="text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'alerts' && (
          <div className="grid gap-4">
            <form onSubmit={handleCreateAlert} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
              <input name="title" required placeholder={t(lang, 'alertTitle')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <textarea name="message" required placeholder={t(lang, 'alertMessage')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <button className="flex items-center justify-center gap-2 bg-rose-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-rose-700 transition">
                <AlertTriangle size={14} /> {t(lang, 'sendAlert')}
              </button>
            </form>
            {activeAlert && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-rose-900 text-sm">{activeAlert.title}</p>
                  <p className="text-xs text-rose-700">{activeAlert.message}</p>
                </div>
                <button onClick={() => dismissAlert(activeAlert.id)} className="text-xs text-rose-700 underline">
                  {t(lang, 'dismiss')}
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'polls' && (
          <div className="grid gap-4">
            <form onSubmit={handleCreatePoll} className="bg-white border border-sand-200 rounded-xl p-4 grid gap-2">
              <input name="question" required placeholder={t(lang, 'question')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm" />
              <textarea name="options" required placeholder={t(lang, 'options')} className="border border-sand-200 rounded-lg px-3 py-2 text-sm min-h-[80px]" />
              <button className="bg-forest-600 text-white rounded-lg py-2 text-sm font-medium">{t(lang, 'newPoll')}</button>
            </form>
            {polls.map((p) => {
              const votesForPoll = pollVotes.filter((v) => v.poll_id === p.id)
              return (
                <div key={p.id} className="bg-white border border-sand-200 border-l-4 border-l-cyan-400 rounded-xl p-4 grid gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-forest-900">{p.question}</h3>
                    {p.closed && <span className="text-xs bg-sand-100 text-forest-600 rounded-full px-2 py-0.5">{t(lang, 'pollClosed')}</span>}
                  </div>
                  {p.options.map((opt, i) => {
                    const count = votesForPoll.filter((v) => v.option_index === i).length
                    return (
                      <div key={i} className="flex items-center justify-between text-sm text-forest-700 bg-sand-50 rounded-lg px-3 py-1.5">
                        <span>{opt}</span>
                        <span className="text-xs text-forest-500">{count} {t(lang, 'votes')}</span>
                      </div>
                    )
                  })}
                  {!p.closed && (
                    <button onClick={() => closePoll(p.id)} className="text-xs text-rose-600 underline justify-self-start">
                      {t(lang, 'closePoll')}
                    </button>
                  )}
                </div>
              )
            })}
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
    <div className="bg-white border border-sand-200 border-l-4 border-l-rose-400 rounded-xl p-4 grid gap-2">
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

function StatCard({ label, value, bg, fg }: { label: string; value: number; bg: string; fg: string }) {
  return (
    <div className={`${bg} rounded-xl p-4 text-center`}>
      <p className={`text-2xl font-display font-semibold ${fg}`}>{value}</p>
      <p className="text-xs text-forest-700 mt-1">{label}</p>
    </div>
  )
}

function Empty({ lang }: { lang: 'en' | 'ur' }) {
  return <p className="text-center text-sm text-forest-500 py-10 col-span-2">{t(lang, 'noData')}</p>
}
