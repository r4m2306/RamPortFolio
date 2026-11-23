import { profile } from '../../data/profile'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

// Shown if /images/profile.jpg has not been added yet.
const FALLBACK_PHOTO = '/images/profile.svg'

export default function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionTitle id="about-title" eyebrow="Get to know me" title="About Me" />
      <div className="grid items-center gap-10 md:grid-cols-[18rem_1fr] lg:grid-cols-[20rem_1fr]">
        {/* About photo slot: put your photo at public/images/about.jpg */}
        <div className="mx-auto w-full max-w-xs">
          <img
            src={profile.aboutPhoto}
            alt={`Portrait of ${profile.name}`}
            width={960}
            height={1200}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget
              if (!img.src.endsWith(FALLBACK_PHOTO)) img.src = FALLBACK_PHOTO
            }}
            className="aspect-[4/5] w-full rounded-3xl border border-slate-200 object-cover shadow-soft dark:border-slate-800 dark:shadow-soft-dark"
          />
        </div>
        <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
          {profile.bio.map((sentence) => (
            <span key={sentence} className="inline">
              {sentence}{' '}
            </span>
          ))}
        </div>
      </div>
    </Section>
  )
}
