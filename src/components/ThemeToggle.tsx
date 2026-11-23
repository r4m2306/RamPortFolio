import { MoonIcon, SunIcon } from '../assets/icons'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-accent-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-accent-400"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
