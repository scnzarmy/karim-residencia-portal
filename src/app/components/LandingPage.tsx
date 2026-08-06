import { useNavigate } from 'react-router-dom'
import { Users, ShieldCheck, Globe, Building2 } from 'lucide-react'
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
    <div className="kr-skyline-bg min-h-screen flex flex-col bg-sand-50">
      <header className="flex items-center justify-between px-6 py-5 max-w-3xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="bg-forest-600 text-white rounded-lg p-1.5">
            <Building2 size={18} />
          </span>
          <span className="font-display font-semibold text-forest-900 text-sm tracking-wide">
            {t(lang, 'appName')}
          </span>
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
          className="flex items-center gap-2 text-sm text-forest-700 border border-forest-200 bg-white rounded-full px-4 py-1.5 hover:bg-forest-50 transition"
        >
          <Globe size={15} />
          {lang === 'en' ? 'اردو' : 'English'}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="max-w-md w-full text-center">
          <span className="inline-flex items-center justify-center bg-forest-100 text-forest-700 rounded-2xl p-4 mb-6">
            <Building2 size={32} />
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-forest-900 mb-3 leading-tight">
            {t(lang, 'appName')}
          </h1>
          <p className="text-forest-600 mb-10 text-base">{t(lang, 'tagline')}</p>

          <p className="text-xs uppercase tracking-widest text-forest-500 mb-4 font-medium">
            {t(lang, 'selectRole')}
          </p>

          <div className="grid gap-3">
            <button
              onClick={() => choose('resident')}
              className="group flex items-center gap-4 bg-white border border-sand-200 rounded-2xl p-5 text-left hover:border-forest-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="bg-forest-100 text-forest-700 rounded-xl p-3 group-hover:bg-forest-600 group-hover:text-white transition-colors">
                <Users size={22} />
              </span>
              <span className="font-medium text-forest-900">{t(lang, 'resident')}</span>
            </button>

            <button
              onClick={() => choose('committee')}
              className="group flex items-center gap-4 bg-white border border-sand-200 rounded-2xl p-5 text-left hover:border-forest-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="bg-forest-100 text-forest-700 rounded-xl p-3 group-hover:bg-forest-600 group-hover:text-white transition-colors">
                <ShieldCheck size={22} />
              </span>
              <span className="font-medium text-forest-900">{t(lang, 'committee')}</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-forest-400 pb-6">
        {t(lang, 'appName')}
      </footer>
    </div>
  )
}
