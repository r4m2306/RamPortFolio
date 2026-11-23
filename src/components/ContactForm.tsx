import { useState, type FormEvent } from 'react'
import { profile } from '../data/profile'

type Status = 'idle' | 'sending' | 'success' | 'error'

const inputClass =
  'mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white'

// Contact form with no backend:
// - If profile.formspreeId is set, it posts to Formspree.
// - Otherwise it opens the visitor's email app with a pre-filled mailto: message.
export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    if (profile.formspreeId) {
      setStatus('sending')
      try {
        const res = await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
        })
        if (!res.ok) throw new Error('Request failed')
        form.reset()
        setStatus('success')
      } catch {
        setStatus('error')
      }
      return
    }

    // mailto: fallback
    const subject = encodeURIComponent(`Portfolio message from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setStatus('success')
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8" aria-label="Contact form">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Your name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} placeholder="Juan Dela Cruz" />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Your email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} placeholder="Hi Ram, I would like to talk about..." />
      </div>

      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-60">
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>

      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
        {status === 'success' && (
          <span className="text-emerald-700 dark:text-emerald-400">
            {profile.formspreeId
              ? 'Thank you! Your message has been sent.'
              : 'Your email app should open with your message ready to send.'}
          </span>
        )}
        {status === 'error' && (
          <span className="text-red-700 dark:text-red-400">
            Something went wrong. Please email me directly at {profile.email}.
          </span>
        )}
      </p>
    </form>
  )
}
