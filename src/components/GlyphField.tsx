import { useEffect, useRef } from 'react'

// Faint "digital rain": tiny monospace glyphs that slowly fade in, swap and fade out.
// A fixed canvas with pointer-events none; it pauses while the tab is hidden.

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789{}[]<>/$#=+*;:'.split('')
const CELL_W = 52
const CELL_H = 58
const FILL = 0.42 // share of cells that hold a glyph
const MAX_ALPHA_DARK = 0.17
const MAX_ALPHA_LIGHT = 0.12

interface Cell {
  x: number
  y: number
  g: string
  phase: number
  speed: number
  tint: 0 | 1 | 2 // 0 neutral, 1 green, 2 violet
}

export default function GlyphField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = (n: number) => Math.floor(Math.random() * n)
    let cells: Cell[] = []
    let raf = 0
    let last = 0
    let w = 0
    let h = 0

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cells = []
      for (let y = 0; y < h + CELL_H; y += CELL_H) {
        for (let x = 0; x < w + CELL_W; x += CELL_W) {
          if (Math.random() > FILL) continue
          cells.push({
            x: x + rand(CELL_W - 14),
            y: y + rand(CELL_H - 14) + 12,
            g: GLYPHS[rand(GLYPHS.length)],
            phase: Math.random() * Math.PI * 2,
            speed: 0.00035 + Math.random() * 0.0007, // slow: ~6-15s per cycle
            tint: Math.random() < 0.06 ? 1 : Math.random() < 0.06 ? 2 : 0,
          })
        }
      }
    }

    const draw = (now: number) => {
      const dark = document.documentElement.classList.contains('dark')
      const max = dark ? MAX_ALPHA_DARK : MAX_ALPHA_LIGHT
      ctx.clearRect(0, 0, w, h)
      ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace'
      for (const c of cells) {
        const wave = Math.sin(now * c.speed + c.phase)
        if (wave < 0) {
          // invisible half of the cycle: swap the glyph so it changes while unseen
          if (c.g !== '') c.g = GLYPHS[rand(GLYPHS.length)]
          continue
        }
        const a = wave * max
        ctx.fillStyle =
          c.tint === 1
            ? `rgba(74,222,128,${a})`
            : c.tint === 2
              ? `rgba(167,139,250,${a})`
              : dark
                ? `rgba(200,205,220,${a})`
                : `rgba(51,65,85,${a})`
        ctx.fillText(c.g, c.x, c.y)
      }
    }

    const loop = (now: number) => {
      if (now - last > 66) {
        // ~15 fps is plenty for slow fades
        draw(now)
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onVis = () => (document.hidden ? stop() : start())
    const onResize = () => {
      build()
      if (reduced) draw(1500)
    }

    build()
    if (reduced) draw(1500)
    else start()
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', onResize)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1]" />
}
