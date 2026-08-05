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

  function setLang(l: Lang) {
    localStorage.setItem('kr_lang', l)
    setLangState(l)
  }

  // Apply RTL direction to <html> whenever language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  // Load the logged-in user's profile (role/block/approval) on session change
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

    const [noticesRes, newsRes, statusRes] = await Promise.all([
      supabase.from('notices').select('*').eq('block_id', selectedBlock).order('pinned', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('news').select('*').eq('block_id', selectedBlock).order('created_at', { ascending: false }),
      supabase.from('live_status').select('*').eq('block_id', selectedBlock).order('label'),
    ])
    if (noticesRes.data) setNotices(noticesRes.data as Notice[])
    if (newsRes.data) setNews(newsRes.data as NewsItem[])
    if (statusRes.data) setLiveStatus(statusRes.data as StatusItem[])

    if (profile?.role === 'resident') {
      const { data } = await supabase
        .from('complaints')
        .select('*')
        .eq('resident_id', profile.id)
        .order('created_at', { ascending: false })
      if (data) setComplaints(data as Complaint[])
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
    }
  }

  useEffect(() => {
    if (selectedBlock && profile) {
      refreshBlockData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlock, profile])

  async function signOutAll() {
    await supabase.auth.signOut()
    setProfile(null)
    setRole(null)
    setSelectedBlock(null)
    setNotices([])
    setNews([])
    setLiveStatus([])
    setComplaints([])
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
      refreshBlockData,
      signOutAll,
    }),
    [lang, role, selectedBlock, profile, loadingProfile, notices, news, liveStatus, complaints, pendingResidents, approvedResidents],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
