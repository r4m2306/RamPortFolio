import { profile } from '../../data/profile'
import AboutPortrait from '../AboutPortrait'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

export default function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionTitle id="about-title" eyebrow="Get to know me" title="About Me" />
      <div className="grid items-center gap-10 md:grid-cols-[20rem_1fr] lg:grid-cols-[22rem_1fr]">
        <AboutPortrait />
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
