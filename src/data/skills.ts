import type { Skill } from '../types'
import javascriptIcon from '../assets/skill-icons/javascript.svg'
import typescriptIcon from '../assets/skill-icons/typescript.svg'
import javascriptMono from '../assets/skill-icons/javascript-mono.svg'
import typescriptMono from '../assets/skill-icons/typescript-mono.svg'
import javaIcon from '../assets/skill-icons/java.svg'
import htmlIcon from '../assets/skill-icons/html5.svg'
import tailwindIcon from '../assets/skill-icons/tailwindcss.svg'
import reactIcon from '../assets/skill-icons/react.svg'
import mysqlIcon from '../assets/skill-icons/mysql.svg'

// EDIT ME: add new skills here, for example:
//   { name: 'Node.js', category: 'Backend', icon: nodeIcon },
// To add an icon: save an .svg in src/assets/skill-icons/, import it above,
// and pass it as `icon`. Without an icon, the skill name is shown as text.
// The Skill Stack marquee shows them in this order.

export const skills: Skill[] = [
  { name: 'JavaScript', category: 'Languages', icon: javascriptIcon, monoIcon: javascriptMono },
  { name: 'TypeScript', category: 'Languages', icon: typescriptIcon, monoIcon: typescriptMono },
  { name: 'Java', category: 'Languages', icon: javaIcon },
  { name: 'HTML', category: 'Languages', icon: htmlIcon },
  { name: 'Tailwind CSS', category: 'Styling', icon: tailwindIcon },
  { name: 'React', category: 'Frameworks and Libraries', icon: reactIcon },
  { name: 'MySQL', category: 'Databases', icon: mysqlIcon },
]
