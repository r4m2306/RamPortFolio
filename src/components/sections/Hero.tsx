import { useState } from 'react'
import { profile } from '../../data/profile'

export default function Hero() {
  // If public/images/profile.jpg does not exist yet, show a labeled placeholder.
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="bg-accent-50/70 dark:bg-slate-900/60"
    >
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        {/* Text column */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <p className="text-sm font-semibold text-accent-600 dark:text-accent-400">Hi, I'm</p>
          <h1
            id="hero-title"
            className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            {profile.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">
            {profile.role}
          </p>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400 md:mx-0">
            {profile.pitch} 3rd year BSIT student at {profile.school}.
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

        {/* Photo column: put your photo at public/images/profile.jpg */}
        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-accent-100 shadow-soft dark:border-slate-800 dark:bg-slate-800 dark:shadow-soft-dark sm:h-72 sm:w-72 lg:h-80 lg:w-80">
            {hasPhoto ? (
              <img
                src={profile.photo}
                alt={`Profile photo of ${profile.name}`}
                width={320}
                height={320}
                onError={() => setHasPhoto(false)}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-accent-700 dark:text-accent-100">
                [ Your photo here ]
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
