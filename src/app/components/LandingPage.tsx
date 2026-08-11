import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
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
    <div
      className="min-h-screen flex flex-col relative bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/building-secondary.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-forest-900/55 to-black/70" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-5 max-w-3xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="bg-white/15 backdrop-blur text-white rounded-lg p-1.5">
              <Building2 size={18} />
            </span>
            <span className="font-display font-semibold text-white text-sm tracking-wide">
              {t(lang, 'appName')}
            </span>
          </div>
          <button
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-2 text-sm text-white border border-white/30 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 hover:bg-white/20 transition"
          >
            <Globe size={15} />
            {lang === 'en' ? 'اردو' : 'English'}
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <motion.div
            className="max-w-md w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center justify-center bg-gradient-to-br from-forest-500 to-forest-700 text-white rounded-2xl p-4 mb-6 shadow-xl shadow-black/30"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <Building2 size={32} />
            </motion.span>

            <motion.h1
              className="font-display text-4xl sm:text-5xl font-semibold text-white mb-3 leading-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {t(lang, 'appName')}
            </motion.h1>

            <motion.p
              className="text-white/85 mb-10 text-base drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              {t(lang, 'tagline')}
            </motion.p>

            <motion.p
              className="text-xs uppercase tracking-widest text-white/70 mb-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {t(lang, 'selectRole')}
            </motion.p>

            <motion.div
              className="grid gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.button
                onClick={() => choose('resident')}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center gap-4 bg-white/95 backdrop-blur rounded-2xl p-5 text-left shadow-lg hover:shadow-2xl"
              >
                <span className="bg-blue-100 text-blue-700 rounded-xl p-3">
                  <Users size={22} />
                </span>
                <span className="font-medium text-forest-900">{t(lang, 'resident')}</span>
              </motion.button>

              <motion.button
                onClick={() => choose('committee')}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center gap-4 bg-white/95 backdrop-blur rounded-2xl p-5 text-left shadow-lg hover:shadow-2xl"
              >
                <span className="bg-forest-100 text-forest-700 rounded-xl p-3">
                  <ShieldCheck size={22} />
                </span>
                <span className="font-medium text-forest-900">{t(lang, 'committee')}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </main>

        <footer className="text-center text-xs text-white/50 pb-6">{t(lang, 'appName')}</footer>
      </div>
    </div>
  )
}
