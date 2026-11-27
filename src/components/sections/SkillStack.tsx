import { useEffect, useRef, useState } from 'react'
import { skills } from '../../data/skills'
import { useReveal } from '../../hooks/useReveal'

// ───────────── TUNABLES ─────────────
const SECONDS_PER_ICON = 1.7 // scroll speed: bigger = slower. 21 icons ≈ 36s per loop
const MOBILE_SPEED_FACTOR = 1.2 // phones scroll a little slower
const REPEATS_PER_SET = 3 // copies of the list in one set, so wide screens never show a gap
const ICON_SIZE_PX = 40 // desktop icon size (phones use 80% of this)
const ICON_GAP_PX = 64 // space between icons (phones use 80% of this)
const EASE_STOP_MS = 700 // how long the slow-down / speed-up takes
// ────────────────────────────────────

const STAGGER = ['', 'ss-d1', 'ss-d2', 'ss-d3']

function Icon({ name, src }: { name: string; src?: string }) {
  return (
    <span className="ss-icon" title={name}>
      {src ? (
        // Mask turns the coloured svg into a one-colour shape that follows the text colour
        <span
          aria-hidden="true"
          className="block h-full w-full bg-current"
          style={{
            WebkitMaskImage: `url("${src}")`,
            maskImage: `url("${src}")`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
      ) : (
        <span className="text-[10px] font-semibold">{name}</span>
      )}
    </span>
  )
}

export default function SkillStack() {
  const { ref, visible } = useReveal<HTMLElement>()
  const trackRef = useRef<HTMLUListElement>(null)
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const set = Array.from({ length: REPEATS_PER_SET }, () => skills).flat()
  const loopSeconds = set.length * SECONDS_PER_ICON

  // Marquee + click-to-stop. The listener lives only while this section is mounted
  // and only listens to clicks inside the section.
  useEffect(() => {
    const section = ref.current
    const track = trackRef.current
    if (!section || !track || reduced || typeof track.animate !== 'function') return

    const phone = window.matchMedia('(max-width: 640px)')
    const anim = track.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
      {
        duration: loopSeconds * 1000 * (phone.matches ? MOBILE_SPEED_FACTOR : 1),
        iterations: Infinity,
        easing: 'linear',
      },
    )
    const onPhone = () => {
      // keep the current position when the breakpoint changes
      const t = anim.effect?.getComputedTiming()
      const progress = t?.progress ?? 0
      anim.effect?.updateTiming({
        duration: loopSeconds * 1000 * (phone.matches ? MOBILE_SPEED_FACTOR : 1),
      })
      anim.currentTime = progress * Number(anim.effect?.getComputedTiming().duration ?? 0)
    }
    phone.addEventListener('change', onPhone)

    let stopped = false
    let raf = 0
    let from = 1
    let to = 1
    let t0 = 0
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const run = (now: number) => {
      const k = Math.min(1, (now - t0) / EASE_STOP_MS)
      const rate = from + (to - from) * ease(k)
      anim.playbackRate = Math.max(rate, 0.0001)
      if (k < 1) raf = requestAnimationFrame(run)
      else if (to === 0) anim.pause() // fully stopped: keep the position
    }
    const setTarget = (target: number) => {
      cancelAnimationFrame(raf)
      from = stopped && target === 1 ? 0 : anim.playbackRate
      to = target
      if (target === 1) anim.play()
      t0 = performance.now()
      raf = requestAnimationFrame(run)
    }
    const onClick = () => {
      stopped = !stopped
      setTarget(stopped ? 0 : 1)
    }
    section.addEventListener('click', onClick)
    const onVis = () => (document.hidden ? anim.pause() : !stopped && anim.play())
    document.addEventListener('visibilitychange', onVis)

    return () => {
      section.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVis)
      phone.removeEventListener('change', onPhone)
      cancelAnimationFrame(raf)
      anim.cancel()
    }
  }, [ref, reduced, loopSeconds])

  const sets = reduced ? 1 : 2
  const cls = (i: number) => `ss-anim ${visible ? 'ss-in' : ''} ${STAGGER[i]}`

  return (
    <section
      id="skills"
      ref={ref}
      aria-labelledby="skills-title"
      className="w-full overflow-hidden py-16 sm:py-20"
      style={
        {
          '--ss-size': `${ICON_SIZE_PX}px`,
          '--ss-gap': `${ICON_GAP_PX}px`,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className={`${cls(0)} mb-2 text-sm font-semibold uppercase tracking-widest text-accent-600 dark:text-accent-400`}>
          Skill Stack
        </p>
        <h2
          id="skills-title"
          className={`${cls(1)} text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl`}
        >
          Tools &amp; technologies I build with
        </h2>
        <p className={`${cls(2)} mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400`}>
          The languages, frameworks and databases I use to turn ideas into reliable web apps, from the front end to the
          database.
        </p>
      </div>

      <div
        className={`${cls(3)} skill-marquee mt-12 ${reduced ? 'is-static' : ''}`}
        aria-label={`Skills: ${skills.map((s) => s.name).join(', ')}`}
        role="group"
      >
        <ul ref={trackRef} className="skill-track">
          {Array.from({ length: sets }, (_, si) =>
            (reduced ? skills : set).map((s, i) => (
              <li key={`${si}-${i}`} aria-hidden={si > 0 || i >= skills.length ? true : undefined} className="ss-item">
                <Icon name={s.name} src={s.monoIcon ?? s.icon} />
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  )
}
