import { useEffect, useRef } from 'react'

// ───────────────────────── TUNABLES ─────────────────────────
const CELL_W = 15
const CELL_H = 20
const FONT_PX = 12
const BASE_ALPHA_DARK: [number, number] = [0.07, 0.12]
const BASE_ALPHA_LIGHT: [number, number] = [0.08, 0.14]
const BURST_ALPHA: [number, number] = [0.55, 0.85]
const BURST_LEN: [number, number] = [4, 10]
const BURST_FADE_IN = 150
const BURST_HOLD: [number, number] = [600, 1200]
const BURST_FADE_OUT = 700
const ACTIVE_BURSTS_PER_MPX = 14 // bursts alive at once per megapixel of viewport
const ACCENT_CHANCE = 0.03
const REROLL_PER_SEC = 6
const CURSOR_RADIUS = 140
// Quiet zones: elements with [data-quiet-zone] dim the glyphs behind them
const QUIET_MIN_DARK = 0.12
const QUIET_MIN_LIGHT = 0.18
const QUIET_PAD = 24
const QUIET_FEATHER = 56
const QUIET_LERP_MS = 200 // time constant (~600ms to settle)
// ────────────────────────────────────────────────────────────

const REROLL_MS = 250 // fade out, swap, fade in (each half)
const STAGGER: [number, number] = [20, 40]
const BUCKETS = 16
const MAX_ALPHA = 0.9
const FONT = `${FONT_PX}px "JetBrains Mono", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace`

interface Burst {
  row: number
  col: number
  len: number
  t: number // ms since start
  hold: number
  alpha: number
  stagger: number
  tint: Uint8Array // 0 neutral, 1 accent A, 2 accent B (per glyph)
  rerollAt: number[] // times (ms) at which the glyphs "decode" again
  rerolled: number
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

function readRgb(style: CSSStyleDeclaration, name: string, fallback: string): string {
  const raw = style.getPropertyValue(name).trim() || fallback
  return raw.split(/[\s,]+/).slice(0, 3).join(',')
}

// Full-page binary "digital rain" made only of 1 and 0. Fixed behind the page.
export default function BinaryBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    let w = 0, h = 0, cols = 0, rows = 0, n = 0, dpr = 1
    let val = new Uint8Array(0) // 0 / 1 per cell
    let baseA = new Float32Array(0) // dim base opacity (with per-cell offset)
    let maskA = new Float32Array(0) // density mask
    let fade = new Float32Array(0) // crossfade multiplier 0..1
    let fadeState = new Uint8Array(0) // 0 idle, 1 fading out, 2 fading in
    let lit = new Float32Array(0) // burst brightness 0..1 this frame
    let litAlpha = new Float32Array(0) // burst peak opacity for the cell
    let litTint = new Uint8Array(0)
    let boost = new Float32Array(0) // eased cursor brightening
    let bucket = new Uint8Array(0)
    let alphaOut = new Float32Array(0)
    let bursts: Burst[] = []
    let colMask = new Float32Array(0)
    let quiet = new Float32Array(0) // current per-cell multiplier (eased)
    let quietT = new Float32Array(0) // target multiplier
    let rectSig = ''
    let quietRaf = 0
    let quietEls: Element[] = []
    let ro: ResizeObserver | null = null

    let rgb = '205,215,210'
    let accA = '61,220,132'
    let accB = '139,124,255'
    let dark = true
    let spawnAcc = 0
    let rerollAcc = 0
    let raf = 0
    let last = 0
    let slowFrames = 0
    let halfRate = false
    let skip = false
    let carry = 0
    const pointer = { x: -9999, y: -9999, on: false }

    const readColors = () => {
      const root = document.documentElement
      const style = getComputedStyle(root)
      dark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark'
      rgb = readRgb(style, '--glyph-rgb', dark ? '205 215 210' : '20 20 20')
      accA = readRgb(style, '--glyph-accent-1', dark ? '61 220 132' : '217 83 79')
      accB = readRgb(style, '--glyph-accent-2', dark ? '139 124 255' : '61 220 132')
    }

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / CELL_W)
      rows = Math.ceil(h / CELL_H)
      n = cols * rows
      val = new Uint8Array(n)
      baseA = new Float32Array(n)
      maskA = new Float32Array(n)
      fade = new Float32Array(n).fill(1)
      fadeState = new Uint8Array(n)
      lit = new Float32Array(n)
      litAlpha = new Float32Array(n)
      litTint = new Uint8Array(n)
      boost = new Float32Array(n)
      bucket = new Uint8Array(n)
      alphaOut = new Float32Array(n)
      colMask = new Float32Array(cols)
      quiet = new Float32Array(n).fill(1)
      quietT = new Float32Array(n).fill(1)
      bursts = []
      const [lo, hi] = dark ? BASE_ALPHA_DARK : BASE_ALPHA_LIGHT
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) / cols
        colMask[c] = 0.3 + 0.7 * smoothstep(0.15, 0.5, Math.abs(x - 0.5) * 2)
      }
      for (let r = 0; r < rows; r++) {
        const y = (r + 0.5) / rows
        const bottom = 1 - 0.6 * smoothstep(0.85, 1, y) // gentle fade over the bottom ~15%
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          val[i] = Math.random() < 0.5 ? 0 : 1
          baseA[i] = rnd(lo, hi)
          maskA[i] = colMask[c] * bottom
        }
      }
    }

    const computeQuiet = (snap: boolean) => {
      const qmin = dark ? QUIET_MIN_DARK : QUIET_MIN_LIGHT
      const els = Array.from(document.querySelectorAll('[data-quiet-zone]'))
      if (ro && (els.length !== quietEls.length || els.some((e, k) => e !== quietEls[k]))) {
        ro.disconnect()
        els.forEach((e) => ro!.observe(e))
      }
      quietEls = els
      const rects = els.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0)
      rectSig = rects.map((r) => `${r.left | 0},${r.top | 0},${r.width | 0},${r.height | 0}`).join('|')
      quietT.fill(1)
      for (const r of rects) {
        const l = r.left - QUIET_PAD, rt = r.right + QUIET_PAD
        const t = r.top - QUIET_PAD, bt = r.bottom + QUIET_PAD
        const c0 = Math.max(0, Math.floor((l - QUIET_FEATHER) / CELL_W))
        const c1 = Math.min(cols - 1, Math.ceil((rt + QUIET_FEATHER) / CELL_W))
        const r0 = Math.max(0, Math.floor((t - QUIET_FEATHER) / CELL_H))
        const r1 = Math.min(rows - 1, Math.ceil((bt + QUIET_FEATHER) / CELL_H))
        for (let ry = r0; ry <= r1; ry++) {
          const cy = (ry + 0.5) * CELL_H
          const dy = Math.max(t - cy, 0, cy - bt)
          for (let cx = c0; cx <= c1; cx++) {
            const x = (cx + 0.5) * CELL_W
            const dx = Math.max(l - x, 0, x - rt)
            const d = Math.hypot(dx, dy)
            const m = d <= 0 ? qmin : d >= QUIET_FEATHER ? 1 : qmin + (1 - qmin) * smoothstep(0, QUIET_FEATHER, d)
            const i = ry * cols + cx
            if (m < quietT[i]) quietT[i] = m
          }
        }
      }
      if (snap) quiet.set(quietT)
    }
    const requestQuiet = () => {
      if (quietRaf) return
      quietRaf = requestAnimationFrame(() => {
        quietRaf = 0
        computeQuiet(false)
        if (reduced) {
          quiet.set(quietT)
          staticFrame()
        }
      })
    }

    const spawnBurst = () => {
      const len = Math.min(cols, Math.round(rnd(BURST_LEN[0], BURST_LEN[1] + 1)))
      let start = 0
      let row = 0
      for (let attempt = 0; attempt < 8; attempt++) {
        // bursts prefer the strong (left / right) areas
        let col = 0
        for (let tries = 0; tries < 12; tries++) {
          col = Math.floor(Math.random() * cols)
          if (Math.random() < colMask[col]) break
        }
        start = Math.max(0, Math.min(cols - len, col - Math.floor(len / 2)))
        row = Math.floor(Math.random() * rows)
        // never start a burst that sits mostly inside a quiet zone
        let calm = 0
        for (let k = 0; k < len; k++) if (quietT[row * cols + start + k] < 0.5) calm++
        if (calm <= len / 2) break
        if (attempt === 7) return
      }
      const hold = rnd(BURST_HOLD[0], BURST_HOLD[1])
      const tint = new Uint8Array(len)
      for (let k = 0; k < len; k++) {
        if (Math.random() < ACCENT_CHANCE) tint[k] = Math.random() < 0.5 ? 1 : 2
      }
      const rr = 1 + Math.floor(Math.random() * 2)
      const rerollAt: number[] = []
      for (let k = 0; k < rr; k++) rerollAt.push(BURST_FADE_IN + (hold * (k + 0.5)) / rr)
      bursts.push({
        row,
        col: start,
        len,
        t: 0,
        hold,
        alpha: rnd(BURST_ALPHA[0], BURST_ALPHA[1]),
        stagger: rnd(STAGGER[0], STAGGER[1]),
        tint,
        rerollAt,
        rerolled: 0,
      })
    }

    const startReroll = (i: number) => {
      if (fadeState[i] === 0) fadeState[i] = 1
    }

    const step = (dt: number) => {
      // slow re-roll of a few cells per second (smooth crossfade)
      rerollAcc += (dt / 1000) * REROLL_PER_SEC
      while (rerollAcc >= 1) {
        rerollAcc -= 1
        startReroll(Math.floor(Math.random() * n))
      }
      const fd = dt / REROLL_MS
      for (let i = 0; i < n; i++) {
        const s = fadeState[i]
        if (s === 0) continue
        if (s === 1) {
          fade[i] -= fd
          if (fade[i] <= 0) {
            fade[i] = 0
            val[i] ^= 1
            fadeState[i] = 2
          }
        } else {
          fade[i] += fd
          if (fade[i] >= 1) {
            fade[i] = 1
            fadeState[i] = 0
          }
        }
      }

      const qk = 1 - Math.exp(-dt / QUIET_LERP_MS)
      for (let i = 0; i < n; i++) {
        const dq = quietT[i] - quiet[i]
        if (dq > 0.0005 || dq < -0.0005) quiet[i] += dq * qk
        else quiet[i] = quietT[i]
      }

      // bursts
      const target = ACTIVE_BURSTS_PER_MPX * ((w * h) / 1e6)
      spawnAcc += (dt / 1000) * (target / 2.0)
      while (spawnAcc >= 1) {
        spawnAcc -= 1
        if (bursts.length < target * 1.4) spawnBurst()
      }
      lit.fill(0)
      for (let b = bursts.length - 1; b >= 0; b--) {
        const bu = bursts[b]
        bu.t += dt
        const total = BURST_FADE_IN + bu.hold + BURST_FADE_OUT
        if (bu.t > total + bu.stagger * bu.len) {
          bursts.splice(b, 1)
          continue
        }
        if (bu.rerolled < bu.rerollAt.length && bu.t >= bu.rerollAt[bu.rerolled]) {
          bu.rerolled++
          for (let k = 0; k < bu.len; k++) startReroll(bu.row * cols + bu.col + k)
        }
        for (let k = 0; k < bu.len; k++) {
          const lt = bu.t - k * bu.stagger
          let a = 0
          if (lt <= 0) a = 0
          else if (lt < BURST_FADE_IN) a = easeOut(lt / BURST_FADE_IN)
          else if (lt < BURST_FADE_IN + bu.hold) a = 1
          else if (lt < total) a = 1 - easeInOut((lt - BURST_FADE_IN - bu.hold) / BURST_FADE_OUT)
          if (a <= 0) continue
          const i = bu.row * cols + bu.col + k
          if (a > lit[i]) {
            lit[i] = a
            litAlpha[i] = bu.alpha
            litTint[i] = bu.tint[k]
          }
        }
      }
    }

    const cursorStep = (dt: number) => {
      // eased brightening near the pointer (lerp ~0.12 per 60Hz frame)
      const k = 1 - Math.pow(1 - 0.12, dt / 16.67)
      const r2 = CURSOR_RADIUS * CURSOR_RADIUS
      for (let r = 0; r < rows; r++) {
        const cy = (r + 0.5) * CELL_H
        const dy = cy - pointer.y
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          let t = 0
          if (pointer.on) {
            const dx = (c + 0.5) * CELL_W - pointer.x
            const d2 = dx * dx + dy * dy
            if (d2 < r2) t = 0.15 * (1 - smoothstep(0, 1, Math.sqrt(d2) / CURSOR_RADIUS))
          }
          boost[i] += (t - boost[i]) * k
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.font = FONT
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      let any = false
      for (let i = 0; i < n; i++) {
        const base = baseA[i]
        let a = base
        if (lit[i] > 0) a = base + (litAlpha[i] - base) * lit[i]
        a = (a * maskA[i] + boost[i]) * quiet[i] * fade[i] // crossfade multiplies the whole glyph once
        alphaOut[i] = a
        if (a < 0.01) {
          bucket[i] = 255
          continue
        }
        any = true
        bucket[i] = lit[i] > 0.05 && litTint[i] ? 254 : Math.min(BUCKETS - 1, Math.round((a / MAX_ALPHA) * (BUCKETS - 1)))
      }
      if (!any) return
      for (let b = 0; b < BUCKETS; b++) {
        ctx.fillStyle = `rgba(${rgb},${((b / (BUCKETS - 1)) * MAX_ALPHA).toFixed(3)})`
        for (let i = 0; i < n; i++) {
          if (bucket[i] !== b) continue
          const r = (i / cols) | 0
          ctx.fillText(val[i] ? '1' : '0', (i - r * cols + 0.5) * CELL_W, (r + 0.5) * CELL_H)
        }
      }
      // accent-tinted glyphs (rare) are drawn one by one
      for (let i = 0; i < n; i++) {
        if (bucket[i] !== 254) continue
        const r = (i / cols) | 0
        ctx.fillStyle = `rgba(${litTint[i] === 1 ? accA : accB},${Math.min(1, alphaOut[i]).toFixed(3)})`
        ctx.fillText(val[i] ? '1' : '0', (i - r * cols + 0.5) * CELL_W, (r + 0.5) * CELL_H)
      }
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(50, now - (last || now))
      last = now
      carry += dt
      if (halfRate) {
        skip = !skip
        if (skip) return // 30fps: simulate with the accumulated time every second frame
      }
      const sdt = carry
      carry = 0
      const t0 = performance.now()
      step(sdt)
      if (!coarse) cursorStep(sdt)
      draw()
      const cost = performance.now() - t0
      // fall back to 30fps if a frame regularly exceeds the ~6ms budget
      if (cost > 6) slowFrames = Math.min(slowFrames + 1, 90)
      else slowFrames = Math.max(slowFrames - 1, 0)
      if (!halfRate && slowFrames > 30) halfRate = true
      else if (halfRate && slowFrames === 0) halfRate = false
    }

    const start = () => {
      if (raf || reduced) return
      last = 0
      carry = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const staticFrame = () => {
      lit.fill(0)
      boost.fill(0)
      draw()
    }

    // theme changes: re-read colours and repaint immediately (same frame as the switch)
    const onTheme = () => {
      const was = dark
      readColors()
      if (was !== dark) {
        const [lo, hi] = dark ? BASE_ALPHA_DARK : BASE_ALPHA_LIGHT
        for (let i = 0; i < n; i++) baseA[i] = rnd(lo, hi)
      }
      computeQuiet(reduced)
      if (reduced) staticFrame()
      else {
        ctx.clearRect(0, 0, w, h)
        draw()
      }
    }
    const mo = new MutationObserver(onTheme)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        build()
        computeQuiet(true)
        if (reduced) staticFrame()
      }, 150)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.on = true
    }
    const onLeave = () => {
      pointer.on = false
    }
    const onVis = () => (document.hidden ? stop() : start())

    readColors()
    build()
    ro = new ResizeObserver(requestQuiet)
    computeQuiet(true)
    if (reduced) staticFrame()
    else start()
    document.fonts?.ready.then(() => {
      computeQuiet(reduced)
      if (reduced) staticFrame()
    })
    const sigTimer = window.setInterval(() => {
      const sig = Array.from(document.querySelectorAll('[data-quiet-zone]'))
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0)
        .map((r) => `${r.left | 0},${r.top | 0},${r.width | 0},${r.height | 0}`)
        .join('|')
      if (sig !== rectSig) requestQuiet()
    }, 500)
    window.addEventListener('scroll', requestQuiet, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)
    if (!coarse && !reduced) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    return () => {
      stop()
      window.clearTimeout(resizeTimer)
      window.clearInterval(sigTimer)
      cancelAnimationFrame(quietRaf)
      ro?.disconnect()
      window.removeEventListener('scroll', requestQuiet)
      mo.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  )
}
