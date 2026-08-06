import { X, Home, AlertCircle, Shield, Users, FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../translations'

const RULES_EN = [
  { icon: Home, title: 'Quiet Hours', body: 'Quiet hours are 11 PM to 7 AM — please keep noise to a minimum.' },
  { icon: AlertCircle, title: 'Visitors', body: 'Visitors must be registered with the gate security.' },
  { icon: Shield, title: 'Parking', body: 'Parking is restricted to your assigned spot only.' },
  { icon: Users, title: 'Waste Disposal', body: 'Garbage should be disposed of in designated bins only.' },
  { icon: FileText, title: 'Maintenance', body: 'Report maintenance issues promptly through the Complaints tab.' },
  { icon: Home, title: 'Pets', body: 'Pets must be leashed in common areas.' },
]

const RULES_UR = [
  { icon: Home, title: 'خاموشی کے اوقات', body: 'خاموشی کے اوقات رات 11 بجے سے صبح 7 بجے تک ہیں۔' },
  { icon: AlertCircle, title: 'مہمان', body: 'مہمانوں کو گیٹ سیکیورٹی کے پاس رجسٹر ہونا ضروری ہے۔' },
  { icon: Shield, title: 'پارکنگ', body: 'پارکنگ صرف آپ کی مختص جگہ تک محدود ہے۔' },
  { icon: Users, title: 'کوڑا کرکٹ', body: 'کوڑا صرف مقررہ ڈبوں میں ڈالیں۔' },
  { icon: FileText, title: 'مرمت', body: 'مرمت کے مسائل فوری طور پر شکایات ٹیب سے رپورٹ کریں۔' },
  { icon: Home, title: 'پالتو جانور', body: 'مشترکہ جگہوں میں پالتو جانوروں کو پٹے پر رکھیں۔' },
]

export default function RulesPanel({ onClose }: { onClose: () => void }) {
  const { lang } = useApp()
  const rules = lang === 'ur' ? RULES_UR : RULES_EN

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-30 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 backdrop-blur text-white rounded-xl p-2.5">
              <FileText size={20} />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-white leading-tight">{t(lang, 'rules')}</h2>
              <p className="text-white/80 text-xs">Karim Residencia</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-white/90 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 grid gap-2 overflow-y-auto">
          {rules.map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-sand-50 border border-sand-200 rounded-xl p-3.5">
              <span className="bg-blue-500 text-white rounded-lg p-2 shrink-0">
                <r.icon size={16} />
              </span>
              <div>
                <p className="font-medium text-forest-900 text-sm">{r.title}</p>
                <p className="text-forest-600 text-xs mt-0.5">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
