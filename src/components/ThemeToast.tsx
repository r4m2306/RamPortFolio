import { useEffect, useRef, useState } from 'react'

// ── TUNABLES ──
const TOAST_MS = 1600

const NAMES = {
  dark: 'Obsidian Rift · Dark mode',
  light: 'Solar Ivory · Light mode',
} as const

// Small mono pill under the navbar that confirms the new theme, then fades away.
export default function ThemeToast({ theme }: { theme: 'light' | 'dark' }) {
  const first = useRef(true)
  const [shown, setShown] = useState<'light' | 'dark' | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setShown(theme)
    setVisible(true)
    const t = window.setTimeout(() => setVisible(false), TOAST_MS)
    return () => window.clearTimeout(t)
  }, [theme])

  if (!shown) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed left-1/2 top-[4.6rem] z-[60] -translate-x-1/2 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <span className="flex items-center gap-2 rounded-full border border-indigo-400/40 bg-white/85 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 shadow-lg backdrop-blur dark:border-indigo-300/30 dark:bg-slate-900/85 dark:text-slate-200">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${shown === 'dark' ? 'bg-violet-400' : 'bg-amber-400'}`}
        />
        {NAMES[shown]}
      </span>
    </div>
  )
}
