import { useState } from 'react'
import { CheckIcon, CopyIcon } from '../assets/icons'

interface CopyButtonProps {
  text: string
  label: string
}

// Copies text to the clipboard and shows a short "Copied!" confirmation.
export default function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for browsers without the async clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-accent-500 hover:text-accent-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-accent-400 dark:hover:text-accent-400"
    >
      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
      <span aria-live="polite">{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  )
}
