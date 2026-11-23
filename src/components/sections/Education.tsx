import { profile } from '../../data/profile'
import Section from '../Section'
import SectionTitle from '../SectionTitle'

export default function Education() {
  return (
    <Section id="education" labelledBy="education-title">
      <SectionTitle id="education-title" eyebrow="My studies" title="Education" />
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile.school}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{profile.degree}</p>
        <p className="mt-1 font-medium text-accent-600 dark:text-accent-400">
          Currently {profile.yearLevel}
        </p>
        {/* EDIT ME: set the graduation year in src/data/profile.ts */}
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {profile.expectedGraduation}
        </p>
      </div>
    </Section>
  )
}
