import { useEffect, useState } from 'react'
import { skills } from '../data/skills'

// Intro screen: tech icons, "Welcome To My Portfolio" typing, and a 0-100% loader.
// When it finishes it fades out and calls onDone (the home page + ID card drop follow).
// EDIT ME: INTRO_TEXT, LOAD_MS and the icons (they come from src/data/skills.ts).

const INTRO_TEXT = 'Welcome To My Portfolio'
const LOAD_MS = 3200
const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Intro({ onDone }: { onDone: () => void }) {
  const [percent, setPercent] = useState(0)
  const [typed, setTyped] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const icons = skills.filter((s) => s.icon)

  // lock scrolling while the intro is visible
  useEffect(() => {
    if (leaving) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [leaving])

  // typing
  useEffect(() => {
    if (reduced()) {
      setTyped(INTRO_TEXT.length)
      return
    }
    const id = window.setInterval(() => {
      setTyped((t) => {
        if (t >= INTRO_TEXT.length) {
          window.clearInterval(id)
          return t
        }
        return t + 1
      })
    }, 75)
    return () => window.clearInterval(id)
  }, [])

  // loader 0 -> 100
  useEffect(() => {
    const total = reduced() ? 400 : LOAD_MS
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      setPercent(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        window.setTimeout(() => {
          setLeaving(true)
          onDone()
          window.setTimeout(() => setGone(true), 700)
        }, 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  if (gone) return null

  return (
    <div
      role="status"
      aria-label={`Loading ${percent}%`}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 px-6 transition-opacity duration-700 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.22),transparent_60%)]" />

      <div className="relative flex flex-wrap items-center justify-center gap-4">
        {icons.map((s, i) => (
          <span
            key={s.name}
            className="intro-icon flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-600/40 bg-slate-800/60 shadow-lg shadow-black/30 sm:h-16 sm:w-16"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <img src={s.icon} alt="" className={`h-8 w-8 sm:h-9 sm:w-9 ${s.name === 'MySQL' ? 'brightness-150' : ''}`} />
          </span>
        ))}
      </div>

      <p className="relative mt-8 min-h-[1.3em] text-center text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
        <span aria-hidden="true">
          {INTRO_TEXT.slice(0, typed).split(' ').map((w, i, arr) => (
            <span key={i} className={i === arr.length - 1 && arr.length > 3 ? '' : ''}>
              {w}
              {i < arr.length - 1 ? ' ' : ''}
            </span>
          ))}
          <span className="ml-0.5 inline-block w-[3px] translate-y-[2px] animate-pulse bg-indigo-400 align-baseline">&nbsp;</span>
        </span>
        <span className="sr-only">{INTRO_TEXT}</span>
      </p>

      <div className="relative mt-10 w-full max-w-xs sm:max-w-sm">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-center font-mono text-sm tabular-nums text-slate-400">{percent}%</p>
      </div>
    </div>
  )
}
