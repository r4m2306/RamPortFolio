interface SectionTitleProps {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
}

// Reusable heading used at the top of every section.
export default function SectionTitle({ id, eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-10 text-center">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-600 dark:text-accent-400">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}
