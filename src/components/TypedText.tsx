import { useEffect, useState } from 'react'

interface TypedTextProps {
  words: readonly string[]
  className?: string
}

// Types out each word, pauses, deletes it, then moves on to the next one.
// With "reduce motion" turned on, the first word is simply shown.
export default function TypedText({ words, className = '' }: TypedTextProps) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(reduced ? words[0].length : 0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) return
    const word = words[index]
    let delay = deleting ? 45 : 85
    if (!deleting && count === word.length) delay = 1500
    if (deleting && count === 0) delay = 350

    const t = window.setTimeout(() => {
      if (!deleting && count === word.length) {
        setDeleting(true)
      } else if (deleting && count === 0) {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      } else {
        setCount((c) => c + (deleting ? -1 : 1))
      }
    }, delay)
    return () => window.clearTimeout(t)
  }, [count, deleting, index, reduced, words])

  return (
    <span className={className}>
      {/* Screen readers get the full list once, not the typing animation */}
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">
        {words[index].slice(0, count)}
        <span className="ml-0.5 inline-block w-[2px] translate-y-[0.1em] animate-pulse bg-current align-baseline">
          &nbsp;
        </span>
      </span>
    </span>
  )
}
