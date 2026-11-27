import { useEffect, useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

const SWAP_MS = 3000 // reduced-motion: crossfade interval

// The role word in the hero: types itself (or crossfades under reduced motion).
// A hidden sizer holding the longest role keeps the text after it from jumping.
export default function TypedRole({ roles }: { roles: readonly string[] }) {
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className="relative inline-grid align-baseline">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap pr-[2px]">
        {longest}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 whitespace-nowrap">
        {reduced ? <Crossfade roles={roles} /> : <Typing roles={roles} />}
      </span>
    </span>
  )
}

function Typing({ roles }: { roles: readonly string[] }) {
  const { text, busy } = useTypewriter(roles)
  return (
    <>
      {text}
      <span
        className={`ml-[2px] inline-block h-[0.9em] w-[2px] translate-y-[0.08em] bg-[color:var(--text-primary)] ${
          busy ? '' : 'caret-blink'
        }`}
      />
    </>
  )
}

function Crossfade({ roles }: { roles: readonly string[] }) {
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(true)
  useEffect(() => {
    const id = window.setInterval(() => {
      setShown(false)
      window.setTimeout(() => {
        setI((v) => (v + 1) % roles.length)
        setShown(true)
      }, 400)
    }, SWAP_MS)
    return () => window.clearInterval(id)
  }, [roles])
  return <span style={{ opacity: shown ? 1 : 0, transition: 'opacity 400ms' }}>{roles[i]}</span>
}
