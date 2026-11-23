import type { Skill, SkillCategory } from '../types'
import javascriptIcon from '../assets/skill-icons/javascript.svg'
import typescriptIcon from '../assets/skill-icons/typescript.svg'
import javaIcon from '../assets/skill-icons/java.svg'
import htmlIcon from '../assets/skill-icons/html5.svg'
import tailwindIcon from '../assets/skill-icons/tailwindcss.svg'
import reactIcon from '../assets/skill-icons/react.svg'
import mysqlIcon from '../assets/skill-icons/mysql.svg'

// EDIT ME: add new skills here, for example:
//   { name: 'Node.js', category: 'Backend', icon: nodeIcon },
// To add an icon: save an .svg in src/assets/skill-icons/, import it above,
// and pass it as `icon`. Without an icon, the skill name is shown as text.
// New categories only need to be added to SKILL_CATEGORY_ORDER below.

export const skills: Skill[] = [
  { name: 'JavaScript', category: 'Languages', icon: javascriptIcon },
  { name: 'TypeScript', category: 'Languages', icon: typescriptIcon },
  { name: 'Java', category: 'Languages', icon: javaIcon },
  { name: 'HTML', category: 'Languages', icon: htmlIcon },
  { name: 'Tailwind CSS', category: 'Styling', icon: tailwindIcon },
  { name: 'React', category: 'Frameworks and Libraries', icon: reactIcon },
  { name: 'MySQL', category: 'Databases', icon: mysqlIcon },
]

// Controls the order in which groups appear. Empty groups are hidden.
export const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  'Languages',
  'Styling',
  'Frameworks and Libraries',
  'Backend',
  'Databases',
  'Tools',
]
