import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

// ───────────────────────── TUNABLES ─────────────────────────
const SPOTLIGHT_RADIUS = 120 // px, sketch spotlight under the cursor
const LERP = 0.15 // how closely the spotlight trails the cursor (0-1, lower = lazier)
const TILT_MAX = 4 // degrees, card tilt toward the cursor
const REVEAL_MS = 350 // spotlight grows / shrinks
const LOCK_MS = 600 // spotlight expands to cover the whole card
const HANDLE = '@rams' // small label, top-left
// ────────────────────────────────────────────────────────────

const FALLBACK_PHOTO = '/images/profile.svg'
const FEATHER = 0.55 // the mask is fully opaque up to 55% of the radius

// cubic-bezier easing (same maths as CSS)
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const X = (t: number) => ((ax * t + bx) * t + cx) * t
  const Y = (t: number) => ((ay * t + by) * t + cy) * t
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x: number) => {
    let t = x
    for (let i = 0; i < 6; i++) {
      const d = dX(t)
      if (Math.abs(d) < 1e-6) break
      t -= (X(t) - x) / d
    }
    return Y(Math.min(1, Math.max(0, t)))
  }
}
const easeOut = bezier(0, 0, 0.2, 1)
const easeLock = bezier(0.22, 1, 0.36, 1)

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isCoarse = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

export default function AboutPortrait() {
  const cardRef = useRef<HTMLButtonElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [hover, setHover] = useState(false)
  const [locked, setLocked] = useState(false)
  const [touch] = useState(isCoarse)
  const [reduced] = useState(prefersReduced)

  // All animated values live in a ref, so moving the mouse never re-renders React.
  const s = useRef({
    w: 345, h: 455,
    px: 0, py: 0, lx: 0, ly: 0, // pointer / eased spotlight position
    r: 0, from: 0, to: 0, t0: 0, dur: 1, ease: easeOut, // radius tween
    tx: 0, ty: 0, tTx: 0, tTy: 0, // tilt, eased
    hv: 0, hvT: 0, // hover lift 0..1
    hovering: false, locked: false,
    raf: 0,
  })

  const cover = (x: number, y: number) => {
    const st = s.current
    return (Math.hypot(Math.max(x, st.w - x), Math.max(y, st.h - y)) + 8) / FEATHER
  }

  const tween = (to: number, dur: number, ease: (x: number) => number) => {
    const st = s.current
    st.from = st.r
    st.to = to
    st.t0 = performance.now()
    st.dur = dur
    st.ease = ease
  }

  const frame = useCallback((now: number) => {
    const st = s.current
    const card = cardRef.current
    if (!card) return

    // spotlight position trails the pointer
    st.lx += (st.px - st.lx) * LERP
    st.ly += (st.py - st.ly) * LERP

    // radius tween (grow / shrink / lock)
    const p = Math.min(1, (now - st.t0) / st.dur)
    st.r = st.from + (st.to - st.from) * st.ease(p)
    if (st.locked && p >= 1) st.r = cover(st.lx, st.ly) // keep full coverage while locked

    // tilt + lift
    st.tx += (st.tTx - st.tx) * 0.1
    st.ty += (st.tTy - st.ty) * 0.1
    st.hv += (st.hvT - st.hv) * 0.12

    card.style.setProperty('--mx', `${st.lx}px`)
    card.style.setProperty('--my', `${st.ly}px`)
    card.style.setProperty('--r', `${Math.max(st.r, 0.01)}px`)
    card.style.transform = `perspective(900px) translateY(${-4 * st.hv}px) scale(${1 + 0.01 * st.hv}) rotateX(${-st.ty * TILT_MAX}deg) rotateY(${st.tx * TILT_MAX}deg)`

    const ring = ringRef.current
    if (ring) {
      const d = st.r * 2
      ring.style.width = ring.style.height = `${d}px`
      ring.style.transform = `translate3d(${st.lx - d / 2}px, ${st.ly - d / 2}px, 0)`
      ring.style.opacity = st.locked || st.r < 4 ? '0' : String(Math.min(1, st.r / SPOTLIGHT_RADIUS))
    }
    // little "+" sparkles drifting around the spotlight
    sparkRefs.current.forEach((el, i) => {
      if (!el) return
      const k = Math.min(1, st.r / SPOTLIGHT_RADIUS) * (st.locked ? 0 : 1)
      const a = now * 0.0007 + i * 2.1
      const rad = st.r * (0.62 + 0.12 * Math.sin(now * 0.002 + i))
      el.style.transform = `translate3d(${st.lx + Math.cos(a) * rad}px, ${st.ly + Math.sin(a) * rad}px, 0)`
      el.style.opacity = String(Math.max(0, Math.sin(now * 0.0035 + i * 2)) * 0.75 * k)
    })

    const idle =
      !st.hovering &&
      p >= 1 &&
      Math.abs(st.px - st.lx) < 0.2 && Math.abs(st.py - st.ly) < 0.2 &&
      Math.abs(st.tTx - st.tx) < 0.002 && Math.abs(st.tTy - st.ty) < 0.002 &&
      Math.abs(st.hvT - st.hv) < 0.002
    st.raf = idle ? 0 : requestAnimationFrame(frame)
  }, [])

  const kick = useCallback(() => {
    if (!s.current.raf) s.current.raf = requestAnimationFrame(frame)
  }, [frame])

  useEffect(() => {
    const st = s.current
    const el = cardRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      st.w = r.width
      st.h = r.height
      st.px = st.lx = r.width / 2
      st.py = st.ly = r.height * 0.4
      el.style.setProperty('--r', '0.01px')
    }
    return () => cancelAnimationFrame(st.raf)
  }, [])

  const track = (e: React.PointerEvent) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const st = s.current
    st.w = r.width
    st.h = r.height
    st.px = e.clientX - r.left
    st.py = e.clientY - r.top
    st.tTx = (st.px / r.width - 0.5) * 2
    st.tTy = (st.py / r.height - 0.5) * 2
  }

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return
    const st = s.current
    track(e)
    st.lx = st.px
    st.ly = st.py
    st.hovering = true
    st.hvT = reduced ? 0 : 1
    if (!st.locked) tween(SPOTLIGHT_RADIUS, REVEAL_MS, easeOut)
    setHover(true)
    kick()
  }

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return
    track(e)
    if (!reduced) kick()
  }

  const onLeave = () => {
    const st = s.current
    st.hovering = false
    st.hvT = 0
    st.tTx = 0
    st.tTy = 0
    if (!st.locked) tween(0, REVEAL_MS, easeOut)
    setHover(false)
    kick()
  }

  const onClick = (e: React.MouseEvent) => {
    const st = s.current
    const el = cardRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      st.w = r.width
      st.h = r.height
      if (e.detail === 0) {
        // keyboard activation: expand from the middle
        st.px = st.lx = r.width / 2
        st.py = st.ly = r.height * 0.4
      } else if (touch || !st.hovering) {
        // tap: expand from the tapped point
        st.px = st.lx = e.clientX - r.left
        st.py = st.ly = e.clientY - r.top
      }
    }
    const next = !st.locked
    st.locked = next
    if (next) tween(cover(st.lx, st.ly), LOCK_MS, easeLock)
    else tween(st.hovering ? SPOTLIGHT_RADIUS : 0, LOCK_MS, easeLock)
    setLocked(next)
    kick()
  }

  const status = locked
    ? 'Graphite mode · locked'
    : hover
      ? 'Sketch reveal active'
      : touch
        ? 'Tap to reveal'
        : 'Hover for graphite'
  const action = locked ? (touch ? 'Tap to unlock' : 'Click to unlock') : touch ? 'Tap to lock' : 'Click to lock'
  const layer = 'absolute inset-0 h-full w-full object-cover object-bottom'

  return (
    <button
      ref={cardRef}
      type="button"
      aria-pressed={locked}
      aria-label={`Portrait of ${profile.name}. Graphite sketch mode is ${locked ? 'locked on. Activate to unlock.' : 'off. Activate to lock it on.'}`}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      style={{ willChange: 'transform' }}
      className="portrait-card relative mx-auto block aspect-[3/4] w-full max-w-[345px] cursor-pointer select-none overflow-hidden rounded-[24px] border border-black/10 bg-white text-left shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] outline-none transition-[background-color,box-shadow,border-color] duration-500 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_60px_-20px_rgba(129,140,248,0.35)]"
    >
      <div aria-hidden="true" className="portrait-grid absolute inset-0" />

      {/* 1. colour photo (base) */}
      <img
        src={profile.aboutPhoto}
        alt=""
        width={1080}
        height={1440}
        loading="lazy"
        draggable={false}
        onError={(e) => {
          const img = e.currentTarget
          if (!img.src.endsWith(FALLBACK_PHOTO)) img.src = FALLBACK_PHOTO
        }}
        className={layer}
      />

      {/* 2. sketch / graphite photo, revealed through a feathered radial mask */}
      <div
        aria-hidden="true"
        className={reduced ? 'absolute inset-0 transition-opacity duration-300' : 'portrait-reveal absolute inset-0'}
        style={reduced ? { opacity: hover || locked ? 1 : 0 } : undefined}
      >
        <img src={profile.aboutSketch} alt="" draggable={false} className={layer} />
      </div>

      {/* 3. spotlight ring, sparkles, vignette */}
      {!reduced && (
        <>
          <div
            ref={ringRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 rounded-full border border-black/15 opacity-0 dark:border-white/20"
          />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => {
                sparkRefs.current[i] = el
              }}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 -ml-1.5 -mt-2 font-mono text-xs leading-none text-slate-900 opacity-0 dark:text-white"
            >
              +
            </span>
          ))}
        </>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] shadow-[inset_0_0_60px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_0_70px_rgba(0,0,0,0.55)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent dark:from-[#0a0a0a]/90"
      />

      {/* corner labels */}
      <span className="pointer-events-none absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {HANDLE}
      </span>
      <span className="pointer-events-none absolute right-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
        00 · Portrait
      </span>
      <span className="pointer-events-none absolute bottom-3.5 left-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
        {status}
      </span>
      <span className="pointer-events-none absolute bottom-3.5 right-4 font-mono text-[10px] tracking-[0.1em] text-slate-400 dark:text-slate-500">
        {action}
      </span>
    </button>
  )
}
