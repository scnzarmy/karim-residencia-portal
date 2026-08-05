import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50 px-6">
      <div className="max-w-sm w-full">
        <button onClick={() => navigate('/select-block')} className="flex items-center gap-1 text-forest-600 text-sm mb-6">
          <ArrowLeft size={16} /> {t(lang, 'back')}
        </button>

        <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6 text-center">
          {mode === 'login' ? t(lang, 'login') : t(lang, 'register')}
        </h2>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="bg-white border border-sand-200 rounded-2xl p-6 grid gap-4">
          {mode === 'register' && role === 'resident' && (
            <>
              <Field label={t(lang, 'fullName')} value={fullName} onChange={setFullName} required />
              <Field label={t(lang, 'houseNumber')} value={houseNumber} onChange={setHouseNumber} required />
            </>
          )}
          <Field label={t(lang, 'email')} type="email" value={email} onChange={setEmail} required />
          <Field label={t(lang, 'password')} type="password" value={password} onChange={setPassword} required />

          <button
            type="submit"
            disabled={busy}
            className="mt-2 bg-forest-600 text-white rounded-xl py-2.5 font-medium hover:bg-forest-700 transition disabled:opacity-50"
          >
            {mode === 'login' ? t(lang, 'login') : t(lang, 'register')}
          </button>
        </form>

        {role === 'resident' && (
          <p className="text-center text-sm text-forest-600 mt-4">
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
        className="border border-sand-200 rounded-lg px-3 py-2 focus:border-forest-400"
      />
    </label>
  )
}
