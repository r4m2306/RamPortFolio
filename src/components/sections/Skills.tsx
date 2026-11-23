import { SKILL_CATEGORY_ORDER, skills } from '../../data/skills'
import Section from '../Section'
import SectionTitle from '../SectionTitle'
import SkillBadge from '../SkillBadge'

export default function Skills() {
  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionTitle
        id="skills-title"
        eyebrow="My capabilities"
        title="What I Can Do"
        subtitle="I combine technical and problem-solving skills to build reliable web apps, from the front end to the database."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {SKILL_CATEGORY_ORDER.map((category) => {
          const items = skills.filter((s) => s.category === category)
          if (items.length === 0) return null
          return (
            <div key={category} className="card p-6 pb-10">
              <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">{category}</h3>
              <ul className="flex flex-wrap gap-4">
                {items.map((s) => (
                  <SkillBadge key={s.name} skill={s} />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
