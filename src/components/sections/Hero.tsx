import { profile } from '../../data/profile'
import IdCard from '../IdCard'
import TypedText from '../TypedText'

export default function Hero({ ready = true }: { ready?: boolean }) {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="bg-accent-50/70 dark:bg-slate-900/60"
    >
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-4 px-4 pb-16 pt-28 sm:px-6 md:grid-cols-[1.2fr_1fr] md:gap-12 lg:px-8">
        {/* Text column. EDIT ME: the words come from src/data/profile.ts */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <h1
            id="hero-title"
            className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="sr-only">{profile.name}: </span>
            <span className="block bg-gradient-to-r from-accent-500 via-accent-400 to-violet-400 bg-clip-text pb-1 text-transparent">
              {profile.heroTitle}
            </span>
            <span className="block text-slate-900 dark:text-white">{profile.heroTitleAccent}</span>
          </h1>

          <p className="mt-5 min-h-[2rem] text-xl font-semibold text-accent-600 dark:text-accent-400 sm:text-2xl">
            <TypedText words={profile.heroRoles} />
          </p>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 md:mx-0 lg:text-lg">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {profile.heroLead}
            </span>{' '}
            {profile.heroSupport}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <a href="#projects" className="btn-primary !rounded-full">
              View Projects
            </a>
            <a href="#contact" className="btn-outline !rounded-full !border-accent-500 !text-accent-600 dark:!text-accent-400">
              Contact Me
            </a>
          </div>
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
