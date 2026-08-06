import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building } from 'lucide-react'
import { useApp, BlockId } from '../context/AppContext'
import { t } from '../translations'

const BLOCKS: { id: BlockId; labelKey: 'blockA' | 'blockB' | 'blockC' }[] = [
  { id: 'A', labelKey: 'blockA' },
  { id: 'B', labelKey: 'blockB' },
  { id: 'C', labelKey: 'blockC' },
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
    <div className="kr-skyline-bg min-h-screen flex flex-col items-center justify-center bg-sand-50 px-6">
      <div className="max-w-md w-full">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-forest-600 text-sm mb-8">
          <ArrowLeft size={16} /> {t(lang, 'back')}
        </button>

        <h2 className="font-display text-3xl font-semibold text-forest-900 mb-8 text-center">
          {t(lang, 'selectBlock')}
        </h2>

        <div className="grid gap-3">
          {BLOCKS.map((b) => (
            <button
              key={b.id}
              onClick={() => choose(b.id)}
              className="group flex items-center gap-4 bg-white border border-sand-200 rounded-2xl p-5 text-left hover:border-forest-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="bg-forest-100 text-forest-700 rounded-xl p-3 group-hover:bg-forest-600 group-hover:text-white transition-colors">
                <Building size={22} />
              </span>
              <span className="font-medium text-forest-900">{t(lang, b.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
