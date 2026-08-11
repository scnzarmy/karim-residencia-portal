import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { t } from '../translations'
import { supabase } from '../../lib/supabaseClient'

export default function ResetPasswordPage() {
  const { lang } = useApp()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(t(lang, 'passwordUpdated'))
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 px-6">
      <div className="max-w-sm w-full">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="bg-forest-600 text-white rounded-lg p-1.5">
            <Building2 size={16} />
          </span>
          <span className="font-display font-semibold text-forest-900 text-sm">{t(lang, 'appName')}</span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-forest-900 mb-2 text-center">{t(lang, 'resetPassword')}</h1>
        <p className="text-sm text-forest-500 mb-6 text-center">{t(lang, 'resetPasswordHint')}</p>

        <form onSubmit={handleSubmit} className="bg-white border border-sand-200 rounded-2xl shadow-sm p-6 grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="text-forest-700">{t(lang, 'password')}</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-sand-300 rounded-lg px-3 py-2 outline-none focus:border-forest-400"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="bg-forest-700 text-white rounded-lg py-2.5 font-medium hover:bg-forest-800 transition disabled:opacity-50"
          >
            {t(lang, 'updatePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
