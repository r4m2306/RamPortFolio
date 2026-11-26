import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { profile } from '../data/profile'
import { useLanyard } from '../hooks/useLanyard'
import qrGithub from '../assets/id-card/qr-github.svg'

// Interactive ID card: hangs from the top of the hero on a lanyard, swings,
// can be dragged and thrown, and flips (tap it, or press Enter) to show the back.
// EDIT ME: the photo is public/images/id-photo.webp (a transparent cutout);
// text on the card comes from src/data/profile.ts.

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function IdCard({ drop = false }: { drop?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const strapRef = useRef<SVGPathElement>(null)
  const stitchRef = useRef<SVGPathElement>(null)

  // Card size follows the available width (phones get a smaller card).
  const [size, setSize] = useState({ w: 240, h: 372 })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = Math.round(Math.max(176, Math.min(250, el.clientWidth * 0.62)))
      setSize((s) => (s.w === w ? s : { w, h: Math.round(w * 1.55) }))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const api = useLanyard({
    containerRef,
    cardRef,
    flipRef,
    shineRef,
    strapRef,
    stitchRef,
    cardW: size.w,
    cardH: size.h,
    reducedMotion: prefersReducedMotion(),
    startSwing: !drop,
  })

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      api.current.flip()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      api.current.nudge(-70)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      api.current.nudge(70)
    }
  }

  const strapW = Math.max(16, Math.round(size.w * 0.08))
  const face =
    'absolute inset-0 overflow-hidden rounded-[1.4em] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]'

  return (
    <div ref={containerRef} className={`relative h-full w-full select-none ${drop ? 'id-drop' : ''}`}>
      {/* Lanyard strap */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible drop-shadow-[0_3px_5px_rgba(15,23,42,0.35)]"
      >
        <path
          ref={strapRef}
          fill="none"
          stroke="#312e81"
          strokeWidth={strapW}
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
        <path
          ref={stitchRef}
          fill="none"
          stroke="rgba(199,210,254,0.55)"
          strokeWidth={1.6}
          strokeDasharray="7 7"
          strokeLinejoin="round"
        />
      </svg>

      {/* Card (position and rotation are set by the physics hook) */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label="Interactive ID card of Rhammzthienne R. Tindoy. Press Enter to flip it, or use the left and right arrow keys to make it swing."
        onKeyDown={onKeyDown}
        className="absolute left-0 top-0 z-[2] cursor-grab touch-none rounded-[1.4em] outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
        style={{
          width: size.w,
          height: size.h,
          fontSize: size.w / 24,
          transformOrigin: '50% 0',
          willChange: 'transform',
        }}
      >
        {/* Metal clip */}
        <div
          aria-hidden="true"
          className="absolute -top-[1.9em] left-1/2 z-10 h-[3em] w-[2.2em] -translate-x-1/2 rounded-[0.55em] border border-slate-400/70 bg-gradient-to-b from-slate-100 via-slate-300 to-slate-400 shadow-md"
        >
          <div className="mx-auto mt-[0.55em] h-[0.9em] w-[0.9em] rounded-full bg-slate-700/80 ring-1 ring-slate-500" />
        </div>

        <div className="h-full w-full [perspective:1000px]">
          <div
            ref={flipRef}
            className="relative h-full w-full [transform-style:preserve-3d]"
            style={{ willChange: 'transform' }}
          >
            {/* FRONT */}
            <div
              className={`${face} border border-white/15 bg-gradient-to-b from-indigo-950 via-indigo-900 to-accent-700 text-white shadow-[0_20px_40px_rgba(30,27,75,0.45)]`}
            >
              {/* slot */}
              <div className="absolute left-1/2 top-[0.9em] h-[0.7em] w-[3.6em] -translate-x-1/2 rounded-full bg-black/55 shadow-inner" />

              <p className="absolute left-[1.3em] right-[1.3em] top-[2.4em] text-[0.62em] font-semibold uppercase tracking-[0.22em] text-indigo-200">
                {profile.school}
              </p>

              {/* big headline behind the photo */}
              <div className="absolute left-[1.1em] top-[4.4em] leading-[0.9]">
                <p className="text-[2.35em] font-black tracking-tight text-white/95">FULL STACK</p>
                <p className="text-[2.35em] font-black tracking-tight text-indigo-200/90">DEVELOPER</p>
              </div>

              {/* photo cutout */}
              <img
                src={profile.idPhoto}
                alt={`Photo of ${profile.name}`}
                width={900}
                height={1355}
                draggable={false}
                className="pointer-events-none absolute bottom-[3.2em] left-1/2 h-[64%] w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]"
              />

              {/* name plate */}
              <div className="absolute inset-x-0 bottom-0 bg-white px-[1.3em] pb-[1.1em] pt-[0.9em] text-slate-900">
                <p className="text-[0.95em] font-extrabold uppercase leading-tight tracking-wide">
                  {profile.name}
                </p>
                <p className="mt-[0.2em] text-[0.7em] font-semibold uppercase tracking-[0.16em] text-accent-600">
                  BSIT | {profile.yearLevel} | {profile.domain}
                </p>
              </div>

              {/* moving shine */}
              <div
                ref={shineRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 46%, transparent 60%)',
                  backgroundSize: '250% 100%',
                }}
              />
            </div>

            {/* BACK */}
            <div
              className={`${face} border border-slate-200 bg-gradient-to-b from-slate-50 to-indigo-100 text-slate-900 shadow-[0_20px_40px_rgba(30,27,75,0.35)] [transform:rotateY(180deg)]`}
            >
              <div className="absolute left-1/2 top-[0.9em] h-[0.7em] w-[3.6em] -translate-x-1/2 rounded-full bg-slate-300 shadow-inner" />
              <div className="flex h-full flex-col items-center px-[1.4em] pb-[1.4em] pt-[3em] text-center">
                <p className="text-[0.62em] font-bold uppercase tracking-[0.25em] text-accent-600">
                  Scan to view
                </p>
                <p className="mt-[0.2em] text-[1.4em] font-black leading-tight">My GitHub</p>

                <div className="mt-[1em] rounded-[1em] bg-white p-[0.9em] shadow-md ring-1 ring-slate-200">
                  <img
                    src={qrGithub}
                    alt="QR code that links to my GitHub profile"
                    width={150}
                    height={150}
                    draggable={false}
                    className="pointer-events-none h-[9.2em] w-[9.2em]"
                  />
                </div>

                <p className="mt-[0.9em] text-[0.7em] font-semibold text-slate-600">
                  github.com/r4m2306
                </p>

                <div className="mt-auto w-full border-t border-slate-300 pt-[0.9em]">
                  <p className="text-[0.85em] font-extrabold uppercase tracking-wide">
                    {profile.name}
                  </p>
                  <p className="mt-[0.2em] text-[0.62em] font-semibold uppercase tracking-[0.16em] text-accent-600">
                    Open to OJT and entry-level roles
                  </p>
                  <p className="mt-[0.5em] break-all text-[0.62em] text-slate-600">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
