import { useState } from 'react'
import { X, User } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '../context/AppContext'
import { t } from '../translations'

export default function ProfilePanel({ onClose }: { onClose: () => void }) {
  const { lang, profile, updateProfile } = useApp()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [houseNumber, setHouseNumber] = useState(profile?.house_number ?? '')
  const [busy, setBusy] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    await updateProfile(fullName, houseNumber)
    setBusy(false)
    toast.success(t(lang, 'profileUpdated'))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-30 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-forest-700 to-forest-800 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 backdrop-blur text-white rounded-xl p-2.5">
              <User size={20} />
            </span>
            <h2 className="font-display text-lg font-semibold text-white leading-tight">{t(lang, 'editProfile')}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-white/90 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="text-forest-700">{t(lang, 'fullName')}</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-sand-300 rounded-lg px-3 py-2 outline-none focus:border-forest-400"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-forest-700">{t(lang, 'houseNumber')}</span>
            <input
              required
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className="border border-sand-300 rounded-lg px-3 py-2 outline-none focus:border-forest-400"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="bg-forest-700 text-white rounded-lg py-2.5 font-medium hover:bg-forest-800 transition disabled:opacity-50"
          >
            {t(lang, 'submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
