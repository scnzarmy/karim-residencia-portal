import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Building } from 'lucide-react'
import { useApp, BlockId } from '../context/AppContext'
import { t } from '../translations'

const BLOCKS: { id: BlockId; labelKey: 'blockA' | 'blockB' | 'blockC'; gradient: string }[] = [
  { id: 'A', labelKey: 'blockA', gradient: 'from-blue-500 to-blue-600' },
  { id: 'B', labelKey: 'blockB', gradient: 'from-amber-500 to-orange-600' },
  { id: 'C', labelKey: 'blockC', gradient: 'from-forest-500 to-forest-700' },
]

export default function BlockSelection() {
  const { lang, setSelectedBlock, role } = useApp()
  const navigate = useNavigate()

  if (!role) {
    navigate('/')
    return null
  }

  function choose(block: BlockId) {
    setSelectedBlock(block)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 to-sand-100 flex items-center justify-center px-6 py-10">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-forest-600 text-sm mb-8">
          <ArrowLeft size={16} /> {t(lang, 'back')}
        </button>

        <motion.h2
          className="font-display text-3xl font-semibold text-forest-900 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t(lang, 'selectBlock')}
        </motion.h2>

        <div className="grid gap-4">
          {BLOCKS.map((b, i) => (
            <motion.button
              key={b.id}
              onClick={() => choose(b.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -6 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden flex items-center gap-4 bg-gradient-to-br ${b.gradient} rounded-2xl p-6 text-left shadow-lg hover:shadow-2xl transition-shadow`}
            >
              <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <span className="absolute right-8 bottom-2 w-12 h-12 rounded-full bg-white/10" />
              <span className="relative bg-white/20 backdrop-blur text-white rounded-xl p-3">
                <Building size={24} />
              </span>
              <span className="relative font-display font-semibold text-white text-lg">{t(lang, b.labelKey)}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
