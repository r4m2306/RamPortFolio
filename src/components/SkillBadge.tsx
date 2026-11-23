import type { Skill } from '../types'

interface SkillBadgeProps {
  skill: Skill
}

// A single skill shown as an icon tile. The name appears as a tooltip on
// hover/focus, and is always available to screen readers.
export default function SkillBadge({ skill }: SkillBadgeProps) {
  const { name, icon } = skill
  return (
    <li className="group relative">
      <div
        tabIndex={0}
        title={name}
        className="flex h-16 min-w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent-400 hover:shadow-soft focus-visible:-translate-y-1 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-accent-400"
      >
        {icon ? (
          <img src={icon} alt="" width={36} height={36} className="h-9 w-9" loading="lazy" />
        ) : (
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{name}</span>
        )}
        <span className="sr-only">{name}</span>
      </div>
      {/* Tooltip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900"
      >
        {name}
      </span>
    </li>
  )
}
