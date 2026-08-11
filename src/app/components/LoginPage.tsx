import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { t } from '../translations'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const { lang, role, selectedBlock } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  if (!role || !selectedBlock) {
    navigate('/')
    return null
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    navigate('/dashboard')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error || !data.user) {
      setBusy(false)
      toast.error(error?.message ?? 'Registration failed')
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role: 'resident',
      block_id: selectedBlock,
      house_number: houseNumber,
      approved: false,
    })
    setBusy(false)
    if (profileError) {
      toast.error(profileError.message)
      return
    }
    toast.success(t(lang, 'pendingApproval'))
    setMode('login')
  }

  const isRegister = mode === 'register' && role === 'resident'

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex flex-col px-6 sm:px-12 lg:px-16 py-8">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/select-block')} className="flex items-center gap-1 text-sm text-forest-500 hover:text-forest-700">
            <ArrowLeft size={15} /> {t(lang, 'back')}
          </button>

          {role === 'resident' && (
            <p className="text-sm text-forest-600">
              {mode === 'login' ? (
                <>
                  {t(lang, 'dontHaveAccount')}{' '}
                  <button className="text-forest-800 font-medium underline" onClick={() => setMode('register')}>
                    {t(lang, 'register')}
                  </button>
                </>
              ) : (
                <>
                  {t(lang, 'alreadyHaveAccount')}{' '}
                  <button className="text-forest-800 font-medium underline" onClick={() => setMode('login')}>
                    {t(lang, 'login')}
                  </button>
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto lg:mx-0">
          <div className="flex items-center gap-2 mb-8">
            <span className="bg-forest-600 text-white rounded-lg p-1.5">
              <Building2 size={16} />
            </span>
            <span className="font-display font-semibold text-forest-900 text-sm">{t(lang, 'appName')}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-forest-900 mb-2">
            {isRegister ? t(lang, 'register') : t(lang, 'login')}
          </h1>
          <p className="text-sm text-forest-500 mb-8">
            {isRegister
              ? `${t(lang, 'appName')} — Block ${selectedBlock}`
              : `${t(lang, 'appName')} · ${role === 'committee' ? t(lang, 'committee') : t(lang, 'resident')} · Block ${selectedBlock}`}
          </p>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="grid gap-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <Field label={t(lang, 'fullName')} value={fullName} onChange={setFullName} required />
                <Field label={t(lang, 'houseNumber')} value={houseNumber} onChange={setHouseNumber} required />
              </div>
            )}
            <Field label={t(lang, 'email')} type="email" value={email} onChange={setEmail} required />
            <Field label={t(lang, 'password')} type="password" value={password} onChange={setPassword} required />

            <button
              type="submit"
              disabled={busy}
              className="mt-2 bg-forest-700 text-white rounded-lg py-2.5 font-medium hover:bg-forest-800 transition disabled:opacity-50"
            >
              {mode === 'login' ? t(lang, 'login') : t(lang, 'register')}
            </button>
          </form>
        </div>

        <p className="text-xs text-forest-400 text-center lg:text-left">{t(lang, 'appName')}</p>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <img src="/building-login.jpg" alt="Karim Residencia" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <p className="font-display font-semibold text-lg drop-shadow">{t(lang, 'appName')}</p>
          <p className="text-xs text-white/80 drop-shadow">{t(lang, 'tagline')}</p>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-forest-700">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-sand-300 rounded-lg px-3 py-2 outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
      />
    </label>
  )
}
