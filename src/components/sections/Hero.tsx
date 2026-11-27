import { profile } from '../../data/profile'
import IdCard from '../IdCard'
import TypedRole from '../TypedRole'

export default function Hero({ ready = true }: { ready?: boolean }) {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className=""
    >
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-4 px-4 pb-16 pt-28 sm:px-6 md:grid-cols-[1.2fr_1fr] md:gap-12 lg:px-8">
        {/* Text column. EDIT ME: the words come from src/data/profile.ts */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <div
            data-quiet-zone
            aria-label="Fullstack Dev, Game Dev, BSIT Student"
            className="hero-text hero-scrim"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
              {profile.heroEyebrow}
            </p>

            <h1
              id="hero-title"
              className="mt-4 font-display text-[clamp(2.75rem,5.2vw,4.25rem)] italic leading-[1.02] tracking-[-0.02em] text-[color:var(--text-primary)] md:whitespace-nowrap"
            >
              {profile.name}
            </h1>

            <p className="mt-[14px] flex flex-wrap items-baseline justify-center gap-x-[0.4em] text-[20px] font-normal text-[color:var(--text-secondary)] md:justify-start">
              <span>A</span>
              <span className="font-display text-[30px] italic leading-none text-[color:var(--text-primary)]">
                <TypedRole roles={profile.heroRoles} />
              </span>
              <span>based in {profile.heroCity}, PH.</span>
            </p>

            <p className="mx-auto mt-[18px] max-w-[34rem] text-[15px] font-normal leading-[1.6] text-[color:var(--text-body)] md:mx-0">
              {profile.heroIntro}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#projects"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-900 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:border-white"
            >
              Interested? Contact me
            </a>
          </div>

          <ul
            data-quiet-zone
            className="hero-text mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[color:var(--text-muted)] md:justify-start"
          >
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-[color:var(--text-primary)]">
                GitHub ↗
              </a>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <a href={profile.facebook} target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-[color:var(--text-primary)]">
                Facebook ↗
              </a>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <a href="#contact" className="transition-colors duration-200 hover:text-[color:var(--text-primary)]">
                Discord
              </a>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <button
                type="button"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="transition-colors duration-200 hover:text-[color:var(--text-primary)]"
              >
                ⌘K Quick Jump
              </button>
            </li>
          </ul>
        </div>

        {/* Interactive ID card. The area stretches to the top of the page so the
            lanyard hangs from the top edge. */}
        <div className="relative order-1 -mt-28 h-[560px] md:order-2 md:-mb-16 md:h-auto md:self-stretch">
          {ready && <IdCard drop />}
        </div>
      </div>
    </section>
  )
}
