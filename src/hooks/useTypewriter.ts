import { useEffect, useRef, useState } from 'react'

// ───────────── TUNABLES ─────────────
export const TYPE_MS_PER_CHAR = 80
export const TYPE_JITTER_MS = 25
export const HOLD_MS = 1800
export const ERASE_MS_PER_CHAR = 40
export const GAP_MS = 350
export const START_DELAY_MS = 600
// ────────────────────────────────────

type Phase = 'delay' | 'typing' | 'hold' | 'erasing' | 'gap'

export interface TypewriterState {
  text: string
  /** true while characters are actively being typed or erased (caret stays solid) */
  busy: boolean
}

// Types each role, holds, erases, then moves on to the next, forever.
// Timestamp driven (requestAnimationFrame), pauses while the tab is hidden.
export function useTypewriter(roles: readonly string[]): TypewriterState {
  const [state, setState] = useState<TypewriterState>({ text: '', busy: false })
  const s = useRef({ idx: 0, len: 0, phase: 'delay' as Phase, next: 0 })

  useEffect(() => {
    if (roles.length === 0) return
    let raf = 0
    const st = s.current
    const typeDelay = () => TYPE_MS_PER_CHAR + (Math.random() * 2 - 1) * TYPE_JITTER_MS
    const publish = () => {
      const phase = st.phase
      setState({
        text: roles[st.idx].slice(0, st.len),
        busy: phase === 'typing' || phase === 'erasing',
      })
    }

    const advance = (now: number) => {
      const word = roles[st.idx]
      switch (st.phase) {
        case 'delay':
          st.phase = 'typing'
          st.next = now
          break
        case 'typing':
          st.len++
          if (st.len >= word.length) {
            st.phase = 'hold'
            st.next += HOLD_MS
          } else st.next += typeDelay()
          break
        case 'hold':
          st.phase = 'erasing'
          st.next += ERASE_MS_PER_CHAR
          break
        case 'erasing':
          st.len--
          if (st.len <= 0) {
            st.len = 0
            st.phase = 'gap'
            st.next += GAP_MS
          } else st.next += ERASE_MS_PER_CHAR
          break
        case 'gap':
          st.idx = (st.idx + 1) % roles.length
          st.phase = 'typing'
          st.next += typeDelay()
          break
      }
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (now < st.next) return
      let guard = 0
      const before = `${st.idx}:${st.len}:${st.phase}`
      // catch up if a frame was late, but never skip past the scheduled steps
      while (now >= st.next && guard++ < 4) advance(st.next)
      if (`${st.idx}:${st.len}:${st.phase}` !== before) publish()
    }

    const start = () => {
      if (raf) return
      st.next = performance.now() + (st.phase === 'delay' ? START_DELAY_MS : 0)
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onVis = () => (document.hidden ? stop() : start())

    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [roles])

  return state
}
