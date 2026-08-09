import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Lang } from '../translations'

export type Role = 'resident' | 'committee'
export type BlockId = 'A' | 'B' | 'C'

export interface Profile {
  id: string
  full_name: string
  role: Role
  block_id: BlockId
  house_number: string | null
  approved: boolean
}

export interface Notice {
  id: string
  block_id: BlockId
  title: string
  body: string
  pinned: boolean
  created_at: string
}

export interface NewsItem {
  id: string
  block_id: BlockId
  title: string
  body: string
  created_at: string
}

export interface StatusItem {
  id: string
  block_id: BlockId
  label: string
  status: string
  updated_at: string
}

export interface BlockInfo {
  id: BlockId
  name: string
  namaz_venue: string
  namaz_fajr: string
  namaz_zuhr: string
  namaz_asr: string
  namaz_maghrib: string
  namaz_isha: string
}

export interface Complaint {
  id: string
  block_id: BlockId
  resident_id: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  committee_reply: string | null
  created_at: string
}

export interface Due {
  id: string
  block_id: BlockId
  resident_id: string
  month: string
  amount: number
  status: 'pending' | 'marked_paid' | 'confirmed'
  proof_note: string | null
  created_at: string
}

export interface EventItem {
  id: string
  block_id: BlockId
  title: string
  description: string | null
  event_date: string
  created_at: string
}

export interface DocumentItem {
  id: string
  block_id: BlockId
  title: string
  file_url: string
  created_at: string
}

export interface Alert {
  id: string
  block_id: BlockId
  title: string
  message: string
  active: boolean
  created_at: string
}

export interface Poll {
  id: string
  block_id: BlockId
  question: string
  options: string[]
  closed: boolean
  created_at: string
}

export interface PollVote {
  id: string
  poll_id: string
  resident_id: string
  option_index: number
}

interface AppState {
  lang: Lang
  setLang: (l: Lang) => void
  role: Role | null
  selectedBlock: BlockId | null
  setSelectedBlock: (b: BlockId | null) => void
  setRole: (r: Role | null) => void
  profile: Profile | null
  loadingProfile: boolean
  notices: Notice[]
  news: NewsItem[]
  liveStatus: StatusItem[]
  complaints: Complaint[]
  pendingResidents: Profile[]
  approvedResidents: Profile[]
  blockInfo: BlockInfo | null
  updateNamazTiming: (field: 'namaz_fajr' | 'namaz_zuhr' | 'namaz_asr' | 'namaz_maghrib' | 'namaz_isha', value: string) => Promise<void>
  dues: Due[]
  allDues: Due[]
  events: EventItem[]
  documents: DocumentItem[]
  activeAlert: Alert | null
  polls: Poll[]
  pollVotes: PollVote[]
  markDuePaid: (month: string, amount: number, proofNote: string) => Promise<void>
  confirmDue: (id: string) => Promise<void>
  createEvent: (title: string, description: string, date: string) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  uploadDocument: (title: string, file: File) => Promise<void>
  deleteDocument: (id: string, fileUrl: string) => Promise<void>
  createAlert: (title: string, message: string) => Promise<void>
  dismissAlert: (id: string) => Promise<void>
  createPoll: (question: string, options: string[]) => Promise<void>
  votePoll: (pollId: string, optionIndex: number) => Promise<void>
  closePoll: (id: string) => Promise<void>
  refreshBlockData: () => Promise<void>
  signOutAll: () => Promise<void>
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('kr_lang') as Lang) || 'en')
  const [role, setRole] = useState<Role | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<BlockId | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const [notices, setNotices] = useState<Notice[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [liveStatus, setLiveStatus] = useState<StatusItem[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [pendingResidents, setPendingResidents] = useState<Profile[]>([])
  const [approvedResidents, setApprovedResidents] = useState<Profile[]>([])
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null)
  const [dues, setDues] = useState<Due[]>([])
  const [allDues, setAllDues] = useState<Due[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null)
  const [polls, setPolls] = useState<Poll[]>([])
  const [pollVotes, setPollVotes] = useState<PollVote[]>([])

  function setLang(l: Lang) {
    localStorage.setItem('kr_lang', l)
    setLangState(l)
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    async function loadSession() {
      setLoadingProfile(true)
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      if (!user) {
        setProfile(null)
        setLoadingProfile(false)
        return
      }
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!error && data) {
        setProfile(data as Profile)
        setRole(data.role)
        setSelectedBlock(data.block_id)
      }
      setLoadingProfile(false)
    }
    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadSession()
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function refreshBlockData() {
    if (!selectedBlock) return

    const [noticesRes, newsRes, statusRes, blockRes, eventsRes, documentsRes, alertRes, pollsRes] = await Promise.all([
      supabase.from('notices').select('*').eq('block_id', selectedBlock).order('pinned', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('news').select('*').eq('block_id', selectedBlock).order('created_at', { ascending: false }),
      supabase.from('live_status').select('*').eq('block_id', selectedBlock).order('label'),
      supabase.from('blocks').select('*').eq('id', selectedBlock).single(),
      supabase.from('events').select('*').eq('block_id', selectedBlock).order('event_date', { ascending: true }),
      supabase.from('documents').select('*').eq('block_id', selectedBlock).order('created_at', { ascending: false }),
      supabase.from('alerts').select('*').eq('block_id', selectedBlock).eq('active', true).order('created_at', { ascending: false }).limit(1),
      supabase.from('polls').select('*').eq('block_id', selectedBlock).order('created_at', { ascending: false }),
    ])
    if (noticesRes.data) setNotices(noticesRes.data as Notice[])
    if (newsRes.data) setNews(newsRes.data as NewsItem[])
    if (statusRes.data) setLiveStatus(statusRes.data as StatusItem[])
    if (blockRes.data) setBlockInfo(blockRes.data as BlockInfo)
    if (eventsRes.data) setEvents(eventsRes.data as EventItem[])
    if (documentsRes.data) setDocuments(documentsRes.data as DocumentItem[])
    setActiveAlert(alertRes.data && alertRes.data.length ? (alertRes.data[0] as Alert) : null)
    if (pollsRes.data) setPolls(pollsRes.data as Poll[])

    const pollIds = (pollsRes.data ?? []).map((p: any) => p.id)
    if (pollIds.length) {
      const { data: votes } = await supabase.from('poll_votes').select('*').in('poll_id', pollIds)
      if (votes) setPollVotes(votes as PollVote[])
    } else {
      setPollVotes([])
    }

    if (profile?.role === 'resident') {
      const { data } = await supabase
        .from('complaints')
        .select('*')
        .eq('resident_id', profile.id)
        .order('created_at', { ascending: false })
      if (data) setComplaints(data as Complaint[])

      const { data: myDues } = await supabase
        .from('dues')
        .select('*')
        .eq('resident_id', profile.id)
        .order('month', { ascending: false })
      if (myDues) setDues(myDues as Due[])
    }

    if (profile?.role === 'committee') {
      const { data: allComplaints } = await supabase
        .from('complaints')
        .select('*')
        .eq('block_id', selectedBlock)
        .order('created_at', { ascending: false })
      if (allComplaints) setComplaints(allComplaints as Complaint[])

      const { data: residents } = await supabase
        .from('profiles')
        .select('*')
        .eq('block_id', selectedBlock)
        .eq('role', 'resident')
      if (residents) {
        setApprovedResidents((residents as Profile[]).filter((r) => r.approved))
        setPendingResidents((residents as Profile[]).filter((r) => !r.approved))
      }

      const { data: blockDues } = await supabase
        .from('dues')
        .select('*')
        .eq('block_id', selectedBlock)
        .order('month', { ascending: false })
      if (blockDues) setAllDues(blockDues as Due[])
    }
  }

  useEffect(() => {
    if (selectedBlock && profile) {
      refreshBlockData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlock, profile])

  async function updateNamazTiming(
    field: 'namaz_fajr' | 'namaz_zuhr' | 'namaz_asr' | 'namaz_maghrib' | 'namaz_isha',
    value: string,
  ) {
    if (!selectedBlock) return
    await supabase.from('blocks').update({ [field]: value }).eq('id', selectedBlock)
    refreshBlockData()
  }

  async function markDuePaid(month: string, amount: number, proofNote: string) {
    if (!profile || !selectedBlock) return
    await supabase.from('dues').upsert(
      {
        block_id: selectedBlock,
        resident_id: profile.id,
        month,
        amount,
        status: 'marked_paid',
        proof_note: proofNote,
      },
      { onConflict: 'resident_id,month' },
    )
    refreshBlockData()
  }

  async function confirmDue(id: string) {
    await supabase.from('dues').update({ status: 'confirmed', confirmed_at: new Date().toISOString() }).eq('id', id)
    refreshBlockData()
  }

  async function createEvent(title: string, description: string, date: string) {
    if (!selectedBlock) return
    await supabase.from('events').insert({ block_id: selectedBlock, title, description, event_date: date })
    refreshBlockData()
  }

  async function deleteEvent(id: string) {
    await supabase.from('events').delete().eq('id', id)
    refreshBlockData()
  }

  async function uploadDocument(title: string, file: File) {
    if (!selectedBlock) return
    const path = `${selectedBlock}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
    if (uploadError) throw uploadError
    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path)
    await supabase.from('documents').insert({ block_id: selectedBlock, title, file_url: urlData.publicUrl })
    refreshBlockData()
  }

  async function deleteDocument(id: string, _fileUrl: string) {
    await supabase.from('documents').delete().eq('id', id)
    refreshBlockData()
  }

  async function createAlert(title: string, message: string) {
    if (!selectedBlock) return
    // deactivate any previous alert for this block, then create the new one
    await supabase.from('alerts').update({ active: false }).eq('block_id', selectedBlock).eq('active', true)
    await supabase.from('alerts').insert({ block_id: selectedBlock, title, message, active: true })
    refreshBlockData()
  }

  async function dismissAlert(id: string) {
    await supabase.from('alerts').update({ active: false }).eq('id', id)
    refreshBlockData()
  }

  async function createPoll(question: string, options: string[]) {
    if (!selectedBlock) return
    await supabase.from('polls').insert({ block_id: selectedBlock, question, options })
    refreshBlockData()
  }

  async function votePoll(pollId: string, optionIndex: number) {
    if (!profile) return
    await supabase.from('poll_votes').insert({ poll_id: pollId, resident_id: profile.id, option_index: optionIndex })
    refreshBlockData()
  }

  async function closePoll(id: string) {
    await supabase.from('polls').update({ closed: true }).eq('id', id)
    refreshBlockData()
  }

  async function signOutAll() {
    await supabase.auth.signOut()
    setProfile(null)
    setRole(null)
    setSelectedBlock(null)
    setNotices([])
    setNews([])
    setLiveStatus([])
    setComplaints([])
    setDues([])
    setAllDues([])
    setEvents([])
    setDocuments([])
    setActiveAlert(null)
    setPolls([])
    setPollVotes([])
  }

  const value = useMemo(
    () => ({
      lang,
      setLang,
      role,
      setRole,
      selectedBlock,
      setSelectedBlock,
      profile,
      loadingProfile,
      notices,
      news,
      liveStatus,
      complaints,
      pendingResidents,
      approvedResidents,
      blockInfo,
      updateNamazTiming,
      dues,
      allDues,
      events,
      documents,
      activeAlert,
      polls,
      pollVotes,
      markDuePaid,
      confirmDue,
      createEvent,
      deleteEvent,
      uploadDocument,
      deleteDocument,
      createAlert,
      dismissAlert,
      createPoll,
      votePoll,
      closePoll,
      refreshBlockData,
      signOutAll,
    }),
    [
      lang,
      role,
      selectedBlock,
      profile,
      loadingProfile,
      notices,
      news,
      liveStatus,
      complaints,
      pendingResidents,
      approvedResidents,
      blockInfo,
      dues,
      allDues,
      events,
      documents,
      activeAlert,
      polls,
      pollVotes,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
