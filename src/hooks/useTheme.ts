import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

// ── TUNABLES ──
const THEME_MS = 800 // length of the circular reveal

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => {
    ready: Promise<void>
    finished: Promise<void>
    skipTransition: () => void
  }
}

// Dark/light mode with a circular reveal that grows from the toggle button.
// Colours all come from the `dark` class on <html>, so one flip changes everything
// in the same frame. The choice is saved in localStorage.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const themeRef = useRef(theme)
  const busy = useRef(false)
  themeRef.current = theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage may be unavailable; ignore */
    }
  }, [theme])

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    if (busy.current) return // ignore extra clicks until the reveal finishes
    const next: Theme = themeRef.current === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    const apply = () => {
      root.classList.toggle('dark', next === 'dark')
      flushSync(() => setTheme(next))
    }
    const doc = document as VTDocument
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!doc.startViewTransition || reduce) {
      root.classList.add('theme-fallback')
      apply()
      window.setTimeout(() => root.classList.remove('theme-fallback'), 350)
      return
    }

    busy.current = true
    const x = origin?.x ?? window.innerWidth / 2
    const y = origin?.y ?? window.innerHeight / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = doc.startViewTransition(apply)
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: THEME_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {
        /* transition was skipped; nothing to animate */
      })
    transition.finished.finally(() => {
      busy.current = false
    })
  }, [])

  return { theme, toggleTheme }
}
