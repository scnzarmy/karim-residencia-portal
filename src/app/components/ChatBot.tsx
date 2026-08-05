import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../translations'

interface Msg {
  from: 'bot' | 'user'
  text: string
}

function reply(input: string, lang: 'en' | 'ur'): string {
  const q = input.toLowerCase()
  if (q.includes('notice')) return lang === 'ur' ? 'نوٹس بورڈ ٹیب میں تازہ ترین اعلانات دیکھیں۔' : 'Check the Notice Board tab for the latest announcements.'
  if (q.includes('namaz') || q.includes('prayer')) return lang === 'ur' ? 'نماز کے اوقات ٹیب میں مسجد کی تفصیل موجود ہے۔' : 'See the Namaz Timings tab for your block\'s masjid/musallah.'
  if (q.includes('complaint')) return lang === 'ur' ? 'آپ شکایات ٹیب سے نئی شکایت درج کر سکتے ہیں۔' : 'You can file a new complaint from the Complaints tab.'
  if (q.includes('water') || q.includes('electric') || q.includes('gate')) return lang === 'ur' ? 'لائیو صورتحال ٹیب میں تازہ حالت دیکھیں۔' : 'Check the Live Status tab for the current situation.'
  return lang === 'ur' ? 'معذرت، میں یہ سمجھ نہیں سکا۔ براہ کرم نوٹس، شکایات یا نماز کے اوقات کے بارے میں پوچھیں۔' : "I'm not sure about that yet. Try asking about notices, complaints, or namaz timings."
}

export default function ChatBot() {
  const { lang } = useApp()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([{ from: 'bot', text: t(lang, 'chatbotGreeting') }])

  function send(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg: Msg = { from: 'user', text: input }
    const botMsg: Msg = { from: 'bot', text: reply(input, lang) }
    setMessages((m) => [...m, userMsg, botMsg])
    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 bg-forest-600 text-white rounded-full p-4 shadow-lg hover:bg-forest-700 transition"
        aria-label="Open chat"
      >
        <MessageCircle size={22} />
      </button>

      {open && (
        <div className="fixed bottom-5 right-5 w-80 max-w-[90vw] h-96 bg-white border border-sand-200 rounded-2xl shadow-xl flex flex-col overflow-hidden z-20">
          <div className="bg-forest-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-medium text-sm">{t(lang, 'appName')}</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 grid gap-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm rounded-xl px-3 py-2 max-w-[85%] ${
                  m.from === 'bot' ? 'bg-forest-50 text-forest-800 self-start' : 'bg-forest-600 text-white self-end ml-auto'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="border-t border-sand-200 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t(lang, 'typeMessage')}
              className="flex-1 text-sm border border-sand-200 rounded-full px-3 py-1.5"
            />
            <button type="submit" className="text-forest-600" aria-label="Send">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
