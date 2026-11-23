import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

interface SectionProps {
  id: string
  /** id of the heading element, for aria-labelledby */
  labelledBy: string
  children: ReactNode
  className?: string
}

// Semantic <section> wrapper with a light fade-in on scroll.
export default function Section({ id, labelledBy, children, className = '' }: SectionProps) {
  const { ref, visible } = useReveal<HTMLElement>()
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={labelledBy}
      className={`reveal ${visible ? 'is-visible' : ''} mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${className}`}
    >
      {children}
    </section>
  )
}
