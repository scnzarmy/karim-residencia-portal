import { useNavigate } from 'react-router-dom'
import { Users, ShieldCheck, Globe } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../translations'
import { Role } from '../context/AppContext'

export default function LandingPage() {
  const { lang, setLang, setRole } = useApp()
  const navigate = useNavigate()

  function choose(role: Role) {
    setRole(role)
    navigate('/select-block')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50 px-6">
      <button
        onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
        className="absolute top-6 right-6 flex items-center gap-2 text-sm text-forest-700 border border-forest-200 bg-white rounded-full px-4 py-2 hover:bg-forest-50 transition"
      >
        <Globe size={16} />
        {lang === 'en' ? 'اردو' : 'English'}
      </button>

      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-4xl font-semibold text-forest-900 mb-2">{t(lang, 'appName')}</h1>
        <p className="text-forest-600 mb-10">{t(lang, 'tagline')}</p>

        <p className="text-sm text-forest-700 mb-4">{t(lang, 'selectRole')}</p>

        <div className="grid gap-4">
          <button
            onClick={() => choose('resident')}
            className="flex items-center gap-4 bg-white border border-sand-200 rounded-2xl p-5 text-left hover:border-forest-400 hover:shadow-sm transition"
          >
            <span className="bg-forest-100 text-forest-700 rounded-xl p-3">
              <Users size={22} />
            </span>
            <span>
              <span className="block font-medium text-forest-900">{t(lang, 'resident')}</span>
            </span>
          </button>

          <button
            onClick={() => choose('committee')}
            className="flex items-center gap-4 bg-white border border-sand-200 rounded-2xl p-5 text-left hover:border-forest-400 hover:shadow-sm transition"
          >
            <span className="bg-forest-100 text-forest-700 rounded-xl p-3">
              <ShieldCheck size={22} />
            </span>
            <span>
              <span className="block font-medium text-forest-900">{t(lang, 'committee')}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
