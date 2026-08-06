import { useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50 px-6">
      <div className="max-w-md w-full">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-forest-600 text-sm mb-8">
          <ArrowLeft size={16} /> {t(lang, 'back')}
        </button>

        <h2 className="font-display text-3xl font-semibold text-forest-900 mb-8 text-center">
          {t(lang, 'selectBlock')}
        </h2>

        <div className="grid gap-4">
          {BLOCKS.map((b) => (
            <button
              key={b.id}
              onClick={() => choose(b.id)}
              className={`relative overflow-hidden flex items-center gap-4 bg-gradient-to-br ${b.gradient} rounded-2xl p-6 text-left hover:-translate-y-0.5 hover:shadow-xl transition-all`}
            >
              <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
              <span className="absolute right-8 bottom-2 w-12 h-12 rounded-full bg-white/10" />
              <span className="relative bg-white/20 backdrop-blur text-white rounded-xl p-3">
                <Building size={24} />
              </span>
              <span className="relative font-display font-semibold text-white text-lg">{t(lang, b.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
