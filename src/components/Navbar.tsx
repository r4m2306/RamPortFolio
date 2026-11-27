import { useEffect, useState } from 'react'
import { navItems, pillItems } from '../data/navigation'
import { useActiveSection } from '../hooks/useActiveSection'
import { CloseIcon, MenuIcon } from '../assets/icons'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: (origin?: { x: number; y: number }) => void
}

// Ids tracked for active highlighting (all sections + contact).
const trackedIds = [...navItems.map((n) => n.id), 'contact']

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(trackedIds)

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const mobileLink = (id: string) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
      active === id
        ? 'text-accent-600 dark:text-accent-400'
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
    }`

  return (
    // The header floats over the page (no bar), so only the pill is visible on
    // tablet and desktop. On phones it gets a light glass bar for readability.
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-lg focus:bg-accent-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <div
        className={`pointer-events-auto border-b backdrop-blur sm:pointer-events-none sm:border-transparent sm:bg-transparent sm:backdrop-blur-none sm:dark:border-transparent sm:dark:bg-transparent ${
          open
            ? 'border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95'
            : 'border-slate-200/70 bg-white/80 dark:border-slate-800/70 dark:bg-slate-950/80'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8"
        >
          <span aria-hidden="true" />

          {/* Floating pill menu (tablet and desktop) */}
          <ul className="pointer-events-auto hidden items-center gap-1 rounded-full border border-white/15 bg-slate-900/90 p-1.5 shadow-[0_8px_30px_rgba(2,6,23,0.35)] backdrop-blur sm:flex">
            {pillItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`block rounded-full px-3.5 py-2 text-sm font-semibold transition md:px-5 ${
                      isActive
                        ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
            <li aria-hidden="true" className="mx-1 h-5 w-px bg-white/20" />
            <li>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="pill" />
            </li>
          </ul>

          <div className="pointer-events-auto flex items-center justify-self-end gap-2">
            {/* Phones: theme toggle + hamburger */}
            <div className="col-start-3 flex items-center gap-1 sm:hidden">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <button
                type="button"
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
            <a href="#contact" className="btn-hire hidden md:inline-flex">
              Hire Me
            </a>
          </div>
        </nav>

        {/* Mobile menu: lists every section */}
        <div id="mobile-menu" hidden={!open} className="border-t border-slate-200 dark:border-slate-800 sm:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={mobileLink(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label === 'Projects' ? 'Portfolio' : item.label}
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
      </div>
    </header>
  )
}
