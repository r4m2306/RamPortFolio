import { MoonIcon, SunIcon } from '../assets/icons'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
  /** "pill" = light icon for the dark floating menu */
  variant?: 'default' | 'pill'
}

export default function ThemeToggle({ theme, onToggle, variant = 'default' }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const style =
    variant === 'pill'
      ? 'rounded-full p-2 text-slate-200 hover:bg-white/10 hover:text-white'
      : 'rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-accent-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-accent-400'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`transition ${style}`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
