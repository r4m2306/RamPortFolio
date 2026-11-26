import { useEffect, useRef, type RefObject } from 'react'

// Small verlet-physics "lanyard": a rope hanging from the top of the area with
// a rigid card on the end. No dependencies. Everything is updated through refs
// (no React re-render per frame), so it stays smooth and light.

interface Point {
  x: number
  y: number
  px: number
  py: number
  /** inverse mass: 0 = pinned, bigger = lighter */
  im: number
}

interface Options {
  containerRef: RefObject<HTMLDivElement | null>
  cardRef: RefObject<HTMLDivElement | null>
  flipRef: RefObject<HTMLDivElement | null>
  shineRef: RefObject<HTMLDivElement | null>
  strapRef: RefObject<SVGPathElement | null>
  stitchRef: RefObject<SVGPathElement | null>
  cardW: number
  cardH: number
  reducedMotion: boolean
  /** small sideways swing when the card first appears */
  startSwing?: boolean
}

const SEGMENTS = 8
const GRAVITY = 1900 // px / s^2
const STEP = 1 / 60

export function useLanyard(opts: Options) {
  const {
    containerRef,
    cardRef,
    flipRef,
    shineRef,
    strapRef,
    stitchRef,
    cardW,
    cardH,
    reducedMotion,
    startSwing = true,
  } = opts
  // Lets the component ask for a flip (click / keyboard) and nudges.
  const api = useRef({
    flip: () => {},
    nudge: (_dx: number) => {},
  })

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return

    let W = container.clientWidth
    let H = container.clientHeight

    const ANCHOR_Y = -90 // starts behind the navbar so the strap looks endless
    const points: Point[] = []
    let seg = 40
    let clipIdx = SEGMENTS
    let qIdx = SEGMENTS + 1

    const build = () => {
      points.length = 0
      const anchorX = W * 0.5
      const restClipY = Math.max(110, Math.min(260, H - cardH - 30))
      const ropeLen = restClipY - ANCHOR_Y
      seg = ropeLen / SEGMENTS
      for (let i = 0; i <= SEGMENTS; i++) {
        const y = ANCHOR_Y + seg * i
        points.push({ x: anchorX, y, px: anchorX, py: y, im: i === 0 ? 0 : 1 })
      }
      points[clipIdx].im = 0.6
      // card bottom point: heavy
      const qy = restClipY + cardH
      points.push({ x: anchorX, y: qy, px: anchorX, py: qy, im: 0.25 })
      // a small start-up swing (skipped for reduced motion)
      if (!reducedMotion && startSwing) {
        points[qIdx].x += 46
        points[clipIdx].x += 8
      }
    }
    build()

    // ----- state -----
    let ry = 0 // card Y-rotation (flip) in radians
    let vy = 0
    let dragging = false
    let pointerX = 0
    let pointerY = 0
    let grabT = 0.5
    let dragVx = 0
    let lastPX = 0
    let lastT = 0
    let moved = 0
    let downAt = 0
    let acc = 0
    let last = performance.now()
    let raf = 0
    let visible = true

    const constrain = (a: Point, b: Point, rest: number) => {
      const dx = b.x - a.x
      const dy = b.y - a.y
      const d = Math.hypot(dx, dy) || 0.0001
      const w = a.im + b.im
      if (w === 0) return
      const diff = (d - rest) / d / w
      a.x += dx * diff * a.im
      a.y += dy * diff * a.im
      b.x -= dx * diff * b.im
      b.y -= dy * diff * b.im
    }

    const step = () => {
      // integrate
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        if (p.im === 0) continue
        const vx = (p.x - p.px) * 0.993
        const vyy = (p.y - p.py) * 0.993
        p.px = p.x
        p.py = p.y
        p.x += vx
        p.y += vyy + GRAVITY * STEP * STEP
      }

      // pointer pulls the grabbed spot of the card
      if (dragging) {
        const c = points[clipIdx]
        const q = points[qIdx]
        const gx = c.x + (q.x - c.x) * grabT
        const gy = c.y + (q.y - c.y) * grabT
        let dx = pointerX - gx
        let dy = pointerY - gy
        const len = Math.hypot(dx, dy)
        if (len > 90) {
          dx = (dx / len) * 90
          dy = (dy / len) * 90
        }
        const k = 0.42
        c.x += dx * k * (1 - grabT)
        c.y += dy * k * (1 - grabT)
        q.x += dx * k * grabT
        q.y += dy * k * grabT
      }

      // constraints
      for (let it = 0; it < 16; it++) {
        for (let i = 0; i < SEGMENTS; i++) constrain(points[i], points[i + 1], seg)
        constrain(points[clipIdx], points[qIdx], cardH)
      }

      // keep everything inside the area
      for (let i = 1; i < points.length; i++) {
        const p = points[i]
        if (p.x < 12) p.x = 12
        if (p.x > W - 12) p.x = W - 12
        if (p.y > H - 8) p.y = H - 8
      }

      // flip spring: rest on the nearest multiple of PI (front or back)
      // (the small look-ahead must stay below damping/stiffness, or it runs away)
      const target = Math.round((ry + vy * 0.08) / Math.PI) * Math.PI
      const ax = 40 * (target - ry) - 7 * vy
      const q = points[qIdx]
      const swingVx = (q.x - q.px) / STEP
      vy += (ax + (dragging ? dragVx * 0.03 : 0) + swingVx * 0.0009) * STEP
      ry += vy * STEP
    }

    const draw = () => {
      const c = points[clipIdx]
      const q = points[qIdx]
      const a = Math.atan2(q.x - c.x, q.y - c.y)
      card.style.transform = `translate3d(${c.x - cardW / 2}px, ${c.y}px, 0) rotate(${-a}rad)`
      const flip = flipRef.current
      if (flip) {
        flip.style.transform = `rotateY(${ry}rad)`
        // show only the face that points at the viewer (does not rely on backface-visibility,
        // which some browsers/GPUs ignore on promoted layers)
        const frontUp = Math.cos(ry) >= 0
        const front = flip.children[0] as HTMLElement | undefined
        const back = flip.children[1] as HTMLElement | undefined
        if (front) front.style.visibility = frontUp ? 'visible' : 'hidden'
        if (back) back.style.visibility = frontUp ? 'hidden' : 'visible'
      }
      const shine = shineRef.current
      if (shine) shine.style.backgroundPosition = `${50 + Math.sin(ry) * 60 + a * 40}% 0`

      // strap path: smooth curve through the rope points
      let d = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < SEGMENTS; i++) {
        const p = points[i]
        const n = points[i + 1]
        d += ` Q ${p.x} ${p.y} ${(p.x + n.x) / 2} ${(p.y + n.y) / 2}`
      }
      d += ` L ${c.x} ${c.y}`
      strapRef.current?.setAttribute('d', d)

      stitchRef.current?.setAttribute('d', d)
    }

    // ----- pointer interaction -----
    const toLocal = (e: PointerEvent) => {
      const r = container.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onDown = (e: PointerEvent) => {
      if (reducedMotion) return
      const p = toLocal(e)
      const c = points[clipIdx]
      const q = points[qIdx]
      const ax = q.x - c.x
      const ay = q.y - c.y
      grabT = Math.max(0.15, Math.min(0.95, ((p.x - c.x) * ax + (p.y - c.y) * ay) / (cardH * cardH)))
      dragging = true
      pointerX = p.x
      pointerY = p.y
      lastPX = p.x
      lastT = performance.now()
      downAt = lastT
      moved = 0
      dragVx = 0
      card.setPointerCapture(e.pointerId)
      card.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const p = toLocal(e)
      pointerX = p.x
      pointerY = p.y
      const now = performance.now()
      const dt = Math.max(1, now - lastT) / 1000
      const v = (p.x - lastPX) / dt
      dragVx = dragVx * 0.7 + v * 0.3
      moved += Math.abs(p.x - lastPX)
      lastPX = p.x
      lastT = now
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      dragVx = 0
      card.style.cursor = 'grab'
      if (card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId)
      // a quick tap (almost no movement) flips the card
      if (moved < 6 && performance.now() - downAt < 350) api.current.flip()
    }

    card.addEventListener('pointerdown', onDown)
    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerup', onUp)
    card.addEventListener('pointercancel', onUp)

    api.current.flip = () => {
      if (reducedMotion) {
        ry = Math.round(ry / Math.PI) * Math.PI + Math.PI
        vy = 0
        draw()
        return
      }
      vy += 26
    }
    api.current.nudge = (dx: number) => {
      points[qIdx].x += dx
    }

    // ----- loop -----
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) {
        last = now
        return
      }
      acc += Math.min(0.05, (now - last) / 1000)
      last = now
      let n = 0
      while (acc >= STEP && n < 4) {
        step()
        acc -= STEP
        n++
      }
      draw()
    }

    if (reducedMotion) {
      // static, hanging straight; only flipping on click / key
      for (let i = 0; i < 40; i++) step()
      for (const p of points) {
        p.px = p.x
        p.py = p.y
      }
      ry = 0
      draw()
      card.addEventListener('click', () => api.current.flip())
    } else {
      raf = requestAnimationFrame(frame)
    }

    // pause when off-screen
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 })
    io.observe(container)

    // resize: rebuild rope for the new size
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      if (Math.abs(nw - W) > 2 || Math.abs(nh - H) > 2) {
        W = nw
        H = nh
        build()
        draw()
      }
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      card.removeEventListener('pointerdown', onDown)
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerup', onUp)
      card.removeEventListener('pointercancel', onUp)
    }
  }, [containerRef, cardRef, flipRef, shineRef, strapRef, stitchRef, cardW, cardH, reducedMotion, startSwing])

  return api
}
