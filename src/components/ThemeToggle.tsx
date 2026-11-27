import { MoonIcon, SunIcon } from '../assets/icons'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  /** origin = centre of the button, used for the circular reveal */
  onToggle: (origin?: { x: number; y: number }) => void
  /** "pill" = icon + mono label for the dark floating menu */
  variant?: 'default' | 'pill'
}

export default function ThemeToggle({ theme, onToggle, variant = 'default' }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const pill = variant === 'pill'
  const style = pill
    ? 'gap-1.5 rounded-full py-1.5 pl-2 pr-2.5 text-slate-200 hover:bg-white/10 hover:text-white'
    : 'rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-accent-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-accent-400'
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        onToggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center transition ${style}`}
    >
      {/* both icons stacked: they rotate and crossfade */}
      <span className="relative block h-5 w-5">
        <span
          className={`absolute inset-0 transition-all duration-500 ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 scale-50 opacity-0'}`}
        >
          <MoonIcon />
        </span>
        <span
          className={`absolute inset-0 transition-all duration-500 ${isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 opacity-100'}`}
        >
          <SunIcon />
        </span>
      </span>
      {pill && (
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  )
}
