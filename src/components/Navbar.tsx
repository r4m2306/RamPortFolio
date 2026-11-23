import { useEffect, useState } from 'react'
import { navItems } from '../data/navigation'
import { profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { CloseIcon, MenuIcon } from '../assets/icons'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

// Ids tracked for active highlighting (navigation sections + contact).
const trackedIds = [...navItems.map((n) => n.id), 'contact']

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(trackedIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = (id: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      active === id
        ? 'text-accent-600 dark:text-accent-400'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition ${
        scrolled || open
          ? 'border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-950/90'
          : 'border-transparent bg-white/60 dark:bg-slate-950/60'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-lg focus:bg-accent-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="#home" className="text-lg font-extrabold text-slate-900 dark:text-white">
          {profile.domain.split('.')[0]}
          <span className="text-accent-600 dark:text-accent-400">.{profile.domain.split('.')[1]}</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={linkClass(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <a href="#contact" className="btn-hire hidden sm:inline-flex">
            Hire Me
          </a>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div id="mobile-menu" hidden={!open} className="border-t border-slate-200 dark:border-slate-800 lg:hidden">
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={`block ${linkClass(item.id)}`}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a href="#contact" onClick={() => setOpen(false)} className="btn-hire w-full">
              Hire Me
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
