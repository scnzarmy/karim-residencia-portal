import { X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../translations'

const RULES_EN = [
  'Quiet hours are 11 PM to 7 AM — please keep noise to a minimum.',
  'Visitors must be registered with the gate security.',
  'Parking is restricted to your assigned spot only.',
  'Garbage should be disposed of in designated bins only.',
  'Report maintenance issues promptly through the Complaints tab.',
  'Pets must be leashed in common areas.',
]

const RULES_UR = [
  'خاموشی کے اوقات رات 11 بجے سے صبح 7 بجے تک ہیں۔',
  'مہمانوں کو گیٹ سیکیورٹی کے پاس رجسٹر ہونا ضروری ہے۔',
  'پارکنگ صرف آپ کی مختص جگہ تک محدود ہے۔',
  'کوڑا صرف مقررہ ڈبوں میں ڈالیں۔',
  'مرمت کے مسائل فوری طور پر شکایات ٹیب سے رپورٹ کریں۔',
  'مشترکہ جگہوں میں پالتو جانوروں کو پٹے پر رکھیں۔',
]

export default function RulesPanel({ onClose }: { onClose: () => void }) {
  const { lang } = useApp()
  const rules = lang === 'ur' ? RULES_UR : RULES_EN

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-30 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-forest-900">{t(lang, 'rules')}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={20} className="text-forest-600" />
          </button>
        </div>
        <ol className="grid gap-3 list-decimal list-inside text-sm text-forest-800">
          {rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
